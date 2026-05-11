"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  Building2, Target, Zap, ArrowRight, ArrowLeft,
  ShieldCheck, ChevronRight, X, Save, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  INDUSTRIES, INDUSTRY_SUGGESTIONS, DEFAULT_SUGGESTIONS,
  BUSINESS_TYPES_BY_INDUSTRY, DEFAULT_BUSINESS_TYPES
} from "@/constants/industryData"

// Step 1 removed — name/phone already collected at signup
// New step order: Business → Location → Offerings → Needs → Goal → Verify → Finish
const STEPS = ["Identity", "Location", "Offerings", "Needs", "Goal", "Verify", "Finish"]

type FormData = {
  role: string
  companyName: string; industry: string; customIndustry: string
  businessType: string; customBusinessType: string; teamSize: string
  country: string; state: string; city: string; pincode: string; address: string
  offerings: string[]; needs: string[]
  goal: string; budget: string; timeline: string
  gstin: string; website: string; linkedin: string
}

const DEFAULT_FORM: FormData = {
  role: "",
  companyName: "", industry: "", customIndustry: "",
  businessType: "", customBusinessType: "", teamSize: "1-5",
  country: "India", state: "", city: "", pincode: "", address: "",
  offerings: [], needs: [],
  goal: "", budget: "", timeline: "",
  gstin: "", website: "", linkedin: ""
}

