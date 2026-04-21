"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, Zap, CheckCircle2, User, Target } from "lucide-react"

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
    <Card className="group relative bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
      <CardContent className="p-5 md:p-8">
        
        {/* Score Badge — top right on mobile */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-primary transition-all duration-500 relative flex-shrink-0">
              <span className="text-2xl font-black text-primary group-hover:text-white transition-colors">{match.name[0]}</span>
              {match.verified && (
                <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-lg">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base md:text-xl font-black text-slate-900 dark:text-white italic tracking-tight leading-tight">{match.name}</h3>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                <Briefcase className="h-2.5 w-2.5" /> {match.industry}
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <MapPin className="h-2.5 w-2.5" /> {match.location}
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <Zap className="h-4 w-4 text-primary fill-primary" />
              <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic">{match.score}%</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Match</span>
          </div>
        </div>

        {/* Intent Box */}
        <div className="p-4 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Strategic Intent</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-xs leading-relaxed italic">
            "{match.description}"
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200/50 dark:border-white/5">
            <div>
              <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Deal Type</span>
              <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[9px] tracking-widest bg-primary/5">{match.dealType}</Badge>
            </div>
            <div>
              <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Value</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{match.dealValue}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white font-black rounded-xl uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20 transition-all" 
            onClick={() => onRequestIntro(match.id)}
          >
            Request Intro
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-10 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 font-black rounded-xl uppercase tracking-widest text-[9px] hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1"
          >
            <User className="h-3 w-3" />
            Profile
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
