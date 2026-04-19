import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Target, Users, BarChart3, Lock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Identity Verification",
    description: "Every entity on Taplyzer is manually verified to prevent fraud and ensure high-quality interactions."
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description: "As soon as you post your intent, our engine works in the background to find compatible partners."
  },
  {
    icon: Target,
    title: "Strategic Filters",
    description: "Filter matches by deal size, industry focus, geographical reach, and specific technology requirements."
  },
  {
    icon: Users,
    title: "Secure Intros",
    description: "Connect via a managed introduction system that protects your privacy until mutual interest is confirmed."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track the performance of your intents and see how your profile ranks in the global marketplace."
  },
  {
    icon: Lock,
    title: "Data Sovereignty",
    description: "Your business data is encrypted and you maintain full control over who sees your detailed intents."
  }
]

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Core Capabilities
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            Powering <span className="text-primary italic">High-Stakes</span> Deals.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Discover the tools that make Taplyzer the most efficient platform for business networking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-primary/50 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
