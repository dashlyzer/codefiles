"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MessageCircle, User, ArrowRight, ShieldCheck, TrendingUp, Award } from "lucide-react"

export default function RatingsPage() {
  const [activeTab, setActiveTab] = useState("received")

  const receivedRatings = [
    { from: "TechFlow Solutions", score: 5, feedback: "Excellent communication and clear deal objectives. A pleasure to work with on the cloud migration strategy.", date: "April 12, 2026", category: "Communication" },
    { from: "GrowthMetrics", score: 4.8, feedback: "Very professional. The intro request was well-defined and led to a productive series of meetings.", date: "March 28, 2026", category: "Professionalism" },
    { from: "Global Systems", score: 5, feedback: "Strategic alignment was perfect. Looking forward to our long-term collaboration.", date: "March 15, 2026", category: "Integrity" },
  ]

  const givenRatings = [
    { to: "Nexus Technologies", score: 4.5, feedback: "Strong technical team and good match for our infrastructure needs. Process was smooth.", date: "April 5, 2026" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-2">Ratings & Feedback</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-sm uppercase tracking-widest font-black">Build and maintain your business trust score</p>
        </div>
        <div className="flex items-center gap-4">
           <Badge className="bg-emerald-500 text-white border-none uppercase text-[10px] font-black tracking-widest px-4 py-2">Verified Partner</Badge>
        </div>
      </div>

      {/* Average Rating Summary (NEW) */}
      <div className="grid md:grid-cols-3 gap-6">
         <Card className="p-8 bg-primary text-white border-none rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Average Trust Score</span>
               <div className="flex items-end gap-3 mb-4">
                  <span className="text-6xl font-black italic tracking-tighter">4.9</span>
                  <div className="flex flex-col pb-2">
                    <div className="flex gap-0.5">
                       {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-white" />)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Top 2%</span>
                  </div>
               </div>
               <p className="text-xs font-bold text-white/80">Based on 12 verified business interactions</p>
            </div>
            <Award className="absolute top-0 right-0 h-40 w-40 text-white/10 -translate-y-10 translate-x-10" />
         </Card>

         <Card className="p-8 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2.5rem]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 block">Performance Metrics</span>
            <div className="space-y-4">
               {[
                 { label: "Communication", val: "5.0", color: "bg-primary" },
                 { label: "Reliability", val: "4.8", color: "bg-primary" },
                 { label: "Integrity", val: "4.9", color: "bg-primary" }
               ].map((m, i) => (
                 <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">{m.label}</span>
                       <span className="text-slate-900 dark:text-white">{m.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${m.color}`} style={{ width: `${parseFloat(m.val)*20}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="p-8 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
            <ShieldCheck className="h-12 w-12 text-emerald-500 mb-4" />
            <h3 className="font-black text-slate-900 dark:text-white italic tracking-tight mb-2">Verified Identity</h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">Your profile has passed our 5-step strategic verification process.</p>
         </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 pt-8">
         <div className="lg:col-span-1">
            <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-8 sticky top-28">
               <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tight">Reputation Insights</h3>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <TrendingUp className="h-5 w-5 text-primary" />
                     <div>
                        <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Improving Score</span>
                        <p className="text-[10px] text-slate-500 font-medium">+0.2 in the last 30 days</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Award className="h-5 w-5 text-amber-500" />
                     <div>
                        <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Top Rated</span>
                        <p className="text-[10px] text-slate-500 font-medium">Ranked #12 in Enterprise SaaS</p>
                     </div>
                  </div>
               </div>
               <Button className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px]">
                  Request Endorsement
               </Button>
            </div>
         </div>

         <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white dark:bg-[#0A0A0A] p-1 rounded-2xl h-14 mb-8 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-100 dark:shadow-none">
                <TabsTrigger value="received" className="rounded-xl px-12 h-full font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Received Ratings ({receivedRatings.length})
                </TabsTrigger>
                <TabsTrigger value="given" className="rounded-xl px-12 h-full font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Given Ratings ({givenRatings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-4">
                 {receivedRatings.map((r, i) => (
                   <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 space-y-6 group hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center font-black text-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                               {r.from[0]}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">{r.from}</h4>
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{r.date}</span>
                                  <Badge className="bg-slate-50 dark:bg-white/5 text-slate-400 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0">{r.category}</Badge>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-black text-slate-900 dark:text-white">{r.score}</span>
                         </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium italic text-lg leading-relaxed max-w-2xl">
                         "{r.feedback}"
                      </p>
                   </div>
                 ))}
              </TabsContent>

              <TabsContent value="given" className="space-y-4">
                 {givenRatings.map((r, i) => (
                   <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 space-y-6 opacity-80 hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center font-black text-2xl text-slate-400">
                               {r.to[0]}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">{r.to}</h4>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{r.date}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-black text-slate-900 dark:text-white">{r.score}</span>
                         </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium italic text-lg leading-relaxed">
                         "{r.feedback}"
                      </p>
                   </div>
                 ))}
              </TabsContent>
            </Tabs>
         </div>
      </div>
    </div>
  )
}
