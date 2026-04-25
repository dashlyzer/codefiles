"use client"

import { MessageSquare, Search, Filter, ChevronDown, CheckCircle2, Clock, MapPin, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const MOCK_REQUESTS = [
  { id: 1, from: "Nexus Tech", to: "Acme Soft", status: "Accepted", type: "Partnership", time: "2 hours ago" },
  { id: 2, from: "DataStream", to: "Zenith Log", status: "Pending", type: "Client", time: "5 hours ago" },
  { id: 3, from: "Oceanic", to: "TechFlow", status: "Rejected", type: "Vendor", time: "1 day ago" },
]

export default function AdminRequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Platform Requests</h1>
        <p className="text-slate-500 font-medium text-sm uppercase tracking-widest font-black">Monitor all introduction requests across the ecosystem</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search requests..." className="pl-12 h-12 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-xl font-bold" />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-white/5 font-black uppercase tracking-widest text-[10px] gap-2">
          <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">From / To</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Type</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {MOCK_REQUESTS.map(req => (
                  <tr key={req.id} className="border-b border-slate-50 dark:border-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                     <td className="p-6">
                        <div className="flex items-center gap-4">
                           <div className="space-y-1">
                              <p className="font-black text-slate-900 dark:text-white text-sm italic">{req.from}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <ArrowRight className="h-2.5 w-2.5" /> {req.to}
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="p-6">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary">{req.type}</Badge>
                     </td>
                     <td className="p-6">
                        {req.status === 'Accepted' ? (
                          <span className="flex items-center gap-2 text-emerald-500 font-black uppercase text-[9px] tracking-widest"><CheckCircle2 className="h-3 w-3" /> {req.status}</span>
                        ) : req.status === 'Pending' ? (
                          <span className="flex items-center gap-2 text-amber-500 font-black uppercase text-[9px] tracking-widest"><Clock className="h-3 w-3" /> {req.status}</span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-500 font-black uppercase text-[9px] tracking-widest"><Clock className="h-3 w-3" /> {req.status}</span>
                        )}
                     </td>
                     <td className="p-6 text-xs font-bold text-slate-400">{req.time}</td>
                     <td className="p-6 text-right">
                        <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100">
                           Details
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  )
}

