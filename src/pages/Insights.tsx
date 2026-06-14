import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MousePointer, Heart, MessageCircle, Globe, TrendingUp, Users, Clock } from 'lucide-react';
import { websites } from '../data/websites';
import { useLikes } from '../hooks/useLikes';
import { useComments } from '../hooks/useComments';
import { useRatings } from '../hooks/useRatings';

const ACCENT_COLORS = ['#00D4FF', '#9D4EDD', '#FF006E', '#E8913A', '#00FF88', '#FFD700'];

export default function Insights() {
  const { getLikeCount } = useLikes();
  const { getTotalComments, getTopCommenters, getRecentActivity, getAverageRating } = useComments();
  const { getAverageRating: getRatingScore } = useRatings();

  const totalLikes = websites.reduce((s, w) => s + getLikeCount(w.id), 0);
  const totalComments = getTotalComments();
  const totalWebsites = websites.length;

  const totalClicks = useMemo(() => {
    try {
      const raw = localStorage.getItem('adforge_visits');
      if (raw) {
        const visits = JSON.parse(raw);
        return Object.values(visits).reduce((a: number, b: unknown) => a + (b as number), 0);
      }
    } catch { /* ignore */ }
    return 0;
  }, []);

  // Simulated clicks per website (merge real visits + likes as proxy)
  const clicksPerWebsite = useMemo(() => {
    return websites.map(w => {
      try {
        const raw = localStorage.getItem('adforge_visits');
        const visits = raw ? JSON.parse(raw) : {};
        return { name: w.name, value: (visits[w.id] || 0) + getLikeCount(w.id) + getTotalComments(), color: w.accentColor };
      } catch {
        return { name: w.name, value: getLikeCount(w.id), color: w.accentColor };
      }
    }).sort((a, b) => b.value - a.value);
  }, [getLikeCount, getTotalComments]);

  const maxClicks = Math.max(...clicksPerWebsite.map(c => c.value), 1);

  // Category distribution
  const categoryDist = useMemo(() => {
    const counts: Record<string, { count: number; color: string }> = {};
    websites.forEach(w => {
      w.categories.forEach((cat) => {
        if (!counts[cat]) counts[cat] = { count: 0, color: w.accentColor };
        counts[cat].count++;
      });
    });
    return Object.entries(counts).map(([name, data], i) => ({
      name,
      count: data.count,
      color: ACCENT_COLORS[i % ACCENT_COLORS.length],
    }));
  }, []);

  const maxCat = Math.max(...categoryDist.map(c => c.count), 1);

  // Comment activity over time (simulated from stored data)
  const activityOverTime = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[d.toLocaleString('default', { month: 'short' })] = 0;
    }

    // Count comments by month from actual data
    const allComments = websites.flatMap(w => {
      try {
        const raw = localStorage.getItem('adforge_comments');
        if (raw) {
          const parsed = JSON.parse(raw);
          return (parsed.comments[w.id] || []).map((c: { createdAt: string }) => ({
            ...c,
            websiteId: w.id,
          }));
        }
      } catch { /* ignore */ }
      return [];
    });

    allComments.forEach((c: { createdAt: string }) => {
      const d = new Date(c.createdAt);
      const key = d.toLocaleString('default', { month: 'short' });
      if (months[key] !== undefined) months[key]++;
    });

    // Fill with simulated data if empty
    const keys = Object.keys(months);
    const values = Object.values(months);
    if (values.every(v => v === 0)) {
      keys.forEach((k, i) => {
        months[k] = [3, 7, 5, 12, 8, 15][i] || Math.floor(Math.random() * 10) + 1;
      });
    }

    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, []);

  const maxActivity = Math.max(...activityOverTime.map(a => a.count), 1);

  const topCommenters = getTopCommenters();
  const recentActivity = getRecentActivity().slice(0, 10);

  const websiteRatings = useMemo(() => {
    return websites.map(w => ({
      name: w.name,
      rating: getRatingScore(w.id) || getAverageRating(w.id),
      color: w.accentColor,
    }));
  }, [getRatingScore, getAverageRating]);

  const maxRating = Math.max(...websiteRatings.map(r => r.rating), 1);

  return (
    <div className="min-h-screen" style={{ background: '#0A0A12', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(157,78,221,0.15) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-3"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                background: 'linear-gradient(135deg, #00D4FF 0%, #9D4EDD 50%, #FF006E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Platform Insights
            </h1>
            <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Analytics and activity across the AdForge network
            </p>
          </motion.div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Clicks', value: totalClicks, icon: <MousePointer size={20} />, color: '#00D4FF' },
            { label: 'Total Likes', value: totalLikes, icon: <Heart size={20} />, color: '#FF006E' },
            { label: 'Comments', value: totalComments, icon: <MessageCircle size={20} />, color: '#9D4EDD' },
            { label: 'Websites', value: totalWebsites, icon: <Globe size={20} />, color: '#E8913A' },
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

      {/* Charts */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clicks per Website */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} style={{ color: '#00D4FF' }} />
              <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Engagement per Website
              </h3>
            </div>
            <div className="space-y-3">
              {clicksPerWebsite.map((site) => (
                <div key={site.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {site.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: site.color }}>
                      {site.value}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(site.value / maxClicks) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${site.color}, ${site.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Globe size={18} style={{ color: '#9D4EDD' }} />
              <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Category Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {categoryDist.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {cat.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: cat.color }}>
                      {cat.count}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / maxCat) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comment Activity Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock size={18} style={{ color: '#FF006E' }} />
              <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Comment Activity
              </h3>
            </div>
            <div className="flex items-end gap-3 h-40">
              {activityOverTime.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / maxActivity) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full rounded-t-lg min-h-[4px]"
                    style={{ background: 'linear-gradient(to top, #FF006E, #FF006E88)' }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Website Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} style={{ color: '#E8913A' }} />
              <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Average Ratings
              </h3>
            </div>
            <div className="space-y-3">
              {websiteRatings.map((site) => (
                <div key={site.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {site.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: site.color }}>
                      {site.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(site.rating / maxRating) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${site.color}, ${site.color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section: Top Contributors + Recent Activity */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Users size={18} style={{ color: '#00D4FF' }} />
              <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Top Contributors
              </h3>
            </div>
            {topCommenters.length > 0 ? (
              <div className="space-y-3">
                {topCommenters.map((tc, i) => (
                  <div key={tc.author} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: i === 0 ? '#FFD70022' : i === 1 ? '#C0C0C022' : i === 2 ? '#CD7F3222' : 'rgba(255,255,255,0.05)',
                        color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.5)',
                        border: `1px solid ${i === 0 ? '#FFD70044' : i === 1 ? '#C0C0C044' : i === 2 ? '#CD7F3244' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {tc.author[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {tc.author}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={12} style={{ color: '#9D4EDD' }} />
                      <span className="text-xs font-bold" style={{ color: '#9D4EDD' }}>
                        {tc.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No comments yet. Be the first to contribute!
              </p>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock size={18} style={{ color: '#FF006E' }} />
              <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Recent Activity
              </h3>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {recentActivity.map((activity) => {
                  const ws = websites.find(w => w.id === activity.websiteId);
                  const timeAgo = (() => {
                    const diff = Date.now() - new Date(activity.createdAt).getTime();
                    const mins = Math.floor(diff / 60000);
                    if (mins < 1) return 'just now';
                    if (mins < 60) return `${mins}m ago`;
                    const hours = Math.floor(mins / 60);
                    if (hours < 24) return `${hours}h ago`;
                    return `${Math.floor(hours / 24)}d ago`;
                  })();

                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                        style={{ background: `${ws?.accentColor || '#00D4FF'}22`, color: ws?.accentColor || '#00D4FF' }}
                      >
                        <MessageCircle size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <span className="font-medium" style={{ color: '#fff' }}>{activity.author}</span>{' '}
                          commented on{' '}
                          <span className="font-medium" style={{ color: ws?.accentColor || '#00D4FF' }}>
                            {ws?.name || 'Unknown'}
                          </span>
                        </p>
                        <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          &quot;{activity.text}&quot;
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                          {timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No activity yet. Start engaging!
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
