"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MatchCard, type Match } from "@/components/dashboard/match-card"
import { Search, Filter, SlidersHorizontal, ChevronDown, MapPin, Target, Zap, ArrowUpDown } from "lucide-react"

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

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic mb-2">Matches</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium text-sm uppercase tracking-widest font-black">Find your next strategic partner</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort: Highest Match
          </Button>
          <Button className="bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20">
            Export Results
          </Button>
        </div>
      </div>

      {/* Search and Filters Panel */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 space-y-8 sticky top-28">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tight">Filters</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Reset</button>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry</label>
                    <select className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl h-10 px-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                       <option>All Industries</option>
                       <option>SaaS</option>
                       <option>Fintech</option>
                       <option>Healthcare</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deal Type</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Client', 'Partnership', 'Vendor', 'Investment'].map(type => (
                         <button key={type} className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-transparent hover:border-primary/20 transition-all">
                           {type}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Match Score %</label>
                    <input type="range" className="w-full accent-primary" min="50" max="100" defaultValue="80" />
                    <div className="flex justify-between text-[10px] font-black text-slate-400">
                       <span>50%</span>
                       <span>100%</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                    <Input placeholder="Global" className="bg-slate-50 dark:bg-white/5 border-none rounded-xl h-10 text-xs font-bold" />
                 </div>
              </div>

              <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-widest text-[10px] h-12">
                Apply Filters
              </Button>
           </div>
        </div>

        {/* Search and Results */}
        <div className="lg:col-span-3 space-y-8">
           <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by company name, industry, or specific business need..." 
                className="pl-16 h-16 bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2rem] font-bold text-lg shadow-xl shadow-slate-100 dark:shadow-none focus-visible:ring-primary/20 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Showing {allMatches.length} Strategic Matches</span>
              <div className="flex gap-2">
                 <button className="h-8 w-8 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 flex items-center justify-center text-primary shadow-sm"><Filter className="h-4 w-4" /></button>
                 <button className="h-8 w-8 rounded-lg bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 shadow-sm"><SlidersHorizontal className="h-4 w-4" /></button>
              </div>
           </div>

           <div className="grid gap-6">
             {allMatches.map((match) => (
               <MatchCard key={match.id} match={match} onRequestIntro={() => {}} />
             ))}
           </div>
           
           <Button variant="ghost" className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/5 text-slate-400 font-black uppercase tracking-widest text-xs hover:border-primary/50 hover:text-primary transition-all">
             Load More Opportunities
           </Button>
        </div>
      </div>
    </div>
  )
}
