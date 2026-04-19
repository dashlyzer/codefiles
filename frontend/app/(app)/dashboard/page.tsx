"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MatchCard, type Match } from "@/components/dashboard/match-card"
import { IntroRequests } from "@/components/dashboard/intro-requests"
import { TrendingUp, Zap, CheckCircle2, Clock, ArrowRight, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"

const suggestedMatches: Match[] = [
  {
    id: "1",
    name: "Nexus Technologies",
    industry: "Enterprise Software",
    location: "San Francisco, CA",
    score: 96,
    dealType: "Client",
    dealValue: "$85,000",
    description: "Looking for cloud infrastructure solutions to scale their B2B platform. Strong alignment with your service offerings.",
    verified: true,
  },
  {
    id: "2",
    name: "DataStream Analytics",
    industry: "Business Intelligence",
    location: "New York, NY",
    score: 91,
    dealType: "Partnership",
    dealValue: "$120,000",
    description: "Seeking strategic partners for market expansion. Complementary product offerings with potential for co-selling.",
    verified: true,
  },
  {
    id: "3",
    name: "Zenith Logistics",
    industry: "Supply Chain",
    location: "Chicago, IL",
    score: 85,
    dealType: "Vendor",
    dealValue: "$200,000",
    description: "Modernizing last-mile delivery system. Interested in automation and real-time tracking APIs.",
    verified: true,
  }
]

const recentActivity = [
  { id: 1, type: "match", content: "New 98% match found: CloudVault Security", time: "2 hours ago", icon: Zap },
  { id: 2, type: "request", content: "Intro request received from Nexus Tech", time: "5 hours ago", icon: MessageSquare },
  { id: 3, type: "meeting", content: "Meeting scheduled with DataStream", time: "1 day ago", icon: Briefcase },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 italic">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-sm uppercase tracking-widest font-black">
            Welcome back, Acme Softworks Admin
          </p>
        </div>
        <Link href="/matches">
           <button className="bg-primary text-white font-black px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
             Discover Matches
           </button>
        </Link>
      </div>

      {/* KPI Cards (RESTORED) */}
      <StatsCards />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Active Deal Flow */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic">Active Deal Flow</h2>
              <Link href="/requests" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
            </div>
            <div className="grid gap-4">
               {[
                 { title: "Cloud Migration Strategy", partner: "TechFlow Solutions", status: "In Negotiation", value: "$120k", type: "Partnership" },
                 { title: "Enterprise API Integration", partner: "Global Systems", status: "Discovery", value: "$45k", type: "Client" },
               ].map((deal, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <TrendingUp className="h-6 w-6 text-primary group-hover:text-white" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 dark:text-white">{deal.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">With {deal.partner} • {deal.type}</p>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none uppercase text-[8px] font-black tracking-widest mb-1">{deal.status}</Badge>
                       <span className="block text-xs font-black text-slate-900 dark:text-white">{deal.value}</span>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Suggested Matches */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic">Suggested Matches</h2>
              <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black text-[10px] tracking-widest">Updated Today</Badge>
            </div>
            <div className="grid gap-4">
              {suggestedMatches.map((match) => (
                <MatchCard key={match.id} match={match} onRequestIntro={() => {}} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           {/* Recent Activity */}
           <Card className="p-8 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2rem]">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 tracking-tight italic">Recent Activity</h3>
              <div className="space-y-6">
                 {recentActivity.map((activity) => (
                   <div key={activity.id} className="flex gap-4 group cursor-pointer">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-all">
                         <activity.icon className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{activity.content}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activity.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-8 rounded-xl font-black uppercase tracking-widest text-[8px] text-slate-400 hover:text-primary transition-all">
                 View Full History <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
           </Card>

           <IntroRequests />
           
           <Card className="p-8 bg-slate-900 dark:bg-primary/10 border-none rounded-[2rem] text-white">
              <h3 className="text-lg font-black mb-6 tracking-tight italic">System Health</h3>
              <div className="space-y-4">
                 {[
                   { label: "Matching Engine", status: "Active", color: "bg-emerald-500" },
                   { label: "Identity Verifier", status: "Online", color: "bg-emerald-500" },
                   { label: "Deal Analytics", status: "Calculating", color: "bg-amber-500" }
                 ].map((s, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{s.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
