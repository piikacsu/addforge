import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Info, ExternalLink, Zap, Gauge, Tag } from 'lucide-react';
import type { Website } from '../data/websites';
import StarRating from './StarRating';
import { useLikes } from '../hooks/useLikes';
import { useRatings } from '../hooks/useRatings';

interface AdCardProps {
  website: Website;
  index?: number;
}

export default function AdCard({ website, index = 0 }: AdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const { getLikeCount, hasLiked, toggleLike } = useLikes();
  const { getAverageRating, getUserRating, submitRating } = useRatings();

  const likeCount = getLikeCount(website.id);
  const liked = hasLiked(website.id);
  const avgRating = getAverageRating(website.id);
  const userRating = getUserRating(website.id);

  // Motion values for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), springConfig);

  // Sheen position using motion values directly
  const sheenGradient = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const px = Math.round((latestX as number) * 100);
      const py = Math.round((latestY as number) * 100);
      return `radial-gradient(600px circle at ${px}% ${py}%, rgba(255,255,255,0.08), transparent 60%)`;
    }
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || isFlipped) return;
      const rect = cardRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      x.set(px);
      y.set(py);
    },
    [x, y, isFlipped]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(website.id);
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 600);
  };

  const handleRate = (rating: number) => {
    submitRating(website.id, rating);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(prev => !prev);
  };

  return (
    <div
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: isFlipped ? 1 : 1.02 }}
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
      >
        {/* FRONT SIDE */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Sheen overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: sheenGradient }}
          />

          {/* Preview Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={website.previewImage}
              alt={website.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(10,10,18,0.95) 0%, rgba(10,10,18,0.3) 50%, transparent 100%)`,
              }}
            />
            {/* Category badge */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              {website.categories.map(cat => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
                  style={{
                    background: `${website.accentColor}22`,
                    color: website.accentColor,
                    border: `1px solid ${website.accentColor}44`,
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
            {/* Info button */}
            <button
              onClick={handleFlip}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              title="Quick stats"
            >
              <Info size={14} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="relative p-5">
            {/* Title */}
            <h3
              className="text-lg font-bold mb-1.5"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
            >
              {website.name}
            </h3>

            {/* Description */}
            <p
              className="text-sm mb-4 line-clamp-2"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif' }}
            >
              {website.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {website.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="mb-4">
              <StarRating
                rating={userRating || avgRating}
                interactive={true}
                onRate={handleRate}
                size={18}
              />
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Heart / Like */}
              <button
                onClick={handleHeartClick}
                className="flex items-center gap-1.5 transition-all duration-200"
              >
                <motion.div
                  animate={heartPulse ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Heart
                    size={18}
                    fill={liked ? '#FF006E' : 'transparent'}
                    style={{ color: liked ? '#FF006E' : 'rgba(255,255,255,0.4)' }}
                    className="transition-colors duration-200"
                  />
                </motion.div>
                <span
                  className="text-xs font-medium"
                  style={{ color: liked ? '#FF006E' : 'rgba(255,255,255,0.4)' }}
                >
                  {likeCount}
                </span>
              </button>

              {/* View Website */}
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: website.accentColor }}
              >
                <span>Visit</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, rgba(10,10,18,0.98) 0%, rgba(20,20,35,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Back header */}
          <div
            className="flex items-center justify-between p-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h3
              className="text-base font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
            >
              {website.name}
            </h3>
            <button
              onClick={handleFlip}
              className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all hover:opacity-80"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Back
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 p-5 space-y-5">
            {/* Load Time */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={14} style={{ color: website.accentColor }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Load Time
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isFlipped ? '65%' : 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${website.accentColor}, ${website.accentColor}88)`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold" style={{ color: website.accentColor }}>
                  {website.stats?.loadTime || '1.0s'}
                </span>
              </div>
            </div>

            {/* Design Score */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} style={{ color: '#E8913A' }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Design Score
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isFlipped ? `${(website.stats?.designScore || 8) * 10}%` : 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, #E8913A, #E8913A88)`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold" style={{ color: '#E8913A' }}>
                  {website.stats?.designScore || 8}/10
                </span>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} style={{ color: '#00D4FF' }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Features
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {website.stats?.features.map(feature => (
                  <span
                    key={feature}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                    style={{
                      background: 'rgba(0,212,255,0.1)',
                      color: '#00D4FF',
                      border: '1px solid rgba(0,212,255,0.2)',
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* User Rating on back */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Your Rating
              </span>
              <StarRating
                rating={userRating}
                interactive={true}
                onRate={handleRate}
                size={22}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${website.accentColor}, ${website.accentColor}88)`,
                color: '#0A0A12',
              }}
            >
              <span>View Website</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
