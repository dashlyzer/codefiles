"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, Zap, CheckCircle2, ArrowRight, User, Target } from "lucide-react"

export interface Match {
  id: string
  name: string
  industry: string
  location: string
  score: number
  dealType: string
  dealValue: string
  description: string
  verified: boolean
}

interface MatchCardProps {
  match: Match
  onRequestIntro: (id: string) => void
}

export function MatchCard({ match, onRequestIntro }: MatchCardProps) {
  return (
    <Card className="group relative bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <CardContent className="p-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Identity */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-110 group-hover:bg-primary transition-all duration-500 relative">
              <span className="text-3xl font-black text-primary group-hover:text-white transition-colors">{match.name[0]}</span>
              {match.verified && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="mt-6 space-y-2">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">{match.name}</h3>
               <div className="flex flex-col gap-1">
                 <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <Briefcase className="h-3 w-3" /> {match.industry}
                 </div>
                 <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <MapPin className="h-3 w-3" /> {match.location}
                 </div>
               </div>
            </div>
          </div>

          {/* Middle - Intent & Details */}
          <div className="flex-grow flex flex-col justify-center">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:border-primary/10 transition-all">
               <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Strategic Intent</span>
               </div>
               <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed italic">
                 "{match.description}"
               </p>
               
               <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-white/5">
                  <div>
                     <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Deal Type</span>
                     <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/5">{match.dealType}</Badge>
                  </div>
                  <div>
                     <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Value</span>
                     <span className="text-sm font-black text-slate-900 dark:text-white">{match.dealValue}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side - Actions & Score */}
          <div className="flex flex-col justify-between items-center md:items-end gap-6 min-w-[160px]">
            <div className="text-center md:text-right">
               <div className="flex items-center gap-2 mb-1 justify-center md:justify-end">
                  <Zap className="h-5 w-5 text-primary fill-primary" />
                  <span className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">{match.score}%</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Accuracy</span>
            </div>

            <div className="flex flex-col w-full gap-3">
               <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 group-hover:scale-105 transition-all" onClick={() => onRequestIntro(match.id)}>
                 Request Intro
               </Button>
               <Button variant="outline" className="w-full h-12 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                 <User className="h-4 w-4" />
                 View Profile
               </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
