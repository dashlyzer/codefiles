"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Building2, CheckCircle2, Star, Zap, MapPin, Globe, 
  Linkedin, Target, Clock, MessageSquare, ArrowRight,
  ShieldCheck, ArrowLeft, Heart, Share2, Lock, Users
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Realistic Mock Data for the Profile
const MOCK_PROFILE = {
  name: "Nexus Technologies",
  tagline: "Helping enterprises modernize infrastructure and scale cloud systems.",
  description: "Nexus Technologies is a premier cloud infrastructure firm specializing in enterprise-grade modernization. With over a decade of experience, we help B2B platforms scale securely with a focus on high availability, disaster recovery, and seamless SaaS integrations.",
  industry: "Enterprise Software",
  businessType: "Agency",
  location: "San Francisco, CA",
  memberSince: "Jan 2024",
  rating: 4.8,
  matchScore: 94,
  verified: true,
  yearsInBusiness: 8,
  teamSize: "50-200",
  website: "nexustech.example.com",
  linkedin: "linkedin.com/company/nexus-tech",
  
  offerings: ["Cloud Infrastructure", "DevOps", "Migration", "Security", "Enterprise Consulting"],
  needs: ["Implementation Partners", "B2B Clients", "Sales Agencies", "Regional Partners"],
  
  intent: {
    goal: "Looking for cloud infrastructure solutions to scale B2B platform.",
    urgency: "High",
    targetValue: "$85,000",
    timeline: "30 Days"
  },
  
  performance: {
    responseRate: 92,
    avgResponseTime: "6 hrs",
    dealsClosed: 12,
    repeatPartnerships: 4
  },
  
  reviews: [
    { text: "Great communication and fast execution. They migrated our entire database with zero downtime.", author: "TechCorp Inc." },
    { text: "Closed partnership in 2 weeks. Highly recommended.", author: "SaaS Builders LLC" },
    { text: "Highly professional team with deep AWS expertise.", author: "FinServe Global" }
  ],
  
  preferences: {
    industries: ["Fintech", "Healthcare Tech", "Logistics"],
    locations: ["North America", "Europe"],
    meetings: "Online / Video"
  },
  
  similar: [
    { name: "CloudScale Systems", industry: "Cloud Hosting" },
    { name: "DataCore Infra", industry: "Enterprise IT" },
    { name: "SecureStack Labs", industry: "Cybersecurity" }
  ]
}

