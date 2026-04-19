import { Badge } from "@/components/ui/badge"

export default function CookiePolicyPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-4xl mx-auto">
        <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          Legal
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
          Cookie <span className="text-primary italic">Policy</span>.
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-8">
          <p className="text-lg">Last Updated: April 18, 2026</p>
          
          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences, keep you logged in, and understand how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. How We Use Cookies</h2>
            <p>
              We use essential cookies to maintain your session and ensure platform security. We also use analytical cookies to understand user behavior and improve our matchmaking algorithms. We do not use third-party tracking cookies for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential:</strong> Required for account login and basic platform functionality.</li>
              <li><strong>Functional:</strong> Remember your preferences and dashboard settings.</li>
              <li><strong>Analytical:</strong> Help us measure platform performance and match accuracy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Managing Cookies</h2>
            <p>
              You can manage your cookie preferences through your browser settings. Note that disabling essential cookies may impact your ability to use the Taplyzer platform effectively.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}
