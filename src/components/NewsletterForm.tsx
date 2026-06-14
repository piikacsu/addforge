import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    const existing: string[] = JSON.parse(localStorage.getItem('adforge_newsletter') || '[]');
    if (!existing.includes(email.trim())) {
      existing.push(email.trim());
      localStorage.setItem('adforge_newsletter', JSON.stringify(existing));
    }
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-emerald-400"
          >
            <Check className="w-4 h-4" />
            <span>Thanks for subscribing!</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#9D4EDD] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
