import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'adforge_likes';

interface LikesData {
  [websiteId: string]: number;
}

interface UserLikes {
  [websiteId: string]: boolean;
}

function getLikesData(): LikesData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
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
