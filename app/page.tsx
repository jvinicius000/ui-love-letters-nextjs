import LoveDeclarationForm from "@/components/love-declaration-form"
import { Heart } from "lucide-react"

export default function Home() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
  }))

  return (
    <main className="min-h-screen bg-valentine flex items-center justify-center p-3">
      {/* Corações flutuantes */}
      <div className="floating-hearts">
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="floating-heart absolute"
            style={{
              left: heart.left,
              animationDelay: heart.animationDelay,
            }}
            size={Math.random() * 16 + 8} // Reduzido o tamanho dos corações flutuantes
          />
        ))}
      </div>
      {/* Decorações fixas */}
      <Heart className="heart-decoration absolute top-8 left-8 animate-pulse-slow" size={24} /> {/* Reduzido */}
      <Heart className="heart-decoration absolute bottom-8 right-8 animate-float" size={24} />
      <Heart className="heart-decoration absolute top-8 right-8 animate-heartbeat" size={20} />
      <Heart className="heart-decoration absolute bottom-8 left-8 animate-pulse-slow" size={20} />
      <div className="max-w-xl w-full card-valentine rounded-lg shadow-lg p-4 space-y-4 relative z-10 hover-scale mx-3">
        <div className="text-center space-y-2">
          <h1 className="font-cursive text-3xl sm:text-4xl font-bold text-primary animate-fade-in">
            Declare seu amor!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground animate-fade-in delay-100 max-w-md mx-auto">
            Envie uma declaração de amor por apenas R$5,00 e surpreenda seu amor!
          </p>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-pink-200 via-primary to-pink-200 rounded-full" />
        </div>

        <LoveDeclarationForm />

        <div className="absolute -top-4 -left-4 animate-float hidden sm:block">
          <Heart className="text-primary/20" size={32} /> {/* Reduzido */}
        </div>
        <div className="absolute -bottom-4 -right-4 animate-float hidden sm:block" style={{ animationDelay: "-1.5s" }}>
          <Heart className="text-primary/20" size={32} /> {/* Reduzido */}
        </div>
      </div>
    </main>
  )
}

