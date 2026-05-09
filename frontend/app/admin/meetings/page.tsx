"use client"

import { useEffect, useState } from "react"
import { Calendar, CheckCircle2, XCircle, Clock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

interface MeetingItem {
  _id: string
  organizerId: { name: string; email: string } | null
  attendeeId: { name: string; email: string } | null
  startTime: string
  status: string
  meetLink: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-white/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingItem[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (status) params.set("status", status)
      const res = await fetch(`/api/admin/meetings?${params}`)
      const data = await res.json()
      setMeetings(data.meetings || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, status])

  const tabs = [
    { label: "All", value: "" },
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Meetings</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Track all platform meetings — scheduled, completed, and cancelled.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Meetings", value: stats?.total ?? "—", icon: Calendar, color: "text-blue-500" },
          { label: "Scheduled", value: stats?.scheduled ?? "—", icon: Clock, color: "text-amber-500" },
          { label: "Completed", value: stats?.completed ?? "—", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Cancelled", value: stats?.cancelled ?? "—", icon: XCircle, color: "text-red-500" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-white/30 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => { setStatus(t.value); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${status === t.value
              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              : "bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:border-red-400"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <p className="text-sm font-black text-slate-900 dark:text-white">{total} meetings</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                {["Organizer", "Attendee", "Scheduled At", "Status", "Meet Link"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : meetings.length === 0
                  ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400 dark:text-white/30 font-bold text-sm">No meetings found</td></tr>
                  : meetings.map((m) => (
                    <tr key={m._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{m.organizerId?.name || "—"}</p>
                        <p className="text-xs text-slate-400">{m.organizerId?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{m.attendeeId?.name || "—"}</p>
                        <p className="text-xs text-slate-400">{m.attendeeId?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-white/60">
                        {new Date(m.startTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${statusColors[m.status] || ""}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {m.meetLink ? (
                          <a href={m.meetLink} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:underline">
                            Open <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-white/5">
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
  )
}
