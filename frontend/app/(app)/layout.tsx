"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  UserCircle, 
  LogOut, 
  Zap,
  Menu,
  X,
  Settings,
  Search,
  Compass
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Explore Matches", href: "/explore", icon: Search },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Matches", href: "/matches", icon: Users },
  { name: "Requests", href: "/requests", icon: MessageSquare },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Ratings & Feedback", href: "/ratings", icon: Star },
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0A0A0A] border-r border-slate-200 dark:border-white/5 z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(3,169,244,0.3)]">
                <Zap className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white italic">Taplyzer</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 dark:text-white/20"}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-6 border-t border-slate-200 dark:border-white/5">
             <div className="flex items-center gap-3 mb-6 px-2">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-black text-primary">
                  {user?.name?.[0] || "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-black text-sm text-slate-900 dark:text-white truncate">{user?.name || "User"}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{user?.email || "user@example.com"}</span>
                </div>
             </div>
             <Button 
                variant="ghost" 
                onClick={logOut}
                className="w-full flex items-center justify-start gap-3 px-4 py-3 h-auto rounded-xl font-bold text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
             </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 text-slate-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-grow max-w-xl mx-8">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search intents, partners, deals..." 
                  className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 ring-primary transition-all"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Status</span>
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Verified Account</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center relative">
               <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-white dark:border-black" />
               <Zap className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="p-8 flex-grow">
          {children}
        </div>
      </main>
    </div>
  )
}
