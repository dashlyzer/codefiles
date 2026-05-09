"use client"

import { useEffect, useState } from "react"
import { Users, Target, Clock, AlertTriangle, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface UserProfile {
  _id: string
  name: string
  email: string
  designation: string
  status: string
  activelyLookingFor: string
  profileScore: number
  intentLastUpdated: string | null
  businessDescription: string
  createdAt: string
  companyName: string
  industry: string
  currentGoal: string
  offerings: string[]
  needs: string[]
  isProfileCompleted: boolean
}

interface Stats {
  totalUsers: number
  completeProfiles: number
  staleIntent: number
  noIntent: number
}

const intentColors: Record<string, string> = {
  Clients: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Partners: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Investors: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Vendors: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Distribution: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "": "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/30",
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-black text-slate-700 dark:text-white/70 w-7 text-right">{score}%</span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-white/5">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function AdminProfilesPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [intent, setIntent] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<UserProfile | null>(null)

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (search) params.set("search", search)
      if (intent) params.set("intent", intent)
      const res = await fetch(`/api/admin/profiles?${params}`)
      const data = await res.json()
      setUsers(data.users || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page, intent])

  const intentOptions = ["", "Clients", "Partners", "Investors", "Vendors", "Distribution"]

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profiles & Intent</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Monitor profile quality and business intent across the network.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "text-blue-500" },
          { label: "High-Quality Profiles", value: stats?.completeProfiles ?? "—", icon: Target, color: "text-emerald-500" },
          { label: "Stale Intent (>30d)", value: stats?.staleIntent ?? "—", icon: Clock, color: "text-amber-500" },
          { label: "No Intent Set", value: stats?.noIntent ?? "—", icon: AlertTriangle, color: "text-red-500" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-white/30 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); fetchData() } }}
            placeholder="Search by name or email… (Enter)"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
        <select
          value={intent}
          onChange={(e) => { setIntent(e.target.value); setPage(1) }}
          className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          {intentOptions.map((o) => (
            <option key={o} value={o}>{o || "All Intent Types"}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="text-sm font-black text-slate-900 dark:text-white">{total} users</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-left">
                {["User", "Business", "Industry", "Intent", "Profile Score", "Intent Updated"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : users.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-white/30 font-bold text-sm">
                        No users found
                      </td>
                    </tr>
                  )
                  : users.map((u) => (
                    <tr
                      key={u._id}
                      onClick={() => setSelected(selected?._id === u._id ? null : u)}
                      className="border-b border-slate-100 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-slate-400 dark:text-white/30">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800 dark:text-white/80">{u.companyName || "—"}</p>
                        <p className="text-xs text-slate-400">{u.designation || ""}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-white/60 font-medium">{u.industry || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${intentColors[u.activelyLookingFor] || intentColors[""]}`}>
                          {u.activelyLookingFor || "Not set"}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-36">
                        <ScoreBar score={u.profileScore} />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 dark:text-white/30">
                        {u.intentLastUpdated
                          ? new Date(u.intentLastUpdated).toLocaleDateString("en-IN")
                          : "Never"}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="border-t border-slate-100 dark:border-white/5 px-6 py-5 bg-slate-50 dark:bg-white/2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Detail — {selected.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-white/30 mb-1">Business Description</p>
                <p className="text-slate-700 dark:text-white/70">{selected.businessDescription || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-white/30 mb-1">Offerings</p>
                <p className="text-slate-700 dark:text-white/70">{selected.offerings.join(", ") || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-white/30 mb-1">Needs</p>
                <p className="text-slate-700 dark:text-white/70">{selected.needs.join(", ") || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-white/30 mb-1">Current Goal</p>
                <p className="text-slate-700 dark:text-white/70">{selected.currentGoal || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-white/30 mb-1">Status</p>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${selected.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {selected.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-white/30 mb-1">Profile Completed</p>
                <p className="text-slate-700 dark:text-white/70">{selected.isProfileCompleted ? "✅ Yes" : "❌ No"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-white/5">
            <p className="text-xs text-slate-400 dark:text-white/30 font-bold">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-white/60" />
              </button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="h-4 w-4 text-slate-600 dark:text-white/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
