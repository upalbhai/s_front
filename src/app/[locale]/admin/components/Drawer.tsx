'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, subtitle, children, width = 'max-w-2xl' }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed top-0 right-0 z-50 h-full ${width} w-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } ${
          isDark 
            ? 'bg-zinc-950 border-l border-zinc-800 text-white' 
            : 'bg-white border-l border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between gap-4 px-8 py-6 border-b shrink-0 transition-colors duration-300 ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Admin</p>
            <h2 className="text-2xl font-black tracking-tighter text-foreground">{title}</h2>
            {subtitle && (
              <p className={`text-xs font-medium mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shrink-0 mt-1 ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' 
                : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-900'
            }`}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </>
  );
}
