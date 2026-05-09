"use client"

import { useEffect, useState } from "react"
import { ScrollText, Filter, ChevronLeft, ChevronRight, Activity } from "lucide-react"

interface LogItem {
  _id: string
  adminId: { name: string; email: string } | null
  action: string
  targetType: string
  notes: string
  createdAt: string
}

const actionColors: Record<string, string> = {
  USER_SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  USER_FLAGGED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  USER_DELETED: "bg-red-200 text-red-800 dark:bg-red-800/40 dark:text-red-300",
  BUSINESS_APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  BUSINESS_REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  FLAG_RESOLVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  FLAG_DISMISSED: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40",
  FLAG_UPDATED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  REVIEW_REMOVED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-slate-100 dark:border-white/5 animate-pulse">
      <div className="h-7 w-7 bg-slate-100 dark:bg-white/5 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/3" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-2/3" />
      </div>
    </div>
  )
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([])
  const [breakdown, setBreakdown] = useState<{ _id: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState("")
  const [targetType, setTargetType] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" })
      if (action) params.set("action", action)
      if (targetType) params.set("targetType", targetType)
      const res = await fetch(`/api/admin/activity-logs?${params}`)
      const data = await res.json()
      setLogs(data.logs || [])
      setBreakdown(data.actionBreakdown || [])
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, action, targetType])

  const targetTypes = ["", "User", "Business", "Meeting", "Request", "Rating", "Flag"]

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Activity Logs</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Full audit trail — every admin action logged with timestamp and context.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Breakdown Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden sticky top-4">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Action Types</p>
            </div>
            <div className="p-3 space-y-1">
              <button
                onClick={() => { setAction(""); setPage(1) }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${action === "" ? "bg-red-600 text-white" : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5"}`}
              >
                All Actions <span className="opacity-50 ml-1">({total})</span>
              </button>
              {breakdown.map((b) => (
                <button
                  key={b._id}
                  onClick={() => { setAction(b._id); setPage(1) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${action === b._id ? "bg-red-600 text-white" : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5"}`}
                >
                  <span className="truncate block">{b._id.replace(/_/g, " ")}</span>
                  <span className="opacity-50">{b.count}×</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Log Feed */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={action}
                onChange={(e) => { setAction(e.target.value); setPage(1) }}
                placeholder="Filter by action…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>
            <select
              value={targetType}
              onChange={(e) => { setTargetType(e.target.value); setPage(1) }}
              className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
            >
              {targetTypes.map((t) => (
                <option key={t} value={t}>{t || "All Target Types"}</option>
              ))}
            </select>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
              <p className="text-sm font-black text-slate-900 dark:text-white">{total} log entries</p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : logs.length === 0 ? (
                <div className="p-12 text-center">
                  <ScrollText className="h-8 w-8 text-slate-200 dark:text-white/10 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400 dark:text-white/30">No log entries found</p>
                  <p className="text-xs text-slate-300 dark:text-white/15 mt-1">Admin actions will appear here</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log._id} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="h-3.5 w-3.5 text-slate-400 dark:text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${actionColors[log.action] || "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40"}`}>
                          {log.action.replace(/_/g, " ")}
                        </span>
                        {log.targetType && (
                          <span className="text-[10px] font-bold text-slate-400 dark:text-white/20">→ {log.targetType}</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white/80 mt-1">
                        {log.adminId?.name || "Unknown Admin"}
                        <span className="font-normal text-slate-400 dark:text-white/30 text-xs ml-1">({log.adminId?.email})</span>
                      </p>
                      {log.notes && (
                        <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{log.notes}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 dark:text-white/15 shrink-0 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-400 dark:text-white/30 font-bold">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5">
                    <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-white/60" />
                  </button>
                  <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5">
                    <ChevronRight className="h-4 w-4 text-slate-600 dark:text-white/60" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
