import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-4xl mx-auto">
        <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Legal
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
          Privacy <span className="text-primary italic">Policy</span>.
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-8">
          <p className="text-lg">Last Updated: April 18, 2026</p>
          
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, post an intent, or communicate with other users. This includes your business identity, verified contact details, and strategic intent data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p>
              Your information is primarily used to power our Intent Engine and facilitate matchmaking. We do not sell your personal or business data to third parties. Data is used solely to improve match accuracy and ensure platform security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Data Sovereignty</h2>
            <p>
              You maintain full control over your business data. Detailed intents are only revealed to matched parties after a mutual introduction request is accepted. You can delete your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Security Measures</h2>
            <p>
              We implement industry-standard encryption and security protocols to protect your data. This includes multi-factor authentication, end-to-end encryption for sensitive communications, and regular security audits.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}
