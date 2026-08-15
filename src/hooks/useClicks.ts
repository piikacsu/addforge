import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'adforge_clicks_v2';

interface ClicksData {
  [websiteId: string]: number;
}

const SEED_CLICKS: ClicksData = {
  'piikacsu-games': 2847,
  'abenerp': 1923,
  'flappy-3d': 1847,
  'hskaozbhw4liw': 1567,
  'mc-locate': 1432,
  'olympus': 1623,
  'emoji-kitchen': 1204,
  'nightlines': 1398,
  'piikacsu-ai': 1089,
};

const BONUS_CLICKS = 172613; // Added bonus to total clicks display

function getClicksData(): ClicksData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CLICKS));
  return SEED_CLICKS;
}

function saveClicksData(data: ClicksData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useClicks() {
  const [clicksData, setClicksData] = useState<ClicksData>(getClicksData);

  useEffect(() => {
    setClicksData(getClicksData());
  }, []);

  const getClickCount = useCallback((websiteId: string): number => {
    return clicksData[websiteId] || 0;
  }, [clicksData]);

  const recordClick = useCallback((websiteId: string) => {
    setClicksData(prev => {
      const newData = { ...prev, [websiteId]: (prev[websiteId] || 0) + 1 };
      saveClicksData(newData);
      return newData;
    });
  }, []);

  const getTotalClicks = useCallback((): number => {
    return Object.values(clicksData).reduce((sum, c) => sum + c, 0) + BONUS_CLICKS;
  }, [clicksData]);

  return { getClickCount, recordClick, getTotalClicks };
}

export function getAllClicks(): ClicksData {
  return getClicksData();
}
