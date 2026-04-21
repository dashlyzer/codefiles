"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MatchCard, type Match } from "@/components/dashboard/match-card"
import { Search, Filter, SlidersHorizontal, ChevronDown, MapPin, Target, Zap, ArrowUpDown, Bell } from "lucide-react"

const allMatches: Match[] = [
  {
    id: "1",
    name: "Nexus Technologies",
    industry: "Enterprise Software",
    location: "San Francisco, CA",
    score: 96,
    dealType: "Client",
    dealValue: "$85,000",
    description: "Looking for cloud infrastructure solutions to scale their B2B platform. Strong alignment with your service offerings.",
    verified: true,
  },
  {
    id: "2",
    name: "DataStream Analytics",
    industry: "Business Intelligence",
    location: "New York, NY",
    score: 91,
    dealType: "Partnership",
    dealValue: "$120,000",
    description: "Seeking strategic partners for market expansion. Complementary product offerings with potential for co-selling.",
    verified: true,
  },
  {
    id: "3",
    name: "CloudVault Security",
    industry: "Cybersecurity",
    location: "Austin, TX",
    score: 88,
    dealType: "Vendor",
    dealValue: "$45,000",
    description: "Needs implementation partner for their enterprise security rollout. Budget approved and timeline set.",
    verified: false,
  },
  {
    id: "4",
    name: "Zenith Logistics",
    industry: "Supply Chain",
    location: "Chicago, IL",
    score: 85,
    dealType: "Strategic",
    dealValue: "$200,000",
    description: "Modernizing last-mile delivery system. Interested in automation and real-time tracking APIs.",
    verified: true,
  },
  {
    id: "5",
    name: "EcoScale Energy",
    industry: "Renewable Energy",
    location: "Berlin, DE",
    score: 82,
    dealType: "Investment",
    dealValue: "$500,000",
    description: "Looking for Series A investment to scale their smart-grid optimization software across Europe.",
    verified: true,
  }
]

export default function MatchesPage() {
  const [search, setSearch] = useState("")
  const [dealTypeFilter, setDealTypeFilter] = useState("ALL")
  const [industryFilter, setIndustryFilter] = useState("ALL")

  const filteredMatches = allMatches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(search.toLowerCase()) || 
                          match.industry.toLowerCase().includes(search.toLowerCase())
    const matchesDealType = dealTypeFilter === "ALL" || match.dealType.toUpperCase() === dealTypeFilter
    const matchesIndustry = industryFilter === "ALL" || match.industry.toUpperCase() === industryFilter
    
    return matchesSearch && matchesDealType && matchesIndustry
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-1">Matches</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-widest font-black">All businesses that match your intent profile</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative flex-grow sm:flex-grow-0 sm:w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search matches..." 
                className="pl-11 h-11 bg-slate-100 dark:bg-white/5 border-none rounded-2xl font-bold text-sm w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-all flex-shrink-0">
              <Bell className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:border-primary/50 transition-all">
             Deal Type <ChevronDown className="h-3 w-3" />
          </Button>
          <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:border-primary/50 transition-all">
             Industry <ChevronDown className="h-3 w-3" />
          </Button>
          <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:border-primary/50 transition-all">
             Score: 70%+ <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
           {filteredMatches.length} Companies Found
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid sm:grid-cols-2 gap-5">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} onRequestIntro={() => {}} />
        ))}
      </div>
      
      {filteredMatches.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No matches found for your criteria</p>
        </div>
      )}
    </div>
  )
}

