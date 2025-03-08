// File: app/payment/[paymentId]/ClientPaymentPage.tsx
"use client";

import { Heart } from "lucide-react";
import PaymentDetails from "@/components/payment-details";

interface HeartConfig {
  id: number;
  left: string;
  animationDelay: string;
}

interface ClientPaymentPageProps {
  paymentData: any;
  hearts: HeartConfig[];
}

export default function ClientPaymentPage({
  paymentData,
  hearts,
}: ClientPaymentPageProps) {
  return (
    <main className="min-h-screen bg-valentine flex items-center justify-center p-4 relative">
      {/* Floating hearts */}
      <div className="floating-hearts">
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="floating-heart absolute"
            style={{
              left: heart.left,
              animationDelay: heart.animationDelay,
            }}
            size={Math.random() * 20 + 10}
          />
        ))}
      </div>
      {/* Fixed decorations */}
      <Heart className="heart-decoration absolute top-10 left-10 animate-pulse-slow" size={40} />
      <Heart className="heart-decoration absolute bottom-10 right-10 animate-float" size={40} />
      <Heart className="heart-decoration absolute top-10 right-10 animate-heartbeat" size={30} />
      <Heart className="heart-decoration absolute bottom-10 left-10 animate-pulse-slow" size={30} />
      <PaymentDetails paymentData={paymentData} />
    </main>
  );
}

