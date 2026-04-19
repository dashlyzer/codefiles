import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Solution } from "@/components/landing/solution"
import { HowItWorks } from "@/components/landing/how-it-works-section"
import { MatchPreview } from "@/components/landing/match-preview"
import { IntentFeed } from "@/components/landing/intent-feed"
import { Features } from "@/components/landing/features"
import { DealFlow } from "@/components/landing/deal-flow"
import { Trust } from "@/components/landing/trust"
import { Testimonials } from "@/components/landing/testimonials"
import { CTA } from "@/components/landing/cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <MatchPreview />
      <IntentFeed />
      <Features />
      <DealFlow />
      <Trust />
      <Testimonials />
      <CTA />
    </main>
  )
}
