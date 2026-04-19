"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function CTA() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const handleStartMatches = () => {
    if (isLoggedIn) {
      router.push("/dashboard/matches")
    } else {
      router.push("/auth?mode=signup")
    }
  }

  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-black transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-950 rounded-[40px] p-10 lg:p-24 text-center overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 text-balance tracking-tight">
              Your next client is already <br/> looking for you.
            </h2>
            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-bold leading-relaxed">
              Stop wasting time on random connections. Start getting matched with businesses that actually need what you offer.
            </p>
            <Button 
              onClick={handleStartMatches}
              size="lg" 
              variant="secondary" 
              className="gap-2 h-16 px-10 bg-white text-blue-600 hover:bg-white/90 font-black rounded-2xl text-lg shadow-xl hover:scale-105 transition-all"
            >
              Start Getting Matches
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
