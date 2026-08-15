import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink } from 'lucide-react'
import { websites } from '../data/websites'

gsap.registerPlugin(ScrollTrigger)

export default function ShowcasePinned() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile || !sectionRef.current || !containerRef.current) return

    const section = sectionRef.current
    const container = containerRef.current
    const cards = container.querySelectorAll<HTMLDivElement>('.showcase-card')
    const progressBar = progressRef.current
    const header = headerRef.current

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          onUpdate: (self: { progress: number }) => {
            if (progressBar) {
              progressBar.style.transform = `scaleX(${self.progress})`
            }
            if (header) {
              header.style.opacity = `${Math.max(0, 1 - self.progress * 10)}`
              header.style.transform = `translateY(${-self.progress * 50}px)`
            }
          },
        },
      })

      cards.forEach((card, i) => {
        if (i === 0) {
          tl.set(card, { x: 0, opacity: 1, scale: 1, zIndex: 10 })
        } else {
          tl.fromTo(
            card,
            { x: '100vw', opacity: 0, scale: 0.95, zIndex: 10 + i },
            { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'none' },
            i * 1
          )
        }

        if (i > 0) {
          tl.to(
            cards[i - 1],
            { x: -60, opacity: 0.4, scale: 0.92, zIndex: 10 + i - 1, duration: 0.5, ease: 'none' },
            i * 1 + 0.5
          )
        }
      })
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  if (isMobile) {
    return (
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent-cyan block mb-4">
              Featured Websites
            </span>
            <h2 className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(32px,6vw,56px)] leading-[1.05] tracking-[-0.02em] text-white mb-4">
              Ads That <span className="text-gradient-cyan-purple">Open Doors</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Click any card to visit the live website. Each ad is crafted to capture the essence of the platform.
            </p>
          </div>
          <div className="space-y-8">
            {websites.map((ad, i) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
                className="glass-card rounded-[20px] overflow-hidden hover:border-glass-border-hover hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer"
                onClick={() => window.open(ad.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={ad.previewImage} alt={ad.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,8,0.8)] via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <span className="inline-flex items-center gap-1.5 glass-card px-4 py-2 rounded-full text-xs font-medium text-white border border-[rgba(0,212,255,0.3)]">
                      <ExternalLink size={12} />
                      Open Site
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-family-display)] font-bold text-xl text-white mb-2">
                    {ad.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{ad.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {ad.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-medium uppercase tracking-[0.08em] text-accent-cyan bg-[rgba(0,212,255,0.08)] px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative bg-bg-secondary overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)',
        }}
      />

      <div ref={containerRef} className="relative h-[100dvh] flex items-center justify-center">
        <div ref={headerRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-0">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent-cyan block mb-4">
            Featured Websites
          </span>
          <h2 className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-white mb-2">
            Ads That
          </h2>
          <h2 className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-gradient-cyan-purple mb-6">
            Open Doors
          </h2>
          <p className="text-text-secondary max-w-lg">
            Click any card to visit the live website. Each ad is crafted to capture the essence of the platform.
          </p>
        </div>

        {websites.map((ad, i) => (
          <div
            key={ad.id}
            className="showcase-card absolute w-[90%] max-w-[700px] glass-card rounded-[20px] overflow-hidden cursor-pointer hover:border-glass-border-hover hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300"
            style={{ opacity: i === 0 ? 1 : 0 }}
            onClick={() => window.open(ad.url, '_blank', 'noopener,noreferrer')}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={ad.previewImage}
                alt={ad.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,8,0.8)] via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-1.5 glass-card px-4 py-2 rounded-full text-xs font-medium text-white border border-[rgba(0,212,255,0.3)]">
                  <ExternalLink size={12} />
                  Open Site
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-[family-name:var(--font-family-display)] font-bold text-xl text-white mb-2">
                {ad.name}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{ad.description}</p>
              <div className="flex flex-wrap gap-2">
                {ad.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium uppercase tracking-[0.08em] text-accent-cyan bg-[rgba(0,212,255,0.08)] px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-6 right-6 z-20">
          <div className="w-full h-[3px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full gradient-cyan-purple origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
