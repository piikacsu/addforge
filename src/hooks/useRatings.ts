import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'adforge_ratings';

interface RatingsData {
  [websiteId: string]: {
    total: number;
    count: number;
  };
}

interface UserRatings {
  [websiteId: string]: number;
}

function getRatingsData(): RatingsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function getUserRatings(): UserRatings {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveRatingsData(data: RatingsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveUserRatings(data: UserRatings) {
  localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(data));
}

export function useRatings() {
  const [ratingsData, setRatingsData] = useState<RatingsData>(getRatingsData);
  const [userRatings, setUserRatings] = useState<UserRatings>(getUserRatings);

  useEffect(() => {
    setRatingsData(getRatingsData());
    setUserRatings(getUserRatings());
  }, []);

  const getAverageRating = useCallback((websiteId: string): number => {
    const data = ratingsData[websiteId];
    if (!data || data.count === 0) return 0;
    return Math.round((data.total / data.count) * 10) / 10;
  }, [ratingsData]);

  const getUserRating = useCallback((websiteId: string): number => {
    return userRatings[websiteId] || 0;
  }, [userRatings]);

  const hasRated = useCallback((websiteId: string): boolean => {
    return !!userRatings[websiteId];
  }, [userRatings]);

  const submitRating = useCallback((websiteId: string, rating: number) => {
    const oldRating = userRatings[websiteId];
    setRatingsData(prev => {
      const current = prev[websiteId] || { total: 0, count: 0 };
      const newTotal = oldRating ? current.total - oldRating + rating : current.total + rating;
      const newCount = oldRating ? current.count : current.count + 1;
      const newData = { ...prev, [websiteId]: { total: newTotal, count: newCount } };
      saveRatingsData(newData);
      return newData;
    });
    setUserRatings(prev => {
      const newData = { ...prev, [websiteId]: rating };
      saveUserRatings(newData);
      return newData;
    });
  }, [userRatings]);

  return { getAverageRating, getUserRating, hasRated, submitRating };
}

export function getAllRatings(): RatingsData {
  return getRatingsData();
}
