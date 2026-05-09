"use client"

import { useEffect, useState } from "react"
import { Bell, Send, Users, CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Notification {
  id: string
  title: string
  message: string
  audience: string
  adminName: string
  sentAt: string
  status: string
}

const audienceColors: Record<string, string> = {
  All: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PRO: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  FREE: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40",
}

export default function AdminNotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ title: "", message: "", audience: "All" })

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/admin/notifications")
      const data = await res.json()
      setNotifications(data.notifications || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchNotifications() }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.message.trim()) return
    setSending(true)
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, adminName: user?.name || "Admin" }),
      })
      setSent(true)
      setForm({ title: "", message: "", audience: "All" })
      await fetchNotifications()
      setTimeout(() => setSent(false), 3000)
    } catch (e) { console.error(e) }
    finally { setSending(false) }
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h1>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1">Broadcast in-app announcements and alerts to platform users.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Compose Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Compose</p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">New Broadcast</h3>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Announcement title…"
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Your message to users…"
                  required
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm(f => ({ ...f, audience: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
                >
                  <option value="All">All Users</option>
                  <option value="PRO">PRO subscribers only</option>
                  <option value="FREE">FREE plan only</option>
                </select>
              </div>

              {/* Target preview */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5">
                <Users className="h-4 w-4 text-slate-400 dark:text-white/30" />
                <span className="text-xs font-bold text-slate-500 dark:text-white/40">
                  Sending to: <span className="text-slate-900 dark:text-white">{form.audience === "All" ? "All platform users" : `${form.audience} plan users`}</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-black transition-all shadow-[0_0_15px_rgba(220,38,38,0.25)] disabled:opacity-60"
              >
                {sending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                ) : sent ? (
                  <><CheckCircle2 className="h-4 w-4" /> Sent!</>
                ) : (
                  <><Send className="h-4 w-4" /> Broadcast</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sent History */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">History</p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Sent Notifications</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-5 animate-pulse">
                    <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full" />
                  </div>
                ))
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="h-8 w-8 text-slate-200 dark:text-white/10 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400 dark:text-white/30">No notifications sent yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-5 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate">{n.title}</p>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black ${audienceColors[n.audience] || audienceColors.All}`}>
                            {n.audience}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-white/40 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 dark:text-white/20 mt-2 font-bold">
                          By {n.adminName} · {new Date(n.sentAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
