import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

const posts = [
  {
    title: "How Intent Engine is Revolutionizing M&A",
    excerpt: "Discover the technology behind Taplyzer's proprietary matching algorithm and why it's faster than traditional methods.",
    date: "April 15, 2026",
    author: "James Wilson",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The Future of Strategic Partnerships in SaaS",
    excerpt: "Why deep integration is becoming the new standard for software companies looking to scale in 2026.",
    date: "April 10, 2026",
    author: "Sarah Chen",
    category: "Business",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Building Trust in a Decentralized Marketplace",
    excerpt: "How verification and identity management create a safe environment for high-value business transactions.",
    date: "April 5, 2026",
    author: "Robert Miller",
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
  }
]

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Insights
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
            The <span className="text-primary italic">Deal Flow</span> Blog.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Strategic advice, technology deep-dives, and platform updates for the modern deal maker.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <article key={i} className="group cursor-pointer">
              <div className="aspect-[16/9] rounded-[2rem] overflow-hidden mb-6 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-6 left-6 bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white border-none font-black text-[10px] uppercase tracking-widest">
                  {post.category}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</div>
                <div className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
