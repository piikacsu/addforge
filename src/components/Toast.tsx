import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const typeConfig: Record<ToastType, { icon: React.ReactNode; gradient: string; progressGradient: string }> = {
  success: {
    icon: <CheckCircle className="w-4 h-4 text-[#00D4FF]" />,
    gradient: 'from-[#00D4FF]/20 to-[#00D4FF]/5',
    progressGradient: 'from-[#00D4FF] to-[#00D4FF]/50',
  },
  error: {
    icon: <XCircle className="w-4 h-4 text-[#FF006E]" />,
    gradient: 'from-[#FF006E]/20 to-[#FF006E]/5',
    progressGradient: 'from-[#FF006E] to-[#FF006E]/50',
  },
  info: {
    icon: <Info className="w-4 h-4 text-[#9D4EDD]" />,
    gradient: 'from-[#9D4EDD]/20 to-[#9D4EDD]/5',
    progressGradient: 'from-[#9D4EDD] to-[#9D4EDD]/50',
  },
};

const DISMISS_MS = 3000;

export function Toast({ toast, onRemove }: ToastProps) {
  const { id, message, type } = toast;
  const config = typeConfig[type];
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onRemove(id);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, y: -10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`pointer-events-auto relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-r ${config.gradient} backdrop-blur-md shadow-lg shadow-black/20`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {config.icon}
        <span className="text-sm font-medium text-white/90 flex-1">{message}</span>
        <button
          onClick={() => onRemove(id)}
          className="shrink-0 rounded-full p-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-[2px] bg-white/5">
        <motion.div
          className={`h-full bg-gradient-to-r ${config.progressGradient}`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </motion.div>
  );
}
