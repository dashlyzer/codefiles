"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, Target, Zap, Handshake } from "lucide-react"

const STEPS = [
  {
    number: "01",
    icon: Shield,
    title: "Verify Identity",
    description: "Every business goes through a strict verification process. GST, LinkedIn, and website checks ensure legitimacy before matching begins.",
    color: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    number: "02",
    icon: Target,
    title: "Define Your Intent",
    description: "Tell us exactly what you need and what you offer. Your intent profile is the core of our AI matching engine — be specific, match better.",
    color: "from-blue-400 to-indigo-500",
    glow: "shadow-blue-500/20",
  },
  {
    number: "03",
    icon: Zap,
    title: "AI Finds Your Match",
    description: "Our Gemini-powered engine computes semantic similarity across thousands of business profiles. You get ranked matches in seconds, not weeks.",
    color: "from-violet-400 to-purple-600",
    glow: "shadow-purple-500/20",
  },
  {
    number: "04",
    icon: Handshake,
    title: "Connect & Close",
    description: "Request intros, schedule Google Meet calls, exchange documents, and seal your deal — all inside Taplyzer. No middlemen.",
    color: "from-amber-400 to-orange-500",
    glow: "shadow-orange-500/20",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-slate-50 dark:bg-[#06060a] overflow-hidden scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-5 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">
            The Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight text-balance">
            Matchmaking <span className="text-primary italic">engineered</span>
            <br className="hidden sm:block" /> for precision.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-500 dark:text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
            Four steps stand between you and your next high-value business deal.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

          {STEPS.map((step, i) => (
            <div key={step.number} className="relative group">
              <div className="h-full bg-white dark:bg-[#0D0D14] border border-slate-200 dark:border-white/[0.07] rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-primary/5">
                {/* Step number */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl ${step.glow} shrink-0`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 dark:text-white/[0.05] tracking-tighter leading-none select-none">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed font-medium">
                  {step.description}
                </p>

                {/* Arrow connector — mobile */}
                {i < STEPS.length - 1 && (
                  <div className="sm:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-px bg-slate-200 dark:bg-white/10" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stat strip */}
        <div className="mt-14 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto text-center">
          {[
            { v: "< 2 min", l: "To find a match" },
            { v: "50+", l: "Industries covered" },
            { v: "98.4%", l: "Embedding accuracy" },
          ].map(s => (
            <div key={s.l}>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{s.v}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-widest mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
