import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowUpRight } from "lucide-react"

const jobs = [
  {
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "Remote / New York",
    type: "Full-time"
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "M&A Strategy Lead",
    department: "Business",
    location: "London",
    type: "Full-time"
  },
  {
    title: "Head of Security",
    department: "Security",
    location: "Remote / Singapore",
    type: "Full-time"
  }
]

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Join the Mission
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            Build the future of <span className="text-primary italic">Deal Flow</span>.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            We're looking for high-impact individuals to help us build the world's first intent-based networking platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          <div className="p-12 rounded-[3rem] bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-black mb-6 italic tracking-tight">Our Culture</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                We are a small, fast-moving team that values intent, transparency, and high-quality execution. We believe in autonomy and building tools that actually matter.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="block text-3xl font-black mb-1">100%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Remote Friendly</span>
              </div>
              <div>
                <span className="block text-3xl font-black mb-1">Equity</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Owners Mentality</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{job.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
