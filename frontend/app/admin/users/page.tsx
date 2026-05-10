"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, Search, UserX, ShieldCheck, MoreVertical, ChevronLeft, ChevronRight, UserPlus, UserCheck } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { SectionCard, SkeletonRow } from "@/components/admin/SectionCard"
import { EmptyState } from "@/components/admin/EmptyState"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { useAuth } from "@/components/auth-provider"

interface User {
  _id: string; name: string; email: string; role: string; status: string
  verified: boolean; createdAt: string; designation?: string; company?: string; isFlagged?: boolean
}

export default function AdminUsersPage() {
  const { user: currentUser, isSuperAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" })
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (roleFilter) params.set("role", roleFilter)
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users || [])
      setStats(data.stats)
      setPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, search, statusFilter, roleFilter])

  useEffect(() => { fetchData() }, [fetchData])

  async function doAction(userId: string, action: string) {
    setActionLoading(userId + action)
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, adminId: currentUser?._id || currentUser?.id }),
      })
      setActiveMenu(null)
      await fetchData()
    } catch (e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    ADMIN: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    USER: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40",
  }

  return (
    <div className="space-y-6 pb-20">
      <AdminPageHeader
        title="Users"
        subtitle="Complete user lifecycle management — search, filter, act."
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats?.total ?? "—", color: "text-blue-500" },
          { label: "Active", value: stats?.active ?? "—", color: "text-emerald-500" },
          { label: "Suspended", value: stats?.suspended ?? "—", color: "text-red-500" },
          { label: "New Today", value: stats?.newToday ?? "—", color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email, company…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30">
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      {/* Table */}
      <SectionCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                {["User", "Role", "Status", "Verified", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : users.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Users} title="No users found" description="Try adjusting your filters." /></td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                          <span className="text-red-500 font-black text-xs">
                            {u.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-white/30">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${roleColors[u.role] || roleColors.USER}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.status?.toLowerCase() || "active"} size="xs" />
                    </td>
                    <td className="px-4 py-3">
                      {u.verified
                        ? <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-3 w-3" /> Yes</span>
                        : <span className="text-[11px] font-bold text-slate-400 dark:text-white/25">No</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-white/25">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                    <td className="px-4 py-3">
                      {u.email !== currentUser?.email && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === u._id ? null : u._id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-400" />
                          </button>
                          {activeMenu === u._id && (
                            <div className="absolute right-0 top-8 z-20 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-1 w-44">
                              {!u.verified && (
                                <button onClick={() => doAction(u._id, "verify")} disabled={!!actionLoading}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                                  <UserCheck className="h-3.5 w-3.5" /> Verify Business
                                </button>
                              )}
                              {u.status === "ACTIVE" ? (
                                <button onClick={() => doAction(u._id, "suspend")} disabled={!!actionLoading}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                                  <UserX className="h-3.5 w-3.5" /> Suspend
                                </button>
                              ) : (
                                <button onClick={() => doAction(u._id, "unsuspend")} disabled={!!actionLoading}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                                  <UserCheck className="h-3.5 w-3.5" /> Reactivate
                                </button>
                              )}
                              {isSuperAdmin && (
                                <button onClick={() => doAction(u._id, "ban")} disabled={!!actionLoading}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                  <UserX className="h-3.5 w-3.5" /> Ban Account
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
            <p className="text-xs font-bold text-slate-400 dark:text-white/25">Page {page} of {pages} ({total} users)</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-white/5">
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-white/5">
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
