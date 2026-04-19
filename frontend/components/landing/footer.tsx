"use client"

import Link from "next/link"
import { Twitter, Linkedin, Github, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Trust & Security", href: "/trust-security" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookie-policy" },
  ]
}

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 pt-20 pb-10 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(3,169,244,0.3)]">
                <Zap className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Taplyzer</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-8 font-medium leading-relaxed">
              Beyond connections, drive intent. The world's first intent-based matchmaking platform for high-impact deals. Join the future of business networking.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all bg-white dark:bg-white/5">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all bg-white dark:bg-white/5">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all bg-white dark:bg-white/5">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all text-sm font-bold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all text-sm font-bold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all text-sm font-bold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Taplyzer Inc.
            </p>
            <div className="hidden md:flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black text-slate-400 dark:text-white/40 tracking-widest uppercase">All systems operational</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs font-bold text-slate-500 hover:text-primary">Privacy</Link>
            <Link href="/terms" className="text-xs font-bold text-slate-500 hover:text-primary">Terms</Link>
            <Link href="/cookie-policy" className="text-xs font-bold text-slate-500 hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
