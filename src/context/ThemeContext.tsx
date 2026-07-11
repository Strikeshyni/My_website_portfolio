import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';
type VisualMode = 'classic' | 'v2';
type PaletteMode = 'ocean' | 'sunset' | 'forest' | 'citrus';

type ThemeContextValue = {
  theme: ThemeMode;
  visual: VisualMode;
  palette: PaletteMode;
  setTheme: (mode: ThemeMode) => void;
  setVisual: (mode: VisualMode) => void;
  setPalette: (mode: PaletteMode) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = 'site-theme-preferences';

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getStoredPreferences = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ThemeContextValue>) : null;
  } catch {
    return null;
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const stored = getStoredPreferences();

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (stored?.theme) return stored.theme;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });
  const [visual, setVisual] = useState<VisualMode>(() => stored?.visual ?? 'classic');
  const [palette, setPalette] = useState<PaletteMode>(() => stored?.palette ?? 'ocean');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-visual', visual);
    root.setAttribute('data-palette', visual === 'v2' ? palette : 'classic');

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme, visual, palette })
    );
  }, [theme, visual, palette]);

  const value = useMemo(
    () => ({
      theme,
      visual,
      palette,
      setTheme,
      setVisual,
      setPalette,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, visual, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