export default function BusinessProfilePage() {
  const params = useParams()
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSendRequest = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsIntroModalOpen(false)
      toast.success("Intro request sent to Nexus Technologies!")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-32">
      {/* 🧭 TOP NAVIGATION */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 flex justify-between items-center">
         <Link href="/explore" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Matches
         </Link>
         <div className="flex gap-3">
            <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
               <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
               <Heart className="h-4 w-4" /> Save
            </Button>
            <Button onClick={() => setIsIntroModalOpen(true)} className="rounded-xl h-10 px-6 font-black text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
               Request Intro
            </Button>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-12">
        
        {/* 👑 HEADER SECTION */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="relative shrink-0">
             <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-7xl font-black text-white italic shadow-[0_0_40px_rgba(37,99,235,0.3)]">
               {MOCK_PROFILE.name[0]}
             </div>
             {MOCK_PROFILE.verified && (
               <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-emerald-500 border-4 border-slate-50 dark:border-black flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6 text-white" />
               </div>
             )}
           </div>
           <div className="space-y-4 flex-grow">
              <div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none">
                  {MOCK_PROFILE.name}
                </h1>
                <p className="text-xl font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  "{MOCK_PROFILE.tagline}"
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                 <Badge className="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" /> {MOCK_PROFILE.industry}
                 </Badge>
                 <Badge className="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> {MOCK_PROFILE.location}
                 </Badge>
                 <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-amber-500" /> {MOCK_PROFILE.rating}/5 Rating
                 </Badge>
                 <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="h-3 w-3 fill-blue-600" /> Member since {MOCK_PROFILE.memberSince}
                 </Badge>
              </div>
           </div>
           {/* Desktop Sticky Quick CTA */}
           <div className="hidden lg:flex shrink-0 p-6 rounded-[2rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 flex-col items-center gap-4 min-w-[200px]">
              <div className="text-center">
                 <div className="text-4xl font-black italic text-blue-600 tracking-tighter">{MOCK_PROFILE.matchScore}%</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Score</div>
              </div>
              <Button onClick={() => setIsIntroModalOpen(true)} className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                 Request Intro
              </Button>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* 🤖 SECTION 1: WHY YOU MATCHED */}
             <Card className="rounded-[2.5rem] bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 p-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Why You Matched
                </h3>
                <div className="space-y-6">
                   <ul className="space-y-3 font-medium text-slate-700 dark:text-slate-300">
                     <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        They need cloud infrastructure support (your offering).
                     </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        You offer relevant B2B services they are looking for.
                     </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        High response rate and verified profile ensuring trust.
                     </li>
                   </ul>
                   <div className="pt-6 border-t border-blue-200/50 dark:border-blue-900/30 grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                           <span>Offer ↔ Need Fit</span>
                           <span className="text-blue-600">94%</span>
                        </div>
                        <Progress value={94} className="h-2 bg-blue-200 dark:bg-blue-900/30" indicatorColor="bg-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                           <span>Industry Fit</span>
                           <span className="text-blue-600">88%</span>
                        </div>
                        <Progress value={88} className="h-2 bg-blue-200 dark:bg-blue-900/30" indicatorColor="bg-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                           <span>Intent Fit</span>
                           <span className="text-blue-600">92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-blue-200 dark:bg-blue-900/30" indicatorColor="bg-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                           <span>Trust Fit</span>
                           <span className="text-blue-600">90%</span>
                        </div>
                        <Progress value={90} className="h-2 bg-blue-200 dark:bg-blue-900/30" indicatorColor="bg-blue-600" />
                      </div>
                   </div>
                </div>
             </Card>

             {/* 🎯 SECTION 5: ACTIVE INTENT */}
             <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-500" /> Current Active Intent
                  </h3>
                  <p className="text-2xl font-black italic text-slate-900 dark:text-white leading-snug">
                     "{MOCK_PROFILE.intent.goal}"
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Urgency</p>
                        <Badge className="bg-red-100 text-red-600 dark:bg-red-900/20 border-none px-3 py-1 font-black text-[10px] uppercase">{MOCK_PROFILE.intent.urgency}</Badge>
                     </div>
                     <div className="space-y-1 pl-4 border-l border-slate-100 dark:border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target Value</p>
                        <p className="font-black text-lg text-slate-900 dark:text-white">{MOCK_PROFILE.intent.targetValue}</p>
                     </div>
                     <div className="space-y-1 pl-4 border-l border-slate-100 dark:border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Timeline</p>
                        <p className="font-black text-lg text-slate-900 dark:text-white">{MOCK_PROFILE.intent.timeline}</p>
                     </div>
                  </div>
                </div>
                <Target className="absolute -bottom-12 -right-12 h-64 w-64 text-slate-50 dark:text-white/[0.02] group-hover:scale-110 transition-transform duration-700" />
             </Card>

             {/* 📖 SECTION 2: COMPANY OVERVIEW */}
             <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Company Overview</h3>
                <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 space-y-6">
                   <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                     {MOCK_PROFILE.description}
                   </p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Years Active</p>
                         <p className="font-bold text-slate-900 dark:text-white mt-1">{MOCK_PROFILE.yearsInBusiness} Years</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Size</p>
                         <p className="font-bold text-slate-900 dark:text-white mt-1">{MOCK_PROFILE.teamSize}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Website</p>
                         <div className="flex items-center gap-1 mt-1 text-blue-600 font-bold">
                           <Globe className="h-4 w-4" /> Link
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn</p>
                         <div className="flex items-center gap-1 mt-1 text-blue-600 font-bold">
                           <Linkedin className="h-4 w-4" /> Link
                         </div>
                      </div>
                   </div>
                </Card>
             </div>

             {/* 💼 SECTION 3 & 4: OFFERINGS & NEEDS */}
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">What They Offer</h3>
                   <div className="flex flex-wrap gap-2">
                     {MOCK_PROFILE.offerings.map((item, i) => (
                       <Badge key={i} className="bg-white dark:bg-[#111] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-4 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm">
                         {item}
                       </Badge>
                     ))}
                   </div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">What They Need</h3>
                   <div className="flex flex-wrap gap-2">
                     {MOCK_PROFILE.needs.map((item, i) => (
                       <Badge key={i} className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 px-4 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm">
                         {item}
                       </Badge>
                     ))}
                   </div>
                </div>
             </div>
             
             {/* 🔒 SECTION 10: CONTACT RULES */}
             <Card className="rounded-[2rem] bg-slate-100 dark:bg-white/5 border-none p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-black flex items-center justify-center">
                      <Lock className="h-5 w-5 text-slate-500" />
                   </div>
                   <div>
                     <h4 className="font-black text-sm text-slate-900 dark:text-white">Direct Contact Info Locked</h4>
                     <p className="text-xs font-bold text-slate-500 mt-1">Contact available after accepted intro request.</p>
                   </div>
                </div>
                <Button onClick={() => setIsIntroModalOpen(true)} className="hidden sm:flex rounded-xl font-black text-[10px] uppercase tracking-widest">
                   Request Intro to Unlock
                </Button>
             </Card>

          </div>

          {/* SIDEBAR CONTENT (Right Column) */}
          <div className="space-y-8">
             
             {/* 🛡️ SECTION 6: TRUST & PERFORMANCE */}
             <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Trust Metrics
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                      <span className="text-sm font-bold text-slate-500">Response Rate</span>
                      <span className="font-black text-emerald-500">{MOCK_PROFILE.performance.responseRate}%</span>
                   </div>
                   <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                      <span className="text-sm font-bold text-slate-500">Avg Response Time</span>
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {MOCK_PROFILE.performance.avgResponseTime}</span>
                   </div>
                   <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                      <span className="text-sm font-bold text-slate-500">Deals Closed</span>
                      <span className="font-black text-slate-900 dark:text-white">{MOCK_PROFILE.performance.dealsClosed}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">Repeat Partners</span>
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {MOCK_PROFILE.performance.repeatPartnerships}</span>
                   </div>
                </div>
             </Card>

             {/* ⭐ SECTION 7: RECENT FEEDBACK */}
             <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Recent Feedback
                </h3>
                <div className="space-y-6">
                   {MOCK_PROFILE.reviews.map((review, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex text-amber-500">
                           {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-500" />)}
                         </div>
                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">"{review.text}"</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">— {review.author}</p>
                      </div>
                   ))}
                </div>
                <Button variant="outline" className="w-full mt-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2">
                   View All Reviews
                </Button>
             </Card>

             {/* 📍 SECTION 8: BUSINESS PREFERENCES */}
             <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Business Preferences</h3>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Preferred Industries</p>
                      <div className="flex flex-wrap gap-2">
                         {MOCK_PROFILE.preferences.industries.map(ind => <Badge key={ind} variant="secondary" className="text-[9px] rounded-lg">{ind}</Badge>)}
                      </div>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Operating Regions</p>
                      <div className="flex flex-wrap gap-2">
                         {MOCK_PROFILE.preferences.locations.map(loc => <Badge key={loc} variant="outline" className="text-[9px] rounded-lg">{loc}</Badge>)}
                      </div>
                   </div>
                </div>
             </Card>

             {/* 🔄 SECTION 9: SIMILAR OPPORTUNITIES */}
             <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Similar Opportunities</h3>
                <div className="space-y-4">
                   {MOCK_PROFILE.similar.map((sim, i) => (
                     <Link key={i} href="#" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center font-black text-slate-500">
                             {sim.name[0]}
                           </div>
                           <div>
                             <p className="font-bold text-sm text-slate-900 dark:text-white">{sim.name}</p>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{sim.industry}</p>
                           </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                     </Link>
                   ))}
                </div>
             </Card>

          </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50">
         <Button onClick={() => setIsIntroModalOpen(true)} className="w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-xl">
            Request Intro Now
         </Button>
      </div>

      {/* 📧 REQUEST INTRO MODAL */}
      <Dialog open={isIntroModalOpen} onOpenChange={setIsIntroModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8 gap-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tight">Request Intro</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Send a direct request to {MOCK_PROFILE.name}. They will review your profile before accepting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Type</label>
                <select className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold px-4 focus:ring-2 ring-blue-600 appearance-none text-sm">
                   <option>Client Pitch</option>
                   <option>Partnership Proposal</option>
                   <option>Vendor Inquiry</option>
                   <option>Investment/Funding</option>
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opportunity Summary</label>
                <Input placeholder="E.g., $50k Cloud Migration Project" className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold px-4 focus:ring-2 ring-blue-600 text-sm" />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                <Textarea placeholder="Explain why you are a good match..." className="min-h-[120px] rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-medium p-4 focus:ring-2 ring-blue-600 text-sm resize-none" />
             </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button 
               onClick={handleSendRequest} 
               disabled={isSending}
               className="w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-all"
            >
               {isSending ? "Sending Request..." : "Send Intro Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
