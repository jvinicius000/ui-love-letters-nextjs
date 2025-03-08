"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { HeartIcon, SendIcon, ImageIcon, X } from "lucide-react"
import { useRecaptchaV3 } from "@/components/recaptcha-provider"

export default function LoveDeclarationForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { executeRecaptcha, isLoaded } = useRecaptchaV3()

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("A imagem deve ter no máximo 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("O arquivo selecionado deve ser uma imagem")
        return
      }

      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    try {
      // Obter o token do reCAPTCHA
      let recaptchaToken = ""
      if (isLoaded) {
        try {
          recaptchaToken = await executeRecaptcha("submit_love_declaration")
        } catch (recaptchaError) {
          console.error("Erro ao executar reCAPTCHA:", recaptchaError)
        }
      }

      // Adicionar o campo useAI
      formData.set("useAI", useAI.toString())

      // Se o usuário marcou anônimo, remover o nome do remetente
      if (isAnonymous) {
        formData.delete("senderName")
      }

      // Se houver imagem, adicionar ao FormData
      if (selectedImage) {
        const lovedOneName = formData.get("lovedOneName") as string
        const lovedOneWhatsApp = formData.get("lovedOneWhatsApp") as string
        const fileName = `${lovedOneWhatsApp}-${btoa(lovedOneName)}`
        formData.set("image", selectedImage)
        formData.set("fileName", fileName)
      }

      // Adicionar o token do reCAPTCHA
      formData.set("recaptchaToken", recaptchaToken)


      if (isAnonymous) formData.append("senderName", "Admirador Secreto")
      if (useAI) formData.append("message", "IAGEN")

      // Enviar para a API interna (que oculta a URL externa)
      const response = await fetch("/api/sendletter", {
        method: "POST",
        body: formData,
      })
      const responseData = await response.json()

      if (!responseData.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erro ao processar o pagamento")
      }


      if (!responseData.id) {
        throw new Error("ID do pagamento não recebido")
      }

      // Redirecionar para a página de pagamento
      router.push(`/payment/${responseData.id}`)
    } catch (error: any) {
      console.error("Erro ao processar o formulário:", error)
      setError(error.message || "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative text-sm" role="alert">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <Label htmlFor="lovedOneName" className="text-base font-medium text-primary">
            Nome do(a) amado(a)
          </Label>
          <Input
            id="lovedOneName"
            name="lovedOneName"
            required
            className="mt-1 h-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-base font-medium text-primary">Foto do(a) amado(a)</Label>
          <div className="flex items-center gap-3">
            <Input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1 h-9 text-sm"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {selectedImage ? "Trocar foto" : "Escolher foto"}
            </Button>
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-12 w-12 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Tamanho máximo: 5MB. A foto será usada para personalizar a mensagem.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <Label htmlFor="senderName" className="text-base font-medium text-primary">
              Seu nome
            </Label>
            <Input
              id="senderName"
              name="senderName"
              disabled={isAnonymous}
              className="mt-1 h-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm text-muted-foreground">
              Anônimo
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="text-base font-medium text-primary">
            Mensagem
          </Label>
          <Textarea
            id="message"
            name="message"
            disabled={useAI}
            className="mt-1 h-20 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="useAI" checked={useAI} onCheckedChange={(checked) => setUseAI(checked as boolean)} />
          <Label htmlFor="useAI" className="text-sm text-muted-foreground">
            Gerar mensagem surpresa via IA (+ R$5,00)
          </Label>
        </div>

        {useAI && (
          <p className="text-xs text-primary font-semibold bg-secondary p-2 rounded animate-pulse">
            Atenção: A mensagem gerada não será exibida na tela e será uma surpresa para o destinatário!
          </p>
        )}

        <div>
          <Label htmlFor="lovedOneWhatsApp" className="text-base font-medium text-primary">
            Número de WhatsApp do(a) amado(a)
          </Label>
          <Input
            id="lovedOneWhatsApp"
            name="lovedOneWhatsApp"
            type="tel"
            required
            className="mt-1 h-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <Label htmlFor="senderWhatsApp" className="text-base font-medium text-primary">
            Seu número de WhatsApp
          </Label>
          <Input
            id="senderWhatsApp"
            name="senderWhatsApp"
            type="tel"
            required
            className="mt-1 h-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white text-sm h-10 transition-all duration-300 transform hover:scale-105"
      >
        {isSubmitting ? (
          "Processando..."
        ) : (
          <>
            <HeartIcon className="mr-2 h-4 w-4" /> Pagar e enviar declaração <SendIcon className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Este site é protegido pelo reCAPTCHA e a
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {" "}
          Política de Privacidade
        </a>{" "}
        e
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {" "}
          Termos de Serviço
        </a>{" "}
        do Google se aplicam.
      </p>
    </form>
  )
}

