"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Video, MapPin, Search, Bell, ChevronDown, Building2, Star } from "lucide-react"
import { RateMeetingModal } from "@/components/modals/rate-meeting-modal"

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
  },
  {
    id: "4",
    partner: "Global Systems Inc",
    person: "David Wu",
    intent: "VENDOR EVALUATION",
    date: "APR 10, 2026",
    time: "3:00 PM",
    duration: "45 MIN",
    mode: "VIDEO CALL",
    status: "COMPLETED"
  }
]

export default function MeetingsPage() {
  const [search, setSearch] = useState("")
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [isRateModalOpen, setIsRateModalOpen] = useState(false)

  const filteredMeetings = allMeetings.filter(m => 
    m.partner.toLowerCase().includes(search.toLowerCase()) ||
    m.person.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-1">Meetings</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-widest font-black">Manage your deal-making schedule</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative flex-grow sm:flex-grow-0 sm:w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search meetings..." 
                className="pl-11 h-11 bg-slate-100 dark:bg-white/5 border-none rounded-2xl font-bold text-sm w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-all flex-shrink-0">
              <Bell className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:border-primary/50 transition-all">
           Meeting Type <ChevronDown className="h-3 w-3" />
        </Button>
        <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:border-primary/50 transition-all">
           Status <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Meeting Cards */}
      <div className="grid gap-4">
         {filteredMeetings.map((m) => (
           <div key={m.id} className="p-5 md:p-8 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 group hover:border-primary/20 transition-all duration-300">
              
              {/* Card Top: identity + status */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                     <Building2 className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight">{m.partner}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">With {m.person}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">{m.intent}</p>
                  </div>
                </div>
                <Badge className={`uppercase text-[9px] font-black tracking-wider px-3 py-1.5 border-none flex-shrink-0 ${m.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                   {m.status}
                </Badge>
              </div>

              {/* Meta info row — wraps on mobile */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{m.date}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{m.time} ({m.duration})</span>
                 </div>
                 <div className="flex items-center gap-2">
                    {m.mode === 'VIDEO CALL' ? <Video className="h-3.5 w-3.5 text-primary flex-shrink-0" /> : <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{m.mode}</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                 <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] h-10 px-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Reschedule
                 </Button>
                 <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] h-10 px-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Cancel
                 </Button>
                 {m.mode === 'VIDEO CALL' && m.status === 'CONFIRMED' && (
                   <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] h-10 px-6 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
                      <Video className="h-3 w-3" /> Join
                   </Button>
                 )}
                 {m.status === 'COMPLETED' && (
                   <Button 
                     onClick={() => {
                       setSelectedMeeting(m)
                       setIsRateModalOpen(true)
                     }}
                     className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[9px] h-10 px-6 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all ml-auto"
                   >
                      <Star className="h-3 w-3" /> Leave Rating
                   </Button>
                 )}
              </div>
           </div>
         ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No meetings found</p>
        </div>
      )}

      {selectedMeeting && (
        <RateMeetingModal
          open={isRateModalOpen}
          onClose={() => setIsRateModalOpen(false)}
          meeting={selectedMeeting}
        />
      )}
    </div>
  )
}
