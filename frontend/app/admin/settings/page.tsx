"use client"

import { useState } from "react"
import { Settings, Shield, Tag, Ban, Sliders, CheckCircle2, AlertTriangle } from "lucide-react"

// Platform settings — in production, these would be stored in a DB Settings collection.
// For now, we manage state locally with clear "save" actions for each panel.

const defaultSettings = {
  matchScoreThreshold: 50,
  maintenanceMode: false,
  maxRequestsPerDay: 10,
  allowGuestExplore: true,
  minProfileScoreForMatching: 30,
  bannedKeywords: ["scam", "fake", "fraud", "spam"],
  featuredIndustries: ["Tech", "Finance", "Healthcare", "Manufacturing", "Retail"],
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${value ? "bg-red-600" : "bg-slate-200 dark:bg-white/10"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-y-0.5 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  )
}

function SavedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 className="h-3 w-3" /> Saved
    </span>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [savedPanel, setSavedPanel] = useState<string | null>(null)
  const [newKeyword, setNewKeyword] = useState("")
  const [newIndustry, setNewIndustry] = useState("")

  function markSaved(panel: string) {
    setSavedPanel(panel)
    setTimeout(() => setSavedPanel(null), 2500)
  }

  function removeKeyword(kw: string) {
    setSettings(s => ({ ...s, bannedKeywords: s.bannedKeywords.filter(k => k !== kw) }))
  }

  function addKeyword() {
    const kw = newKeyword.trim().toLowerCase()
    if (kw && !settings.bannedKeywords.includes(kw)) {
      setSettings(s => ({ ...s, bannedKeywords: [...s.bannedKeywords, kw] }))
      setNewKeyword("")
    }
  }

  function removeIndustry(ind: string) {
    setSettings(s => ({ ...s, featuredIndustries: s.featuredIndustries.filter(i => i !== ind) }))
  }

  function addIndustry() {
    const ind = newIndustry.trim()
    if (ind && !settings.featuredIndustries.includes(ind)) {
      setSettings(s => ({ ...s, featuredIndustries: [...s.featuredIndustries, ind] }))
      setNewIndustry("")
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Manage platform behavior, matching rules, industries, and content policy.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Controls */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-red-500" />
                <p className="text-sm font-black text-slate-900 dark:text-white">Platform Controls</p>
              </div>
              {savedPanel === "controls" && <SavedBadge />}
            </div>
          </div>
          <div className="p-6 space-y-5">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white/80">Maintenance Mode</p>
                <p className="text-xs text-slate-400 dark:text-white/30">Block all user access — admin only</p>
              </div>
              <div className="flex items-center gap-2">
                {settings.maintenanceMode && (
                  <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> LIVE
                  </span>
                )}
                <Toggle value={settings.maintenanceMode} onChange={(v) => setSettings(s => ({ ...s, maintenanceMode: v }))} />
              </div>
            </div>

            {/* Guest Explore */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white/80">Guest Explore Access</p>
                <p className="text-xs text-slate-400 dark:text-white/30">Allow non-logged-in users to search</p>
              </div>
              <Toggle value={settings.allowGuestExplore} onChange={(v) => setSettings(s => ({ ...s, allowGuestExplore: v }))} />
            </div>

            {/* Match Score Threshold */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white/80">Match Score Threshold</p>
                  <p className="text-xs text-slate-400 dark:text-white/30">Min score to show a match result</p>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{settings.matchScoreThreshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.matchScoreThreshold}
                onChange={(e) => setSettings(s => ({ ...s, matchScoreThreshold: Number(e.target.value) }))}
                className="w-full accent-red-600"
              />
            </div>

            {/* Min Profile Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white/80">Min Profile Score for Matching</p>
                  <p className="text-xs text-slate-400 dark:text-white/30">Users below this are excluded</p>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{settings.minProfileScoreForMatching}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.minProfileScoreForMatching}
                onChange={(e) => setSettings(s => ({ ...s, minProfileScoreForMatching: Number(e.target.value) }))}
                className="w-full accent-red-600"
              />
            </div>

            {/* Max Requests Per Day */}
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white/80 mb-1">Max Requests Per User / Day</p>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxRequestsPerDay}
                onChange={(e) => setSettings(s => ({ ...s, maxRequestsPerDay: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>

            <button
              onClick={() => markSaved("controls")}
              className="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700 transition-colors shadow-[0_0_10px_rgba(220,38,38,0.2)]"
            >
              Save Controls
            </button>
          </div>
        </div>

        {/* Banned Keywords */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                <p className="text-sm font-black text-slate-900 dark:text-white">Banned Keywords</p>
              </div>
              {savedPanel === "keywords" && <SavedBadge />}
            </div>
            <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">Blocked in messages, profiles, and biz names</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.bannedKeywords.map((kw) => (
                <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-xs font-bold text-red-700 dark:text-red-400">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                placeholder="Add keyword…"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
              <button onClick={addKeyword} className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition-colors">Add</button>
            </div>
            <button
              onClick={() => markSaved("keywords")}
              className="w-full py-2 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700 transition-colors shadow-[0_0_10px_rgba(220,38,38,0.2)]"
            >
              Save Keywords
            </button>
          </div>
        </div>

        {/* Featured Industries */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-black text-slate-900 dark:text-white">Featured Industries</p>
              </div>
              {savedPanel === "industries" && <SavedBadge />}
            </div>
            <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">Shown first in Explore filters</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.featuredIndustries.map((ind) => (
                <span key={ind} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-xs font-bold text-blue-700 dark:text-blue-400">
                  {ind}
                  <button onClick={() => removeIndustry(ind)} className="text-blue-400 hover:text-blue-600 transition-colors ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIndustry()}
                placeholder="Add industry…"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
              <button onClick={addIndustry} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-colors">Add</button>
            </div>
            <button
              onClick={() => markSaved("industries")}
              className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-colors"
            >
              Save Industries
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-black text-slate-900 dark:text-white">System Info</p>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: "Environment", value: "Production" },
              { label: "Auth Provider", value: "JWT / NextAuth" },
              { label: "Database", value: "MongoDB Atlas" },
              { label: "Storage", value: "Cloudinary" },
              { label: "Calendar", value: "Google Meet API (Platform)" },
              { label: "Platform Version", value: "2.0.0" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                <span className="text-xs font-bold text-slate-400 dark:text-white/30">{row.label}</span>
                <span className="text-xs font-black text-slate-800 dark:text-white/80">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
