"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  User, Building2, MapPin, Target, Zap, CheckCircle2, 
  ArrowRight, ArrowLeft, ShieldCheck, Globe, Users, 
  Banknote, Clock, FileText, ChevronRight, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const STEPS = [
  "Personal", "Business", "Location", "Offerings", 
  "Needs", "Goal", "Verify", "Finish"
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "", role: "", phone: "",
    companyName: "", industry: "", businessType: "", teamSize: "1-5",
    country: "India", state: "", city: "",
    offerings: [] as string[],
    needs: [] as string[],
    goal: "", urgency: "", budget: "", timeline: "",
    gstin: "", website: "", linkedin: ""
  })

  const [tagInput, setTagInput] = useState("")

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleFinish = () => {
    // Mark setup as complete in localStorage
    localStorage.setItem("taplyzer_setup_complete", "true")
    router.push("/dashboard")
  }

  const addTag = (type: 'offerings' | 'needs') => {
    if (tagInput.trim() && !formData[type].includes(tagInput.trim())) {
      setFormData({ ...formData, [type]: [...formData[type], tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (type: 'offerings' | 'needs', tag: string) => {
    setFormData({ ...formData, [type]: formData[type].filter(t => t !== tag) })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Progress Bar */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Step {currentStep} of {STEPS.length}</span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{STEPS[currentStep-1]}</span>
          </div>
          <Progress value={(currentStep / STEPS.length) * 100} className="h-1.5 bg-slate-100 dark:bg-white/5" />
        </div>

        <div className="p-8 md:p-12 flex-grow overflow-y-auto custom-scrollbar max-h-[70vh]">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Welcome to Taplyzer</h2>
                  <p className="text-slate-500 font-medium">Let's start with your personal professional details.</p>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role / Designation</label>
                    <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="CEO / Founder" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
               </div>
            </div>
          )}

          {/* STEP 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Company Identity</h2>
                  <p className="text-slate-500 font-medium">Tell us about the business you represent.</p>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                    <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Acme Softworks" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry</label>
                      <Input value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="Technology" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Type</label>
                      <Input value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} placeholder="Startup / SME" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Team Size</label>
                    <div className="flex flex-wrap gap-2">
                       {["1-5", "6-20", "21-50", "51-200", "201+"].map(size => (
                         <button 
                          key={size}
                          onClick={() => setFormData({...formData, teamSize: size})}
                          className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.teamSize === size ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-white/5 text-slate-500'}`}
                         >
                           {size}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Global Presence</h2>
                  <p className="text-slate-500 font-medium">Where is your business headquartered?</p>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
                    <Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                      <Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="California" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                      <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="San Francisco" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 4: Offerings */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Your Offerings</h2>
                  <p className="text-slate-500 font-medium">What products or services do you provide to the market?</p>
               </div>
               <div className="space-y-6">
                  <div className="flex gap-2">
                    <Input 
                      value={tagInput} 
                      onChange={e => setTagInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && addTag('offerings')}
                      placeholder="e.g. Cloud Security, AI Development" 
                      className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" 
                    />
                    <Button onClick={() => addTag('offerings')} className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px]">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.offerings.map(tag => (
                      <Badge key={tag} className="bg-primary/10 text-primary border-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag('offerings', tag)} />
                      </Badge>
                    ))}
                    {formData.offerings.length === 0 && <p className="text-xs font-bold text-slate-300 italic">No offerings added yet...</p>}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 5: Needs */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Market Needs</h2>
                  <p className="text-slate-500 font-medium">What are you currently looking for or needing from partners?</p>
               </div>
               <div className="space-y-6">
                  <div className="flex gap-2">
                    <Input 
                      value={tagInput} 
                      onChange={e => setTagInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && addTag('needs')}
                      placeholder="e.g. Marketing Agency, Supply Chain Partner" 
                      className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" 
                    />
                    <Button onClick={() => addTag('needs')} className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px]">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.needs.map(tag => (
                      <Badge key={tag} className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag('needs', tag)} />
                      </Badge>
                    ))}
                    {formData.needs.length === 0 && <p className="text-xs font-bold text-slate-300 italic">No needs added yet...</p>}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 6: Goal / Intent */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Strategic Goal</h2>
                  <p className="text-slate-500 font-medium">What is your most urgent objective on Taplyzer?</p>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Primary Objective</label>
                    <Textarea 
                      value={formData.goal} 
                      onChange={e => setFormData({...formData, goal: e.target.value})} 
                      placeholder="I am looking for a long-term logistics partner to handle my regional distribution..." 
                      className="min-h-[120px] bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold text-lg p-6 resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Budget</label>
                      <Input value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="$10,000 - $50,000" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Timeline</label>
                      <Input value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} placeholder="Next 3 months" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 7: Verification */}
          {currentStep === 7 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Trust & Verification</h2>
                  <p className="text-slate-500 font-medium">Provide details for business verification and trust.</p>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">GSTIN / CIN / Business Registration</label>
                    <Input value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} placeholder="Optional for now" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Website</label>
                    <Input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://acme.io" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">LinkedIn Profile</label>
                    <Input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="linkedin.com/company/acme" className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold" />
                  </div>
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-900/30 flex items-start gap-4">
                     <ShieldCheck className="h-6 w-6 text-amber-600 mt-1" />
                     <p className="text-xs font-bold text-amber-700 dark:text-amber-500 leading-relaxed">Verification ensures high-quality matches and builds trust within the Taplyzer ecosystem. You can provide these later, but verified profiles get 3x more introductions.</p>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 8: Finish */}
          {currentStep === 8 && (
            <div className="py-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-700">
               <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin duration-[2s]" />
                  <Zap className="h-12 w-12 text-primary fill-primary" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">Profile Ready!</h2>
                  <p className="text-slate-500 font-bold max-w-md">Your strategic profile is now optimized. Taplyzer AI is now scanning for the best business matches.</p>
               </div>
               <div className="grid grid-cols-2 gap-4 w-full pt-8">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                     <span className="text-3xl font-black text-primary italic">12</span>
                     <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Potential Matches</span>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                     <span className="text-3xl font-black text-emerald-500 italic">94%</span>
                     <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Profile Score</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
           <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 disabled:opacity-0"
           >
             <ArrowLeft className="h-4 w-4 mr-2" /> Back
           </Button>
           
           {currentStep < STEPS.length ? (
             <Button 
              onClick={nextStep} 
              className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
             >
               Next Step <ChevronRight className="h-4 w-4" />
             </Button>
           ) : (
             <Button 
              onClick={handleFinish} 
              className="h-14 px-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 dark:shadow-white/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
             >
               Go to Dashboard <Zap className="h-4 w-4 fill-current" />
             </Button>
           )}
        </div>

      </div>
    </div>
  )
}
