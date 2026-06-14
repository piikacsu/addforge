import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#9D4EDD] text-white shadow-lg shadow-cyan-500/25 cursor-pointer hover:shadow-cyan-500/40 transition-shadow"
          aria-label="Back to top"
        >
          <motion.div
            animate={{
              y: hovered ? -4 : 0,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative"
          >
            <Rocket className="w-5 h-5" />
            {/* Flame trail */}
            <motion.div
              animate={{
                opacity: hovered ? [0.6, 1, 0.6] : 0,
                height: hovered ? [4, 10, 4] : 0,
              }}
              transition={{
                duration: 0.4,
                repeat: hovered ? Infinity : 0,
                repeatType: 'loop',
              }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-yellow-400"
            />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
