import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'adforge_comments';
const VISITS_KEY = 'adforge_visits';

export type ReactionType = '👍' | '👎' | '😂' | '🔥';

export interface CommentEntry {
  id: string;
  websiteId: string;
  text: string;
  author: string;
  rating: number;
  reactions: Record<ReactionType, number>;
  userReactions?: Record<string, ReactionType>;
  createdAt: string;
}

interface CommentsData {
  comments: Record<string, CommentEntry[]>;
}

function getCommentsData(): CommentsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { comments: {} };
}

function saveCommentsData(data: CommentsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getVisits(): Record<string, number> {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

export function recordVisit(websiteId: string) {
  try {
    const visits = getVisits();
    visits[websiteId] = (visits[websiteId] || 0) + 1;
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch { /* ignore */ }
}

export function hasVisited(websiteId: string): boolean {
  return (getVisits()[websiteId] || 0) > 0;
}

export function useComments() {
  const [data, setData] = useState<CommentsData>(getCommentsData);

  useEffect(() => {
    setData(getCommentsData());
  }, []);

  const comments = Object.values(data.comments).flat();

  const getCommentsForWebsite = useCallback((websiteId: string): CommentEntry[] => {
    return data.comments[websiteId] || [];
  }, [data]);

  const getCommentCount = useCallback((websiteId: string): number => {
    return (data.comments[websiteId] || []).length;
  }, [data]);

  const addComment = useCallback((websiteId: string, text: string, author: string, rating: number = 0) => {
    const newComment: CommentEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      websiteId,
      text,
      author,
      rating,
      reactions: { '👍': 0, '👎': 0, '😂': 0, '🔥': 0 },
      userReactions: {},
      createdAt: new Date().toISOString(),
    };
    setData(prev => {
      const updated = {
        comments: {
          ...prev.comments,
          [websiteId]: [...(prev.comments[websiteId] || []), newComment],
        },
      };
      saveCommentsData(updated);
      return updated;
    });
  }, []);

  const toggleReaction = useCallback((websiteId: string, commentId: string, userId: string, reaction: ReactionType) => {
    setData(prev => {
      const websiteComments = [...(prev.comments[websiteId] || [])];
      const idx = websiteComments.findIndex(c => c.id === commentId);
      if (idx === -1) return prev;

      const comment = { ...websiteComments[idx] };
      const userReactions = { ...comment.userReactions };
      const reactions = { ...comment.reactions };

      // If user already has this reaction, remove it
      if (userReactions[userId] === reaction) {
        reactions[reaction] = Math.max(0, (reactions[reaction] || 0) - 1);
        delete userReactions[userId];
      } else {
        // Remove old reaction if exists
        const oldReaction = userReactions[userId];
        if (oldReaction) {
          reactions[oldReaction] = Math.max(0, (reactions[oldReaction] || 0) - 1);
        }
        reactions[reaction] = (reactions[reaction] || 0) + 1;
        userReactions[userId] = reaction;
      }

      comment.reactions = reactions;
      comment.userReactions = userReactions;
      websiteComments[idx] = comment;

      const updated = {
        comments: { ...prev.comments, [websiteId]: websiteComments },
      };
      saveCommentsData(updated);
      return updated;
    });
  }, []);

  const getAverageRating = useCallback((websiteId: string): number => {
    const list = data.comments[websiteId] || [];
    const rated = list.filter(c => c.rating > 0);
    if (rated.length === 0) return 0;
    return Math.round((rated.reduce((sum, c) => sum + c.rating, 0) / rated.length) * 10) / 10;
  }, [data]);

  const getTopCommenters = useCallback((): { author: string; count: number }[] => {
    const authorCounts: Record<string, number> = {};
    for (const comment of comments) {
      authorCounts[comment.author] = (authorCounts[comment.author] || 0) + 1;
    }
    return Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [comments]);

  const getRecentActivity = useCallback((): CommentEntry[] => {
    return [...comments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
  }, [comments]);

  const getTotalComments = useCallback((): number => {
    return comments.length;
  }, [comments]);

  const getReactionCounts = useCallback((websiteId: string, commentId: string): Record<ReactionType, number> => {
    const list = data.comments[websiteId] || [];
    const comment = list.find(c => c.id === commentId);
    return comment?.reactions || { '👍': 0, '👎': 0, '😂': 0, '🔥': 0 };
  }, [data]);

  const getUserReaction = useCallback((websiteId: string, commentId: string, userId: string): ReactionType | null => {
    const list = data.comments[websiteId] || [];
    const comment = list.find(c => c.id === commentId);
    return comment?.userReactions?.[userId] || null;
  }, [data]);

  return {
    comments,
    getCommentsForWebsite,
    getCommentCount,
    addComment,
    toggleReaction,
    getAverageRating,
    getTopCommenters,
    getRecentActivity,
    getTotalComments,
    getReactionCounts,
    getUserReaction,
  };
}

export function getAllComments(): CommentsData {
  return getCommentsData();
}
