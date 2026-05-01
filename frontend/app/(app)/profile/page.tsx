"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
   Building2, Target, Search, CheckCircle2, ShieldCheck, MapPin,
   Calendar, Zap, Shield, Activity, XCircle, Rocket, FileText,
   Briefcase, Edit3, Lock, Plus, Mail, Smartphone,
   X, Check, Loader2, AlertCircle, Users
} from "lucide-react"
import { toast } from "sonner"

const INDUSTRY_SUGGESTIONS: Record<string, any> = {
   "Marketing": {
      offerings: ["SEO", "Paid Ads", "Lead Generation", "Content Marketing"],
      needs: ["Clients", "White-label Partners", "Freelancers"],
      goals: ["Need 5 monthly clients in Bangalore this quarter.", "Looking for white-label SEO partners."]
   },
   "Manufacturing": {
      offerings: ["OEM Supply", "Bulk Orders", "Packaging", "Raw Materials"],
      needs: ["Distributors", "Retail Buyers", "Logistics Partners"],
      goals: ["Need 3 distributors in Bangalore this quarter.", "Looking for raw material suppliers in Hyderabad."]
   },
   "Software": {
      offerings: ["SaaS Development", "API Integration", "Web Apps", "AI Automation"],
      needs: ["Clients", "Channel Partners", "Investors"],
      goals: ["Seeking channel sales partners for SaaS product.", "Need investors for seed round in next 60 days."]
   },
   "Default": {
      offerings: ["Consulting", "Services", "B2B Solutions"],
      needs: ["Clients", "Vendors", "Partners"],
      goals: ["Looking for new clients this month.", "Seeking business partners for expansion."]
   }
};

// -------------------------------------------------------------
// SKELETON
// -------------------------------------------------------------
const ProfileSkeleton = () => (
   <div className="max-w-5xl mx-auto space-y-6 pb-32 px-4 md:px-8 pt-8 animate-pulse">
      <div className="h-48 w-full bg-slate-200 dark:bg-white/5 rounded-3xl"></div>
      <div className="h-32 w-full bg-slate-200 dark:bg-white/5 rounded-3xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="h-48 bg-slate-200 dark:bg-white/5 rounded-3xl"></div>
         <div className="h-48 bg-slate-200 dark:bg-white/5 rounded-3xl"></div>
      </div>
      <div className="h-48 w-full bg-slate-200 dark:bg-white/5 rounded-3xl"></div>
   </div>
)

