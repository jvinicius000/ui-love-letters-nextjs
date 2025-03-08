// File: app/payment/[paymentId]/page.tsx
import ClientPaymentPage from "./_ClientPaymentPage";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Pagamento - Trinity e-Cartas",
  description: "Detalhes para o pagamento do envio da e-carta.",
};

async function getPaymentData(paymentId: string) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/payment/${paymentId}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export default async function PaymentPage({
  params,
}: {
  params: { paymentId: string };
}) {
  const {paymentId} = params;
  const paymentData = await getPaymentData(paymentId);
  // Generate random positions for floating hearts
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
  }));
  return <ClientPaymentPage paymentData={paymentData} hearts={hearts} />;
}

