"use client"

import { useState } from "react"
import Image from "next/image"
import { HeartIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

interface PaymentData {
  status: any

  pixCopiaECola: string
  qrcodeBase64: string
  totalAmount: number
  useAI: boolean
}

export default function PaymentDetails({ paymentData }: { paymentData: PaymentData }) {
  const [copied, setCopied] = useState(false)

  let paid;

  switch (paymentData.status) {
    case "paid":
      paid = true;
      break;
    case "expired":
      notFound();
      break;
    default:
      paid = false;
      break;
  }


  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(paymentData.pixCopiaECola).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (

    <div className="max-w-sm w-full card-valentine rounded-lg shadow-lg p-4 space-y-4 animate-fade-in relative overflow-hidden z-10">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-300 via-red-300 to-pink-300 animate-pulse"></div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-primary">Pagamento {paid ? "Confirmado!" : ""}</h1>
        <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-pink-200 via-primary to-pink-200 rounded-full" />
      </div>

      <div className="flex justify-center">
        <div className="relative hover-float">
          <Image
            src={`data:image/png;base64,${paid ? "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" : paymentData.qrcodeBase64}`}
            alt="QR Code do Pix"
            width={160}
            height={160}
            className="rounded-lg shadow-md"
          />
          <HeartIcon className="absolute -top-3 -right-3 text-primary animate-heartbeat" size={24} />
        </div>
      </div>
      {!paid && (

        <div className="space-y-2 bg-secondary/50 p-3 rounded-lg hover-scale">
          <h2 className="text-base font-semibold text-primary mb-2 flex items-center">
            <HeartIcon className="mr-2 h-4 w-4" /> Código Pix:
          </h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={paymentData.pixCopiaECola}
              readOnly
              className="flex-grow p-2 bg-white rounded-lg border border-pink-200 text-xs focus:ring-2 focus:ring-primary transition-all"
            />
            <Button
              onClick={handleCopyPixCode}
              className="bg-primary hover:bg-primary/90 text-white h-8 transition-all duration-300 hover:scale-105"
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Clique no botão para copiar o código Pix</p>
        </div>

      )}


      <div className="text-center bg-pink-50/50 p-3 rounded-lg animate-fade-in">
        <p className="text-2xl font-bold text-primary">R${paymentData.totalAmount.toFixed(2)}</p>
      </div>
      {!paid && (
        <div className="space-y-2 text-xs text-center text-muted-foreground bg-white/50 p-3 rounded-lg">
          <p>
            Use o código Pix acima ou escaneie o QR Code para realizar o pagamento. Sua declaração será enviada assim que
            o pagamento for confirmado!
          </p>
          <p>
            Após a confirmação do pagamento, você receberá uma notificação de sucesso no número de WhatsApp fornecido.
          </p>
          {paymentData.useAI && (
            <p className="font-semibold text-primary animate-heartbeat">
              A mensagem surpresa via IA será revelada apenas ao destinatário. ❤️
            </p>
          )}
        </div>
      )}
      <div className="absolute -bottom-3 -right-3 animate-float">
        <HeartIcon className="text-primary/20" size={32} />
      </div>
      <div className="absolute -top-3 -left-3 animate-float" style={{ animationDelay: "-1.5s" }}>
        <HeartIcon className="text-primary/20" size={32} />
      </div>
    </div>
  )
}

