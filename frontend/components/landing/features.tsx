import { Target, Sparkles, ShieldCheck, Mail, Calendar } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Intent-Based Matching",
    description: "Our AI matches you with businesses based on what you offer and what they need - and vice versa.",
  },
  {
    icon: Sparkles,
    title: "Smart Deal Discovery",
    description: "Automatically surface high-value opportunities that align with your business goals.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Business Profiles",
    description: "Every business on Taplyzer is verified to ensure quality connections.",
  },
  {
    icon: Mail,
    title: "Intro Request System",
    description: "Request warm introductions to your matches with context that converts.",
  },
  {
    icon: Calendar,
    title: "Meeting Tracking",
    description: "Track all your meetings, follow-ups, and deal progress in one place.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-black transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl text-balance">
            Everything You Need to Close Deals
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-white/40 font-medium">
            Powerful features designed to help you find and close real business opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-50 dark:bg-[#0A0A0A] rounded-3xl p-10 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none backdrop-blur-md"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-200 dark:border-white/5 flex items-center justify-center mb-10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 dark:text-white/40 leading-relaxed font-medium mb-6">{feature.description}</p>
              <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-1 hover:border-primary transition-all">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
