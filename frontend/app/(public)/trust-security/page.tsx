import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Lock, Eye, CheckCircle2, UserCheck, Scale } from "lucide-react"

const principles = [
  {
    icon: UserCheck,
    title: "Vetted Identities",
    description: "Every user and business must pass a rigorous multi-step verification process before they can post or view intents."
  },
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    description: "All sensitive deal data and communication are encrypted at rest and in transit using industry-standard protocols."
  },
  {
    icon: Eye,
    title: "Granular Privacy",
    description: "You choose exactly who sees your intent details. Maintain complete anonymity until you are ready to reveal your identity."
  },
  {
    icon: CheckCircle2,
    title: "Transaction Integrity",
    description: "Our system tracks deal milestones to ensure both parties fulfill their strategic obligations."
  },
  {
    icon: Scale,
    title: "Regulatory Compliance",
    description: "Taplyzer is designed to meet GDPR, CCPA, and other global data privacy standards for enterprise business data."
  },
  {
    icon: ShieldCheck,
    title: "Trust Scores",
    description: "Businesses are rated on their transaction history, creating a merit-based ecosystem of reliable partners."
  }
]

export default function TrustPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Security First
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            Built on <span className="text-primary italic">Absolute</span> Trust.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Business networking requires a level of security that social media cannot provide. We built Taplyzer from the ground up for safety.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((p, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center mb-8 border border-slate-50 dark:border-white/10">
                <p.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight">{p.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
