import { useState } from 'react';
import { Link, useLocation } from 'react-router';
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

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/showcase', label: 'Showcase' },
  { to: '/create', label: 'Create' },
  { to: '/comments', label: 'Comments' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/insights', label: 'Insights' },
  { to: '/install', label: 'Install App' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-9 h-9 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/icon-512x512.png"
                alt="AdForge"
                className="w-9 h-9 rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`text-[20px] font-bold font-['Space_Grotesk'] tracking-tight transition-all duration-300 ${
                theme === 'light' ? 'text-[#0A0A12]' : 'bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent'
              }`}>
                AdForge
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-cyan-400/70 -mt-0.5">
                Ad Builder
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? theme === 'light'
                        ? 'text-[#0A0A12]'
                        : theme === 'matrix'
                        ? 'text-green-400'
                        : 'text-white'
                      : theme === 'light'
                      ? 'text-[#6B7280] hover:text-[#0A0A12]'
                      : theme === 'matrix'
                      ? 'text-green-400/70 hover:text-green-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        theme === 'matrix' ? 'bg-green-400' : 'bg-cyan-400'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
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

              </motion.button>
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
            className={`md:hidden border-t ${
              theme === 'light'
                ? 'bg-white/80 border-gray-200/60 backdrop-blur-xl'
                : 'bg-[#0A0A12]/80 border-white/10 backdrop-blur-xl'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? theme === 'light'
                        ? 'bg-gray-100 text-[#0A0A12]'
                        : 'bg-white/10 text-white'
                      : theme === 'light'
                      ? 'text-[#6B7280] hover:bg-gray-50'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
