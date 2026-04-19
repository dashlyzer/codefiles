"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Video, MapPin, Search, Bell, ChevronDown, Building2 } from "lucide-react"

const allMeetings = [
  {
    id: "1",
    partner: "DataStream Analytics",
    person: "Sarah Chen",
    intent: "PARTNERSHIP DISCUSSION",
    date: "APR 14, 2026",
    time: "10:00 AM",
    duration: "30 MIN",
    mode: "VIDEO CALL",
    status: "CONFIRMED"
  },
  {
    id: "2",
    partner: "Nexus Technologies",
    person: "Michael Park",
    intent: "INITIAL DISCOVERY",
    date: "APR 15, 2026",
    time: "2:00 PM",
    duration: "45 MIN",
    mode: "VIDEO CALL",
    status: "CONFIRMED"
  },
  {
    id: "3",
    partner: "ScaleOps Solutions",
    person: "Emily Rodriguez",
    intent: "CONTRACT NEGOTIATION",
    date: "APR 17, 2026",
    time: "11:00 AM",
    duration: "1 HOUR",
    mode: "IN-PERSON",
    status: "PENDING"
  }
]

export default function MeetingsPage() {
  const [search, setSearch] = useState("")

  const filteredMeetings = allMeetings.filter(m => 
    m.partner.toLowerCase().includes(search.toLowerCase()) ||
    m.person.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-2">Meetings</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-sm uppercase tracking-widest font-black">Manage your deal-making schedule</p>
        </div>
        
        <div className="flex items-center gap-4 flex-grow max-w-md md:justify-end">
           <div className="relative flex-grow max-w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search meetings..." 
                className="pl-12 h-12 bg-slate-100 dark:bg-white/5 border-none rounded-2xl font-bold text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:border-primary/50 transition-all">
           Meeting Type <ChevronDown className="h-3 w-3" />
        </Button>
        <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:border-primary/50 transition-all">
           Status <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid gap-6">
         {filteredMeetings.map((m) => (
           <div key={m.id} className="p-10 rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 group hover:border-primary/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                     <Building2 className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{m.partner}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">With {m.person}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary tracking-[0.2em]">{m.intent}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 md:gap-12">
                   <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{m.date}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{m.time} ({m.duration})</span>
                   </div>
                   <div className="flex items-center gap-3">
                      {m.mode === 'VIDEO CALL' ? <Video className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{m.mode}</span>
                   </div>
                   <Badge className={`uppercase text-[10px] font-black tracking-[0.1em] px-4 py-2 border-none ${m.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {m.status}
                   </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-11 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Reschedule
                 </Button>
                 <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-11 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Cancel
                 </Button>
                 {m.mode === 'VIDEO CALL' && m.status === 'CONFIRMED' && (
                   <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
                      <Video className="h-3 w-3" /> Join
                   </Button>
                 )}
              </div>
           </div>
         ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No meetings found</p>
        </div>
      )}
    </div>
  )
}
