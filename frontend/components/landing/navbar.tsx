"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { usePathname, useRouter } from "next/navigation"

const NAV_LINKS = [
  { name: "Product", href: "/product" },
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Trust & Security", href: "/trust-security" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-[#050508]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.07] py-3"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 z-50">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" />
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">Taplyzer</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex lg:gap-x-7 xl:gap-x-9">
            {NAV_LINKS.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <Link
              href="/auth/login"
              className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors px-3"
            >
              Log In
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-6 transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)] uppercase tracking-widest text-[10px] h-10 gap-1.5"
              >
                Get Started
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation"
            className="lg:hidden relative z-50 flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-900 dark:text-white backdrop-blur-sm transition-all hover:border-primary/30 active:scale-95"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu — full screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-[min(320px,90vw)] bg-white dark:bg-[#0D0D14] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/[0.07]">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="font-black text-lg text-slate-900 dark:text-white">Taplyzer</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:border-primary/30 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

             {/* Auth buttons */}
             <div className="px-4 py-6 border-t border-slate-100 dark:border-white/[0.07] space-y-3">
               <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                 <Button variant="outline" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] border-slate-200 dark:border-white/10">
                   Log In
                 </Button>
               </Link>
               <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                 <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-all gap-2">
                   Get Started Free
                   <ArrowRight className="h-4 w-4" />
                 </Button>
               </Link>
             </div>
          </div>
        </div>
      )}
    </>
  )
}
