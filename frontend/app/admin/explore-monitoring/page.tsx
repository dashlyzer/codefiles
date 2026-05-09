"use client"

import { useEffect, useState } from "react"
import { Search, TrendingUp, AlertTriangle, Filter, BarChart3 } from "lucide-react"

interface TopQuery {
  query: string
  count: number
  avgResults: number
}

interface ZeroQuery {
  query: string
  count: number
}

interface IndustryItem {
  industry: string
  count: number
}

interface DailyItem {
  date: string
  count: number
}

export default function AdminExploreMonitoringPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/explore-monitoring?days=${days}`)
      const json = await res.json()
      setData(json)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [days])

  const topQueries: TopQuery[] = data?.topQueries || []
  const zeroQueries: ZeroQuery[] = data?.zeroResultQueries || []
  const industryBreakdown: IndustryItem[] = data?.industryBreakdown || []
  const dailyVolume: DailyItem[] = data?.dailyVolume || []
  const maxDaily = Math.max(...dailyVolume.map((d) => d.count), 1)

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore Monitoring</h1>
          <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Search intelligence — top queries, unmet demand, industry trends.</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Stat */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Searches", value: loading ? "—" : (data?.totalSearches ?? 0), icon: Search, color: "text-blue-500" },
          { label: "Unique Queries", value: loading ? "—" : topQueries.length, icon: TrendingUp, color: "text-purple-500" },
          { label: "Zero-Result Queries", value: loading ? "—" : zeroQueries.length, icon: AlertTriangle, color: "text-red-500" },
          { label: "Industries Searched", value: loading ? "—" : industryBreakdown.length, icon: Filter, color: "text-amber-500" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
            <c.icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-white/30 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Queries */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Top Search Queries</p>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">What users search for</h3>
          </div>
          <div className="p-4 space-y-2">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
              ))
            ) : topQueries.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-white/30 text-center py-8">No search data yet</p>
            ) : (
              topQueries.map((q, i) => {
                const maxCount = topQueries[0]?.count || 1
                const pct = Math.round((q.count / maxCount) * 100)
                return (
                  <div key={q.query} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 dark:text-white/20 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-800 dark:text-white/80 truncate">{q.query}</span>
                        <span className="text-xs font-black text-slate-500 dark:text-white/40 ml-2 shrink-0">{q.count}×</span>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    {q.avgResults === 0 && (
                      <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded shrink-0">0 results</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Zero-Result + Industry */}
        <div className="space-y-6">
          {/* Zero-Result Queries */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 dark:text-red-500/70">⚠ Unmet Demand</p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Zero-result searches</h3>
            </div>
            <div className="p-4 space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                ))
              ) : zeroQueries.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-white/30 text-center py-6">No zero-result searches 🎉</p>
              ) : (
                zeroQueries.map((q) => (
                  <div key={q.query} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                    <span className="text-sm font-bold text-red-700 dark:text-red-400 truncate">{q.query}</span>
                    <span className="text-xs font-black text-red-500 ml-2 shrink-0">{q.count} searches</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Industry Breakdown */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Industry Filter Usage</p>
            </div>
            <div className="p-4 space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                ))
              ) : industryBreakdown.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-white/30 text-center py-6">No industry filter data yet</p>
              ) : (
                industryBreakdown.map((item) => {
                  const maxCount = industryBreakdown[0]?.count || 1
                  const pct = Math.round((item.count / maxCount) * 100)
                  return (
                    <div key={item.industry} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 dark:text-white/60 w-28 truncate">{item.industry}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-black text-slate-400 dark:text-white/30 w-6 text-right">{item.count}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Volume Chart */}
      {dailyVolume.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Daily Search Volume (Last 7 Days)</p>
          <div className="flex items-end gap-2 h-24">
            {dailyVolume.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all"
                  style={{ height: `${Math.round((d.count / maxDaily) * 80)}px`, minHeight: "4px" }}
                />
                <span className="text-[9px] font-bold text-slate-400 dark:text-white/20">
                  {new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
