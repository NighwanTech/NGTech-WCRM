"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, Settings as SettingsIcon, User, LayoutGrid, FileText, Shield, ChevronRight } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useNavigation } from "./navigation-provider";



interface HeaderProps {
  /** Wired to the shell's drawer state. Used only on mobile — the
   *  hamburger button is hidden on lg+. */
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { profile, isOwner, signOut } = useAuth();
  const { groups } = useNavigation();

  // Find current breadcrumb
  let currentGroup: { label: string; icon?: React.ElementType; color?: string } | null = null
  let currentItem: { label: string; icon?: React.ElementType } | null = null
  
  for (const group of groups) {
    const item = group.items.find(i => pathname === i.href || (i.href !== '/dashboard' && pathname.startsWith(i.href)))
    if (item) {
      currentGroup = { label: group.label, icon: group.groupIcon, color: group.colorClass }
      currentItem = { label: item.label, icon: item.icon }
      break
    }
  }

  // Fallback
  if (!currentItem) currentItem = { label: "Dashboard" }

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() ??
    profile?.email?.charAt(0)?.toUpperCase() ??
    "U";

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 lg:px-5">
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — mobile only. 44×44 hit target per Apple HIG. */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 overflow-hidden">
          {currentGroup && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground/80">
                {currentGroup.icon && <currentGroup.icon className={`w-[14px] h-[14px] ${currentGroup.color?.split(' ')[0]}`} />}
                <span className="truncate text-[13px] font-medium tracking-tight">
                  {currentGroup.label}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 hidden sm:inline-block" />
            </>
          )}
          <div className="flex items-center gap-1.5 text-foreground">
            {currentItem.icon && <currentItem.icon className="w-4 h-4 opacity-80" />}
            <h1 className="truncate text-[15px] font-semibold tracking-tight">
              {currentItem.label}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isOwner && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 shadow-sm transition-all"
          >
            <Shield className="size-3.5" />
            <span>Super Admin</span>
          </Link>
        )}

        <LanguageSwitcher />
        <ModeToggle />

        <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-muted/70 focus:bg-muted/70 focus:outline-none data-popup-open:bg-muted/70 sm:gap-3 sm:pl-1 sm:pr-3"
          aria-label="Open account menu"
        >
          <Avatar className="size-8">
            {profile?.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.full_name ?? "Avatar"}
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-foreground sm:inline">
            {profile?.full_name ?? "User"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="min-w-56 bg-popover text-popover-foreground ring-border"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium text-foreground">
              {profile?.full_name ?? "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile?.email ?? ""}
            </p>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          {isOwner && (
            <DropdownMenuItem
              render={
                <Link
                  href="/admin"
                  className="text-emerald-400 font-bold focus:bg-accent focus:text-accent-foreground"
                />
              }
            >
              <Shield className="size-4 text-emerald-400" />
              Super Admin Portal
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            render={
              <Link
                href="/settings?tab=profile"
                className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
              />
            }
          >
            <User className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link
                href="/settings?tab=whatsapp"
                className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
              />
            }
          >
            <SettingsIcon className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link
                href="/settings?tab=plan"
                className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
              />
            }
          >
            <LayoutGrid className="size-4" />
            Subscription
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link
                href="/settings?tab=invoices"
                className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
              />
            }
          >
            <FileText className="size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={signOut}
            className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
