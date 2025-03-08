import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Alex_Brush } from "next/font/google"
import { RecaptchaProvider } from "@/components/recaptcha-provider"

const inter = Inter({ subsets: ["latin"] })
const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alex-brush",
})

export const metadata = {
  title: "Declare seu amor! - Trinity e-Cartas",
  description: "Envie uma declaração de amor por apenas R$5,00 e surpreenda seu amor!"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} ${alexBrush.variable}`}>
        <RecaptchaProvider>{children}</RecaptchaProvider>
      </body>
    </html>
  )
}



import './globals.css'