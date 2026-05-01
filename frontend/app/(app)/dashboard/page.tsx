"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MatchCard, type Match } from "@/components/dashboard/match-card"
import { IntroRequests } from "@/components/dashboard/intro-requests"
import { TrendingUp, Zap, CheckCircle2, Clock, ArrowRight, MessageSquare, Briefcase, Video, Info, FileText, Target, Users, MapPin, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { RequestIntroModal } from "@/components/modals/request-intro-modal"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

const suggestedMatches: Match[] = [
  {
    id: "1",
    name: "Nexus Tech Solutions",
    industry: "Enterprise Software",
    location: "San Francisco, CA",
    score: 92,
    dealType: "Client",
    dealValue: "$85,000",
    description: "Looking for cloud infrastructure solutions to scale their B2B platform. Strong alignment with your service offerings.",
    verified: true,
  },
  {
    id: "2",
    name: "FinBridge Capital",
    industry: "Financial Services",
    location: "New York, NY",
    score: 88,
    dealType: "Partnership",
    dealValue: "$120,000",
    description: "Seeking strategic partners for market expansion. Complementary product offerings with potential for co-selling.",
    verified: true,
  },
  {
    id: "3",
    name: "AgroMax Pvt Ltd",
    industry: "Supply Chain",
    location: "Chicago, IL",
    score: 84,
    dealType: "Vendor",
    dealValue: "$200,000",
    description: "Modernizing last-mile delivery system. Interested in automation and real-time tracking APIs.",
    verified: true,
  },
  {
    id: "4",
    name: "UrbanScale Infra",
    industry: "Real Estate Tech",
    location: "Austin, TX",
    score: 81,
    dealType: "Client",
    dealValue: "$45,000",
    description: "Looking for prop-tech software to manage operations.",
    verified: true,
  }
]

const recentActivity = [
  { id: 1, type: "request", content: "You received a request from FinBridge", time: "2 hours ago", icon: MessageSquare, color: "text-blue-500" },
  { id: 2, type: "meeting", content: "Meeting completed with AgroMax", time: "5 hours ago", icon: Briefcase, color: "text-emerald-500" },
  { id: 3, type: "rating", content: "New rating received (5★)", time: "1 day ago", icon: Target, color: "text-amber-500" },
]

const upcomingMeetings = [
  { id: 1, name: "FinBridge Capital", time: "Tomorrow 11:00 AM" },
  { id: 2, name: "AgroMax Pvt Ltd", time: "Friday 3:30 PM" }
]

const exploreTrending = [
  { id: 1, name: "MedCore Systems", industry: "Healthcare Tech" },
  { id: 2, name: "BrightChain Logistics", industry: "Supply Chain" },
  { id: 3, name: "GreenLeaf Foods", industry: "FMCG" }
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 italic">
            Hello, {user?.name || "User"} 👋
          </h1>
          <p className="text-slate-500 dark:text-white/40 font-bold text-sm tracking-wide">
            You have new opportunities today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <Link href="/profile">
             <Button variant="outline" className="h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
               Update Goal
             </Button>
           </Link>
           <Link href="/explore">
             <Button variant="outline" className="h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
               Explore Matches
             </Button>
           </Link>
           <Link href="/requests">
             <Button className="h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
               View Requests
             </Button>
           </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsCards />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          {/* Suggested Matches */}
          <section className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic">Suggested Matches</h2>
              <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black text-[9px] tracking-widest">High Intent</Badge>
            </div>
            
            <div className="grid gap-4 mb-6">
              {suggestedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onRequestIntro={() => {
                    setSelectedCompany({ id: match.id, name: match.name, industry: match.industry, verified: match.verified });
                    setIsModalOpen(true);
                  }} 
                />
              ))}
            </div>

            <Link href="/matches">
              <Button variant="ghost" className="w-full h-12 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                View All Matches <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </section>

          {/* Explore Opportunities Widget */}
          <section className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-[2.5rem]">
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic mb-6">Explore Trending</h2>
             <div className="grid sm:grid-cols-3 gap-4">
               {exploreTrending.map(t => (
                 <div key={t.id} className="p-5 border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl hover:border-primary/30 transition-colors">
                    <h4 className="font-black text-slate-900 dark:text-white mb-1">{t.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">{t.industry}</span>
                    <div className="flex gap-2">
                       <Link href="/profile" className="flex-1">
                         <Button size="sm" variant="outline" className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10">Profile</Button>
                       </Link>
                       <Link href="/explore" className="flex-1">
                         <Button size="sm" className="w-full h-8 text-[9px] font-black uppercase tracking-widest bg-primary text-white">Explore</Button>
                       </Link>
                    </div>
                 </div>
               ))}
             </div>
          </section>

        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
           <IntroRequests />

           {/* Upcoming Meetings Widget */}
           <Card className="p-6 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2rem]">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight italic mb-5">Upcoming Meetings</h3>
              <div className="space-y-4">
                 {upcomingMeetings.map(m => (
                    <div key={m.id} className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl">
                       <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                             <Video className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</h4>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3"/> {m.time}</span>
                          </div>
                       </div>
                       <div className="flex gap-2 mt-2">
                          <Button size="sm" className="flex-1 h-8 text-[9px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white transition-all" onClick={() => toast.success(`Joining meeting with ${m.name}...`)}>Join</Button>
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all" onClick={() => toast.info(`Reschedule request sent to ${m.name}`)}>Reschedule</Button>
                       </div>
                       <Button size="sm" variant="ghost" className="w-full mt-2 h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" onClick={() => toast.success(`Meeting with ${m.name} marked as complete!`)}>Mark Complete</Button>
                    </div>
                 ))}
              </div>
           </Card>

           {/* Performance Insights */}
           <Card className="p-6 bg-slate-900 dark:bg-primary/10 border-none rounded-[2rem] text-white">
              <h3 className="text-base font-black tracking-tight italic mb-4 flex items-center gap-2"><Zap className="h-5 w-5 text-amber-400" /> Performance Insights</h3>
              <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                   <p className="text-xs font-medium text-white/80 leading-relaxed">Verified businesses receive <strong className="text-white">2x more requests</strong>. Complete your verification.</p>
                 </li>
                 <li className="flex items-start gap-3">
                   <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                   <p className="text-xs font-medium text-white/80 leading-relaxed">Add current goal to improve your matching score across the network.</p>
                 </li>
                 <li className="flex items-start gap-3">
                   <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                   <p className="text-xs font-medium text-white/80 leading-relaxed">Respond faster to increase your ranking in Explore feeds.</p>
                 </li>
              </ul>
           </Card>

           {/* Recent Activity */}
           <Card className="p-6 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2rem]">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight italic mb-5">Recent Activity</h3>
              <div className="space-y-4">
                 {recentActivity.map((act) => (
                    <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all">
                       <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 shadow-sm`}>
                          <act.icon className={`h-4 w-4 ${act.color}`} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{act.content}</p>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 block">{act.time}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>

        </div>
      </div>

      {selectedCompany && (
        <RequestIntroModal 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          company={selectedCompany} 
        />
      )}
    </div>
  )
}
