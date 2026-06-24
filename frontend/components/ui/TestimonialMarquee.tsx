import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"
import { getTestimonials } from "@/lib/api"
import { getMediaUrl } from "@/lib/utils"
import type { Testimonial } from "@/types"

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: -1,
    name: "Sarah Chen",
    username: "@sarahc_fintech",
    body: "Phantex Tech transformed our data collection process. Their scrapers are rock-solid and handle our high-volume requirements without breaking. A total game-changer for our market analysis.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    order: 0
  },
  {
    id: -2,
    name: "Marcus Thorne",
    username: "@mthorne_saas",
    body: "The AI pipelines Phantex Tech built for us have automated 90% of our lead qualification. The integration was seamless, and the performance is incredible. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    order: 1
  },
  {
    id: -3,
    name: "Elena Rodriguez",
    username: "@elena_dev_lead",
    body: "Finally, a team that understands the complexity of modern web automation. They navigate anti-bot measures like pros. Our engineering team can finally focus on product instead of maintenance.",
    avatar: "https://i.pravatar.cc/150?u=elena",
    order: 2
  },
  {
    id: -4,
    name: "Dr. Aris Varma",
    username: "@arisv_biotech",
    body: "The precision of the data extraction tool Phantex Tech developed for our research is unmatched. Their expertise in Python and Playwright is evident in every line of code.",
    avatar: "https://i.pravatar.cc/150?u=aris",
    order: 3
  },
  {
    id: -5,
    name: "Jessica Low",
    username: "@jesslow_ops",
    body: "Working with Phantex Tech was the best decision we made this year. They didn't just build a tool; they provided a strategic automation partner that scales with our growth.",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    order: 4
  },
  {
    id: -6,
    name: "David Park",
    username: "@dpark_growth",
    body: "The speed and reliability of their browser automation scripts are impressive. We've seen a 4x increase in our data processing speed since implementation. Professional and highly skilled.",
    avatar: "https://i.pravatar.cc/150?u=david",
    order: 5
  },
  {
    id: -7,
    name: "Sophia Moretti",
    username: "@sophia_founder",
    body: "Phantex Tech delivered a custom AI solution that literally saved us hundreds of man-hours a month. Their communication is top-notch, and the delivery was on schedule.",
    avatar: "https://i.pravatar.cc/150?u=sophia",
    order: 6
  },
  {
    id: -8,
    name: "Alex Rivera",
    username: "@arivera_cto",
    body: "I've worked with many scraping agencies, but Phantex Tech is in a league of their own. Their code is clean, documented, and exceptionally performant. They truly are the experts.",
    avatar: "https://i.pravatar.cc/150?u=alex",
    order: 7
  }
]

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const avatarUrl = getMediaUrl(testimonial.avatar)
  
  return (
    <figure
      className={cn(
        "relative w-80 h-full cursor-pointer overflow-hidden p-8 transition-all duration-300",
        "bg-white dark:bg-stone-900/50 backdrop-blur-sm",
        "border border-amber-100 dark:border-white/10",
        "hover:border-amber-400/50 dark:hover:border-amber-500/30 shadow-sm hover:shadow-xl",
        "rounded-[2rem]"
      )}
    >
      <div className="flex flex-row items-center gap-4 mb-6">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-amber-100 dark:border-white/10 shadow-inner">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={testimonial.name} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center font-bold text-amber-700">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">
            {testimonial.name}
          </figcaption>
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
            {testimonial.username}
          </p>
        </div>
      </div>
      <blockquote className="text-sm leading-relaxed text-stone-600 dark:text-stone-300 italic font-medium">
        "{testimonial.body}"
      </blockquote>
    </figure>
  )
}

export default async function TestimonialMarquee() {
  let testimonials: Testimonial[] = []
  try {
    testimonials = await getTestimonials()
  } catch (error) {
    console.error("Failed to fetch testimonials, using fallbacks:", error)
  }

  // Use fallback data if API returns nothing
  const data = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS

  const firstRow = data.slice(0, Math.ceil(data.length / 2))
  const secondRow = data.slice(Math.ceil(data.length / 2))

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-2">
      <Marquee pauseOnHover className="[--duration:50s] [--gap:2rem]">
        {firstRow.map((review) => (
          <ReviewCard key={review.id} testimonial={review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:55s] [--gap:2rem] mt-8">
        {secondRow.map((review) => (
          <ReviewCard key={review.id} testimonial={review} />
        ))}
      </Marquee>
      
      {/* Gradients to fade edges - theme aware */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10"></div>
    </div>
  )
}
