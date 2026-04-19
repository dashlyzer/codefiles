"use client"

import { Badge } from "@/components/ui/badge"
import { Play, Check, Zap, Target, Search } from "lucide-react"

const features = [
  {
    title: "Verify Identity",
    description: "Every user goes through a strict verification process to ensure business legitimacy.",
    icon: Check,
  },
  {
    title: "Define Intent",
    description: "Input your business needs, offers, and strategic goals into the Intent Engine.",
    icon: Target,
  },
  {
    title: "Get Matched",
    description: "Our AI matches you with the most relevant partners based on multi-dimensional data.",
    icon: Zap,
  },
  {
    title: "Execute & Close",
    description: "Securely communicate, share documents, and finalize your business deals.",
    icon: Search,
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-black overflow-hidden scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              The Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
              Matchmaking <span className="text-primary italic">engineered</span> for precision.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-12">
              Forget social feeds and endless scrolling. Taplyzer is built for speed and efficiency in business deal-making.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex gap-6 group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-white/5 overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 animate-pulse hover:scale-110 transition-transform cursor-pointer">
                  <Play className="h-8 w-8 fill-white ml-1" />
                </div>
              </div>
              
              {/* Floating UI Elements */}
              <div className="absolute top-10 right-10 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/10 animate-bounce duration-3000">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs font-black tracking-widest uppercase">Matching Now...</span>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Top Match</span>
                  <span className="text-lg font-black text-primary italic">98.4% Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
