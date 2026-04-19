"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, MapPin, ExternalLink, ChevronRight, CheckCircle2, MoreHorizontal } from "lucide-react"

const meetings = [
  {
    title: "Strategic Partnership Discovery",
    partner: "Nexus Technologies",
    date: "April 20, 2026",
    time: "10:00 AM EST",
    mode: "Virtual (Zoom)",
    status: "Confirmed",
    type: "Upcoming"
  },
  {
    title: "M&A Integration Discussion",
    partner: "DataStream Analytics",
    date: "April 22, 2026",
    time: "2:30 PM EST",
    mode: "Virtual (Google Meet)",
    status: "Pending Confirmation",
    type: "Upcoming"
  },
  {
    title: "Product Demo & Technical Sync",
    partner: "TechFlow Solutions",
    date: "April 15, 2026",
    time: "11:00 AM EST",
    mode: "Virtual (Teams)",
    status: "Completed",
    type: "Completed"
  },
  {
    title: "Initial Introduction",
    partner: "Global Systems",
    date: "April 10, 2026",
    time: "4:00 PM EST",
    mode: "Virtual (Zoom)",
    status: "Completed",
    type: "Completed"
  }
]

export default function MeetingsPage() {
  const upcoming = meetings.filter(m => m.type === "Upcoming")
  const completed = meetings.filter(m => m.type === "Completed")

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-2">Meetings</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-sm uppercase tracking-widest font-black">Manage your deal-making schedule</p>
        </div>
        <Button className="bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20">
          Sync with Google Calendar
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1">
           <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 space-y-8 sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tight">Calendar</h3>
                <span className="text-xs font-black text-primary uppercase tracking-widest">April 2026</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
                {[...Array(30)].map((_, i) => (
                  <div key={i} className={`h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${[19, 21].includes(i) ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black' : 'hover:bg-slate-50 dark:hover:bg-white/5 font-bold'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upcoming Meeting</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Available Slot</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Meeting Lists */}
        <div className="lg:col-span-3 space-y-16">
           <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight italic flex items-center gap-4">
                Upcoming Meetings
                <Badge className="bg-primary/10 text-primary border-none text-xs font-black px-3 py-1">{upcoming.length}</Badge>
              </h2>
              <div className="space-y-4">
                 {upcoming.map((m, i) => (
                   <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                      <div className="flex gap-8">
                        <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60">APR</span>
                           <span className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-white">{m.date.split(' ')[1].replace(',','')}</span>
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight group-hover:text-primary transition-colors">{m.title}</h3>
                           <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span className="flex items-center gap-2"><Video className="h-3 w-3" /> {m.partner}</span>
                              <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> {m.time}</span>
                              <span className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {m.mode}</span>
                           </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={`uppercase text-[10px] font-black tracking-widest px-4 py-2 border-none ${m.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {m.status}
                        </Badge>
                        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-all">
                          Join Call
                        </Button>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight italic opacity-50">Completed Meetings</h2>
              <div className="space-y-4">
                 {completed.map((m, i) => (
                   <div key={i} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center gap-8">
                         <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 className="h-7 w-7" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-black text-slate-900 dark:text-white text-xl italic tracking-tight">{m.title}</h4>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                               <span>With {m.partner}</span>
                               <span>•</span>
                               <span>{m.date}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">View Notes</Button>
                         <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Recording</Button>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  )
}
