import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles, Code2, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const themeLabels: Record<string, string> = {
  dark: 'Dark',
  light: 'Light',
  matrix: 'Matrix',
  rainbow: 'Rainbow',
};

const themeIcons: Record<string, React.ReactNode> = {
  dark: <Moon className="w-4 h-4" />,
  light: <Sun className="w-4 h-4" />,
  matrix: <Code2 className="w-4 h-4" />,
  rainbow: <Sparkles className="w-4 h-4" />,
};

export function Navbar() {
  const { theme, toggleTheme, unlockMatrix, unlockRainbow } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const availableThemes = [
    'dark',
    'light',
    ...(unlockMatrix ? ['matrix'] : []),
    ...(unlockRainbow ? ['rainbow'] : []),
  ] as const;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white/70 border-gray-200/60 backdrop-blur-xl'
          : theme === 'matrix'
          ? 'bg-black/80 border-green-500/20 backdrop-blur-xl'
          : theme === 'rainbow'
          ? 'bg-[#0A0A12]/80 border-white/10 backdrop-blur-xl'
          : 'bg-[#0A0A12]/70 border-white/10 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#9D4EDD]">
              <span className="text-white font-bold text-sm font-['Space_Grotesk']">A</span>
            </div>
            <span
              className={`text-lg font-bold font-['Space_Grotesk'] transition-colors duration-300 ${
                theme === 'light' ? 'text-[#0A0A12]' : 'text-white'
              }`}
            >
              AdForge
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { to: '/', label: 'Home' },
              { to: '/showcase', label: 'Showcase' },
              { to: '/create', label: 'Create' },
              { to: '/comments', label: 'Comments' },
              { to: '/leaderboard', label: 'Leaderboard' },
              { to: '/insights', label: 'Insights' },
            ].map((item) => (
              <a
                key={item.to}
                href={item.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  theme === 'light'
                    ? 'text-[#6B7280] hover:text-[#0A0A12]'
                    : theme === 'matrix'
                    ? 'text-green-400/70 hover:text-green-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side: Theme toggle + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 border ${
                  theme === 'light'
                    ? 'bg-gray-100 border-gray-200 text-[#0A0A12] hover:bg-gray-200'
                    : theme === 'matrix'
                    ? 'bg-green-900/30 border-green-500/30 text-green-400 hover:bg-green-900/50'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5"
                  >
                    {themeIcons[theme]}
                    <span className="hidden sm:inline">{themeLabels[theme]}</span>
                  </motion.span>
                </AnimatePresence>
                {/* Small dot indicator for available extra themes */}
                {(unlockMatrix || unlockRainbow) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#FF006E]" />
                )}
              </motion.button>

              {/* Theme picker dropdown (shows on hover/focus for direct selection) */}
              {availableThemes.length > 2 && (
                <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" />
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden rounded-lg p-2 transition-colors ${
                theme === 'light'
                  ? 'text-[#0A0A12] hover:bg-gray-100'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`md:hidden overflow-hidden border-t ${
              theme === 'light'
                ? 'bg-white/90 border-gray-200/60 backdrop-blur-xl'
                : 'bg-[#0A0A12]/90 border-white/10 backdrop-blur-xl'
            }`}
          >
            <div className="px-4 py-3 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/showcase', label: 'Showcase' },
                { to: '/create', label: 'Create' },
                { to: '/comments', label: 'Comments' },
                { to: '/leaderboard', label: 'Leaderboard' },
                { to: '/insights', label: 'Insights' },
              ].map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'text-[#6B7280] hover:text-[#0A0A12] hover:bg-gray-100'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
