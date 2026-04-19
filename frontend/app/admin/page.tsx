"use client"

import { useAdminStore } from "@/lib/admin-store"
import { 
  Users, 
  Building2, 
  Target, 
  Handshake, 
  TrendingUp, 
  CheckCircle2,
  Clock
} from "lucide-react"

export default function AdminDashboard() {
  const { getPlatformStats } = useAdminStore()
  const stats = getPlatformStats()

  const dashboardStats = [
    {
      name: "Total Users",
      value: stats.totalUsers,
      sub: `${stats.activeUsers} Active`,
      icon: Users,
      color: "blue"
    },
    {
      name: "Total Businesses",
      value: stats.totalBusinesses,
      sub: `${stats.pendingBusinesses} Pending`,
      icon: Building2,
      color: "purple"
    },
    {
      name: "Active Intents",
      value: "42", // Mocked for now
      sub: "8 New Today",
      icon: Target,
      color: "orange"
    },
    {
      name: "Total Matches",
      value: "128", // Mocked for now
      sub: "+12% this week",
      icon: Handshake,
      color: "emerald"
    },
    {
      name: "Deals Closed",
      value: stats.approvedBusinesses, // Using approved as a proxy
      sub: stats.totalDealValue,
      icon: CheckCircle2,
      color: "green"
    },
    {
      name: "Platform Trust",
      value: `${((stats.verifiedBusinesses / stats.totalBusinesses) * 100).toFixed(0)}%`,
      sub: "Verified Units",
      icon: TrendingUp,
      color: "primary"
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Super Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-white/40 font-medium mt-1">Platform overview and real-time statistics.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/5 p-8 hover:border-blue-500/20 transition-all hover:shadow-2xl group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(3,169,244,0.1)]`}>
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  Live
                </span>
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {stat.value}
              </p>
              <p className="text-sm font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mt-2">{stat.name}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-white/40">
                <Clock className="h-3 w-3" />
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Placeholder for future charts or activity logs */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/5 p-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Recent Platform Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">New User Registered</p>
                  <p className="text-xs text-slate-500 dark:text-white/40 font-medium">User #829 just joined the platform from New York.</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/5 p-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6">System Health</h3>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-white/60">Server Status</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Operational
                </span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-white/60">Database Latency</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">12ms</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-white/60">Match Engine Load</span>
                <div className="w-32 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[34%]"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
