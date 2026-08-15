import { motion } from 'framer-motion'
import { Eye, ExternalLink, Share2 } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const features = [
  {
    icon: Eye,
    iconColor: '#00D4FF',
    borderColor: 'rgba(0,212,255,0.1)',
    borderHover: 'rgba(0,212,255,0.25)',
    title: 'Instant Preview',
    description:
      'Paste any URL and watch AdForge automatically generate a polished ad preview with the site\'s colors, typography, and mood.',
  },
  {
    icon: ExternalLink,
    iconColor: '#9D4EDD',
    borderColor: 'rgba(157,78,221,0.1)',
    borderHover: 'rgba(157,78,221,0.25)',
    title: 'Clickable Links',
    description:
      'Every ad card includes a live link to the original website. Your audience clicks once and lands directly on the advertised page.',
  },
  {
    icon: Share2,
    iconColor: '#FF006E',
    borderColor: 'rgba(255,0,110,0.1)',
    borderHover: 'rgba(255,0,110,0.25)',
    title: 'Export & Share',
    description:
      'Download your ad as an image, copy a shareable link, or embed it directly on your own website with a single snippet.',
  },
]

export default function FeaturesGrid() {
  const { ref: headerRef, inView: headerInView } = useScrollReveal(0.2)
  const { ref: gridRef, inView: gridInView } = useScrollReveal(0.15)

  return (
    <section className="relative py-24 md:py-36 bg-bg-primary overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-[640px] mx-auto mb-16"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent-cyan block mb-4">
            Why AdForge
          </span>
          <h2 className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-white mb-2">
            Everything You
          </h2>
          <h2 className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-gradient-cyan-purple mb-6">
            Need to Advertise
          </h2>
          <p className="text-lg text-text-secondary">
            Generate, customize, and share website ads with zero design experience.
          </p>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.15,
              }}
              whileHover={{ y: -4 }}
              className="group p-8 rounded-[20px] border transition-all duration-300 cursor-default"
              style={{ borderColor: feature.borderColor }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = feature.borderHover
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = feature.borderColor
              }}
            >
              <feature.icon size={32} style={{ color: feature.iconColor }} className="mb-5" />
              <h3 className="font-[family-name:var(--font-family-display)] font-bold text-xl text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
