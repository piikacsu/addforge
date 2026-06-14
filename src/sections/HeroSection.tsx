import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { websites } from '../data/websites';

/* ─── Shimmer keyframes injected as style tag ─── */
const shimmerStyles = `
  @keyframes shimmer-sweep {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer-text {
    background: linear-gradient(
      90deg,
      #00D4FF 0%,
      #9D4EDD 25%,
      #FF006E 50%,
      #9D4EDD 75%,
      #00D4FF 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-sweep 3s linear infinite;
  }
`;

function ShimmerStyles() {
  return <style>{shimmerStyles}</style>;
}

/* ─── Floating Preview Card ─── */
function FloatingCard({
  website,
  index,
}: {
  website: (typeof websites)[number];
  index: number;
}) {
  const angle = (index / websites.length) * 360;
  const radiusX = 300;
  const radiusY = 160;
  const duration = 14 + index * 2.5;

  return (
    <motion.div
      className="absolute"
      style={{
        width: 170,
        height: 120,
        left: '50%',
        top: '50%',
        marginLeft: -85,
        marginTop: -60,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          x: [
            Math.cos((angle * Math.PI) / 180) * radiusX,
            Math.cos(((angle + 90) * Math.PI) / 180) * radiusX,
            Math.cos(((angle + 180) * Math.PI) / 180) * radiusX,
            Math.cos(((angle + 270) * Math.PI) / 180) * radiusX,
            Math.cos((angle * Math.PI) / 180) * radiusX,
          ],
          y: [
            Math.sin((angle * Math.PI) / 180) * radiusY,
            Math.sin(((angle + 90) * Math.PI) / 180) * radiusY,
            Math.sin(((angle + 180) * Math.PI) / 180) * radiusY,
            Math.sin(((angle + 270) * Math.PI) / 180) * radiusY,
            Math.sin((angle * Math.PI) / 180) * radiusY,
          ],
          rotateX: [8, -6, 10, -8, 8],
          rotateY: [-10, 12, -8, 10, -10],
          rotateZ: [-3, 2, -2, 3, -3],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.2,
          zIndex: 100,
          transition: { duration: 0.25 },
        }}
      >
        <div
          className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            boxShadow: `0 0 30px ${website.accentColor}15, 0 8px 32px rgba(0,0,0,0.4)`,
          }}
        >
          <img
            src={website.previewImage}
            alt={website.name}
            className="w-full h-[72%] object-cover opacity-80"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#0A0A12]/95 to-transparent flex items-end p-2.5">
            <span className="text-[10px] font-medium text-white/80 truncate">
              {website.name}
            </span>
          </div>
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 1px ${website.accentColor}20`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Typing Demo ─── */
function TypingDemo() {
  const [phase, setPhase] = useState<'typing' | 'generating' | 'show'>('typing');
  const [displayUrl, setDisplayUrl] = useState('');
  const fullUrl = 'https://example.com';

  useEffect(() => {
    let cancelled = false;

    const cycle = async () => {
      while (!cancelled) {
        // Phase: typing
        setPhase('typing');
        setDisplayUrl('');
        for (let i = 1; i <= fullUrl.length; i++) {
          if (cancelled) return;
          setDisplayUrl(fullUrl.slice(0, i));
          await new Promise((r) => setTimeout(r, 70));
        }
        await new Promise((r) => setTimeout(r, 400));
        if (cancelled) return;

        // Phase: generating
        setPhase('generating');
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;

        // Phase: show result
        setPhase('show');
        await new Promise((r) => setTimeout(r, 2500));
        if (cancelled) return;
      }
    };

    cycle();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 backdrop-blur-sm">
        {/* URL input display */}
        <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <span className="text-sm text-white/40 font-mono">{displayUrl}</span>
          {phase === 'typing' && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[2px] h-4 bg-[#00D4FF] ml-0.5"
            />
          )}
        </div>

        {/* Generating state */}
        {phase === 'generating' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-3 text-sm text-white/50"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
            <span>Analyzing page & generating ad...</span>
          </motion.div>
        )}

        {/* Mini ad card result */}
        {phase === 'show' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 rounded-lg overflow-hidden border border-[#00D4FF]/20 bg-gradient-to-br from-[#00D4FF]/10 to-[#9D4EDD]/10"
          >
            <div className="flex gap-3 p-3">
              <div className="w-16 h-16 rounded-md bg-white/10 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop"
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-[#00D4FF]" />
                  <span className="text-[10px] font-medium text-[#00D4FF] uppercase tracking-wider">
                    Generated Ad
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white truncate">
                  Transform Your Website Into Ads
                </h4>
                <p className="text-[11px] text-white/50 mt-0.5 line-clamp-2">
                  AI-powered ad generation from any URL. Beautiful, conversion-ready creatives in seconds.
                </p>
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                  AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9D4EDD]/10 text-[#9D4EDD] border border-[#9D4EDD]/20">
                  Creative
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Hero Section ─── */
export function HeroSection() {
  return (
    <>
      <ShimmerStyles />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00D4FF]/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#9D4EDD]/5 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF006E]/[0.03] blur-[150px]" />
        </div>

        {/* Floating cards layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-0 h-0">
            {websites.map((site, i) => (
              <div key={site.id} className="pointer-events-auto">
                <FloatingCard website={site} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span className="text-sm text-white/60">AI-Powered Ad Builder</span>
            </motion.div>

            {/* Main heading with shimmer & float */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-['Space_Grotesk'] tracking-tight leading-[1.05] mb-6"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="text-white">Forge Ads </span>
              <span className="shimmer-text">That Convert</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Turn any website into a stunning, conversion-ready advertisement in seconds.
              No design skills needed.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="/create"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#9D4EDD] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-shadow"
              >
                <Sparkles className="w-4 h-4" />
                Start Creating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-7 py-3.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                View Gallery
              </a>
            </motion.div>
          </motion.div>

          {/* Typing Demo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <TypingDemo />
          </motion.div>
        </div>
      </section>
    </>
  );
}
