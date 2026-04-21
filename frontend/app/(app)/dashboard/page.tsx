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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1 italic">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-widest font-black">
            Welcome back, Acme Softworks Admin
          </p>
        </div>
        <Link href="/matches">
           <button className="w-full sm:w-auto bg-primary text-white font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
             Discover Matches
           </button>
        </Link>
      </div>

      {/* KPI Cards (RESTORED) */}
      <StatsCards />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          {/* Suggested Matches */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight italic">Suggested Matches</h2>
              <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black text-[9px] tracking-widest">Updated Today</Badge>
            </div>
            <div className="grid gap-4">
              {suggestedMatches.map((match) => (
                <MatchCard key={match.id} match={match} onRequestIntro={() => {}} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
           {/* Profile Completion */}
           <Card className="p-5 md:p-6 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight italic">Profile Completion</h3>
                <span className="text-xl font-black text-primary italic">60%</span>
              </div>
              
              <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
              </div>

              <div className="space-y-3 mb-5">
                 {[
                   { label: "Basic Information", completed: true },
                   { label: "Business Details", completed: true },
                   { label: "What You Offer", completed: true },
                   { label: "What You Need", completed: false },
                   { label: "Verification", completed: false },
                 ].map((item, i) => (
                   <div key={i} className={`flex items-center gap-3 ${item.completed ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-white/20'}`}>
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.completed ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-white/10'}`}>
                         {item.completed ? <CheckCircle2 className="h-2.5 w-2.5" /> : <div className="h-1.5 w-1.5 rounded-full" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>

              <Button className="w-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] h-10 transition-all">
                 Complete Profile <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
           </Card>

           <IntroRequests />
           
           <Card className="p-5 bg-slate-900 dark:bg-primary/10 border-none rounded-2xl text-white">
              <h3 className="text-base font-black mb-4 tracking-tight italic">System Health</h3>
              <div className="space-y-3">
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
