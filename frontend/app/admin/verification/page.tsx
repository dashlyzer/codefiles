"use client"

import { useEffect, useState, useCallback } from "react"
import { ShieldCheck, Search, Globe, Check, X, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { SectionCard } from "@/components/admin/SectionCard"
import { EmptyState } from "@/components/admin/EmptyState"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { useAuth } from "@/components/auth-provider"

interface Business {
  _id: string; name: string; industry: string; website?: string; linkedIn?: string
  verificationStatus: string; createdAt: string; userId?: { name: string; email: string }
  teamSize?: string; businessType?: string; location?: { city: string }; gstNumber?: string
  adminNotes?: string; profileScore?: number
}

const statusTabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Under Review", value: "Under Review" },
  { label: "Need More Info", value: "Need More Info" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
]

export default function AdminVerificationPage() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [noteMap, setNoteMap] = useState<Record<string, string>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" })
      if (statusFilter) params.set("status", statusFilter)
      if (search) params.set("search", search)
      const res = await fetch(`/api/admin/verification?${params}`)
      const data = await res.json()
      setBusinesses(data.businesses || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, statusFilter, search])

  useEffect(() => { fetchData() }, [fetchData])

  async function act(businessId: string, status: string) {
    setActionLoading(businessId + status)
    try {
      await fetch("/api/admin/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, status, adminNotes: noteMap[businessId] || "", adminId: user?._id || user?.id }),
      })
      await fetchData()
    } catch (e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  return (
    <div className="space-y-6 pb-20">
      <AdminPageHeader title="Business Verification" subtitle="Trust & authenticity layer — review and approve business legitimacy." />

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Pending", value: stats?.pending ?? "—", color: "text-amber-500" },
          { label: "Under Review", value: stats?.underReview ?? "—", color: "text-blue-500" },
          { label: "Need More Info", value: stats?.needMore ?? "—", color: "text-purple-500" },
          { label: "Approved", value: stats?.approved ?? "—", color: "text-emerald-500" },
          { label: "Rejected", value: stats?.rejected ?? "—", color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-white/5 p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search business, industry…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusTabs.map((t) => (
            <button key={t.value} onClick={() => { setStatusFilter(t.value); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${statusFilter === t.value ? "bg-red-600 text-white" : "bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:border-slate-300"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-6 animate-pulse">
              <div className="h-5 w-48 bg-slate-100 dark:bg-white/5 rounded mb-3" />
              <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded" />
            </div>
          ))
        ) : businesses.length === 0 ? (
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5">
            <EmptyState icon={ShieldCheck} title="Queue is empty" description="No businesses match the current filter." />
          </div>
        ) : (
          businesses.map((biz) => (
            <div key={biz._id} className={`bg-white dark:bg-[#0A0A0A] rounded-2xl border transition-all overflow-hidden ${expandedId === biz._id ? "border-red-300 dark:border-red-900/50" : "border-slate-200 dark:border-white/5"}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{biz.name}</h3>
                      <StatusBadge status={biz.verificationStatus === "Need More Info" ? "underReview" : biz.verificationStatus.toLowerCase()} size="xs" />
                      {biz.industry && <span className="text-[10px] font-bold text-slate-400 dark:text-white/30">{biz.industry}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-bold text-slate-500 dark:text-white/40">
                      {biz.userId?.email && <span>👤 {biz.userId.name} ({biz.userId.email})</span>}
                      {biz.location?.city && <span>📍 {biz.location.city}</span>}
                      {biz.teamSize && <span>👥 {biz.teamSize}</span>}
                      {biz.gstNumber && <span>🏢 GST: {biz.gstNumber}</span>}
                    </div>
                    <div className="flex gap-3 mt-2">
                      {biz.website && (
                        <a href={biz.website.startsWith("http") ? biz.website : `https://${biz.website}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                          <Globe className="h-3 w-3" /> Website
                        </a>
                      )}
                      {biz.linkedIn && (
                        <a href={biz.linkedIn} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                          LinkedIn
                        </a>
                      )}
                    </div>
                    {biz.adminNotes && (
                      <p className="mt-2 text-[11px] text-slate-400 dark:text-white/25 italic">Note: {biz.adminNotes}</p>
                    )}
                  </div>

                  {/* Right actions */}
                  {!["Approved", "Rejected"].includes(biz.verificationStatus) && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setExpandedId(expandedId === biz._id ? null : biz._id)}
                        className="px-3 py-1.5 text-xs font-black rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        {expandedId === biz._id ? "Cancel" : "Act"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Panel */}
                {expandedId === biz._id && !["Approved", "Rejected"].includes(biz.verificationStatus) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                    <textarea
                      value={noteMap[biz._id] || ""}
                      onChange={(e) => setNoteMap((m) => ({ ...m, [biz._id]: e.target.value }))}
                      placeholder="Admin note (internal only)…"
                      rows={2}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {biz.verificationStatus === "Pending" && (
                        <button onClick={() => act(biz._id, "Under Review")} disabled={!!actionLoading}
                          className="px-3 py-1.5 text-xs font-black rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50">
                          <Clock className="h-3.5 w-3.5 inline mr-1" /> Under Review
                        </button>
                      )}
                      <button onClick={() => act(biz._id, "Need More Info")} disabled={!!actionLoading}
                        className="px-3 py-1.5 text-xs font-black rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50">
                        <AlertCircle className="h-3.5 w-3.5 inline mr-1" /> Need More Info
                      </button>
                      <button onClick={() => act(biz._id, "Approved")} disabled={!!actionLoading}
                        className="px-3 py-1.5 text-xs font-black rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50">
                        <Check className="h-3.5 w-3.5 inline mr-1" /> Approve ✅
                      </button>
                      <button onClick={() => act(biz._id, "Rejected")} disabled={!!actionLoading}
                        className="px-3 py-1.5 text-xs font-black rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50">
                        <X className="h-3.5 w-3.5 inline mr-1" /> Reject
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
          <p className="text-xs font-bold text-slate-400 dark:text-white/25">Page {page} of {pages} ({total} total)</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            </button>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
