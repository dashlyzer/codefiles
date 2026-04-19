import { Badge } from "@/components/ui/badge"
import { PlayCircle, CheckCircle, Zap, Target, Search, MessageSquare, Handshake } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Onboarding & Verification",
    description: "Join the platform and complete your business profile. We verify your identity and corporate credentials to ensure a high-trust environment."
  },
  {
    icon: Target,
    title: "Define Strategic Intent",
    description: "State your business needs. Whether you're looking for an acquisition, a strategic partner, or a specific technology, the Intent Engine maps your goals."
  },
  {
    icon: Zap,
    title: "AI Matchmaking",
    description: "Our proprietary algorithm surfaces the most relevant businesses based on your intent. No scrolling, just high-score matches delivered to your dashboard."
  },
  {
    icon: MessageSquare,
    title: "Request Intro",
    description: "Reach out to matches. Your full identity is protected until both parties agree to a formal introduction, keeping your strategic moves confidential."
  },
  {
    icon: Handshake,
    title: "Closing the Deal",
    description: "Move from introduction to execution. Use our integrated deal rooms to share sensitive documents and finalize terms securely."
  }
]

export default function HowItWorksPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            The Workflow
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            How Deals <span className="text-primary italic">Get Done</span>.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            A structured approach to high-stakes business networking, from first intent to final handshake.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 items-start p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group transition-all">
              <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <step.icon className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Step 0{i+1}</span>
                   <div className="h-px flex-grow bg-slate-200 dark:bg-white/10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight">{step.title}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
