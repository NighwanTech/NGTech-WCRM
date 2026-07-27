'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Users,
  Send,
  Kanban,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardMobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/inbox',
      label: 'Inbox',
      icon: MessageSquare,
      badge: true,
    },
    {
      href: '/contacts',
      label: 'Contacts',
      icon: Users,
    },
    {
      href: '/broadcasts',
      label: 'Broadcasts',
      icon: Send,
    },
    {
      href: '/pipelines',
      label: 'Pipelines',
      icon: Kanban,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="dashboard-mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-border/60 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center w-full h-full py-1 transition-all duration-300 select-none group',
                isActive ? 'text-emerald-500 font-bold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active Tab Glow & Indicator Line */}
              {isActive && (
                <span className="absolute top-0 inset-x-3 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              )}

              {/* Icon Container */}
              <div
                className={cn(
                  'relative p-1.5 rounded-2xl transition-all duration-300',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-500 scale-110 shadow-sm'
                    : 'group-active:scale-95'
                )}
              >
                <Icon className="h-5 w-5" />

                {/* Badge Dot for Inbox */}
                {item.badge && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background animate-ping" />
                )}
              </div>

              {/* Label */}
              <span className={cn('text-[10px] tracking-tight mt-0.5 font-medium transition-colors', isActive && 'font-extrabold text-emerald-600 dark:text-emerald-400')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
