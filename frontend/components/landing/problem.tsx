import { Shuffle, Timer, XCircle } from "lucide-react"

const problems = [
  {
    icon: Shuffle,
    title: "Random Connections",
    description: "Endless networking events and connections that never lead anywhere meaningful.",
  },
  {
    icon: XCircle,
    title: "No Real Outcomes",
    description: "Thousands of connections but zero business deals or partnerships to show for it.",
  },
  {
    icon: Timer,
    title: "Wasted Time",
    description: "Hours spent in meetings with people who don&apos;t actually need what you offer.",
  },
]

export function Problem() {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-black transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl text-balance">
            Networking is Broken
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-white/40 font-medium">
            Traditional networking wastes your time with connections that never convert.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative bg-slate-50 dark:bg-zinc-900/40 rounded-[28px] p-10 border border-slate-200 dark:border-white/5 hover:border-red-500/30 transition-all hover:-translate-y-1 backdrop-blur-sm group"
            >
              <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 group-hover:bg-red-500/20 transition-colors">
                <problem.icon className="h-7 w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{problem.title}</h3>
              <p className="text-slate-500 dark:text-white/50 leading-relaxed font-medium">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
