import { Badge } from "@/components/ui/badge"
import { Zap, Target, Search, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            The Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            Deep <span className="text-primary italic">Deal Intelligence</span>.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Taplyzer isn't just a network; it's an engine designed to surface hidden business opportunities using advanced intent analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-32">
          <div className="p-10 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
            <Zap className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Intent Analysis</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
              Our platform uses natural language processing to understand the nuance of your business needs. We don't just match keywords; we match strategic goals.
            </p>
            <ul className="space-y-3">
              {["Contextual understanding", "Multi-layered intent mapping", "Real-time urgency detection"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-10 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
            <Target className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Match Precision</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
              Our matching algorithm considers over 50 data points including industry history, deal size, technology stack, and verified trust scores.
            </p>
            <ul className="space-y-3">
              {["94% match accuracy", "Verified business profiles", "Proprietary trust scoring"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-primary/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8">
              Built for the <span className="text-primary italic">Modern Executive</span>.
            </h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
              We've stripped away the noise of traditional social networks to focus solely on what matters: the deal.
            </p>
            <Link href="/auth?mode=signup">
              <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-10 h-16 text-lg group">
                Start Trading Intent
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
