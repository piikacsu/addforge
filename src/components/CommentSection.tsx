import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldCheck } from 'lucide-react';
import { useComments, type ReactionType, hasVisited } from '../hooks/useComments';
import { useToast } from '../context/ToastContext';
import StarRating from './StarRating';

const REACTIONS: ReactionType[] = ['👍', '👎', '😂', '🔥'];

interface CommentSectionProps {
  websiteId: string;
}

export default function CommentSection({ websiteId }: CommentSectionProps) {
  const { getCommentsForWebsite, addComment, toggleReaction, getUserReaction } = useComments();
  const { success } = useToast();
  const comments = getCommentsForWebsite(websiteId);

  const [text, setText] = useState('');
  const [author, setAuthor] = useState(() => {
    try { return localStorage.getItem('adforge_commenter_name') || ''; } catch { return ''; }
  });
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userId = useRef(() => {
    try {
      let id = localStorage.getItem('adforge_user_id');
      if (!id) {
        id = `user-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem('adforge_user_id', id);
      }
      return id;
    } catch { return 'anonymous'; }
  }).current();

  const handleSubmit = useCallback(() => {
    if (!text.trim() || !author.trim()) return;
    setIsSubmitting(true);
    addComment(websiteId, text.trim(), author.trim(), rating);
    try { localStorage.setItem('adforge_commenter_name', author.trim()); } catch { /* ignore */ }
    setText('');
    setRating(0);
    setIsSubmitting(false);
    success('Comment posted!');
    textareaRef.current?.focus();
  }, [text, author, rating, websiteId, addComment, success]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h4 className="text-sm font-bold mb-3" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
          Write a comment
        </h4>

        {/* Name input */}
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full h-9 px-3 rounded-lg text-sm mb-3 outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}
        />

        {/* Rating */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Rate:</span>
          <StarRating rating={rating} interactive size={20} onRate={setRating} />
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts... (Ctrl+Enter to send)"
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || !author.trim() || isSubmitting}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00D4FF, #9D4EDD)',
              color: '#0A0A12',
            }}
          >
            <Send size={12} />
            Post
          </button>
        </div>
      </div>

      {/* Comments List */}
      <AnimatePresence mode="popLayout">
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          </motion.div>
        ) : (
          comments.map((comment, idx) => {
            const visited = hasVisited(comment.websiteId);

            return (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF33, #9D4EDD33)',
                      color: '#00D4FF',
                      border: '1px solid rgba(0,212,255,0.2)',
                    }}
                  >
                    {comment.author[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {comment.author}
                  </span>
                  {visited && (
                    <span
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: 'rgba(0,212,255,0.1)',
                        color: '#00D4FF',
                        border: '1px solid rgba(0,212,255,0.2)',
                      }}
                    >
                      <ShieldCheck size={10} />
                      Verified Visitor
                    </span>
                  )}
                  <span className="text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Rating */}
                {comment.rating > 0 && (
                  <div className="mb-2">
                    <StarRating rating={comment.rating} size={14} color="#E8913A" />
                  </div>
                )}

                {/* Text */}
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>
                  {comment.text}
                </p>

                {/* Reactions */}
                <div className="flex items-center gap-2">
                  {REACTIONS.map(reaction => {
                    const count = comment.reactions?.[reaction] || 0;
                    const isActive = getUserReaction(websiteId, comment.id, userId) === reaction;
                    return (
                      <button
                        key={reaction}
                        onClick={() => toggleReaction(websiteId, comment.id, userId, reaction)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105"
                        style={{
                          background: isActive ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isActive ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          color: isActive ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        <span>{reaction}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
