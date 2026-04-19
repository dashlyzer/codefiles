import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for exploring the platform and understanding intent mapping.",
    features: ["Basic Intent Posting", "Public Intent Feed View", "Identity Verification", "3 Intro Requests / month"],
    cta: "Start for Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$99",
    description: "For active businesses looking to close mid-market deals consistently.",
    features: ["Advanced Intent Engine", "Unlimited Intro Requests", "Priority Support", "Basic Analytics", "Verified Trust Badge"],
    cta: "Get Pro Now",
    popular: true
  },
  {
    name: "Premium",
    price: "$499",
    description: "Enterprise-grade tools for high-volume deal makers and M&A firms.",
    features: ["Dedicated Account Manager", "White-glove Verification", "Custom API Access", "Advanced Deal Flow Analytics", "Unlimited Everything"],
    cta: "Contact Sales",
    popular: false
  }
]

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Investment Plans
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            Simple, <span className="text-primary italic">Transparent</span> Pricing.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Choose the plan that fits your deal-making volume. No hidden fees, just value.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col ${plan.popular ? 'ring-2 ring-primary shadow-2xl' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-slate-500 dark:text-white/40 font-bold text-sm">/mo</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10 min-h-[40px]">
                {plan.description}
              </p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <Check className="h-5 w-5 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/auth?mode=signup">
                <Button className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 ${plan.popular ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-900 dark:bg-white text-white dark:text-black'}`}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
