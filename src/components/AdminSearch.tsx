'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Music, FolderOpen, Sparkles } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useTheme } from 'next-themes';

export function AdminSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-xl border sm:w-64 ${isDark
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
            : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 shadow-sm'
          }`}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline-flex flex-1 text-left">Search...</span>
        <kbd
          className={`hidden sm:inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-400' : 'border-zinc-300 bg-zinc-50 text-zinc-500'
            }`}
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Links">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/admin'))}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/admin/sounds'))}
            >
              <Music className="mr-2 h-4 w-4" />
              <span>Sounds</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/admin/categories'))}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Categories</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/admin/blogs'))}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Blogs</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/admin/sounds/new'))}
            >
              <Music className="mr-2 h-4 w-4" />
              <span>Create New Sound</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

// Just defining LayoutDashboard here because I didn't import it at the top
import { LayoutDashboard } from 'lucide-react';
