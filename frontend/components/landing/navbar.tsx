"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isLoggedIn } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Product", href: "/product" },
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Trust & Security", href: "/trust-security" },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 py-3"
        : "bg-transparent py-5"
      }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-x-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(3,169,244,0.3)] group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Taplyzer</span>
          </Link>
          <div className="hidden lg:flex lg:gap-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href 
                    ? "text-primary" 
                    : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-6">
          <Link
            href="/auth?mode=signin"
            className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors px-4"
          >
            Log In
          </Link>
          <Link href="/auth?mode=signup">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-6 transition-all hover:scale-105 shadow-[0_0_20px_rgba(3,169,244,0.3)] uppercase tracking-widest text-[10px] h-11">
              Get Started
            </Button>
          </Link>
        </div>
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-slate-900 dark:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-white/10 animate-in slide-in-from-top duration-300">
          <div className="space-y-1 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-base font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-8 flex flex-col gap-4">
              <Link href="/auth?mode=signin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-white/10">
                  Log In
                </Button>
              </Link>
              <Link href="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
