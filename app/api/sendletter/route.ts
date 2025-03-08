import { type NextRequest, NextResponse } from "next/server"

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("reCAPTCHA secret key não configurada")
      return process.env.NODE_ENV === "development"
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    // Verificar se o score é aceitável (0.3 é um valor mais permissivo)
    return data.success && data.score >= 0.3
  } catch (error) {
    console.error("Erro na verificação do reCAPTCHA:", error)
    return process.env.NODE_ENV === "development"
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extrair o token do reCAPTCHA
    const recaptchaToken = formData.get("recaptchaToken") as string
    formData.delete("recaptchaToken")

    // Verificar o token do reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken)

    if (!isHuman && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, error: "Verificação de segurança falhou. Por favor, tente novamente." },
        { status: 400 },
      )
    }

    // Enviar para a API externa (URL oculta no servidor)
    const response = await fetch(`${process.env.API_BASE_URL}/payment`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Resposta da API não ok:", response.status, errorData)
      return NextResponse.json(
        { success: false, error: errorData.error || "Erro ao processar o pagamento" },
        { status: response.status },
      )
    }

    const responseData = await response.json().catch(() => ({}))
console.log(responseData)
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Erro ao processar a declaração:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao processar a declaração" },
      { status: 500 },
    )
  }
}

