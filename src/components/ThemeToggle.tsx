'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/i18n';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-foreground/[0.05] animate-pulse" />
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-foreground/[0.05] border border-border text-foreground transition-all hover:border-primary/50 hover:bg-foreground/[0.1] shadow-sm active:scale-90"
      aria-label={t('common.toggle_theme')}
    >
      {currentTheme === 'dark' ? (
        <Sun size={18} className="text-foreground animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        <Moon size={18} className="text-foreground animate-in zoom-in spin-in-90 duration-300" />
      )}
    </button>
  );
}
