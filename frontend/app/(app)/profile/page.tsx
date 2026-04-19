"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, User, Target, Search, CheckCircle2, ShieldCheck, MapPin, 
  Globe, Users, Calendar, Briefcase, Zap, Banknote, Clock, FileText, Lock
} from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  const [profileData, setProfileData] = useState<any>({
    // Account Owner
    name: "", designation: "", phone: "", email: "", linkedinOwner: "",
    // Basic Info
    companyName: "", brandName: "", industry: "Software Company", subIndustry: "", businessType: "Startup",
    country: "", state: "", city: "", operatesIn: "National", website: "",
    yearsInBusiness: 1, teamSize: "1-5",
    // Offerings & Needs
    offerings: [], needs: [],
    // Intent
    currentGoal: "", priority: "Medium", budget: "", timeline: "",
    // Documents
    gst: "", verificationStatus: "Not Verified"
  })

  const [offeringInput, setOfferingInput] = useState("")
  const [needInput, setNeedInput] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          const { user, business } = data
          
          setProfileData({
            ...profileData,
            name: user.name || "", designation: user.designation || "", phone: user.phone || "", email: user.email || "", linkedinOwner: user.linkedin || "",
            companyName: business?.companyName || "", brandName: business?.brandName || "", industry: business?.industry || "Software Company", subIndustry: business?.subIndustry || "", businessType: business?.businessType || "Startup",
            country: business?.location?.country || "", state: business?.location?.state || "", city: business?.location?.city || "", operatesIn: business?.location?.operatesIn || "National",
            yearsInBusiness: business?.strength?.yearsInBusiness || 1, teamSize: business?.strength?.teamSize || "1-5", 
            offerings: business?.offerings || [], needs: business?.needs || [],
            currentGoal: business?.intent?.currentGoal || "", priority: business?.intent?.priority || "Medium", budget: business?.intent?.budget || "", timeline: business?.intent?.timeline || "",
            website: business?.trust?.website || "", gst: business?.trust?.gst || "", verificationStatus: business?.trust?.verificationStatus || "Not Verified"
          })
          
          if (!business?.companyName) {
            setIsEditMode(true)
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        setIsInitializing(false)
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profileData.companyName || !profileData.industry) {
      toast.error("Company Name and Industry are required")
      return;
    }

    setIsLoading(true)
    try {
      const payload = {
        name: profileData.name,
        designation: profileData.designation,
        phone: profileData.phone,
        linkedin: profileData.linkedinOwner,
        companyName: profileData.companyName,
        brandName: profileData.brandName,
        industry: profileData.industry,
        subIndustry: profileData.subIndustry,
        businessType: profileData.businessType,
        location: {
          country: profileData.country,
          state: profileData.state,
          city: profileData.city,
          operatesIn: profileData.operatesIn
        },
        strength: {
          yearsInBusiness: Number(profileData.yearsInBusiness),
          teamSize: profileData.teamSize,
        },
        offerings: profileData.offerings,
        needs: profileData.needs,
        intent: {
          currentGoal: profileData.currentGoal,
          priority: profileData.priority,
          budget: profileData.budget,
          timeline: profileData.timeline
        },
        trust: {
          website: profileData.website,
          gst: profileData.gst,
        }
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("Profile saved successfully")
        setIsEditMode(false)
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to save profile")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagAdd = (type: 'offerings' | 'needs', e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = (type === 'offerings' ? offeringInput : needInput).trim();
      if (value && !profileData[type].includes(value)) {
        setProfileData({ ...profileData, [type]: [...profileData[type], value] });
      }
      if (type === 'offerings') setOfferingInput("");
      else setNeedInput("");
    }
  }

  const handleTagRemove = (type: 'offerings' | 'needs', tagToRemove: string) => {
    setProfileData({
      ...profileData,
      [type]: profileData[type].filter((tag: string) => tag !== tagToRemove)
    });
  }

  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-pulse font-black text-slate-400 tracking-widest uppercase text-xs">Loading Profile...</div></div>
  }

  const renderEditMode = () => (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 md:px-8 pt-8">
       
       {/* Global Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
         <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Edit Business Profile</h1>
            <p className="text-slate-500 font-bold mt-2">Update your company details and intent settings</p>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
           <Button 
              variant="outline"
              onClick={() => setIsEditMode(false)} 
              disabled={isLoading} 
              className="font-black px-6 rounded-xl h-12 uppercase tracking-widest text-[11px] flex-1 md:flex-none border-slate-200 dark:border-white/10"
           >
              Cancel
           </Button>
           <Button 
              onClick={handleSave} 
              disabled={isLoading} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 rounded-xl h-12 uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/20 flex-1 md:flex-none"
           >
              {isLoading ? "Saving..." : "Save Changes"}
           </Button>
         </div>
       </div>

       {/* Section 1: Basic Information */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Basic Information</h2>
          </div>
          <div className="p-8 space-y-8">
             {/* Logo Upload */}
             <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
                   <Building2 className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                   <Button variant="outline" className="font-black uppercase tracking-widest text-[10px] mb-3 rounded-xl border-slate-200 dark:border-white/10 h-10 px-6">Upload Logo</Button>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">RECOMMENDED: SQUARE IMAGE, AT LEAST 200X200PX</p>
                </div>
             </div>
             
             {/* Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Building2 className="h-3 w-3"/> Company Name</label>
                  <Input value={profileData.companyName} onChange={e => setProfileData({...profileData, companyName: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Briefcase className="h-3 w-3"/> Industry</label>
                  <Input value={profileData.industry} onChange={e => setProfileData({...profileData, industry: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><MapPin className="h-3 w-3"/> Location (City, State)</label>
                  <Input value={`${profileData.city ? profileData.city + ', ' : ''}${profileData.state}`} onChange={e => {
                     const parts = e.target.value.split(',');
                     setProfileData({
                        ...profileData, 
                        city: parts[0]?.trim() || '', 
                        state: parts[1]?.trim() || ''
                     })
                  }} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" placeholder="e.g. San Francisco, CA" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Globe className="h-3 w-3"/> Website</label>
                  <Input value={profileData.website} onChange={e => setProfileData({...profileData, website: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" placeholder="https://" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Users className="h-3 w-3"/> Team Size</label>
                  <select 
                     className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                     value={profileData.teamSize}
                     onChange={(e) => setProfileData({...profileData, teamSize: e.target.value})}
                  >
                     {["1-5", "6-20", "21-50", "50-200", "200+"].map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Calendar className="h-3 w-3"/> Years in Business</label>
                  <Input type="number" min="0" value={profileData.yearsInBusiness} onChange={e => setProfileData({...profileData, yearsInBusiness: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                </div>
             </div>

             <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Company Description (Brand Name / Tagline)</label>
                <Textarea value={profileData.brandName} onChange={e => setProfileData({...profileData, brandName: e.target.value})} className="min-h-[100px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl resize-none" placeholder="Briefly describe what your company does..." />
             </div>
          </div>
       </div>

       {/* Section 2: Account Owner */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
             <User className="h-5 w-5 text-slate-400" />
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Account Owner</h2>
          </div>
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Full Name</label>
                  <Input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Designation / Role</label>
                  <Input value={profileData.designation} onChange={e => setProfileData({...profileData, designation: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Email Address</label>
                  <Input disabled value={profileData.email} className="h-12 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl text-slate-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Phone Number</label>
                  <Input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" />
                </div>
             </div>
          </div>
       </div>

       {/* Section 3: Offerings & Needs */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
             <Target className="h-5 w-5 text-slate-400" />
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Offerings & Needs</h2>
          </div>
          <div className="p-8 space-y-8">
             {/* Offerings */}
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block">What does your business offer?</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profileData.offerings.map((tag: string) => (
                    <Badge key={tag} className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-blue-100">
                      {tag} <span className="cursor-pointer font-black ml-1 text-[10px] opacity-60 hover:opacity-100" onClick={() => handleTagRemove('offerings', tag)}>✕</span>
                    </Badge>
                  ))}
                </div>
                <Input 
                   value={offeringInput}
                   onChange={e => setOfferingInput(e.target.value)}
                   onKeyDown={e => handleTagAdd('offerings', e)}
                   placeholder="Type a product/service and press Enter..." 
                   className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" 
                />
             </div>

             {/* Needs */}
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block">What are you currently looking for?</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profileData.needs.map((tag: string) => (
                    <Badge key={tag} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-emerald-100">
                      {tag} <span className="cursor-pointer font-black ml-1 text-[10px] opacity-60 hover:opacity-100" onClick={() => handleTagRemove('needs', tag)}>✕</span>
                    </Badge>
                  ))}
                </div>
                <Input 
                   value={needInput}
                   onChange={e => setNeedInput(e.target.value)}
                   onKeyDown={e => handleTagAdd('needs', e)}
                   placeholder="Type a requirement (e.g. SEO Agency, Raw Materials) and press Enter..." 
                   className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" 
                />
             </div>
          </div>
       </div>

       {/* Section 4: Your Intent */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
             <Zap className="h-5 w-5 text-slate-400 fill-slate-400" />
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Your Intent</h2>
          </div>
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Target className="h-3 w-3"/> Primary Goal</label>
                  <Textarea value={profileData.currentGoal} onChange={e => setProfileData({...profileData, currentGoal: e.target.value})} className="min-h-[100px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl resize-none text-lg" placeholder="Describe the main business objective you want to achieve right now..." />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Banknote className="h-3 w-3"/> Budget Allocation</label>
                  <select 
                     className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                     value={profileData.budget}
                     onChange={(e) => setProfileData({...profileData, budget: e.target.value})}
                  >
                     <option value="">Select Budget</option>
                     <option value="Under $5k">Under $5k</option>
                     <option value="$5k - $20k">$5k - $20k</option>
                     <option value="$20k - $50k">$20k - $50k</option>
                     <option value="$50k+">$50k+</option>
                     <option value="To be discussed">To be discussed</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Clock className="h-3 w-3"/> Timeline / Urgency</label>
                  <select 
                     className="w-full h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                     value={profileData.timeline}
                     onChange={(e) => setProfileData({...profileData, timeline: e.target.value})}
                  >
                     <option value="">Select Timeline</option>
                     <option value="Immediate (ASAP)">Immediate (ASAP)</option>
                     <option value="Within 1 month">Within 1 month</option>
                     <option value="1-3 months">1-3 months</option>
                     <option value="Just exploring">Just exploring</option>
                  </select>
                </div>
             </div>
          </div>
       </div>

       {/* Section 5: Upload Documents */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
             <FileText className="h-5 w-5 text-slate-400" />
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Upload Documents</h2>
          </div>
          <div className="p-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">GST / Tax Number</label>
                  <Input value={profileData.gst} onChange={e => setProfileData({...profileData, gst: e.target.value})} className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold rounded-xl" placeholder="e.g. 22AAAAA0000A1Z5" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Verification Status</label>
                  <div className="h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 flex items-center gap-2">
                     {profileData.verificationStatus === 'Verified' ? (
                       <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Verified Business</span></>
                     ) : (
                       <><ShieldCheck className="h-4 w-4 text-amber-500" /><span className="font-bold text-sm text-amber-700 dark:text-amber-400">Pending Verification</span></>
                     )}
                  </div>
                </div>
             </div>
             
             <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-white/5">
                <Lock className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <h4 className="font-black text-slate-700 dark:text-slate-300">Secure Document Upload</h4>
                <p className="text-sm font-bold text-slate-400 mt-1 mb-4">Upload incorporation certificates or tax documents to receive the Verified Badge.</p>
                <Button variant="outline" className="font-black uppercase tracking-widest text-[10px] rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A]">Select Files</Button>
             </div>
          </div>
       </div>

    </div>
  )

  const renderReadMode = () => (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 px-4 md:px-8 pt-8 animate-in fade-in duration-500">
       
       {/* Global Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
         <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Business Profile</h1>
            <p className="text-slate-500 font-bold mt-2">Manage your company profile and intent settings</p>
         </div>
         <Button 
            onClick={() => setIsEditMode(true)} 
            className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-black px-8 rounded-xl h-12 uppercase tracking-widest text-[11px] w-full md:w-auto"
         >
            Edit Profile
         </Button>
       </div>

       {/* Hero Card */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="h-28 w-28 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
             <Building2 className="h-10 w-10 text-blue-500" />
          </div>
          <div className="flex-1">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profileData.companyName || "Your Company Name"}</h2>
                   <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-1">{profileData.industry || "Add your industry"}</p>
                </div>
                {profileData.verificationStatus === 'Verified' ? (
                   <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest self-start"><CheckCircle2 className="h-3 w-3 mr-1"/> Verified</Badge>
                ) : (
                   <Badge className="bg-slate-100 text-slate-500 border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest self-start"><ShieldCheck className="h-3 w-3 mr-1"/> Unverified</Badge>
                )}
             </div>
             
             <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-slate-500">
                   <MapPin className="h-4 w-4" />
                   <span className="font-bold text-sm">{profileData.city ? `${profileData.city}, ${profileData.state}` : 'Location not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                   <Globe className="h-4 w-4" />
                   <span className="font-bold text-sm">{profileData.website || 'Website not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                   <Users className="h-4 w-4" />
                   <span className="font-bold text-sm">{profileData.teamSize}</span>
                </div>
             </div>
          </div>
       </div>

       {/* Description Card */}
       {profileData.brandName && (
         <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">About the Company</h3>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
               {profileData.brandName}
            </p>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Owner Details */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><User className="h-4 w-4"/> Account Owner</h3>
             <div className="space-y-4">
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white">{profileData.name || 'Name not set'}</p>
                   <p className="text-xs font-bold text-slate-500">{profileData.designation || 'Designation not set'}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                   <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{profileData.email || 'Email not set'}</p>
                   <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{profileData.phone || 'Phone not set'}</p>
                </div>
             </div>
          </div>

          {/* Current Intent */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Zap className="h-4 w-4"/> Current Intent</h3>
             <div className="space-y-4">
                <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                   {profileData.currentGoal || "No specific goal set currently."}
                </p>
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                   {profileData.budget && <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg">{profileData.budget}</Badge>}
                   {profileData.timeline && <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg">{profileData.timeline}</Badge>}
                </div>
             </div>
          </div>
       </div>

       {/* Offerings and Needs */}
       <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2"><Target className="h-4 w-4"/> Offerings & Needs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">What We Offer</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.offerings.length > 0 ? profileData.offerings.map((tag: string) => (
                    <Badge key={tag} className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-4 py-2 font-bold text-sm rounded-xl">
                      {tag}
                    </Badge>
                  )) : <p className="text-sm font-bold text-slate-400">No offerings listed.</p>}
                </div>
             </div>
             
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">What We Need</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.needs.length > 0 ? profileData.needs.map((tag: string) => (
                    <Badge key={tag} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-4 py-2 font-bold text-sm rounded-xl">
                      {tag}
                    </Badge>
                  )) : <p className="text-sm font-bold text-slate-400">No needs listed.</p>}
                </div>
             </div>
          </div>
       </div>

    </div>
  )

  return isEditMode ? renderEditMode() : renderReadMode();
}
