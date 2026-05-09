"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, ShieldCheck, Target, Handshake,
  MessageSquare, Calendar, Star, Search, Flag,
  BarChart3, Bell, Settings, LogOut, ChevronLeft,
  ChevronRight, ShieldAlert, ScrollText, CreditCard
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { ModeToggle } from "@/components/mode-toggle"

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard",         href: "/admin",                    icon: LayoutDashboard },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Users",             href: "/admin/users",              icon: Users },
      { name: "Verification",      href: "/admin/verification",       icon: ShieldCheck },
      { name: "Profiles & Intent", href: "/admin/profiles",          icon: Target },
    ],
  },
  {
    label: "Activity",
    items: [
      { name: "Matches",           href: "/admin/matches",            icon: Handshake },
      { name: "Requests",          href: "/admin/requests",           icon: MessageSquare },
      { name: "Meetings",          href: "/admin/meetings",           icon: Calendar },
      { name: "Ratings",           href: "/admin/ratings",            icon: Star },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { name: "Explore Monitor",   href: "/admin/explore-monitoring", icon: Search },
      { name: "Reports & Flags",   href: "/admin/flags",              icon: Flag },
    ],
  },
  {
    label: "Monetization",
    items: [
      { name: "Subscriptions",     href: "/admin/subscriptions",      icon: CreditCard },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Analytics",         href: "/admin/analytics",          icon: BarChart3 },
    ],
  },
  {
    label: "Comms",
    items: [
      { name: "Notifications",     href: "/admin/notifications",      icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Settings",          href: "/admin/settings",           icon: Settings },
      { name: "Activity Logs",     href: "/admin/activity-logs",      icon: ScrollText },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logOut, user, isSuperAdmin } = useAuth()

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-[#030303] border-r border-slate-200 dark:border-white/5 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* ── Logo ── */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-white/5 shrink-0">
        <Link href="/" className={cn("flex items-center gap-2.5", collapsed && "justify-center w-full")}>
          <div className="h-8 w-8 rounded-lg bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-black tracking-tight text-slate-900 dark:text-white text-sm">
              TapAdmin
            </span>
          )}
        </Link>
        <div className="flex items-center gap-1">
          {!collapsed && <ModeToggle />}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 shrink-0 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 rounded-lg",
              collapsed && "absolute -right-3.5 top-[18px] bg-white dark:bg-[#030303] border border-slate-200 dark:border-white/10 rounded-full h-7 w-7 shadow-sm"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all",
                      active
                        ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.2)]"
                        : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom: User Mode + Log Out ── */}
      <div className="px-2 py-3 border-t border-slate-100 dark:border-white/5 space-y-0.5 shrink-0">
        <Link
          href="/dashboard"
          title={collapsed ? "User Mode" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>User Mode</span>}
        </Link>
        <button
          onClick={logOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>

      {/* ── Admin Profile ── */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-100 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-600/15 border border-red-600/20 flex items-center justify-center shrink-0">
              <span className="text-red-500 font-black text-xs">
                {user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "SA"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate leading-none">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-0.5">
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
