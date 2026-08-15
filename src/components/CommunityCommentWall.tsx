import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, User, Users, Clock, Filter } from 'lucide-react'
import { useComments } from '../hooks/useComments'
import { websites } from '../data/websites'

export default function CommunityCommentWall() {
  const { comments, addComment } = useComments()
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [selectedSite, setSelectedSite] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  const websiteOptions = [
    { id: 'all', name: 'All Websites' },
    ...websites.map((w) => ({ id: w.id, name: w.name })),
  ]

  const filteredComments = comments
    .filter((c) => selectedSite === 'all' || c.websiteId === selectedSite)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !text.trim()) return
    const targetId = selectedSite === 'all' ? websites[0]?.id || 'friboard' : selectedSite
    addComment(targetId, author.trim(), text.trim())
    setText('')
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getWebsiteName = (websiteId: string) => {
    return websites.find((w) => w.id === websiteId)?.name || 'Unknown'
  }

  const getWebsiteAccent = (websiteId: string) => {
    return websites.find((w) => w.id === websiteId)?.accentColor || '#00D4FF'
  }

  return (
    <section className="py-20 bg-bg-primary border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] rounded-full px-4 py-1.5 mb-4">
            <MessageSquare size={14} className="text-accent-cyan" />
            <span className="text-xs font-medium text-accent-cyan uppercase tracking-[0.08em]">
              Community
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-family-display)] font-bold text-[clamp(32px,5vw,56px)] leading-[1.1] text-white mb-4">
            What People Are
            <span className="text-gradient-cyan-purple"> Saying</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Read and share thoughts about these websites. Join the conversation!
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters + Submit */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-[380px] lg:shrink-0"
          >
            <div className="lg:sticky lg:top-[100px] space-y-6">
              {/* Submit Form */}
              <div className="bg-bg-card border border-glass-border rounded-[20px] p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Send size={14} className="text-accent-cyan" />
                  Leave a Comment
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-bg-elevated border border-[rgba(255,255,255,0.08)] rounded-[12px] px-4 py-3 text-sm text-white placeholder-text-muted outline-none focus:border-accent-cyan focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
                  />
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="w-full bg-bg-elevated border border-[rgba(255,255,255,0.08)] rounded-[12px] px-4 py-3 text-sm text-white outline-none focus:border-accent-cyan transition-all cursor-pointer"
                  >
                    {websiteOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-bg-card">
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share your thoughts about this website..."
                    rows={4}
                    className="w-full bg-bg-elevated border border-[rgba(255,255,255,0.08)] rounded-[12px] px-4 py-3 text-sm text-white placeholder-text-muted outline-none focus:border-accent-cyan focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all resize-y"
                  />
                  <button
                    type="submit"
                    disabled={!author.trim() || !text.trim()}
                    className="w-full py-3 rounded-[12px] font-semibold text-sm text-white gradient-cyan-purple hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    Post Comment
                  </button>
                </form>
              </div>

              {/* Stats */}
              <div className="bg-bg-card border border-glass-border rounded-[20px] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-accent-cyan" />
                    <span className="text-sm text-white font-semibold">{comments.length}</span>
                    <span className="text-xs text-text-muted">Comments</span>
                  </div>
                  <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]" />
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-accent-purple" />
                    <span className="text-sm text-white font-semibold">
                      {new Set(comments.map((c) => c.author)).size}
                    </span>
                    <span className="text-xs text-text-muted">Commenters</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Comment Feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            {/* Filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-text-muted" />
                <div className="flex gap-1">
                  {websiteOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSite(opt.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                        selectedSite === opt.id
                          ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                          : 'border-[rgba(255,255,255,0.06)] text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                    sortBy === 'newest' ? 'text-accent-cyan' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                    sortBy === 'oldest' ? 'text-accent-cyan' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredComments.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <MessageSquare size={32} className="mx-auto text-text-muted mb-3" />
                    <p className="text-sm text-text-muted">No comments yet for this filter.</p>
                  </motion.div>
                )}
                {filteredComments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-bg-card border border-glass-border rounded-[16px] p-5 hover:border-glass-border-hover transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${getWebsiteAccent(comment.websiteId)}, ${getWebsiteAccent(comment.websiteId)}66)`,
                        }}
                      >
                        <User size={16} className="text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-semibold text-white">
                            {comment.author}
                          </span>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              color: getWebsiteAccent(comment.websiteId),
                              backgroundColor: `${getWebsiteAccent(comment.websiteId)}14`,
                            }}
                          >
                            {getWebsiteName(comment.websiteId)}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-text-muted">
                            <Clock size={8} />
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        {/* Comment Text */}
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
