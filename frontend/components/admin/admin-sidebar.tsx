"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  MessageSquare
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Verification Queue", href: "/admin/verification", icon: ShieldCheck },
  { name: "Platform Requests", href: "/admin/requests", icon: MessageSquare },
  { name: "Analytics & Growth", href: "/admin/analytics", icon: BarChart3 },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Manage Businesses", href: "/admin/businesses", icon: Building2 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logOut, user, isSuperAdmin } = useAuth()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 dark:bg-[#030303] border-r border-slate-800 dark:border-white/5 transition-all duration-300 backdrop-blur-xl text-white",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
            <div className="h-8 w-8 rounded-lg bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center shrink-0">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            {!collapsed && <span className="font-bold tracking-tight text-white">TapAdmin</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 shrink-0 hover:bg-white/10 hover:text-white text-white/70", collapsed && "absolute -right-4 top-4 bg-slate-800 border border-slate-700 rounded-full")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="mb-4 px-3">
            {!collapsed && <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Platform Info</p>}
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-white/60 hover:bg-white/5 hover:text-white",
              collapsed && "justify-center"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span>User Mode</span>}
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              logOut()
            }}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-white/60 hover:bg-white/5 hover:text-white",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>

        {/* User profile */}
        {!collapsed && (
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-9 w-9 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center">
                <span className="text-red-500 font-bold text-sm">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'SA'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate tracking-tight">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-red-400 truncate font-bold uppercase tracking-widest">{isSuperAdmin ? "Super Admin" : "Admin"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
