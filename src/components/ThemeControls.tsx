import { useTheme } from '../context/ThemeContext';

const ThemeControls = () => {
  const { theme, visual, palette, setTheme, setVisual, setPalette } = useTheme();

  const palettes = [
    { id: 'ocean', label: 'Ocean', swatch: 'linear-gradient(120deg, #0ea5e9, #3b82f6)' },
    { id: 'sunset', label: 'Sunset', swatch: 'linear-gradient(120deg, #f97316, #ef4444)' },
    { id: 'forest', label: 'Forest', swatch: 'linear-gradient(120deg, #22c55e, #14b8a6)' },
    { id: 'citrus', label: 'Citrus', swatch: 'linear-gradient(120deg, #eab308, #f97316)' },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setVisual('classic')}
          className={`px-3 py-1 text-xs sm:text-sm theme-pill transition-all ${
            visual === 'classic' ? 'theme-pill-active' : ''
          }`}
        >
          Classic
        </button>
        <button
          type="button"
          onClick={() => setVisual('v2')}
          className={`px-3 py-1 text-xs sm:text-sm theme-pill transition-all ${
            visual === 'v2' ? 'theme-pill-active' : ''
          }`}
        >
          V2
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 text-xs sm:text-sm theme-pill transition-all ${
            theme === 'dark' ? 'theme-pill-active' : ''
          }`}
        >
          Dark
        </button>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`px-3 py-1 text-xs sm:text-sm theme-pill transition-all ${
            theme === 'light' ? 'theme-pill-active' : ''
          }`}
        >
          Light
        </button>
      </div>

      {visual === 'v2' && (
        <div className="flex items-center gap-2">
          {palettes.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPalette(option.id)}
              className={`w-7 h-7 theme-swatch transition-transform ${
                palette === option.id ? 'scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              title={option.label}
              aria-label={`Palette ${option.label}`}
              style={{ background: option.swatch }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeControls;
