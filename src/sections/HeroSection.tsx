import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router'
import ParticleField from '../components/ParticleField'

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-bg-primary">
      <ParticleField />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <span className="inline-block text-[11px] font-medium uppercase tracking-[0.12em] text-accent-cyan border border-[rgba(0,212,255,0.3)] rounded-full px-4 py-1.5 bg-[rgba(0,212,255,0.05)]">
            Website Advertising Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(48px,10vw,112px)] leading-[1.0] tracking-[-0.03em] text-white mb-2"
        >
          Forge Ads
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(48px,10vw,112px)] leading-[1.0] tracking-[-0.03em] text-gradient-cyan-purple mb-8"
        >
          That Convert
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-lg text-text-secondary max-w-[560px] mx-auto mb-10 leading-relaxed"
        >
          Turn any website into a stunning advertisement. Generate clickable ad previews, export shareable links, and drive traffic in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/create"
            className="gradient-cyan-purple text-white font-semibold px-8 py-3.5 rounded-full hover:brightness-110 hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Create an Ad
          </Link>
          <Link
            to="/showcase"
            className="border border-[rgba(255,255,255,0.15)] text-white font-medium px-8 py-3.5 rounded-full hover:border-accent-cyan hover:text-accent-cyan transition-all duration-300"
          >
            View Showcase &rarr;
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 animate-pulse-opacity">
            <span className="text-xs text-text-muted uppercase tracking-[0.08em]">Scroll to explore</span>
            <ChevronDown size={20} className="text-text-muted" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
