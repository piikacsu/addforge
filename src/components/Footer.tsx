import { Github, Twitter } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

/* Simple Discord icon since lucide doesn't have one */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const platformLinks = [
  { label: 'Showcase', href: '/showcase' },
  { label: 'Create', href: '/create' },
  { label: 'Comments', href: '/comments' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Insights', href: '/insights' },
];

const resourceLinks = [
  { label: 'Docs', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Support', href: '#' },
];

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: DiscordIcon, href: '#', label: 'Discord' },
];

export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#00D4FF] via-[#9D4EDD] to-[#FF006E]" />

      <div className="bg-[#0A0A12]/80 backdrop-blur-xl border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Column 1: Logo + tagline */}
            <div className="space-y-4">
              <a href="/" className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#9D4EDD]">
                  <span className="text-white font-bold text-sm font-['Space_Grotesk']">A</span>
                </div>
                <span className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  AdForge
                </span>
              </a>
              <p className="text-sm text-white/40 leading-relaxed max-w-[260px]">
                Turn any website into a stunning advertisement. AI-powered creative generation for modern marketers.
              </p>
            </div>

            {/* Column 2: Platform */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Platform
              </h3>
              <ul className="space-y-2.5">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-[#00D4FF] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-[#00D4FF] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Newsletter
              </h3>
              <p className="text-sm text-white/40">
                Get the latest updates on new features and ad templates.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; 2026 AdForge. All rights reserved.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-[#00D4FF]/30 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <p className="text-xs text-white/30">
              Made with <span className="text-orange-400">&#x1F525;</span> by AdForge
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
