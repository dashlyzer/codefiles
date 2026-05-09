"use client"

import { useEffect, useState } from "react"
import { Handshake, TrendingUp, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface MatchItem {
  _id: string
  userId: { _id: string; name: string; email: string } | null
  matchedUserId: { _id: string; name: string; email: string } | null
  score: number
  reasons: string[]
  outcome: string
  createdAt: string
}

const outcomeColors: Record<string, string> = {
  Meeting: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Partnership: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ClientDeal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  VendorDeal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Ignored: "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/40",
  NoOutcome: "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/30",
  "": "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/30",
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
  return (
    <span className={`inline-flex items-center justify-center h-7 w-12 rounded-lg text-xs font-black text-white ${bg}`}>
      {score}
    </span>
  )
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

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [outcome, setOutcome] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (outcome) params.set("outcome", outcome)
      const res = await fetch(`/api/admin/matches?${params}`)
      const data = await res.json()
      setMatches(data.matches || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, outcome])

  const outcomes = ["", "Meeting", "Partnership", "ClientDeal", "VendorDeal", "Ignored", "NoOutcome"]
  const outcomeCounts = stats?.outcomeCounts || {}

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Matches</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Match engine output — synergy scores and real-world outcomes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Matches", value: total, icon: Handshake, color: "text-purple-500" },
          { label: "Avg Match Score", value: stats?.avgScore ?? "—", icon: TrendingUp, color: "text-blue-500" },
          { label: "Led to Meeting", value: outcomeCounts["Meeting"] ?? 0, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Ignored", value: outcomeCounts["Ignored"] ?? 0, icon: XCircle, color: "text-slate-400" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-white/30 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Outcome filter tabs */}
      <div className="flex flex-wrap gap-2">
        {outcomes.map((o) => (
          <button
            key={o}
            onClick={() => { setOutcome(o); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${outcome === o
              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              : "bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:border-red-400"
              }`}
          >
            {o || "All Outcomes"}
            {o && outcomeCounts[o] ? <span className="ml-1.5 opacity-70">({outcomeCounts[o]})</span> : null}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <p className="text-sm font-black text-slate-900 dark:text-white">{total} matches</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                {["User", "Matched With", "Score", "Outcome", "Reasons", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : matches.length === 0
                  ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-white/30 font-bold text-sm">No matches found</td></tr>
                  : matches.map((m) => (
                    <tr key={m._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{m.userId?.name || "—"}</p>
                        <p className="text-xs text-slate-400">{m.userId?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{m.matchedUserId?.name || "—"}</p>
                        <p className="text-xs text-slate-400">{m.matchedUserId?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3"><ScoreBadge score={m.score} /></td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${outcomeColors[m.outcome] || outcomeColors[""]}`}>
                          {m.outcome || "No Outcome"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-white/40 max-w-[200px] truncate">
                        {m.reasons?.join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 dark:text-white/30">
                        {new Date(m.createdAt).toLocaleDateString("en-IN")}
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
