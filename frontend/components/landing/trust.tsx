"use client"

import { Star, BadgeCheck, TrendingUp } from "lucide-react"

const trustPoints = [
  {
    icon: Star,
    title: "Business Ratings",
    description: "Real reviews from businesses who've closed deals through Taplyzer.",
    stat: "4.9/5",
    statLabel: "Avg Rating",
  },
  {
    icon: BadgeCheck,
    title: "Verified Companies",
    description: "Every company is verified before they can connect with you.",
    stat: "100%",
    statLabel: "Verified",
  },
  {
    icon: TrendingUp,
    title: "Real Deal Outcomes",
    description: "Track record of businesses closing real, measurable deals.",
    stat: "$12M+",
    statLabel: "Deals Closed",
  },
]

export function Trust() {
  const scrollToTestimonials = () => {
    const element = document.getElementById("testimonials")
    if (element) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="security" className="py-24 lg:py-32 bg-white dark:bg-black relative transition-colors">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl text-balance">
            Trusted by Growing Businesses
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-white/40 font-medium">
            Join thousands of businesses already closing deals on Taplyzer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <button
              key={index}
              onClick={scrollToTestimonials}
              className="bg-slate-50 dark:bg-[#0A0A0A] rounded-3xl p-10 border border-slate-200 dark:border-white/5 text-center relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm dark:shadow-none hover:-translate-y-1 block w-full outline-none"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(3,169,244,0.1)] group-hover:scale-110 transition-transform">
                <point.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="mb-4">
                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.2)]">{point.stat}</span>
                <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] font-black mt-2">{point.statLabel}</p>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{point.title}</h3>
              <p className="text-slate-500 dark:text-white/40 font-medium text-sm leading-relaxed">{point.description}</p>
            </button>
          ))}
        </div>

        {/* Testimonial */}
        <div id="testimonials" className="mt-16 bg-slate-50 dark:bg-[#080808] rounded-3xl border border-slate-200 dark:border-white/5 p-10 lg:p-16 text-center relative group shadow-sm dark:shadow-none transition-all hover:border-primary/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <blockquote className="text-2xl lg:text-3xl text-slate-900 dark:text-white font-black max-w-4xl mx-auto leading-[1.4] tracking-tight italic">
            &quot;Taplyzer completely changed how we find new clients. Within two weeks, we closed a <span className="text-emerald-600 dark:text-emerald-400 font-black">$50K deal</span> with a company we would have never found otherwise.&quot;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-slate-200 dark:bg-zinc-900 flex items-center justify-center border border-slate-300 dark:border-white/10">
                <span className="text-primary font-black text-xl">JD</span>
              </div>
            </div>
            <div className="text-left">
              <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Jason Drake</p>
              <p className="text-[10px] text-slate-400 dark:text-white/40 font-black uppercase tracking-widest">CEO, TechFlow Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
