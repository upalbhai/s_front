"use client";

import React, { useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  Hash,
  ChevronDown,
  ChevronRight,
  Inbox,
  Calendar,
  Activity,
  CreditCard,
  Globe,
  Terminal,
  Blocks,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  X,
  Music,
  FolderOpen,
  Sparkles,
  Shield,
  RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
  href?: string;
  onClick?: () => void;
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

function WorkspaceSwitcher({ selected, onSelect }: { selected?: string, onSelect?: (ws: string) => void }) {
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between px-3 py-2 mb-6 rounded-lg select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-[15px] shadow-sm">
            <Sparkles size={18} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-black leading-tight mb-0.5 text-foreground truncate max-w-[120px]">Sound Buttons</span>
            <span className="text-[10px] text-zinc-500 leading-tight uppercase tracking-widest font-black">Control Center</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ 
  item, 
  activeId, 
  onSelect,
  level = 0,
  isSidebarOpen
}: { 
  item: NavItemData; 
  activeId: string; 
  onSelect: (id: string) => void;
  level?: number;
  isSidebarOpen?: boolean;
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      onSelect(item.id);
    }
  };

  const innerContent = (
    <>
      <div className="flex items-center gap-2.5">
        <item.icon 
          className={`w-[18px] h-[18px] transition-colors shrink-0
            ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}
          `} 
          strokeWidth={2} 
        />
        <span className="text-[13px] tracking-wide truncate mt-0.5">
          {item.title}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {item.shortcut && (
           <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium font-mono text-muted-foreground/60 bg-background/50 border border-border/50 rounded-[4px] shadow-xs">
             {item.shortcut}
           </kbd>
        )}
        {item.badge && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronRight 
            className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
            strokeWidth={2}
          />
        )}
      </div>
    </>
  );

  const containerClasses = `group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 select-none
    ${isActive 
      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold' 
      : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white font-medium'
    }
  `;

  return (
    <div className="flex flex-col w-full">
      {item.href ? (
        <Link 
          href={item.href}
          className={containerClasses}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          onClick={() => {
            if (item.onClick) item.onClick();
            onSelect(item.id);
          }}
        >
          {innerContent}
        </Link>
      ) : (
        <div 
          className={containerClasses}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          onClick={handleClick}
        >
          {innerContent}
        </div>
      )}

      {hasChildren && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l border-black/5 dark:border-white/5"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activeId={activeId} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  onWorkspaceSelect,
  onLogout,
  onGenerateSitemap,
  generatingSitemap
}: { 
  className?: string,
  onWorkspaceSelect?: (ws: string) => void,
  onLogout?: () => void,
  onGenerateSitemap?: () => void,
  generatingSitemap?: boolean
}) {
  const pathname = usePathname();
  
  // Determine active ID based on pathname
  let activeId = 'home';
  if (pathname.startsWith('/admin/sounds')) activeId = 'sounds';
  else if (pathname.startsWith('/admin/categories')) activeId = 'categories';
  else if (pathname.startsWith('/admin/blogs')) activeId = 'blogs';

  const [internalId, setInternalId] = useState(activeId);
  const currentId = activeId || internalId;
  const handleSelect = setInternalId;

  const appNavGroups: NavGroupData[] = [
    {
      items: [
        { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
        { id: 'home', title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      ]
    },
    {
      heading: 'Content',
      items: [
        { id: 'sounds', title: 'Sounds', icon: Music, href: '/admin/sounds' },
        { id: 'categories', title: 'Categories', icon: FolderOpen, href: '/admin/categories' },
        { id: 'blogs', title: 'Blogs', icon: Sparkles, href: '/admin/blogs' },
      ]
    },
    {
      heading: 'Tools',
      items: [
        { id: 'site', title: 'Open Site', icon: Shield, href: '/' },
        { 
          id: 'sitemap', 
          title: generatingSitemap ? 'Generating...' : 'Generate Sitemaps', 
          icon: RefreshCcw,
          onClick: onGenerateSitemap
        },
      ]
    }
  ];

  const appBottomItems: NavItemData[] = [
    { id: 'settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
    { id: 'logout', title: 'Log out', icon: LogOut, onClick: onLogout },
  ];

  return (
    <div className={`flex flex-col w-[260px] h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-4 font-sans ${className}`}>
      <WorkspaceSwitcher selected="Admin" onSelect={onWorkspaceSelect} />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {appNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-3 mb-2 text-[10px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mt-6">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                activeId={currentId} 
                onSelect={handleSelect} 
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-1">
        <div className="flex justify-between items-center px-3 py-2 mt-4">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Theme</span>
            <ThemeToggle />
        </div>
        {appBottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={currentId} 
            onSelect={handleSelect} 
          />
        ))}

        <div className="flex items-center gap-3 px-3 py-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="w-10 h-10 rounded-full bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-black text-[14px]">
            N
          </div>
        </div>
      </div>
    </div>
  );
}
