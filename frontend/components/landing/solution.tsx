"use client"

import { Building, Target, Search, Send, Handshake, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

const steps = [
  {
    icon: Building,
    step: "01",
    title: "Create Business Profile",
    description: "Set up your company profile with key details about your business.",
    href: "/dashboard/profile?step=1",
  },
  {
    icon: Target,
    step: "02",
    title: "Define What You OFFER",
    description: "List your products, services, and unique capabilities.",
    href: "/dashboard/profile?step=2",
  },
  {
    icon: Search,
    step: "03",
    title: "Define What You NEED",
    description: "Specify the services, partnerships, or clients you're looking for.",
    href: "/dashboard/profile?step=3",
  },
  {
    icon: Send,
    step: "04",
    title: "Get Matched",
    description: "Taplyzer's AI finds businesses that match your intent.",
    href: "/dashboard/matches",
  },
  {
    icon: Handshake,
    step: "05",
    title: "Close Deals",
    description: "Request introductions and start closing real business deals.",
    href: "#security", // Testimonials
  },
]

export function Solution() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const handleStepClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1))
      if (element) {
        const offset = 80
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = element.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        })
      }
      return
    }

    if (isLoggedIn || href.includes("profile")) {
      router.push(href)
    } else {
      router.push("/auth?mode=signup")
    }
  }

  return (
    <section id="intent-engine" className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden transition-colors">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      
      <div id="how-it-works" className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black mb-6 uppercase tracking-widest">
            <CheckCircle2 className="h-4 w-4" />
            The Solution
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl text-balance leading-tight">
            Introducing <br className="hidden sm:block" /> Intent-Based Networking
          </h2>
          <p className="mt-6 text-lg text-slate-500 dark:text-white/50 font-medium">
            Connect with businesses that actually need what you offer, and vice versa.
          </p>
        </div>

        {/* Steps flow */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -translate-y-1/2 opacity-30 dark:opacity-100" />
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <button 
                  onClick={() => handleStepClick(step.href)}
                  className="bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-3xl p-7 h-full hover:border-blue-500/30 transition-all hover:-translate-y-2 group backdrop-blur-sm shadow-sm dark:shadow-none text-left w-full outline-none"
                >
                  {/* Step number */}
                  <div className="absolute -top-3 left-7">
                    <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(3,169,244,0.3)]">
                      {step.step}
                    </span>
                  </div>
                  
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors mt-2">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-white/40 font-medium leading-relaxed">{step.description}</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visual flow diagram for mobile */}
        <div className="mt-16 lg:hidden">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-muted-foreground flex-wrap font-bold uppercase tracking-widest">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Business</span>
            <span className="text-primary/40">→</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Intent</span>
            <span className="text-primary/40">→</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Match</span>
            <span className="text-primary/40">→</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Intro</span>
            <span className="text-primary/40">→</span>
            <span className="bg-primary text-white px-3 py-1 rounded-full font-black">Deal</span>
          </div>
        </div>
      </div>
    </section>
  )
}
