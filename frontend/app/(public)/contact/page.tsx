"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Globe, Phone, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Get in Touch
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            Let's Talk <span className="text-primary italic">Strategy</span>.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Have questions about the platform, partnership opportunities, or enterprise solutions? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight italic">Our Details</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Email Us</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">hello@taplyzer.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Live Chat</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Available Mon-Fri, 9am-6pm EST</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Headquarters</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">New York, NY / Remote First</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10">
             <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input type="email" placeholder="john@company.com" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 ring-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <select className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 ring-primary">
                    <option>Sales Inquiry</option>
                    <option>Partnerships</option>
                    <option>Technical Support</option>
                    <option>Press</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea rows={5} placeholder="How can we help?" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 ring-primary resize-none" />
                </div>
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl uppercase tracking-widest text-xs group">
                  Send Message
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
             </form>
          </div>
        </div>
      </section>
    </div>
  )
}
