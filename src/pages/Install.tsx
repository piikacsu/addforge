import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Smartphone, Monitor, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Install() {
  const { ref: headerRef, inView: headerInView } = useScrollReveal(0.2);

  return (
    <main className="min-h-screen bg-[#0A0A12] pt-[64px]">
      {/* Header */}
      <section className="pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Download size={28} className="text-accent-cyan" />
              <h1 className="font-[family-name:var(--font-family-display)] font-bold text-4xl md:text-5xl text-white">
                Install <span className="text-gradient-cyan-purple">AdForge</span>
              </h1>
            </div>
            <p className="text-text-secondary text-lg max-w-xl">
              Install AdForge on your device for the best experience. Works offline, launches full-screen, and feels like a native app!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Install Options */}
      <section className="pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* iPhone */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[20px] overflow-hidden"
            >
              <div className="p-6 border-b border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone size={20} className="text-accent-cyan" />
                  <h2 className="text-xl font-bold text-white">iPhone / iPad</h2>
                </div>
                <p className="text-sm text-text-muted">Safari browser required</p>
              </div>
              <div className="p-0">
                <img
                  src="/install-iphone.jpg"
                  alt="iPhone install guide"
                  className="w-full"
                />
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Open AdForge in Safari',
                  'Tap the Share button (square with arrow)',
                  'Scroll down and tap "Add to Home Screen"',
                  'Tap "Add" in the top right',
                  'AdForge icon appears on your home screen!',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                    <span className="text-sm text-text-secondary">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Android */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[20px] overflow-hidden"
            >
              <div className="p-6 border-b border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone size={20} className="text-accent-purple" />
                  <h2 className="text-xl font-bold text-white">Android</h2>
                </div>
                <p className="text-sm text-text-muted">Chrome browser required</p>
              </div>
              <div className="p-0">
                <img
                  src="/install-android.jpg"
                  alt="Android install guide"
                  className="w-full"
                />
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Open AdForge in Chrome',
                  'Tap the 3-dot menu (top right)',
                  'Tap "Install App" or "Add to Home Screen"',
                  'Tap "Install" on the popup',
                  'AdForge launches like a native app!',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-accent-purple mt-0.5 shrink-0" />
                    <span className="text-sm text-text-secondary">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-[20px] overflow-hidden"
            >
              <div className="p-6 border-b border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                  <Monitor size={20} className="text-accent-pink" />
                  <h2 className="text-xl font-bold text-white">Windows / Mac</h2>
                </div>
                <p className="text-sm text-text-muted">Chrome or Edge browser</p>
              </div>
              <div className="p-0">
                <img
                  src="/install-desktop.jpg"
                  alt="Desktop install guide"
                  className="w-full"
                />
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Open AdForge in Chrome or Edge',
                  'Look for the install icon in the address bar',
                  'Click "Install AdForge" in the popup',
                  'App installs and opens automatically',
                  'Find it in your Start Menu / Applications!',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-accent-pink mt-0.5 shrink-0" />
                    <span className="text-sm text-text-secondary">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass-card rounded-[20px] p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Why Install?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🔌', title: 'Works Offline', desc: 'Use AdForge without internet' },
                { icon: '🚀', title: 'Full-Screen', desc: 'No browser distractions' },
                { icon: '⚡', title: 'Fast Launch', desc: 'Opens instantly from home screen' },
                { icon: '📱', title: 'Native Feel', desc: 'Like a real app' },
              ].map((b, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <h4 className="text-sm font-semibold text-white">{b.title}</h4>
                  <p className="text-xs text-text-muted">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
