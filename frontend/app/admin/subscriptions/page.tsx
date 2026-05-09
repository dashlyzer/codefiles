"use client"

import { StatCard } from "@/components/admin/stat-card"
import { Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Subscriptions</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Manage user plans, billing, and revenue metrics.</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value="$0" // Mocked for now
          sub="Monthly Recurring"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          label="Pro Users"
          value="0" // Mocked
          sub="Active subscriptions"
          icon={Users}
          color="purple"
        />
        <StatCard
          label="Free Users"
          value="0" // Mocked
          sub="Basic tier"
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Past Due"
          value="0" // Mocked
          sub="Failed payments"
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 p-12 text-center">
        <CreditCard className="h-12 w-12 text-slate-200 dark:text-white/5 mx-auto mb-4" />
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Subscription Management</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-white/40 mt-2 max-w-md mx-auto">
          This panel is currently in shell mode. It will display a searchable table of all user subscriptions, their status, and allow manual plan upgrades before Razorpay integration is finalized.
        </p>
      </div>
    </div>
  )
}
