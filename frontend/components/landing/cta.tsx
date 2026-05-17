"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function CTA() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const handleCTA = () => {
    router.push(isLoggedIn ? "/dashboard" : "/auth?mode=signup")
  }

  return (
    <section className="py-20 sm:py-32 bg-white dark:bg-[#050508] transition-colors overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden">

          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-900" />

          {/* Animated orbs inside */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-6 sm:px-12 py-14 sm:py-20 lg:py-24">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-black uppercase tracking-widest mb-8">
              <Sparkles className="h-3 w-3 text-amber-300" />
              AI-Powered Business Matching
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight text-balance leading-[1.05] mb-6">
              Your next client is already
              <br className="hidden sm:block" />
              <span className="italic"> looking for you.</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-white/65 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Stop wasting time on random introductions. Start getting matched with businesses that actually need exactly what you offer — powered by Google Gemini AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                onClick={handleCTA}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-white text-indigo-700 hover:bg-white/90 font-black rounded-2xl text-base gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-200 uppercase tracking-wide"
              >
                Get Matched Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-white/40 font-bold sm:ml-2">No credit card required</p>
            </div>

            {/* Mini stats */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              {[
                { v: "2,500+", l: "Businesses" },
                { v: "$12M+", l: "Deals matched" },
                { v: "Free", l: "To get started" },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{s.v}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
