import { Users, Zap, MessageSquare, Calendar, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    name: "Total Matches",
    value: "18",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
    href: "/matches",
  },
  {
    name: "New Opportunities",
    value: "9",
    change: "+4",
    changeType: "positive" as const,
    icon: Zap,
    href: "/explore",
  },
  {
    name: "Pending Requests",
    value: "4",
    change: "-1",
    changeType: "negative" as const,
    icon: MessageSquare,
    href: "/requests",
  },
  {
    name: "Meetings This Week",
    value: "3",
    change: "+1",
    changeType: "positive" as const,
    icon: Calendar,
    href: "/meetings",
  },
  {
    name: "Deals In Progress",
    value: "6",
    change: "+2",
    changeType: "positive" as const,
    icon: TrendingUp,
    href: "/requests",
  },
  {
    name: "Trust Rating",
    value: "4.8 ★",
    change: "Verified",
    changeType: "positive" as const,
    icon: Star,
    href: "/profile",
  },
]

export function StatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Link href={stat.href} key={stat.name} prefetch={true} className="block">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-7 hover:border-primary/50 hover:shadow-xl transition-all group h-full">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(3,169,244,0.1)] group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <stat.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                stat.change === "Verified" 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : stat.changeType === "positive" 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20"
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-6">
              <p className={`text-3xl font-black tracking-tighter ${
                stat.name === "Trust Rating" ? "text-amber-500" : "text-slate-900 dark:text-white"
              }`}>
                {stat.value}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest mt-2">{stat.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
