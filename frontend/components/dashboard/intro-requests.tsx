import { Button } from "@/components/ui/button"
import { Building2, Clock, Check, X, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const requests = [
  {
    id: "1",
    company: "TechNova Labs",
    type: "Incoming",
    status: "pending",
    time: "2 hours ago",
    message: "Interested in your cloud infrastructure services.",
  },
  {
    id: "2",
    company: "GrowthEdge Media",
    type: "Incoming",
    status: "pending",
    time: "5 hours ago",
    message: "Looking to discuss partnership opportunities.",
  },
  {
    id: "3",
    company: "FinBridge Capital",
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
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Pending Requests</h3>
        <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full border border-primary/20 uppercase tracking-widest shadow-[0_0_10px_rgba(3,169,244,0.1)]">
          {requests.filter((r) => r.status === "pending").length} new
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:border-slate-200 dark:hover:border-white/10 transition-all group"
          >
            <div className="flex items-start gap-4">
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
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-wider">
                  <Clock className="h-3 w-3" />
                  {request.time}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-1">
              {request.status === "pending" ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-8 text-[10px] font-black uppercase tracking-widest border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-white/10 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    onClick={() => toast.info(`Rejected request from ${request.company}`)}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="flex-1 h-8 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
                    onClick={() => toast.success(`Accepted request from ${request.company}`)}
                  >
                    Accept
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-8 text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                  onClick={() => toast.success(`Sent follow-up to ${request.company}`)}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Follow Up
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Link href="/requests" className="block w-full mt-6">
        <Button variant="ghost" className="w-full h-11 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl font-bold transition-all">
          View All Requests
        </Button>
      </Link>
    </div>
  )
}
