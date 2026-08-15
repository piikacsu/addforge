import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'adforge_likes_v3';

interface LikesData {
  [websiteId: string]: number;
}

interface UserLikes {
  [websiteId: string]: boolean;
}

const SEED_LIKES: LikesData = {
  // Ranked: Piikacsu's Games #1, ABENERP #2, Flappy 3D #3, Black Hole Explorer #4, Mc Locate #5, OLYMPUS #6, Emoji Kitchen #7, NIGHTLINES #8, Piikacsu AI #9
  'piikacsu-games': 147,
  'abenerp': 98,
  'flappy-3d': 89,
  'hskaozbhw4liw': 85,
  'mc-locate': 76,
  'olympus': 67,
  'emoji-kitchen': 63,
  'nightlines': 54,
  'piikacsu-ai': 52,
};

function getLikesData(): LikesData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // First visit: seed with pre-populated likes
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LIKES));
  return SEED_LIKES;
}

function getUserLikes(): UserLikes {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveLikesData(data: LikesData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveUserLikes(data: UserLikes) {
  localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(data));
}

export function useLikes() {
  const [likesData, setLikesData] = useState<LikesData>(getLikesData);
  const [userLikes, setUserLikes] = useState<UserLikes>(getUserLikes);

  useEffect(() => {
    setLikesData(getLikesData());
    setUserLikes(getUserLikes());
  }, []);

  const getLikeCount = useCallback((websiteId: string): number => {
    return likesData[websiteId] || 0;
  }, [likesData]);

  const hasLiked = useCallback((websiteId: string): boolean => {
    return !!userLikes[websiteId];
  }, [userLikes]);

  const toggleLike = useCallback((websiteId: string) => {
    setLikesData(prev => {
      const current = prev[websiteId] || 0;
      const newData = { ...prev, [websiteId]: userLikes[websiteId] ? Math.max(0, current - 1) : current + 1 };
      saveLikesData(newData);
      return newData;
    });
    setUserLikes(prev => {
      const newData = { ...prev, [websiteId]: !prev[websiteId] };
      saveUserLikes(newData);
      return newData;
    });
  }, [userLikes]);

  return { getLikeCount, hasLiked, toggleLike };
}

export function getAllLikes(): LikesData {
  return getLikesData();
}
