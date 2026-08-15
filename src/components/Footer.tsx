import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Footer() {
  const { ref, inView } = useScrollReveal(0.1)

  const linkGroups = [
    {
      title: 'Platform',
      links: [
        { to: '/showcase', label: 'Showcase' },
        { to: '/create', label: 'Create' },
        { to: '/', label: 'Home' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { to: '/', label: 'Docs' },
        { to: '/', label: 'Blog' },
        { to: '/', label: 'Support' },
      ],
    },
  ]

  return (
    <footer className="bg-bg-primary border-t border-[rgba(255,255,255,0.06)]">
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          <div>
            <Link
              to="/"
              className="font-[family-name:var(--font-family-display)] font-bold text-xl text-white"
            >
              AdForge
            </Link>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Turn any website into a stunning advertisement. Generate, customize, and share in minutes.
            </p>
          </div>

          {linkGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (gi + 1) * 0.08 }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted mb-4">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted mb-4">
              Get Started
            </h4>
            <Link
              to="/create"
              className="inline-block gradient-cyan-purple text-white text-sm font-semibold px-6 py-3 rounded-full hover:brightness-110 hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Creating
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} AdForge. All rights reserved.
          </p>
          <span className="text-xs text-text-muted">
            Made with AdForge
          </span>
        </motion.div>
      </div>
    </footer>
  )
}
