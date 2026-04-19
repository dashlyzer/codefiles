import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-4xl mx-auto">
        <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Legal
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
          Terms of <span className="text-primary italic">Service</span>.
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-8">
          <p className="text-lg">Effective Date: April 18, 2026</p>
          
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Taplyzer, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our platform. These terms apply to all visitors, users, and businesses who access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Platform Purpose</h2>
            <p>
              Taplyzer is a platform for business networking and deal-making. Users must provide accurate business information and act with integrity. Spam, fraud, and misrepresentation of intent are strictly prohibited and will result in immediate account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Verification Requirements</h2>
            <p>
              To maintain a high-trust environment, users must complete our verification process. We reserve the right to deny access to any individual or business that fails to meet our verification standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Limitation of Liability</h2>
            <p>
              Taplyzer provides the platform to facilitate introductions and deal-making. We are not a party to any transactions between users and are not responsible for the outcome of any business deals initiated on the platform.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}