const inputCls = "h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold"
const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
const selectCls = "w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold px-4 text-sm text-slate-900 dark:text-white outline-none cursor-pointer"

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedStep, setSavedStep] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM)
  const [tagInput, setTagInput] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)

  const set = (key: keyof FormData, value: any) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  useEffect(() => {
    async function fetchProfile() {
      if (!user?._id) return
      try {
        const res = await fetch(`/api/business/${user._id}`)
        if (res.ok) {
          const data = await res.json()
          if (data?.companyName) {
            setFormData({
              role: data.ownerDesignation || "",
              companyName: data.companyName || "",
              industry: data.industry || "",
              customIndustry: "",
              businessType: data.businessType || "",
              customBusinessType: "",
              teamSize: data.strength?.teamSize || "1-5",
              country: data.location?.country || "India",
              state: data.location?.state || "",
              city: data.location?.city || "",
              pincode: data.location?.pincode || "",
              address: data.location?.address || "",
              offerings: data.offerings || [],
              needs: data.needs || [],
              goal: data.intent?.currentGoal || "",
              budget: data.intent?.budget || "",
              timeline: data.intent?.timeline || "",
              gstin: data.trust?.gst || "",
              website: data.trust?.website || "",
              linkedin: data.trust?.linkedin || ""
            })
          }
        }
      } catch (err) { console.error(err) }
      finally { setIsInitializing(false) }
    }
    fetchProfile()
  }, [user?._id])

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center"><p className="text-slate-400 font-bold text-sm">Loading profile...</p></div>
  }

  const buildPayload = () => ({
    ownerId: user?._id,
    ownerName: user?.name,
    ownerDesignation: formData.role,
    companyName: formData.companyName,
    industry: formData.industry === "Other" ? formData.customIndustry : formData.industry,
    businessType: formData.businessType === "Other" ? formData.customBusinessType : formData.businessType,
    location: { country: formData.country, state: formData.state, city: formData.city, pincode: formData.pincode, address: formData.address, operatesIn: "National" },
    strength: { teamSize: formData.teamSize },
    offerings: formData.offerings,
    needs: formData.needs,
    intent: { currentGoal: formData.goal, budget: formData.budget, timeline: formData.timeline },
    trust: { website: formData.website, linkedin: formData.linkedin, gst: formData.gstin },
    isProfileCompleted: currentStep === STEPS.length
  })

  const handleSaveAndNext = async () => {
    if (!user?._id) return
    setIsSaving(true)
    try {
      await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload())
      })
      setCurrentStep(p => Math.min(p + 1, STEPS.length))
    } catch (err) { console.error(err) }
    finally { setIsSaving(false) }
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildPayload(), isProfileCompleted: true })
      })
      if (res.ok) { localStorage.setItem("taplyzer_setup_complete", "true"); router.push("/dashboard") }
    } catch (err) { console.error(err) }
    finally { setIsSubmitting(false) }
  }

  const addTag = (type: "offerings" | "needs") => {
    if (tagInput.trim() && !formData[type].includes(tagInput.trim())) {
      set(type, [...formData[type], tagInput.trim()])
      setTagInput("")
    }
  }
  const removeTag = (type: "offerings" | "needs", tag: string) =>
    set(type, formData[type].filter(t => t !== tag))

  const toggleTag = (type: "offerings" | "needs", tag: string) => {
    if (formData[type].includes(tag)) {
      set(type, formData[type].filter(t => t !== tag))
    } else {
      set(type, [...formData[type], tag])
    }
  }

  const countWords = (str: string) => str.trim().split(/\s+/).filter(w => w.length > 0).length;

  const businessTypeOptions = formData.industry && formData.industry !== "Other"
    ? [...(BUSINESS_TYPES_BY_INDUSTRY[formData.industry] || DEFAULT_BUSINESS_TYPES), "Other"]
    : [...DEFAULT_BUSINESS_TYPES, "Other"]

  const isLastStep = currentStep === STEPS.length

  const generateDynamicGoals = () => {
    const suggestions: string[] = []
    if (formData.needs.length > 0 && formData.city) {
      suggestions.push(`Seeking ${formData.needs[0]} partners in ${formData.city}.`)
    }
    if (formData.offerings.length > 0) {
      suggestions.push(`Looking to provide ${formData.offerings[0]} services.`)
    }
    if (formData.industry) {
      suggestions.push(`Expanding our ${formData.industry} business network.`)
    }
    
    const industrySuggestions = INDUSTRY_SUGGESTIONS[formData.industry]?.goals || DEFAULT_SUGGESTIONS.goals
    
    const combined = [...suggestions, ...industrySuggestions]
    return Array.from(new Set(combined)).slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">

        {/* Progress Bar */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Step {currentStep} of {STEPS.length}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{STEPS[currentStep - 1]}</span>
          </div>
          <Progress value={(currentStep / STEPS.length) * 100} className="h-1.5 bg-slate-100 dark:bg-white/5" />
        </div>

        <div className="p-8 md:p-12 flex-grow overflow-y-auto custom-scrollbar max-h-[65vh]">

          {/* STEP 1: Company Identity (formerly step 2, now includes role/designation) */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Company Identity</h2>
                <p className="text-slate-500 font-medium">Tell us about you and the business you represent.</p>
              </div>
              <div className="space-y-4">

                <div className="space-y-2">
                  <label className={labelCls}>Company Name</label>
                  <Input value={formData.companyName} onChange={e => set("companyName", e.target.value)} placeholder="Acme Softworks" className={inputCls} />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Your Role / Designation</label>
                  <Input value={formData.role} onChange={e => set("role", e.target.value)} placeholder="CEO / Founder / Director" className={inputCls} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Industry dropdown */}
                  <div className="space-y-2">
                    <label className={labelCls}>Industry</label>
                    <select
                      value={formData.industry}
                      onChange={e => { set("industry", e.target.value); set("businessType", ""); set("customIndustry", "") }}
                      className={selectCls}
                    >
                      <option value="" disabled>Select Industry</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      <option value="Other">Other (specify below)</option>
                    </select>
                    {formData.industry === "Other" && (
                      <Input
                        value={formData.customIndustry}
                        onChange={e => set("customIndustry", e.target.value)}
                        placeholder="Type your industry"
                        className={`${inputCls} mt-2`}
                      />
                    )}
                  </div>

                  {/* Business Type dropdown — options depend on selected industry */}
                  <div className="space-y-2">
                    <label className={labelCls}>Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={e => { set("businessType", e.target.value); set("customBusinessType", "") }}
                      className={selectCls}
                      disabled={!formData.industry}
                    >
                      <option value="" disabled>{formData.industry ? "Select Type" : "Select Industry first"}</option>
                      {businessTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {formData.businessType === "Other" && (
                      <Input
                        value={formData.customBusinessType}
                        onChange={e => set("customBusinessType", e.target.value)}
                        placeholder="Type your business type"
                        className={`${inputCls} mt-2`}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Team Size</label>
                  <div className="flex flex-wrap gap-2">
                    {["1-5", "6-20", "21-50", "51-200", "201+"].map(size => (
                      <button
                        key={size}
                        onClick={() => set("teamSize", size)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.teamSize === size ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-white/5 text-slate-500"}`}
                      >{size}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Global Presence</h2>
                <p className="text-slate-500 font-medium">Where is your business headquartered?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={labelCls}>Country</label>
                  <Input value={formData.country} onChange={e => set("country", e.target.value)} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelCls}>State</label>
                    <Input value={formData.state} onChange={e => set("state", e.target.value)} placeholder="Maharashtra" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>City</label>
                    <Input value={formData.city} onChange={e => set("city", e.target.value)} placeholder="Mumbai" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-1">
                    <label className={labelCls}>Pincode</label>
                    <Input value={formData.pincode} onChange={e => set("pincode", e.target.value)} placeholder="400001" className={inputCls} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className={labelCls}>Company Address</label>
                    <Input value={formData.address} onChange={e => set("address", e.target.value)} placeholder="Office 402, Business Park" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Offerings */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Your Offerings</h2>
                <p className="text-slate-500 font-medium">What products or services do you provide?</p>
              </div>
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag("offerings")} placeholder="e.g. Cloud Security, AI Development" className={inputCls} />
                  <Button onClick={() => addTag("offerings")} className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px]">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.offerings.map(tag => (
                    <Badge key={tag} className="bg-primary/10 text-primary border-none px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                      {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag("offerings", tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Suggestions for {formData.industry || "your industry"}:</p>
                  <div className="flex flex-wrap gap-2">
                    {(INDUSTRY_SUGGESTIONS[formData.industry]?.offerings || DEFAULT_SUGGESTIONS.offerings)
                      .map(s => {
                        const isSelected = formData.offerings.includes(s);
                        return (
                        <Badge key={s} onClick={() => toggleTag("offerings", s)} variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all ${isSelected ? "bg-primary text-white border-primary shadow-sm shadow-primary/20" : "border-slate-200 dark:border-white/10 text-slate-500 hover:bg-primary/5 hover:text-primary"}`}>
                          {isSelected ? "✓" : "+"} {s}
                        </Badge>
                      )})}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Needs */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Market Needs</h2>
                <p className="text-slate-500 font-medium">What are you currently looking for from partners?</p>
              </div>
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag("needs")} placeholder="e.g. Marketing Agency, Supply Chain Partner" className={inputCls} />
                  <Button onClick={() => addTag("needs")} className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px]">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.needs.map(tag => (
                    <Badge key={tag} className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                      {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag("needs", tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Suggestions for {formData.industry || "your industry"}:</p>
                  <div className="flex flex-wrap gap-2">
                    {(INDUSTRY_SUGGESTIONS[formData.industry]?.needs || DEFAULT_SUGGESTIONS.needs)
                      .map(s => {
                        const isSelected = formData.needs.includes(s);
                        return (
                        <Badge key={s} onClick={() => toggleTag("needs", s)} variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all ${isSelected ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20" : "border-slate-200 dark:border-white/10 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"}`}>
                          {isSelected ? "✓" : "+"} {s}
                        </Badge>
                      )})}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Goal */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Strategic Goal</h2>
                <p className="text-slate-500 font-medium">What is your most urgent objective on Taplyzer?</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Textarea
                    value={formData.goal}
                    onChange={e => {
                      if (countWords(e.target.value) <= 60 || e.target.value.length < formData.goal.length) {
                        set("goal", e.target.value)
                      }
                    }}
                    placeholder="e.g. I am looking for a long-term logistics partner..."
                    className="min-h-[120px] bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-bold text-lg p-6 resize-none"
                  />
                  <div className="flex justify-between items-center px-1 mt-1">
                    <span className="text-[10px] font-bold text-slate-400">{countWords(formData.goal)}/60 words</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suggestions:</p>
                  {generateDynamicGoals().map(s => (
                    <div key={s} onClick={() => set("goal", s)}
                      className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all">
                      {s}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelCls}>Minimum Budget</label>
                    <Input value={formData.budget} onChange={e => set("budget", e.target.value)} placeholder="₹5L – ₹25L" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Expected Turnaround</label>
                    <select
                      value={formData.timeline}
                      onChange={e => set("timeline", e.target.value)}
                      className={selectCls}
                    >
                      <option value="" disabled>Select turnaround time</option>
                      <option value="Less than 7 Days">Less than 7 Days</option>
                      <option value="Within 14 Days">Within 14 Days</option>
                      <option value="Within 30 Days">Within 30 Days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Verification */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-2">Trust & Verification</h2>
                <p className="text-slate-500 font-medium">Provide details for business verification and trust.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={labelCls}>GSTIN / CIN / Business Registration</label>
                  <Input value={formData.gstin} onChange={e => set("gstin", e.target.value)} placeholder="Optional for now" className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Company Website</label>
                  <Input value={formData.website} onChange={e => set("website", e.target.value)} placeholder="https://acme.io" className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>LinkedIn Profile</label>
                  <Input value={formData.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/company/acme" className={inputCls} />
                </div>
                <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-900/30 flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-amber-600 mt-1" />
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-500 leading-relaxed">
                    Verified profiles get 3x more introductions. You can provide these details now or later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Finish */}
          {currentStep === 7 && (
            <div className="py-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-700">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin duration-[2s]" />
                <Zap className="h-12 w-12 text-primary fill-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">Profile Ready!</h2>
                <p className="text-slate-500 font-bold max-w-md">Your strategic profile is optimized. Taplyzer AI is scanning for the best business matches.</p>
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
        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(p => Math.max(p - 1, 1))}
            disabled={currentStep === 1}
            className="h-12 px-5 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <div className="flex items-center gap-3">
            {isLastStep ? (
              <Button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="h-14 px-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] shadow-xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
              >
                {isSubmitting ? "Saving..." : "Go to Dashboard"} <Zap className="h-4 w-4 fill-current" />
              </Button>
            ) : (
              <Button
                onClick={handleSaveAndNext}
                disabled={isSaving}
                className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
              >
                {isSaving ? "Saving..." : "Save & Next"} <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
