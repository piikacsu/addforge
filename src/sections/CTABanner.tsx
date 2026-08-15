import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface CTABannerProps {
  title: string
  subtitle: string
  buttonText: string
  buttonTo: string
}

export default function CTABanner({ title, subtitle, buttonText, buttonTo }: CTABannerProps) {
  const { ref, inView } = useScrollReveal(0.2)

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <div ref={ref} className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[28px] p-10 md:p-16 text-center overflow-hidden"
          style={{ background: '#111118' }}
        >
          <div
            className="absolute inset-0 rounded-[28px] p-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(157,78,221,0.2), rgba(255,0,110,0.1))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(28px,4vw,48px)] leading-[1.1] text-white mb-4 relative z-10"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-secondary max-w-[520px] mx-auto mb-8 relative z-10"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to={buttonTo}
              className="inline-block gradient-cyan-purple text-white font-semibold px-10 py-4 rounded-full hover:brightness-110 hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] relative z-10"
            >
              {buttonText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
