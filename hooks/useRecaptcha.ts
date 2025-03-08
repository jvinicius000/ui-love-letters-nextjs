"use client"

import { useCallback, useState, useEffect } from "react"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function useRecaptcha() {
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false)

  useEffect(() => {
    // Verificar se o reCAPTCHA já está disponível
    if (window.grecaptcha) {
      setIsRecaptchaLoaded(true)
      return
    }

    // Caso contrário, configurar um intervalo para verificar periodicamente
    const checkRecaptchaLoaded = setInterval(() => {
      if (window.grecaptcha) {
        setIsRecaptchaLoaded(true)
        clearInterval(checkRecaptchaLoaded)
      }
    }, 100)

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(checkRecaptchaLoaded)
  }, [])

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

      if (!siteKey) {
        console.error("reCAPTCHA site key is missing")
        return ""
      }

      // Se o reCAPTCHA não estiver carregado, aguardar até que esteja
      if (!isRecaptchaLoaded || !window.grecaptcha) {
        console.log("reCAPTCHA not loaded yet, waiting...")
        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.grecaptcha) {
              clearInterval(checkInterval)
              resolve(true)
            }
          }, 100)
        })
      }

      try {
        return new Promise((resolve) => {
          if (!window.grecaptcha) {
            console.error("reCAPTCHA still not available")
            resolve("")
            return
          }

          window.grecaptcha.ready(() => {
            window
              .grecaptcha!.execute(siteKey, { action })
              .then((token) => resolve(token))
              .catch((err) => {
                console.error("reCAPTCHA execution error:", err)
                resolve("")
              })
          })
        })
      } catch (error) {
        console.error("reCAPTCHA execution failed:", error)
        return ""
      }
    },
    [isRecaptchaLoaded],
  )

  return { executeRecaptcha, isRecaptchaLoaded }
}

