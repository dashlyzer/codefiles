"use client"

import { Button } from "@/components/ui/button"
import { Building2, MapPin, ArrowRight, BadgeCheck } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { IntroRequestModal } from "./intro-request-modal"
import { BusinessProfileModal } from "./business-profile-modal"

const matches = [
  {
    name: "Nexus Technologies",
    industry: "Enterprise Software",
    location: "San Francisco, CA",
    score: 96,
    dealType: "Client",
    value: "$85,000",
    verified: true,
  },
  {
    name: "DataStream Analytics",
    industry: "Business Intelligence",
    location: "New York, NY",
    score: 91,
    dealType: "Partnership",
    value: "$120,000",
    verified: true,
  },
  {
    name: "CloudVault Security",
    industry: "Cybersecurity",
    location: "Austin, TX",
    score: 88,
    dealType: "Client",
    value: "$45,000",
    verified: true,
  },
  {
    name: "ScaleOps Solutions",
    industry: "DevOps",
    location: "Seattle, WA",
    score: 85,
    dealType: "Partnership",
    value: "$67,000",
    verified: false,
  },
]

export function MatchPreview() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [introBusiness, setIntroBusiness] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)

  const handleRequestIntro = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    if (isLoggedIn) {
      setIntroBusiness(name)
    } else {
      router.push("/auth?mode=signup")
    }
  }

  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-black relative transition-colors">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl text-balance">
            See Your Potential Matches
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-white/40 font-medium">
            Here&apos;s what your match feed could look like. Real businesses, real opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <div
              key={index}
              onClick={() => setSelectedBusiness(match)}
              className="bg-slate-50 dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/5 p-7 hover:border-blue-500/30 transition-all hover:scale-[1.02] cursor-pointer group backdrop-blur-md shadow-sm dark:shadow-none"
            >
              {/* Company icon */}
              <div className="flex items-start justify-between mb-5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 px-2.5 py-1 rounded-full">
                  <span className="text-xs font-black text-primary">{match.score}%</span>
                </div>
              </div>

              {/* Company details */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-lg truncate">{match.name}</h3>
                {match.verified && (
                  <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-white/40 mb-2 font-bold uppercase tracking-widest leading-none">{match.industry}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-white/30 mb-5 font-black uppercase tracking-widest leading-none">
                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                {match.location}
              </div>

              {/* Deal info */}
              <div className="flex items-center justify-between mb-5 p-4 bg-white/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl shadow-inner dark:shadow-none">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest block mb-1">Type</span>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{match.dealType}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest block mb-1">Value</span>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{match.value}</p>
                </div>
              </div>

              {/* CTA */}
              <Button 
                onClick={(e) => handleRequestIntro(e, match.name)}
                className="w-full h-12 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-primary hover:text-white hover:border-primary text-slate-900 dark:text-white rounded-xl gap-2 font-black transition-all group/btn" 
                variant="outline"
              >
                Request Intro
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <IntroRequestModal 
        isOpen={!!introBusiness} 
        onClose={() => setIntroBusiness(null)} 
        businessName={introBusiness || ""} 
      />
      <BusinessProfileModal 
        isOpen={!!selectedBusiness} 
        onClose={() => setSelectedBusiness(null)} 
        business={selectedBusiness} 
      />
    </section>
  )
}
