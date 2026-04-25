"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Clock, CheckCircle2, XCircle, ArrowRight, User, Check, X, Calendar } from "lucide-react"
import { DealFlowStepper } from "@/components/deal/deal-flow-stepper"

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState("received")
  const [receivedRequests, setReceivedRequests] = useState([
    { id: 1, company: "Acme Corp", message: "We're very interested in your recent intent regarding AI infrastructure and would love to discuss a potential partnership.", status: "Pending", match: "96%", time: "2 hours ago" },
    { id: 2, company: "BuildIt Ltd", message: "Your expertise in cloud scaling matches our current project needs. Let's explore how we can work together.", status: "Pending", match: "91%", time: "5 hours ago" },
    { id: 3, company: "Nexus Systems", message: "Interested in your supply chain solution for our East Coast operations.", status: "Accepted", match: "88%", time: "1 day ago" },
  ])

  const [sentRequests, setSentRequests] = useState([
    { id: 4, company: "Xenia Soft", message: "We saw your offer for strategic investment and would like to share our current performance metrics.", status: "Pending", match: "94%", time: "Sent 2 days ago" },
    { id: 5, company: "Y-Combinator", message: "Requesting an introduction regarding your portfolio's infrastructure needs.", status: "Rejected", match: "89%", time: "Sent 1 week ago" },
  ])

  const handleAction = (id: number, action: 'Accepted' | 'Rejected') => {
    setReceivedRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-2">Intro Requests</h1>
        <p className="text-slate-500 dark:text-white/40 font-medium text-sm uppercase tracking-widest font-black">Manage your deal-making introductions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white dark:bg-[#0A0A0A] p-1 rounded-2xl h-16 mb-8 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-100 dark:shadow-none">
          <TabsTrigger value="received" className="rounded-xl px-12 h-full font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm transition-all">
            Received ({receivedRequests.filter(r => r.status === 'Pending').length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="rounded-xl px-12 h-full font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm transition-all">
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
           {receivedRequests.map(r => (
             <div key={r.id} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                <div className="flex gap-8">
                   <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center font-black text-3xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {r.company[0]}
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">{r.company}</h3>
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">{r.match} Match</Badge>
                      </div>
                      <p className="text-slate-500 dark:text-white/60 text-sm font-medium italic max-w-xl leading-relaxed">"{r.message}"</p>
                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <span className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg"><Clock className="h-3 w-3" /> {r.time}</span>
                         <DealFlowStepper status={r.status as any} />
                      </div>
                   </div>
                </div>
                
                <div className="flex gap-4">
                  {r.status === 'Pending' ? (
                     <>
                        <Button 
                          variant="outline" 
                          onClick={() => handleAction(r.id, 'Rejected')}
                          className="rounded-xl border-slate-200 dark:border-white/10 text-red-500 font-black uppercase tracking-widest text-[10px] h-14 px-8 hover:bg-red-500/10 transition-all flex items-center gap-2"
                        >
                           <X className="h-4 w-4" /> Reject
                        </Button>
                        <Button 
                          onClick={() => handleAction(r.id, 'Accepted')}
                          className="bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-xl shadow-primary/20 group-hover:scale-105 transition-all flex items-center gap-2"
                        >
                           <Check className="h-4 w-4" /> Accept Intro
                        </Button>
                     </>
                  ) : r.status === 'Accepted' ? (
                    <Link href={`/meetings?schedule=true&partner=${r.company}`}>
                      <Button className="bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-all flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Schedule Meeting
                      </Button>
                    </Link>
                  ) : null}
                </div>
             </div>
           ))}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
           {sentRequests.map(r => (
             <div key={r.id} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 opacity-90 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex gap-8">
                   <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center font-black text-3xl text-slate-400">
                      {r.company[0]}
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">{r.company}</h3>
                      <p className="text-slate-500 dark:text-white/60 text-sm font-medium italic max-w-xl leading-relaxed">"{r.message}"</p>
                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <span className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg"><Clock className="h-3 w-3" /> {r.time}</span>
                         {r.status === 'Rejected' ? (
                            <span className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1 rounded-lg font-black uppercase">Rejected</span>
                         ) : (
                            <span className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg font-black uppercase">Pending Response</span>
                         )}
                      </div>
                   </div>
                </div>
                <Button variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-14 px-8 hover:bg-slate-50 dark:hover:bg-white/5">
                  Cancel Request
                </Button>
             </div>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
