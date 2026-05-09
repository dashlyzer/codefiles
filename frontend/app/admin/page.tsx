"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/admin/stat-card"
import { AdminActivityFeed } from "@/components/admin/activity-feed"
import {
  Users, Building2, ShieldCheck, UserX, Handshake,
  Send, Calendar, CheckCircle2, ShieldAlert, Star,
  UserPlus, TrendingUp
} from "lucide-react"

interface AdminStats {
  users: {
    total: number
    active: number
    suspended: number
    newToday: number
    verified: number
    flagged: number
  }
  businesses: {
    total: number
    pendingVerification: number
    verified: number
    profileComplete: number
  }
  activity: {
    matchesToday: number
    requestsSent: number
    requestsAccepted: number
    requestsPending: number
    meetingsScheduled: number
    meetingsCompleted: number
    meetingsCancelled: number
  }
  trust: {
    pendingVerification: number
    flagged: number
    lowRated: number
    totalRatings: number
  }
  funnel: {
    signupToProfile: number
    acceptanceRate: number
    requestToMeeting: number
    meetingCompletionRate: number
  }
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5" />
      </div>
      <div className="h-8 w-16 bg-slate-100 dark:bg-white/5 rounded mb-2" />
      <div className="h-3 w-24 bg-slate-100 dark:bg-white/5 rounded" />
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch admin stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-10 pb-16">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Control Room
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">
            Intent Network Operating System — real-time platform intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 px-4 py-2 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>

      {/* ── ROW 1: User Metrics ── */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">
          User Metrics
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Users"
                value={stats?.users.total ?? 0}
                sub={`${stats?.users.active ?? 0} active`}
                icon={Users}
                color="blue"
                href="/admin/users"
              />
              <StatCard
                label="New Today"
                value={stats?.users.newToday ?? 0}
                sub="Signed up in last 24h"
                icon={UserPlus}
                color="emerald"
                trend="up"
                href="/admin/users"
              />
              <StatCard
                label="Verified Businesses"
                value={stats?.businesses.verified ?? 0}
                sub={`of ${stats?.businesses.total ?? 0} total`}
                icon={ShieldCheck}
                color="emerald"
                href="/admin/verification"
              />
              <StatCard
                label="Suspended Users"
                value={stats?.users.suspended ?? 0}
                sub={`${stats?.users.flagged ?? 0} flagged`}
                icon={UserX}
                color="red"
                href="/admin/users"
              />
            </>
          )}
        </div>
      </section>

      {/* ── ROW 2: Business Activity ── */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">
          Business Activity
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Matches Today"
                value={stats?.activity.matchesToday ?? 0}
                sub="Synergy pairs generated"
                icon={Handshake}
                color="purple"
                href="/admin/matches"
              />
              <StatCard
                label="Requests Sent"
                value={stats?.activity.requestsSent ?? 0}
                sub={`${stats?.activity.requestsAccepted ?? 0} accepted`}
                icon={Send}
                color="blue"
                href="/admin/requests"
              />
              <StatCard
                label="Meetings Scheduled"
                value={stats?.activity.meetingsScheduled ?? 0}
                sub={`${stats?.activity.meetingsCompleted ?? 0} completed`}
                icon={Calendar}
                color="primary"
                href="/admin/meetings"
              />
              <StatCard
                label="Meeting Completion"
                value={`${stats?.funnel.meetingCompletionRate ?? 0}%`}
                sub="Completion rate"
                icon={CheckCircle2}
                color="emerald"
                href="/admin/meetings"
              />
            </>
          )}
        </div>
      </section>

      {/* ── ROW 3: Trust & Safety ── */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">
          Trust & Safety
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Pending Verification"
                value={stats?.trust.pendingVerification ?? 0}
                sub="Awaiting manual review"
                icon={ShieldAlert}
                color="amber"
                href="/admin/verification"
              />
              <StatCard
                label="Flagged Users"
                value={stats?.trust.flagged ?? 0}
                sub="Needs admin review"
                icon={UserX}
                color="red"
                href="/admin/flags"
              />
              <StatCard
                label="Low-Rated Businesses"
                value={stats?.trust.lowRated ?? 0}
                sub="Rated 2★ or below"
                icon={Star}
                color="amber"
                href="/admin/ratings"
              />
              <StatCard
                label="Total Ratings"
                value={stats?.trust.totalRatings ?? 0}
                sub="Platform feedback"
                icon={Star}
                color="blue"
                href="/admin/ratings"
              />
            </>
          )}
        </div>
      </section>

      {/* ── BOTTOM: Funnel + Activity Feed ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Funnel Conversion Table — 2/5 width */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
              Pipeline Conversion
            </p>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              Intent → Deal Funnel
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-3 w-32 bg-slate-100 dark:bg-white/5 rounded" />
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full" />
                </div>
              ))
            ) : (
              [
                {
                  label: "Signup → Profile Complete",
                  value: stats?.funnel.signupToProfile ?? 0,
                  color: "bg-blue-500",
                },
                {
                  label: "Request Acceptance Rate",
                  value: stats?.funnel.acceptanceRate ?? 0,
                  color: "bg-purple-500",
                },
                {
                  label: "Request → Meeting",
                  value: stats?.funnel.requestToMeeting ?? 0,
                  color: "bg-amber-500",
                },
                {
                  label: "Meeting Completion Rate",
                  value: stats?.funnel.meetingCompletionRate ?? 0,
                  color: "bg-emerald-500",
                },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {row.label}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {row.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${row.color}`}
                      style={{ width: `${Math.min(row.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}

            {/* North Star reminder */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
                  North Star: Intent → Match → Meeting → Deal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed — 3/5 width */}
        <div className="lg:col-span-3">
          <AdminActivityFeed />
        </div>
      </div>

    </div>
  )
}
