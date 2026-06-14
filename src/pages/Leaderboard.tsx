import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, Heart, MessageCircle, Star, Eye, Trophy } from 'lucide-react';
import { websites } from '../data/websites';
import { useLikes } from '../hooks/useLikes';
import { useComments } from '../hooks/useComments';
import { useRatings } from '../hooks/useRatings';

const REACTION_EMOJI: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const RANK_GRADIENT: Record<number, string> = {
  1: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  2: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
  3: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)',
};

const RANK_BORDER: Record<number, string> = {
  1: '1px solid rgba(255, 215, 0, 0.5)',
  2: '1px solid rgba(192, 192, 192, 0.5)',
  3: '1px solid rgba(205, 127, 50, 0.5)',
};

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00D4FF', '#9D4EDD', '#FF006E', '#E8913A', '#FFD700', '#00FF88'];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number; decay: number }[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 1 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 6,
        life: 1,
        decay: 0.003 + Math.random() * 0.005,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.life -= p.decay;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
      }
      ctx.globalAlpha = 1;
      if (alive > 0) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ width: '100%', height: '100%' }} />;
}

export default function Leaderboard() {
  const { getLikeCount } = useLikes();
  const { getCommentCount, getAverageRating } = useComments();
  const { getAverageRating: getRatingScore } = useRatings();

  const rankedWebsites = useMemo(() => {
    const scored = websites.map(w => {
      const likes = getLikeCount(w.id);
      const comments = getCommentCount(w.id);
      const rating = getRatingScore(w.id) || getAverageRating(w.id);
      const score = likes * 2 + comments * 3 + rating * 5;
      return { ...w, likes, comments, rating, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [getLikeCount, getCommentCount, getAverageRating, getRatingScore]);

  const totalLikes = rankedWebsites.reduce((s, w) => s + w.likes, 0);
  const totalComments = rankedWebsites.reduce((s, w) => s + w.comments, 0);
  const totalViews = useMemo(() => {
    try {
      const raw = localStorage.getItem('adforge_visits');
      if (raw) {
        const visits = JSON.parse(raw);
        return Object.values(visits).reduce((a: number, b: unknown) => a + (b as number), 0);
      }
    } catch { /* ignore */ }
    return 0;
  }, []);

  const categoryWinners = useMemo(() => {
    const cats = ['Gaming', 'AI', 'Business', 'Entertainment'];
    const winners: { category: string; website: (typeof rankedWebsites)[0] | null }[] = [];
    for (const cat of cats) {
      const match = rankedWebsites.find(w => w.categories.includes(cat));
      winners.push({ category: cat, website: match || null });
    }
    return winners;
  }, [rankedWebsites]);

  const maxScore = rankedWebsites[0]?.score || 1;

  return (
    <div className="min-h-screen" style={{ background: '#0A0A12', fontFamily: 'Inter, sans-serif' }}>
      <ConfettiCanvas />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy size={36} style={{ color: '#FFD700' }} />
              <h1
                className="text-4xl sm:text-5xl font-bold"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #9D4EDD 50%, #FF006E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Website Leaderboard
              </h1>
            </div>
            <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Ranked by community engagement, ratings, and activity
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Websites', value: websites.length, icon: <Trophy size={20} />, color: '#00D4FF' },
            { label: 'Total Likes', value: totalLikes, icon: <Heart size={20} />, color: '#FF006E' },
            { label: 'Comments', value: totalComments, icon: <MessageCircle size={20} />, color: '#9D4EDD' },
            { label: 'Total Views', value: totalViews, icon: <Eye size={20} />, color: '#E8913A' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 text-center"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex justify-center mb-2" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Rankings */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-5"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
        >
          Rankings
        </motion.h2>
        <div className="space-y-3">
          {rankedWebsites.map((site, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            const barWidth = (site.score / maxScore) * 100;

            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * rank }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: isTop3
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  border: isTop3 ? RANK_BORDER[rank] : '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Score bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 1, delay: 0.2 * rank, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 opacity-10"
                  style={{
                    background: isTop3 ? RANK_GRADIENT[rank] : 'linear-gradient(90deg, #00D4FF, #9D4EDD)',
                  }}
                />

                <div className="relative flex items-center gap-4 p-4 sm:p-5">
                  {/* Rank */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                    style={{
                      background: isTop3 ? RANK_GRADIENT[rank] : 'rgba(255,255,255,0.05)',
                      color: isTop3 ? '#0A0A12' : 'rgba(255,255,255,0.5)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    {isTop3 ? <Crown size={20} /> : rank}
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={site.previewImage}
                    alt={site.name}
                    className="w-14 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold truncate" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {site.name}
                      </h3>
                      {isTop3 && (
                        <span className="text-base" title={`Rank #${rank}`}>
                          {REACTION_EMOJI[rank]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <span className="flex items-center gap-1">
                        <Heart size={10} style={{ color: '#FF006E' }} /> {site.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={10} style={{ color: '#9D4EDD' }} /> {site.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={10} style={{ color: '#E8913A' }} /> {site.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        color: isTop3 ? (rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32') : '#00D4FF',
                      }}
                    >
                      {site.score}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Score
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Category Winners */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl font-bold mb-5"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
        >
          Category Winners
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryWinners.map((cw, i) => (
            <motion.div
              key={cw.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {cw.website ? (
                <>
                  <div className="relative h-32 overflow-hidden">
                    <img src={cw.website.previewImage} alt={cw.website.name} className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(10,10,18,0.95) 0%, transparent 100%)' }}
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
                        style={{
                          background: `${cw.website.accentColor}22`,
                          color: cw.website.accentColor,
                          border: `1px solid ${cw.website.accentColor}44`,
                        }}
                      >
                        {cw.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-sm font-bold truncate" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {cw.website.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span className="flex items-center gap-1">
                      <Heart size={10} style={{ color: '#FF006E' }} /> {cw.website.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={10} style={{ color: '#9D4EDD' }} /> {cw.website.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={10} style={{ color: '#E8913A' }} /> {cw.website.rating.toFixed(1)}
                    </span>
                    <span className="font-bold" style={{ color: '#00D4FF' }}>
                      {cw.website.score} pts
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No entries yet
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
