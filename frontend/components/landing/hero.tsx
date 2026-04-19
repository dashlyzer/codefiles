"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Play, TrendingUp, Users, Zap, BadgeCheck } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useState } from "react"
import { BusinessProfileModal } from "./business-profile-modal"
import { IntroRequestModal } from "./intro-request-modal"
import { useRouter } from "next/navigation"

export function Hero() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [introBusiness, setIntroBusiness] = useState<string | null>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const handleLaunchIntent = () => {
    if (isLoggedIn) {
      router.push("/dashboard/profile")
    } else {
      router.push("/auth?mode=signup")
    }
  }

  const handleRequestIntro = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    if (isLoggedIn) {
      setIntroBusiness(name)
    } else {
      router.push("/auth?mode=signup")
    }
  }

  const handleViewAll = () => {
    if (isLoggedIn) {
      router.push("/dashboard/matches")
    } else {
      router.push("/auth?mode=signup")
    }
  }

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-white dark:bg-black transition-colors">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30 dark:opacity-30 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] opacity-20 dark:opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-black mb-10 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
              </span>
              Now in Private Beta
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl xl:text-8xl text-balance leading-[1.05]">
              Beyond Connections, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 dark:from-blue-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                Drive Intent.
              </span>
            </h1>
            
            <p className="mt-8 text-lg leading-8 text-slate-500 dark:text-white/50 max-w-xl mx-auto lg:mx-0 font-medium">
              The world's first intent-based matchmaking platform for high-stakes business deals. Don't just network; close.
            </p>
            
            <div className="mt-12 flex flex-row flex-wrap gap-4 justify-center lg:justify-start">
              <Button 
                onClick={handleLaunchIntent}
                size="lg" 
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl gap-2 text-base sm:text-lg shadow-[0_0_25px_rgba(3,169,244,0.4)] transition-all hover:scale-105 uppercase tracking-widest"
              >
                Launch Your Intent
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => scrollToSection("how-it-works")}
                variant="outline" 
                size="lg" 
                className="h-14 px-8 border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold rounded-2xl gap-2 text-base sm:text-lg backdrop-blur-sm transition-all hover:scale-105"
              >
                <Play className="h-5 w-5 fill-slate-900 dark:fill-white" />
                How it Works
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 lg:gap-8">
              <div className="text-center lg:text-left">
                <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">2,500+</p>
                <p className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest mt-1">Active Businesses</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] tracking-tighter">$12M+</p>
                <p className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest mt-1">Deals Closed</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">89%</p>
                <p className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest mt-1">Match Success</p>
              </div>
            </div>
          </div>

          {/* Right content - Dashboard preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-[32px] blur-3xl opacity-20" />
            <div className="relative bg-white/50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-2xl p-8 space-y-6 backdrop-blur-xl transition-colors">
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5">
                <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Your Top Matches</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black border border-primary/20 uppercase tracking-widest">3 new</span>
              </div>
              
              {/* Match cards */}
              {[
                { name: "TechFlow Solutions", industry: "SaaS", score: 94, value: "$45K", type: "Client", location: "San Francisco, CA", verified: true },
                { name: "GrowthMetrics Inc", industry: "Analytics", score: 87, value: "$32K", type: "Partner", location: "New York, NY", verified: true },
                { name: "CloudScale Systems", industry: "Infrastructure", score: 82, value: "$28K", type: "Client", location: "Austin, TX", verified: false },
              ].map((match, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedBusiness(match)}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-2xl hover:bg-white dark:hover:bg-white/[0.06] hover:border-primary/20 transition-all hover:translate-x-1 cursor-pointer group/card"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/card:bg-primary/20 transition-colors">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900 dark:text-white">{match.name}</p>
                        {match.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest leading-none mt-1">{match.industry}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-primary">{match.score}%</span>
                      <button 
                        onClick={(e) => handleRequestIntro(e, match.name)}
                        className="text-[10px] bg-primary text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-all hover:scale-105"
                      >
                        Intro
                      </button>
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-extrabold">{match.value}</p>
                  </div>
                </div>
              ))}

              {/* Bottom stats */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400 dark:text-white/40" />
                    <span className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">12 matches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">+23%</span>
                  </div>
                </div>
                <Button 
                  onClick={handleViewAll}
                  size="sm" 
                  variant="secondary" 
                  className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-white rounded-xl h-9 px-4 transition-all"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BusinessProfileModal 
        isOpen={!!selectedBusiness} 
        onClose={() => setSelectedBusiness(null)} 
        business={selectedBusiness} 
      />
      <IntroRequestModal 
        isOpen={!!introBusiness} 
        onClose={() => setIntroBusiness(null)} 
        businessName={introBusiness || ""} 
      />
    </section>
  )
}
