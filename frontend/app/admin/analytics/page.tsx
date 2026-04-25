"use client"

import { 
  BarChart3, TrendingUp, Users, Zap, MessageSquare, 
  Calendar, ArrowUpRight, ArrowDownRight, Activity,
  Globe, Target, Banknote, ShieldCheck
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const STATS = [
  { label: "Total Users", value: "2,420", trend: "+12.5%", color: "text-blue-500", icon: Users },
  { label: "Active Deals", value: "158", trend: "+8.2%", color: "text-primary", icon: Target },
  { label: "Intro Success", value: "72%", trend: "+5.1%", color: "text-emerald-500", icon: ShieldCheck },
  { label: "Platform Rev", value: "$45,200", trend: "-2.4%", color: "text-amber-500", icon: Banknote },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Platform Analytics</h1>
        <p className="text-slate-500 font-medium text-sm uppercase tracking-widest font-black">Performance metrics and growth insights</p>
      </div>

      {/* KPI Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(stat => (
          <Card key={stat.label} className="p-6 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center ${stat.color}`}>
                   <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className={`border-none font-black text-[10px] ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                   {stat.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                   {stat.trend}
                </Badge>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white italic">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Mockup */}
      <div className="grid lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 p-8 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">Growth Velocity</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">User signups vs deal creation</p>
               </div>
               <div className="flex gap-2">
                  <Badge className="bg-slate-100 dark:bg-white/5 text-slate-500 border-none font-black uppercase text-[9px] tracking-widest px-3 py-1">Last 30 Days</Badge>
               </div>
            </div>
            
            {/* Visual Bars Mockup */}
            <div className="h-64 flex items-end gap-2 px-2">
               {[40, 65, 45, 90, 75, 55, 80, 60, 95, 70, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                     <div className="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg group-hover:bg-primary/40 transition-all" style={{ height: `${h * 0.4}%` }} />
                     <div className="w-full bg-primary rounded-t-lg group-hover:scale-y-105 transition-all shadow-lg shadow-primary/20" style={{ height: `${h * 0.6}%` }} />
                  </div>
               ))}
            </div>
            <div className="flex justify-between px-2 pt-4 border-t border-slate-100 dark:border-white/5 mt-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
               <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
         </Card>

         <Card className="p-8 bg-slate-900 dark:bg-primary rounded-[2.5rem] shadow-2xl shadow-primary/20 flex flex-col">
            <h3 className="text-xl font-black text-white italic tracking-tight mb-2">Deal Intelligence</h3>
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-8">Industry distribution</p>
            
            <div className="flex-grow flex flex-col justify-center space-y-6">
               {[
                 { label: "Technology", val: 45, color: "bg-white" },
                 { label: "Manufacturing", val: 25, color: "bg-white/60" },
                 { label: "Healthcare", val: 15, color: "bg-white/40" },
                 { label: "Others", val: 15, color: "bg-white/20" }
               ].map(item => (
                 <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white">
                       <span>{item.label}</span>
                       <span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="pt-8 border-t border-white/10 mt-8">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                     <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-xs font-black text-white uppercase tracking-wider">Market Outlook</p>
                     <p className="text-[10px] font-bold text-white/60">Bullish on Enterprise SaaS</p>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* Activity Feed */}
      <Card className="p-8 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">Real-time Activity</h3>
            <Activity className="h-5 w-5 text-primary" />
         </div>
         <div className="space-y-6">
            {[
              { type: "Signup", content: "New business 'SkyHigh Logistics' just joined from Singapore.", time: "Just now", icon: Globe },
              { type: "Deal", content: "Intro accepted between Nexus Tech and Acme Softworks.", time: "12 mins ago", icon: Zap },
              { type: "Meeting", content: "Meeting scheduled: Q4 Strategy Session.", time: "45 mins ago", icon: Calendar }
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                 <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
                    <act.icon className="h-5 w-5" />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">{act.type}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{act.time}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{act.content}</p>
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  )
}
