"use client"

import { useState } from "react"
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, 
  ExternalLink, Building2, User, Globe, AlertCircle,
  Search, Filter, ChevronDown, Check, X, ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const MOCK_QUEUE = [
  { id: 1, company: "Quantum Labs", type: "Startup", reg: "CIN-982341", website: "quantum.labs", linkedin: "linkedin.com/quantum", status: "Pending", submitted: "2 hours ago" },
  { id: 2, company: "Oceanic Systems", type: "SME", reg: "GST-22AA982", website: "oceanic.io", linkedin: "linkedin.com/oceanic", status: "Pending", submitted: "5 hours ago" },
  { id: 3, company: "TechFlow Solutions", type: "Enterprise", reg: "CIN-112233", website: "techflow.net", linkedin: "linkedin.com/techflow", status: "Reviewing", submitted: "1 day ago" },
]

export default function AdminVerificationPage() {
  const [queue, setQueue] = useState(MOCK_QUEUE)

  const handleAction = (id: number, status: string) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status } : item))
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Verification Queue</h1>
          <p className="text-slate-500 font-medium text-sm uppercase tracking-widest font-black">Moderate business trust and verification</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-amber-500 text-white border-none font-black px-3 py-1 uppercase text-[10px] tracking-widest">
             {queue.filter(q => q.status === 'Pending').length} Pending
           </Badge>
           <Badge className="bg-blue-500 text-white border-none font-black px-3 py-1 uppercase text-[10px] tracking-widest">
             {queue.filter(q => q.status === 'Reviewing').length} Reviewing
           </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search registrations, companies..." className="pl-12 h-12 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-xl font-bold" />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-white/5 font-black uppercase tracking-widest text-[10px] gap-2">
          <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {queue.map(item => (
          <div key={item.id} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all shadow-sm">
             <div className="flex gap-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center font-black text-2xl text-primary">
                   {item.company[0]}
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">{item.company}</h3>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 text-slate-500">{item.type}</Badge>
                      {item.status === 'Approved' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black uppercase text-[9px] tracking-widest px-2">Approved</Badge>
                      ) : item.status === 'Rejected' ? (
                        <Badge className="bg-red-500/10 text-red-500 border-none font-black uppercase text-[9px] tracking-widest px-2">Rejected</Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-none font-black uppercase text-[9px] tracking-widest px-2">{item.status}</Badge>
                      )}
                   </div>
                   <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <ShieldAlert className="h-3.5 w-3.5" /> REG: <span className="text-slate-900 dark:text-white">{item.reg}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <Globe className="h-3.5 w-3.5" /> {item.website}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <Clock className="h-3.5 w-3.5" /> Submitted {item.submitted}
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-12 w-12 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5">
                   <ExternalLink className="h-5 w-5" />
                </Button>
                {item.status !== 'Approved' && item.status !== 'Rejected' && (
                  <>
                    <Button 
                      onClick={() => handleAction(item.id, 'Rejected')}
                      variant="outline" 
                      className="h-12 px-6 rounded-xl border-slate-200 dark:border-white/5 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button 
                      onClick={() => handleAction(item.id, 'Approved')}
                      className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  </>
                )}
             </div>
          </div>
        ))}
        {queue.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <ShieldCheck className="h-12 w-12 text-slate-200 mx-auto" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Queue is empty. Well done!</p>
          </div>
        )}
      </div>
    </div>
  )
}
