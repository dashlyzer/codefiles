"use client"

import { Button } from "@/components/ui/button"
import { Building2, Clock, Check, X } from "lucide-react"

const requests = [
  {
    id: "1",
    company: "InnovateTech Labs",
    type: "Incoming",
    status: "pending",
    time: "2 hours ago",
    message: "Interested in your cloud infrastructure services.",
  },
  {
    id: "2",
    company: "GrowthPath Analytics",
    type: "Incoming",
    status: "pending",
    time: "5 hours ago",
    message: "Looking to discuss partnership opportunities.",
  },
  {
    id: "3",
    company: "ScaleUp Ventures",
    type: "Outgoing",
    status: "awaiting",
    time: "1 day ago",
    message: "Sent intro request for potential client relationship.",
  },
]

export function IntroRequests() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-7 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Pending Intro Requests</h3>
        <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full border border-primary/20 uppercase tracking-widest shadow-[0_0_10px_rgba(3,169,244,0.1)]">
          {requests.filter((r) => r.status === "pending").length} new
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:border-slate-200 dark:hover:border-white/10 transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{request.company}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tight ${
                  request.type === "Incoming"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                    : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 border border-slate-200 dark:border-white/10"
                }`}>
                  {request.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-1 lines-clamp-1 font-medium italic">
                &quot;{request.message}&quot;
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-wider">
                <Clock className="h-3 w-3" />
                {request.time}
              </div>
            </div>
            {request.status === "pending" && (
              <div className="flex flex-col gap-2 shrink-0">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-500 hover:border-red-500/30 rounded-lg transition-all">
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-7 w-7 p-0 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-[0_0_10px_rgba(3,169,244,0.3)]">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
            {request.status === "awaiting" && (
              <span className="text-[10px] text-slate-300 dark:text-white/20 font-bold uppercase tracking-widest shrink-0 self-center">
                Awaiting
              </span>
            )}
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-8 h-11 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl font-bold transition-all">
        View All Requests
      </Button>
    </div>
  )
}
