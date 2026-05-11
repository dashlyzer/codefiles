"use client"

import { Settings, Save } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { SectionCard } from "@/components/admin/SectionCard"
import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 pb-20">
      <AdminPageHeader title="System Settings" subtitle="Global platform configuration." />
      
      <ModulePlaceholder
        title="Settings API Migration"
        description="Global system settings are being migrated to the unified config API. Please use environment variables in the meantime."
        status="internal"
      />

      {/* Static Mockup for future implementation */}
      <div className="opacity-50 pointer-events-none mt-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <SectionCard title="Match Algorithm Tuning">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Industry Weight</label>
                <input type="range" className="w-full" disabled />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Goal Alignment Weight</label>
                <input type="range" className="w-full" disabled />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Trust Score Minimum</label>
                <input type="number" className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10" disabled placeholder="40" />
              </div>
            </div>
          </SectionCard>
          
          <SectionCard title="Platform Controls">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Auto-Approve Verifications</p>
                  <p className="text-[10px] font-bold text-slate-400">If AI trust score &gt; 90</p>
                </div>
                <div className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Maintenance Mode</p>
                  <p className="text-[10px] font-bold text-slate-400">Block all non-admin logins</p>
                </div>
                <div className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full" />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
