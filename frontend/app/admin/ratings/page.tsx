"use client"

import { useEffect, useState } from "react"
import { Star, ThumbsUp, ThumbsDown, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"

interface RatingItem {
  _id: string
  fromBizName: string
  toBizName: string
  rating: number
  tags: string[]
  communication: string
  reliability: string
  dealSeriousness: string
  comment: string
  dealType: string
  createdAt: string
}

interface Stats {
  avgRating: number
  totalRatings: number
  highRatings: number
  lowRatings: number
  topTags: { _id: string; count: number }[]
  distribution: { _id: number; count: number }[]
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-white/10"}`}
        />
      ))}
      <span className="ml-1 text-xs font-black text-slate-600 dark:text-white/60">{rating}</span>
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

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<RatingItem[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [minRating, setMinRating] = useState(1)
  const [maxRating, setMaxRating] = useState(5)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15", minRating: minRating.toString(), maxRating: maxRating.toString() })
      const res = await fetch(`/api/admin/ratings?${params}`)
      const data = await res.json()
      setRatings(data.ratings || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, minRating, maxRating])

  const ratingFilters = [
    { label: "All", min: 1, max: 5 },
    { label: "⭐⭐⭐⭐⭐ (5)", min: 5, max: 5 },
    { label: "⭐⭐⭐⭐ (4+)", min: 4, max: 5 },
    { label: "⚠️ Low (≤2)", min: 1, max: 2 },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ratings & Feedback</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Monitor platform feedback integrity — detect patterns and abuse.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Rating", value: stats ? `${stats.avgRating}★` : "—", icon: Star, color: "text-amber-500" },
          { label: "Total Reviews", value: stats?.totalRatings ?? "—", icon: BarChart3, color: "text-blue-500" },
          { label: "High Ratings (4-5★)", value: stats?.highRatings ?? "—", icon: ThumbsUp, color: "text-emerald-500" },
          { label: "Low Ratings (1-2★)", value: stats?.lowRatings ?? "—", icon: ThumbsDown, color: "text-red-500" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-white/30 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Tags */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Top Feedback Tags</p>
          {stats?.topTags?.length ? (
            <div className="flex flex-wrap gap-2">
              {stats.topTags.map((t) => (
                <span key={t._id} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-white/60">
                  {t._id} <span className="opacity-50 ml-1">×{t.count}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-white/30">No tags yet</p>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Rating Distribution</p>
          {stats?.distribution?.length ? (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = stats.distribution.find((d) => d._id === r)?.count || 0
                const pct = stats.totalRatings > 0 ? Math.round((count / stats.totalRatings) * 100) : 0
                return (
                  <div key={r} className="flex items-center gap-3">
                    <span className="text-xs font-black text-amber-500 w-6">{r}★</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-white/30 w-10 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-white/30">No distribution data yet</p>
          )}
        </div>
      </div>

      {/* Rating Filters */}
      <div className="flex flex-wrap gap-2">
        {ratingFilters.map((f) => (
          <button
            key={f.label}
            onClick={() => { setMinRating(f.min); setMaxRating(f.max); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${minRating === f.min && maxRating === f.max
              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              : "bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:border-red-400"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <p className="text-sm font-black text-slate-900 dark:text-white">{total} reviews</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                {["From", "To", "Rating", "Tags", "Deal Type", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : ratings.length === 0
                  ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-white/30 font-bold text-sm">No ratings found</td></tr>
                  : ratings.map((r) => (
                    <tr key={r._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{r.fromBizName || "—"}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{r.toBizName || "—"}</td>
                      <td className="px-4 py-3"><StarDisplay rating={r.rating} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.tags?.length ? r.tags.slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[10px] font-bold text-slate-500 dark:text-white/40">{t}</span>
                          )) : <span className="text-xs text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-white/40">{r.dealType || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 dark:text-white/30">
                        {new Date(r.createdAt).toLocaleDateString("en-IN")}
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
