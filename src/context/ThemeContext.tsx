import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'matrix' | 'rainbow';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  unlockMatrix: boolean;
  unlockRainbow: boolean;
  setUnlockMatrix: (v: boolean) => void;
  setUnlockRainbow: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'adforge-theme';
const MATRIX_KEY = 'adforge-matrix-unlocked';
const RAINBOW_KEY = 'adforge-rainbow-unlocked';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [unlockMatrix, setUnlockMatrix] = useState(() => {
    try {
      return localStorage.getItem(MATRIX_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [unlockRainbow, setUnlockRainbow] = useState(() => {
    try {
      return localStorage.getItem(RAINBOW_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch { /* noop */ }
  };

  const toggleTheme = () => {
    setThemeState((prev: Theme) => {
      const order: Theme[] = ['dark', 'light'];
      if (unlockMatrix) order.push('matrix');
      if (unlockRainbow) order.push('rainbow');
      const idx = order.indexOf(prev);
      const next = order[(idx + 1) % order.length];
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch { /* noop */ }
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'matrix', 'rainbow');
    root.classList.add(theme);
  }, [theme]);

  const handleSetUnlockMatrix = (v: boolean) => {
    setUnlockMatrix(v);
    try {
      localStorage.setItem(MATRIX_KEY, String(v));
    } catch { /* noop */ }
  };

  const handleSetUnlockRainbow = (v: boolean) => {
    setUnlockRainbow(v);
    try {
      localStorage.setItem(RAINBOW_KEY, String(v));
    } catch { /* noop */ }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        unlockMatrix,
        unlockRainbow,
        setUnlockMatrix: handleSetUnlockMatrix,
        setUnlockRainbow: handleSetUnlockRainbow,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
