"use client"

import { useEffect, useState, createContext, useContext, type ReactNode } from "react"

interface RecaptchaContextType {
  executeRecaptcha: (action: string) => Promise<string>
  isLoaded: boolean
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  executeRecaptcha: async () => "",
  isLoaded: false,
})

export const useRecaptchaV3 = () => useContext(RecaptchaContext)

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  useEffect(() => {
    // Se não houver chave do site, não carregue o reCAPTCHA
    if (!siteKey) {
      console.warn("reCAPTCHA site key não configurada, pulando carregamento")
      return
    }

    // Verificar se o script já foi carregado
    if (window.grecaptcha) {
      console.log("reCAPTCHA já carregado")
      setIsLoaded(true)
      return
    }

    console.log("Carregando reCAPTCHA...")

    // Carregar o script do reCAPTCHA manualmente
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true

    script.onload = () => {
      console.log("Script do reCAPTCHA carregado com sucesso")
      setIsLoaded(true)
    }

    script.onerror = (error) => {
      console.error("Erro ao carregar o script do reCAPTCHA:", error)
    }

    document.head.appendChild(script)

    return () => {
      // Limpar o script quando o componente for desmontado
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [siteKey])

  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!siteKey) {
      console.warn("reCAPTCHA site key não configurada")
      return ""
    }

    if (!isLoaded || !window.grecaptcha) {
      console.warn("reCAPTCHA não carregado ainda")
      return ""
    }

    try {
      return new Promise((resolve) => {
        window.grecaptcha!.ready(async () => {
          try {
            console.log(`Executando reCAPTCHA para ação: ${action}`)
            const token = await window.grecaptcha!.execute(siteKey, { action })
            console.log("Token do reCAPTCHA obtido com sucesso")
            resolve(token)
          } catch (error) {
            console.error("Erro ao executar reCAPTCHA:", error)
            resolve("")
          }
        })
      })
    } catch (error) {
      console.error("Falha na execução do reCAPTCHA:", error)
      return ""
    }
  }

  return <RecaptchaContext.Provider value={{ executeRecaptcha, isLoaded }}>{children}</RecaptchaContext.Provider>
}