export default function ProfilePage() {
   const [isInitializing, setIsInitializing] = useState(true)
   
   // Modals State
   const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
   const [isEditOfferingsOpen, setIsEditOfferingsOpen] = useState(false)
   const [isEditNeedsOpen, setIsEditNeedsOpen] = useState(false)
   const [isEditGoalOpen, setIsEditGoalOpen] = useState(false)
   const [isVerificationOpen, setIsVerificationOpen] = useState(false)

   const [profileData, setProfileData] = useState<any>({
      // Business Info
      companyName: "Acme Corp", industry: "Marketing", subIndustry: "Digital Agency", businessType: "Agency",
      location: "Bangalore, KA", city: "Bangalore", state: "KA", country: "India", website: "https://acme.io",
      yearsInBusiness: "5", teamSize: "6-20", tagline: "Data-driven marketing growth.", description: "We scale businesses.",
      memberSince: "2024",
      // Security/Contact (Private)
      email: "", phone: "",
      // Tags
      offerings: ["SEO", "Paid Ads"],
      needs: ["Clients"],
      // Goal
      currentGoal: "Need 5 monthly clients in Bangalore this quarter.", 
      goalType: "Need Clients", goalTimeline: "Within 1 month", goalPriority: "High", goalIndustry: "E-commerce", goalLocation: "Bangalore",
      // Trust Statuses
      mobileVerified: false, emailVerified: false, verificationStatus: "Not Started", // "Not Started" | "Under Review" | "Approved" | "Rejected"
   })

   useEffect(() => {
      const cached = sessionStorage.getItem("taplyzer_biz_profile")
      if (cached) {
         setProfileData(JSON.parse(cached))
         setIsInitializing(false)
      } else {
         setTimeout(() => setIsInitializing(false), 800)
      }
   }, [])

   const updateData = (newData: any) => {
      const merged = { ...profileData, ...newData }
      setProfileData(merged)
      sessionStorage.setItem("taplyzer_biz_profile", JSON.stringify(merged))
   }

   // Completion Logic
   const calculateCompletion = () => {
      const fields = [
         profileData.companyName, profileData.industry, profileData.location,
         profileData.offerings.length > 0, profileData.needs.length > 0, profileData.currentGoal,
         profileData.mobileVerified, profileData.emailVerified,
         profileData.verificationStatus === "Approved" || profileData.verificationStatus === "Under Review"
      ];
      const completed = fields.filter(Boolean).length;
      return Math.round((completed / fields.length) * 100);
   }

   const completionPct = calculateCompletion();
   const isProfileReady = completionPct > 70;

   if (isInitializing) return <ProfileSkeleton />

   return (
      <div className="max-w-5xl mx-auto space-y-8 pb-32 px-4 md:px-8 pt-8 animate-in fade-in duration-500">
         
         {/* TOP HERO CARD */}
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
               <div className="h-28 w-28 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="h-10 w-10 text-slate-400" />
               </div>
               <div className="flex-1 space-y-5 w-full">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                     <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                           {profileData.companyName}
                           {profileData.verificationStatus === "Approved" && (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 px-2.5 py-1 font-bold rounded-lg uppercase tracking-widest text-[10px] flex items-center gap-1 shadow-sm"><CheckCircle2 className="h-3 w-3"/> Verified Business</Badge>
                           )}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 font-bold text-sm">
                           <span className="text-blue-600 dark:text-blue-400">{profileData.industry}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                           <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {profileData.location}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                           <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Member Since {profileData.memberSince}</span>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <Button onClick={() => setIsEditProfileOpen(true)} variant="outline" className="font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm"><Edit3 className="h-3 w-3 mr-2" /> Edit Profile</Button>
                        {profileData.verificationStatus !== "Approved" && profileData.verificationStatus !== "Under Review" && (
                           <Button onClick={() => setIsVerificationOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10"><ShieldCheck className="h-3 w-3 mr-2" /> Get Verified</Button>
                        )}
                     </div>
                  </div>
                  
                  {/* Progress Bar Component */}
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                     <div className="font-black text-slate-900 dark:text-white shrink-0">Profile Completion: <span className="text-blue-600 dark:text-blue-400">{completionPct}%</span></div>
                     <div className="flex-1 bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${completionPct}%` }}></div>
                     </div>
                     {completionPct < 100 && <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-blue-600 shrink-0 p-0 h-auto" onClick={() => setIsEditProfileOpen(true)}>Complete Profile</Button>}
                  </div>
               </div>
            </div>
         </div>

         {/* SECTION 4: ACTIVE GOAL (MOST IMPORTANT) */}
         <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950/40 dark:to-slate-900 rounded-[2rem] border border-slate-800 dark:border-white/5 p-8 md:p-10 shadow-xl relative overflow-hidden">
            <Target className="absolute -right-10 -bottom-10 h-64 w-64 text-blue-500 opacity-10 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
               <div className="max-w-3xl">
                  <h2 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2"><Target className="h-4 w-4"/> Current Business Goal</h2>
                  {profileData.currentGoal ? (
                     <>
                        <p className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">{profileData.currentGoal}</p>
                        <div className="flex flex-wrap gap-3">
                           <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-1.5 font-bold rounded-lg text-xs">{profileData.goalType}</Badge>
                           <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-1.5 font-bold rounded-lg text-xs">{profileData.goalPriority} Priority</Badge>
                           <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-1.5 font-bold rounded-lg text-xs">{profileData.goalTimeline}</Badge>
                           <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-1.5 font-bold rounded-lg text-xs">{profileData.goalLocation}</Badge>
                           <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-1.5 font-bold rounded-lg text-xs">{profileData.goalIndustry}</Badge>
                        </div>
                     </>
                  ) : <p className="text-xl font-bold text-slate-400">No active goal set. Add a goal to attract targeted matches.</p>}
               </div>
               <Button onClick={() => setIsEditGoalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shrink-0 border-none shadow-xl">Update Goal</Button>
            </div>
         </div>

         {/* SECTION 1: BUSINESS TRUST STATUS */}
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 md:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
               <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-500"/> Business Trust Status</h2>
               {profileData.verificationStatus !== "Approved" && <Button onClick={() => setIsVerificationOpen(true)} variant="outline" className="font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Improve Profile Trust</Button>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Mobile Verified</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Phone OTP</p>
                  </div>
                  <div className="mt-4">{profileData.mobileVerified ? <CheckCircle2 className="h-6 w-6 text-emerald-500"/> : <XCircle className="h-6 w-6 text-slate-300 dark:text-slate-700"/>}</div>
               </div>
               <div className="bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Email Verified</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Work Email</p>
                  </div>
                  <div className="mt-4">{profileData.emailVerified ? <CheckCircle2 className="h-6 w-6 text-emerald-500"/> : <XCircle className="h-6 w-6 text-slate-300 dark:text-slate-700"/>}</div>
               </div>
               <div className={`p-5 rounded-2xl border flex flex-col justify-between ${profileData.verificationStatus === 'Approved' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30' : profileData.verificationStatus === 'Under Review' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30' : 'bg-slate-50 border-slate-100 dark:bg-white/[0.02] dark:border-white/5'}`}>
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Verification Status</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Manual Review</p>
                  </div>
                  <div className={`mt-4 font-black ${profileData.verificationStatus === 'Approved' ? 'text-emerald-600' : profileData.verificationStatus === 'Under Review' ? 'text-amber-500' : 'text-slate-400'}`}>{profileData.verificationStatus}</div>
               </div>
               <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isProfileReady ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30' : 'bg-slate-50 border-slate-100 dark:bg-white/[0.02] dark:border-white/5'}`}>
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Profile Ready</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Basic details</p>
                  </div>
                  <div className="mt-4">{isProfileReady ? <CheckCircle2 className="h-6 w-6 text-blue-500"/> : <XCircle className="h-6 w-6 text-slate-300 dark:text-slate-700"/>}</div>
               </div>
            </div>
         </div>

         {/* SECTIONS 2 & 3: WHAT WE OFFER / WHAT WE NEED */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2"><Briefcase className="h-5 w-5 text-slate-400"/> What We Offer</h2>
                  <Button onClick={() => setIsEditOfferingsOpen(true)} variant="outline" className="font-black uppercase tracking-widest text-[10px] h-8 px-4 rounded-lg border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Edit Offerings</Button>
               </div>
               {profileData.offerings.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                     {profileData.offerings.map((tag: string) => (
                        <Badge key={tag} className="bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-4 py-2 font-bold text-sm rounded-xl">{tag}</Badge>
                     ))}
                  </div>
               ) : <p className="text-sm font-bold text-slate-400 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl p-6 text-center">No offerings added.</p>}
            </div>
            
            <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2"><Search className="h-5 w-5 text-slate-400"/> What We Need</h2>
                  <Button onClick={() => setIsEditNeedsOpen(true)} variant="outline" className="font-black uppercase tracking-widest text-[10px] h-8 px-4 rounded-lg border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Edit Needs</Button>
               </div>
               {profileData.needs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                     {profileData.needs.map((tag: string) => (
                        <Badge key={tag} className="bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-4 py-2 font-bold text-sm rounded-xl">{tag}</Badge>
                     ))}
                  </div>
               ) : <p className="text-sm font-bold text-slate-400 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl p-6 text-center">No needs added.</p>}
            </div>
         </div>

         {/* ------------------------------------------------------------- */}
         {/* MODALS OVERLAYS */}
         {/* ------------------------------------------------------------- */}

         {/* TAG EDITOR MODAL (Reusable for Offerings/Needs) */}
         {(isEditOfferingsOpen || isEditNeedsOpen) && (
            <TagEditorModal 
               type={isEditOfferingsOpen ? "offerings" : "needs"}
               industry={profileData.industry}
               currentTags={isEditOfferingsOpen ? profileData.offerings : profileData.needs}
               onClose={() => {setIsEditOfferingsOpen(false); setIsEditNeedsOpen(false)}}
               onSave={(tags) => {
                  updateData(isEditOfferingsOpen ? { offerings: tags } : { needs: tags })
                  setIsEditOfferingsOpen(false); setIsEditNeedsOpen(false);
                  toast.success("Tags updated successfully")
               }}
            />
         )}

         {/* EDIT GOAL MODAL */}
         {isEditGoalOpen && (
            <EditGoalModal 
               data={profileData}
               onClose={() => setIsEditGoalOpen(false)}
               onSave={(d) => { updateData(d); setIsEditGoalOpen(false); toast.success("Goal updated successfully") }}
            />
         )}

         {/* VERIFICATION WIZARD MODAL */}
         {isVerificationOpen && (
            <VerificationWizardModal 
               profileData={profileData}
               onClose={() => setIsVerificationOpen(false)}
               onComplete={(d) => { updateData(d); setIsVerificationOpen(false); toast.success("Verification submitted!") }}
            />
         )}

         {/* EDIT PROFILE MODAL (Strictly Business Info & Settings) */}
         {isEditProfileOpen && (
            <EditProfileModal 
               data={profileData}
               onClose={() => setIsEditProfileOpen(false)}
               onSave={(d) => { updateData(d); setIsEditProfileOpen(false); toast.success("Profile saved") }}
            />
         )}
      </div>
   )
}


// -------------------------------------------------------------
// MODALS COMPONENTS
// -------------------------------------------------------------

function TagEditorModal({ type, industry, currentTags, onClose, onSave }: any) {
   const [tags, setTags] = useState<string[]>(currentTags)
   const [input, setInput] = useState("")

   const isOfferings = type === "offerings"
   const suggestions = INDUSTRY_SUGGESTIONS[industry]?.[type] || INDUSTRY_SUGGESTIONS["Default"][type]

   const handleAdd = (val: string) => {
      const t = val.trim()
      if (t && !tags.includes(t)) setTags([...tags, t])
      setInput("")
   }

   const handleRemove = (tag: string) => setTags(tags.filter(t => t !== tag))

   return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] w-full max-w-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {isOfferings ? <Briefcase className="h-5 w-5 text-slate-500"/> : <Search className="h-5 w-5 text-slate-500"/>} 
                  Edit {isOfferings ? "Offerings" : "Needs"}
               </h3>
               <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="h-5 w-5"/></Button>
            </div>
            <div className="p-6 space-y-6">
               <div>
                  <div className="flex gap-2 mb-4">
                     <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd(input)} placeholder={`Add new tag...`} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                     <Button onClick={() => handleAdd(input)} className="h-12 bg-slate-900 text-white dark:bg-white dark:text-black font-black px-6 rounded-xl">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {tags.map(t => (
                        <Badge key={t} className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-white dark:border-white/20 px-3 py-1.5 font-bold text-sm rounded-lg flex items-center gap-2">
                           {t} <X onClick={() => handleRemove(t)} className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100"/>
                        </Badge>
                     ))}
                  </div>
               </div>
               
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Industry Recommendations</p>
                  <div className="flex flex-wrap gap-2">
                     {suggestions.filter((s:string) => !tags.includes(s)).map((s:string) => (
                        <Badge key={s} onClick={() => handleAdd(s)} variant="outline" className="cursor-pointer border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1">
                           <Plus className="h-3 w-3"/> {s}
                        </Badge>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex justify-end">
               <Button onClick={() => onSave(tags)} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl w-full">Save Tags</Button>
            </div>
         </div>
      </div>
   )
}


function EditGoalModal({ data, onClose, onSave }: any) {
   const [goal, setGoal] = useState(data.currentGoal || "")
   const [type, setType] = useState(data.goalType || "Need Clients")
   const [industry, setIndustry] = useState(data.goalIndustry || "")
   const [location, setLocation] = useState(data.goalLocation || "")
   const [timeline, setTimeline] = useState(data.goalTimeline || "Within 1 month")
   const [priority, setPriority] = useState(data.goalPriority || "Medium")

   const suggestions = INDUSTRY_SUGGESTIONS[data.industry]?.goals || INDUSTRY_SUGGESTIONS["Default"].goals

   return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] w-full max-w-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
               <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2"><Target className="h-5 w-5 text-blue-500"/> Update Active Goal</h3>
               <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="h-5 w-5"/></Button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Clear Live Statement</label>
                  <Textarea value={goal} onChange={e => setGoal(e.target.value)} className="min-h-[80px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl resize-none text-base" placeholder="e.g. Need 3 distributors in Bangalore this quarter." />
                  <div className="mt-3 flex flex-col gap-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suggestions:</span>
                     {suggestions.map((s:string) => (
                        <p key={s} onClick={() => setGoal(s)} className="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{s}</p>
                     ))}
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Goal Type</label>
                     <select value={type} onChange={e => setType(e.target.value)} className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none">
                        <option value="Need Clients">Need Clients</option><option value="Need Partners">Need Partners</option><option value="Need Vendors">Need Vendors</option><option value="Need Investors">Need Investors</option><option value="Need Distributors">Need Distributors</option><option value="Offer Services">Offer Services</option><option value="Hiring">Hiring</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Priority</label>
                     <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none">
                        <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Target Industry</label>
                     <Input value={industry} onChange={e => setIndustry(e.target.value)} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Target Location</label>
                     <Input value={location} onChange={e => setLocation(e.target.value)} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                  </div>
                  <div className="col-span-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Timeline</label>
                     <Input value={timeline} onChange={e => setTimeline(e.target.value)} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex justify-end shrink-0">
               <Button onClick={() => onSave({ currentGoal: goal, goalType: type, goalPriority: priority, goalIndustry: industry, goalLocation: location, goalTimeline: timeline })} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl w-full">Save Goal</Button>
            </div>
         </div>
      </div>
   )
}


function EditProfileModal({ data, onClose, onSave }: any) {
   const [tab, setTab] = useState("Business Info")
   const [formData, setFormData] = useState(data)

   const TABS = ["Business Info", "Security", "Notifications", "Billing", "Privacy"]

   return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in">
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] w-full max-w-4xl h-[85vh] flex flex-col border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
               <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">Edit Profile Settings</h3>
               <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="h-5 w-5"/></Button>
            </div>
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
               <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-4 space-y-1 overflow-y-auto shrink-0">
                  {TABS.map(t => (
                     <button key={t} onClick={() => setTab(t)} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${tab === t ? 'bg-white dark:bg-[#111] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/10' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>{t}</button>
                  ))}
               </div>
               <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  {tab === "Business Info" && (
                     <>
                        <h4 className="font-black text-slate-900 dark:text-white mb-6">Business Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Company Name</label><Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Industry</label><Input value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Sub Industry</label><Input value={formData.subIndustry} onChange={e => setFormData({...formData, subIndustry: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Business Type</label>
                              <select value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none">
                                 <option value="Startup">Startup</option><option value="Agency">Agency</option><option value="SME">SME</option><option value="Mid Cap">Mid Cap</option><option value="Enterprise">Enterprise</option><option value="Consultant">Consultant</option><option value="Manufacturer">Manufacturer</option><option value="Distributor">Distributor</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Team Size</label>
                              <select value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none">
                                 <option value="1-5">1-5</option><option value="6-20">6-20</option><option value="21-50">21-50</option><option value="50-200">50-200</option><option value="200+">200+</option>
                              </select>
                           </div>
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Years in Business</label><Input type="number" value={formData.yearsInBusiness} onChange={e => setFormData({...formData, yearsInBusiness: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">City</label><Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">State</label><Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Country</label><Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" /></div>
                        </div>
                        <div className="mt-6">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Tagline</label>
                           <Input value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                        </div>
                        <div className="mt-6">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Description</label>
                           <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[100px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl resize-none" />
                        </div>
                     </>
                  )}
                  {(tab === "Security" || tab === "Privacy") && (
                     <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 flex gap-3">
                           <Lock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0"/>
                           <div><p className="font-bold text-amber-900 dark:text-amber-500 text-sm">Security & Privacy V1</p><p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-1">We NEVER show email or phone to other users. Communication goes through Taplyzer requests + video calls only, even after acceptance.</p></div>
                        </div>
                     </div>
                  )}
                  {(tab === "Notifications" || tab === "Billing") && (
                     <p className="text-slate-500 font-bold">Settings specific to {tab} go here.</p>
                  )}
               </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 shrink-0 bg-slate-50 dark:bg-white/[0.02]">
               <Button onClick={onClose} variant="ghost" className="font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl">Cancel</Button>
               <Button onClick={() => onSave({ ...formData, location: `${formData.city}, ${formData.state}` })} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg">Save Changes</Button>
            </div>
         </div>
      </div>
   )
}


function VerificationWizardModal({ profileData, onClose, onComplete }: any) {
   const [step, setStep] = useState(1)
   const [loading, setLoading] = useState(false)
   const [otp, setOtp] = useState("")
   const [email, setEmail] = useState("")

   const handleSimulate = async (nextStep: number | 'complete') => {
      setLoading(true)
      await new Promise(r => setTimeout(r, 1200)) // network simulation
      setLoading(false)
      if (nextStep === 'complete') {
         onComplete({ mobileVerified: true, emailVerified: true, verificationStatus: "Under Review" })
      } else {
         setStep(nextStep)
      }
   }

   return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] w-full max-w-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] relative overflow-hidden">
               <ShieldCheck className="absolute -right-4 -bottom-4 h-32 w-32 text-slate-200 dark:text-white/5 pointer-events-none" />
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-black text-slate-900 dark:text-white">Verification Flow</h3>
                     <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 -mr-2"><X className="h-4 w-4"/></Button>
                  </div>
                  <div className="flex gap-2">
                     {[1,2,3,4,5].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s === step ? 'bg-slate-900 dark:bg-white' : s < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                     ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-3">Step {step} of 5</p>
               </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 relative min-h-[320px]">
               {step === 1 && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                     <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-6"><Smartphone className="h-6 w-6"/></div>
                     <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Mobile OTP Verification</h4>
                     <p className="text-sm font-bold text-slate-500 mb-6">Enter your mobile number to receive a one-time password.</p>
                     <div className="space-y-4">
                        <Input placeholder="Mobile Number" className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" />
                        <div className="flex gap-2">
                           <Input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP" className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" />
                           <Button onClick={() => handleSimulate(2)} disabled={loading || otp.length < 4} className="h-12 bg-slate-900 text-white dark:bg-white dark:text-black px-6 font-black rounded-xl w-32 shrink-0">
                              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Verify OTP"}
                           </Button>
                        </div>
                     </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                     <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center mb-6"><Mail className="h-6 w-6"/></div>
                     <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Business Email Verification</h4>
                     <p className="text-sm font-bold text-slate-500 mb-6">We will send a verification link to your work email (name@company.com).</p>
                     <div className="space-y-4">
                        <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" />
                        <div className="flex gap-2">
                           <Button onClick={() => handleSimulate(3)} disabled={loading || !email.includes('@')} className="h-12 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl">
                              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Send Link"}
                           </Button>
                           <Button variant="outline" className="h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest border-slate-200">Resend</Button>
                        </div>
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                     <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center mb-6"><Building2 className="h-6 w-6"/></div>
                     <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Business Authenticity Details</h4>
                     <p className="text-sm font-bold text-slate-500 mb-6">Provide clear business signals to pass our manual review.</p>
                     <div className="space-y-4">
                        <Input defaultValue={profileData.companyName} className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" placeholder="Company Name" />
                        <Input defaultValue={profileData.website} className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" placeholder="Website URL (optional)" />
                        <Input className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" placeholder="LinkedIn Company Page (optional)" />
                        <Input className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" placeholder="GSTIN / CIN / Registration ID (optional)" />
                        <Button onClick={() => handleSimulate(4)} disabled={loading} className="h-12 w-full bg-slate-900 text-white dark:bg-white dark:text-black font-black rounded-xl mt-2">
                           {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Next"}
                        </Button>
                     </div>
                  </div>
               )}

               {step === 4 && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                     <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-6"><Activity className="h-6 w-6"/></div>
                     <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Business Readiness</h4>
                     <p className="text-sm font-bold text-slate-500 mb-6">Confirm your deal readiness parameters.</p>
                     <div className="space-y-4">
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">What do you offer?</label>
                           <Input disabled value={profileData.offerings.join(', ')} className="h-12 bg-slate-100 dark:bg-white/5 font-bold rounded-xl text-slate-500" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">What deals are you seeking?</label>
                           <Input disabled value={profileData.needs.join(', ')} className="h-12 bg-slate-100 dark:bg-white/5 font-bold rounded-xl text-slate-500" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Preferred industries</label>
                           <Input className="h-12 bg-slate-50 dark:bg-white/5 font-bold rounded-xl" placeholder="e.g. Finance, Healthcare" />
                        </div>
                        <Button onClick={() => handleSimulate(5)} disabled={loading} className="h-12 w-full bg-slate-900 text-white dark:bg-white dark:text-black font-black rounded-xl mt-2">
                           {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Submit for Review"}
                        </Button>
                     </div>
                  </div>
               )}

               {step === 5 && (
                  <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center py-6 h-full justify-center">
                     <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                        <Activity className="h-10 w-10 text-blue-600 dark:text-blue-400 stroke-[3]"/>
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Under Review</h4>
                     <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 mb-6">
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-400 text-left flex gap-2 items-start"><AlertCircle className="h-5 w-5 shrink-0"/> Your business verification is under manual review. Taplyzer team will verify your company website, LinkedIn presence, and business authenticity before approval.</p>
                     </div>
                     <Button onClick={() => handleSimulate('complete')} className="h-12 w-full bg-slate-900 text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-xl">Return to Profile</Button>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
