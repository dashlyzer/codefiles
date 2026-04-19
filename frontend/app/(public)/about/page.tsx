import { Badge } from "@/components/ui/badge"
import { Users, Globe, Award, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Our Story
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            The Future of <span className="text-primary italic">Business</span>.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Founded in 2024, Taplyzer was built to solve a single problem: traditional business networking is slow, noisy, and inefficient.
          </p>
        </div>

        <div className="aspect-[21/9] rounded-[3rem] bg-slate-100 dark:bg-white/5 mb-24 overflow-hidden relative border border-slate-200 dark:border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
            alt="Team collaboration" 
            className="w-full h-full object-cover opacity-50 dark:opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white max-w-3xl italic tracking-tight">
               "We believe every business deal starts with a clear intent."
             </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Founded", value: "2024", icon: Sparkles },
            { label: "Verified Businesses", value: "5,000+", icon: Users },
            { label: "Deals Facilitated", value: "$2.4B+", icon: Globe },
            { label: "Match Accuracy", value: "94.2%", icon: Award },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
               <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                 <stat.icon className="h-6 w-6" />
               </div>
               <span className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
