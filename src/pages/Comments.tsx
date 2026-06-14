import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Star, ShieldCheck, Users, Filter, ChevronDown } from 'lucide-react';
import { websites } from '../data/websites';
import { useComments, hasVisited } from '../hooks/useComments';
import CommentSection from '../components/CommentSection';

export default function Comments() {
  const { getCommentsForWebsite, getAverageRating, getTopCommenters, getCommentCount } = useComments();
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const selectedComments = selectedWebsite ? getCommentsForWebsite(selectedWebsite) : [];
  const filteredComments = useMemo(() => {
    if (!verifiedFilter) return selectedComments;
    return selectedComments.filter(c => hasVisited(c.websiteId));
  }, [selectedComments, verifiedFilter]);

  const topCommenters = getTopCommenters();

  const websiteStats = useMemo(() => {
    return websites.map(w => ({
      ...w,
      commentCount: getCommentCount(w.id),
      avgRating: getAverageRating(w.id),
    }));
  }, [getCommentCount, getAverageRating]);

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle size={32} style={{ color: '#9D4EDD' }} />
              <h1
                className="text-4xl sm:text-5xl font-bold"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #9D4EDD 50%, #FF006E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Comments
              </h1>
            </div>
            <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Community discussions and reviews
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Website Selector */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <h3 className="text-sm font-bold mb-4" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Select Website
              </h3>
              <div className="space-y-2">
                {websiteStats.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWebsite(selectedWebsite === w.id ? null : w.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left"
                    style={{
                      background: selectedWebsite === w.id ? `${w.accentColor}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedWebsite === w.id ? `${w.accentColor}44` : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <img src={w.previewImage} alt={w.name} className="w-10 h-7 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: '#fff' }}>
                        {w.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <span className="flex items-center gap-0.5">
                          <MessageCircle size={8} /> {w.commentCount}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Star size={8} /> {w.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {w.avgRating > 0 && (
                      <div className="flex-shrink-0">
                        <Star size={12} fill="#E8913A" style={{ color: '#E8913A' }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} style={{ color: '#00D4FF' }} />
                <h3 className="text-sm font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Top Contributors
                </h3>
              </div>
              {topCommenters.length > 0 ? (
                <div className="space-y-2">
                  {topCommenters.map((tc, i) => (
                    <div key={tc.author} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: i === 0 ? '#FFD70022' : i === 1 ? '#C0C0C022' : 'rgba(255,255,255,0.05)',
                          color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : 'rgba(255,255,255,0.5)',
                          border: `1px solid ${i === 0 ? '#FFD70044' : i === 1 ? '#C0C0C044' : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        {tc.author[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm flex-1 min-w-0 truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {tc.author}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#9D4EDD' }}>
                        {tc.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No contributors yet</p>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {selectedWebsite ? (
              <div className="space-y-4">
                {/* Website Header */}
                <div
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {(() => {
                    const ws = websites.find(w => w.id === selectedWebsite);
                    if (!ws) return null;
                    const avg = getAverageRating(selectedWebsite);
                    return (
                      <>
                        <img src={ws.previewImage} alt={ws.name} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold truncate" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {ws.name}
                          </h2>
                          <div className="flex items-center gap-3 mt-1">
                            {avg > 0 && (
                              <div className="flex items-center gap-1">
                                <Star size={14} fill="#E8913A" style={{ color: '#E8913A' }} />
                                <span className="text-sm font-medium" style={{ color: '#E8913A' }}>
                                  {avg.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MessageCircle size={14} style={{ color: '#9D4EDD' }} />
                              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {getCommentCount(selectedWebsite)} comments
                              </span>
                            </div>
                            {hasVisited(selectedWebsite) && (
                              <span
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background: 'rgba(0,212,255,0.1)',
                                  color: '#00D4FF',
                                  border: '1px solid rgba(0,212,255,0.2)',
                                }}
                              >
                                <ShieldCheck size={10} />
                                You visited
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Filter Bar */}
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      <Filter size={12} />
                      <span>Filter</span>
                      <ChevronDown size={12} />
                    </button>
                    <AnimatePresence>
                      {showFilterDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute left-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                          style={{
                            background: 'rgba(20,20,35,0.98)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                          }}
                        >
                          <button
                            onClick={() => { setVerifiedFilter(!verifiedFilter); setShowFilterDropdown(false); }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-150"
                            style={{
                              color: verifiedFilter ? '#00D4FF' : 'rgba(255,255,255,0.7)',
                              background: verifiedFilter ? 'rgba(0,212,255,0.08)' : 'transparent',
                            }}
                          >
                            <ShieldCheck size={14} />
                            Verified Visitors Only
                            {verifiedFilter && <span className="ml-auto text-xs">On</span>}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {filteredComments.length} comment{filteredComments.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <CommentSection websiteId={selectedWebsite} />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <MessageCircle size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                <p className="mt-4 text-lg font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Select a website
                </p>
                <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Choose a website from the sidebar to view and post comments
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
