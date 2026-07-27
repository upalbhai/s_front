"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Music,
  FolderOpen,
  Sparkles,
  Shield,
  RefreshCcw,
  Menu,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";

export function AppSidebar({
  onGenerateSitemap,
  generatingSitemap,
  onLogout
}: {
  onGenerateSitemap?: () => void,
  generatingSitemap?: boolean,
  onLogout?: () => void
}) {
  const pathname = usePathname();

  // Determine active item
  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href) && href !== '/';
  };

  type NavItem = {
    title: string;
    icon: React.ElementType;
    url?: string;
    onClick?: () => void;
  };

  const navGroups: { title?: string; items: NavItem[] }[] = [
    {
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, url: '/admin' },
      ]
    },
    {
      title: 'Content',
      items: [
        { title: 'Sounds', icon: Music, url: '/admin/sounds' },
        { title: 'Categories', icon: FolderOpen, url: '/admin/categories' },
        { title: 'Blogs', icon: Sparkles, url: '/admin/blogs' },
      ]
    },
    {
      title: 'Tools',
      items: [
        { title: 'Open Site', icon: Shield, url: '/' },
        {
          title: generatingSitemap ? 'Generating...' : 'Generate Sitemaps',
          icon: RefreshCcw,
          onClick: onGenerateSitemap
        },
      ]
    }
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800">
      <SidebarHeader className="p-2 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Sparkles size={16} className="fill-white" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="text-[14px] font-black text-foreground">Sound Buttons</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">Control Center</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-4 gap-0">
        {navGroups.map((group, i) => (
          <SidebarGroup key={i} className="py-2">
            {group.title && (
              <SidebarGroupLabel className="px-2 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!!item.url}
                      onClick={item.onClick}
                      isActive={item.url ? isActive(item.url) : false}
                      tooltip={item.title}
                      className="px-3 py-5 rounded-xl transition-all font-bold group data-[active=true]:bg-zinc-100 data-[active=true]:text-zinc-900 dark:data-[active=true]:bg-zinc-900 dark:data-[active=true]:text-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/50 dark:hover:text-white"
                    >
                      {item.url ? (
                        <Link href={item.url} className="flex items-center gap-3 w-full">
                          <item.icon size={18} strokeWidth={2.5} className="group-data-[active=true]:text-zinc-900 dark:group-data-[active=true]:text-white shrink-0" />
                          <span className="text-[13px] tracking-wide">{item.title}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 w-full cursor-pointer">
                          <item.icon size={18} strokeWidth={2.5} className={generatingSitemap && item.icon === RefreshCcw ? "animate-spin shrink-0" : "shrink-0"} />
                          <span className="text-[13px] tracking-wide">{item.title}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-zinc-100 dark:border-zinc-800/50">
        <SidebarMenu>
          {/* Theme Toggle mapped as a menu item so it collapses cleanly */}

          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" className="px-3 py-5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/50 dark:hover:text-white">
              <Link href="#" className="flex items-center gap-3 w-full">
                <Settings size={18} strokeWidth={2.5} className="shrink-0" />
                <span className="text-[13px] tracking-wide group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} tooltip="Log out" className="px-3 py-5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/50 dark:hover:text-white">
              <div className="flex items-center gap-3 w-full cursor-pointer">
                <LogOut size={18} strokeWidth={2.5} className="shrink-0" />
                <span className="text-[13px] tracking-wide group-data-[collapsible=icon]:hidden">Log out</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="mt-2 border-t border-zinc-100 dark:border-zinc-800/50 pt-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Profile" className="hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-black text-[14px]">
                A
              </div>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="text-[13px] font-black text-foreground">Admin</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">Admin Account</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
