"use client"

import { useEffect, useState } from "react"
import { Flag, AlertTriangle, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface FlagItem {
  _id: string
  reporterId: { name: string; email: string } | null
  reportedUserId: { name: string; email: string; status: string } | null
  type: string
  description: string
  status: string
  adminNotes: string
  createdAt: string
  resolvedBy: { name: string } | null
  resolvedAt: string | null
}

const typeColors: Record<string, string> = {
  "Fake Business": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Spam": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Abusive Behavior": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "Fraudulent Activity": "bg-red-200 text-red-800 dark:bg-red-800/30 dark:text-red-300",
  "Misleading Information": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Other": "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40",
}

const statusColors: Record<string, string> = {
  Open: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Under Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Dismissed: "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/30",
}

function SkeletonRow() {
  return (
    <div className="p-4 border-b border-slate-100 dark:border-white/5 animate-pulse">
      <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/2" />
    </div>
  )
}

export default function AdminFlagsPage() {
  const { user } = useAuth()
  const [flags, setFlags] = useState<FlagItem[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedFlag, setSelectedFlag] = useState<FlagItem | null>(null)
  const [noteText, setNoteText] = useState("")

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (status) params.set("status", status)
      const res = await fetch(`/api/admin/flags?${params}`)
      const data = await res.json()
      setFlags(data.flags || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, status])

  async function updateFlag(flagId: string, newStatus: string) {
    setActionLoading(flagId)
    try {
      await fetch("/api/admin/flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flagId,
          status: newStatus,
          adminNotes: noteText,
          adminId: user?._id || user?.id,
        }),
      })
      setSelectedFlag(null)
      setNoteText("")
      await fetchData()
    } catch (e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  const tabs = [
    { label: "All", value: "", count: (stats?.open || 0) + (stats?.underReview || 0) + (stats?.resolved || 0) + (stats?.dismissed || 0) },
    { label: "Open", value: "Open", count: stats?.open || 0 },
    { label: "Under Review", value: "Under Review", count: stats?.underReview || 0 },
    { label: "Resolved", value: "Resolved", count: stats?.resolved || 0 },
    { label: "Dismissed", value: "Dismissed", count: stats?.dismissed || 0 },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Reports & Flags</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">User-submitted abuse and fraud reports — resolve or dismiss.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open", value: stats?.open ?? "—", icon: AlertTriangle, color: "text-red-500" },
          { label: "Under Review", value: stats?.underReview ?? "—", icon: Clock, color: "text-amber-500" },
          { label: "Resolved", value: stats?.resolved ?? "—", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Dismissed", value: stats?.dismissed ?? "—", icon: XCircle, color: "text-slate-400" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-white/30 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => { setStatus(t.value); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${status === t.value
              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              : "bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:border-red-400"
              }`}
          >
            {t.label} {t.count > 0 && <span className="ml-1 opacity-60">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Flag Cards */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden"><SkeletonRow /></div>)
        ) : flags.length === 0 ? (
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-12 text-center">
            <Flag className="h-8 w-8 text-slate-300 dark:text-white/10 mx-auto mb-3" />
            <p className="text-slate-400 dark:text-white/30 font-bold text-sm">No flags in this category</p>
          </div>
        ) : (
          flags.map((f) => (
            <div key={f._id} className={`bg-white dark:bg-[#0A0A0A] rounded-2xl border transition-all overflow-hidden ${selectedFlag?._id === f._id ? "border-red-400 dark:border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]" : "border-slate-200 dark:border-white/5"}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${typeColors[f.type] || typeColors["Other"]}`}>
                        {f.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${statusColors[f.status] || ""}`}>
                        {f.status}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-white/20 ml-auto">
                        {new Date(f.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div>
                        <span className="text-xs font-black text-slate-400 dark:text-white/30">Reporter: </span>
                        <span className="font-bold text-slate-800 dark:text-white/80">{f.reporterId?.name || "Unknown"}</span>
                        <span className="text-xs text-slate-400 ml-1">({f.reporterId?.email})</span>
                      </div>
                      <span className="text-slate-300 dark:text-white/10">→</span>
                      <div>
                        <span className="text-xs font-black text-slate-400 dark:text-white/30">Reported: </span>
                        <span className="font-bold text-slate-800 dark:text-white/80">{f.reportedUserId?.name || "Unknown"}</span>
                        <span className="text-xs text-slate-400 ml-1">({f.reportedUserId?.email})</span>
                      </div>
                    </div>
                    {f.description && (
                      <p className="text-sm text-slate-600 dark:text-white/50 mt-2 italic">"{f.description}"</p>
                    )}
                    {f.adminNotes && (
                      <p className="text-xs text-slate-400 dark:text-white/30 mt-1">Admin note: {f.adminNotes}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {(f.status === "Open" || f.status === "Under Review") && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedFlag(selectedFlag?._id === f._id ? null : f)}
                        className="px-3 py-1.5 text-xs font-black rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                      >
                        {selectedFlag?._id === f._id ? "Cancel" : "Act"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Panel */}
                {selectedFlag?._id === f._id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Admin note (optional)…"
                      rows={2}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                    />
                    <div className="flex gap-2">
                      {f.status === "Open" && (
                        <button
                          onClick={() => updateFlag(f._id, "Under Review")}
                          disabled={actionLoading === f._id}
                          className="px-3 py-1.5 text-xs font-black rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors disabled:opacity-50"
                        >
                          Mark Under Review
                        </button>
                      )}
                      <button
                        onClick={() => updateFlag(f._id, "Resolved")}
                        disabled={actionLoading === f._id}
                        className="px-3 py-1.5 text-xs font-black rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50"
                      >
                        ✓ Resolve
                      </button>
                      <button
                        onClick={() => updateFlag(f._id, "Dismissed")}
                        disabled={actionLoading === f._id}
                        className="px-3 py-1.5 text-xs font-black rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 dark:text-white/30 font-bold">Page {page} of {pages} ({total} total)</p>
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
  )
}
