"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, BadgeCheck } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"


const STATS = [
  { value: "2,500+", label: "Active Businesses", color: "text-slate-900 dark:text-white" },
  { value: "$12M+", label: "Deals Closed", color: "text-emerald-600 dark:text-emerald-400" },
  { value: "89%", label: "Match Accuracy", color: "text-primary" },
]

const INTENTS = [
  "Looking for a SaaS distribution partner in India",
  "Seeking equity investor for FinTech Series A",
  "Want a white-label logistics provider",
  "Need B2B lead generation agency",
  "Looking for a CTO co-founder",
]

export function Hero() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [activeIntent, setActiveIntent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActiveIntent(prev => (prev + 1) % INTENTS.length)
        setAnimating(false)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleCTA = () => {
    router.push(isLoggedIn ? "/dashboard" : "/auth?mode=signup")
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden bg-white dark:bg-[#050508]">

      {/* ── Animated background ───────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Primary orb */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-600/10 blur-[80px] sm:blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        {/* Secondary orb */}
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-tr from-cyan-400/15 to-blue-500/10 blur-[80px] sm:blur-[100px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center max-w-3xl mx-auto">

          {/* ── LEFT: Copy ───────────────────────────────────────────── */}
          <div className="text-center w-full">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-black mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now in Private Beta · Invite Only
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white text-balance">
              Stop Networking.{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Start Closing.
              </span>
            </h1>

            {/* Sub */}
            <p className="mt-7 text-base sm:text-lg text-slate-500 dark:text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
              Taplyzer is India's first AI-powered intent matching platform. Tell us what you need — we'll find the exact business that offers it.
            </p>

            {/* Animated intent ticker */}
            <div className="mt-6 mx-auto max-w-md">
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p
                  className="text-sm font-bold text-slate-700 dark:text-white/80 transition-all duration-300"
                  style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(4px)' : 'translateY(0)' }}
                >
                  <span className="text-slate-400 dark:text-white/30 font-normal">Live intent: </span>
                  {INTENTS[activeIntent]}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleCTA}
                size="lg"
                className="h-13 px-7 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl gap-2 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-200 text-base uppercase tracking-wide w-full sm:w-auto"
              >
                Get Matched Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => router.push("/auth?mode=login")}
                variant="outline"
                size="lg"
                className="h-13 px-7 border-slate-200 dark:border-white/15 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold rounded-2xl text-base transition-all w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-11 grid grid-cols-3 gap-3 sm:gap-6">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-white/35 font-black uppercase tracking-widest mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex items-center gap-4 justify-center flex-wrap">
              {["SOC 2 Compliant", "GDPR Safe", "AI-Powered"].map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
                  <BadgeCheck className="h-3 w-3 text-emerald-500" />
                  {b}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
