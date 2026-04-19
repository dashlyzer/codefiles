import { Users, Send, Calendar, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Total Matches",
    value: "142",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    name: "Active Deals",
    value: "18",
    change: "+4",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    name: "Requests Sent",
    value: "45",
    change: "-2%",
    changeType: "negative" as const,
    icon: Send,
  },
  {
    name: "Success Rate",
    value: "92%",
    change: "+5%",
    changeType: "positive" as const,
    icon: Calendar,
  },
]

export function StatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-7 hover:border-blue-500/20 transition-all hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(3,169,244,0.1)]">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              stat.changeType === "positive" 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                : "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20"
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-6">
            <p className={`text-3xl font-black tracking-tighter ${
              stat.name === "Deal Pipeline" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
            }`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 dark:text-white/30 font-bold uppercase tracking-widest mt-2">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
