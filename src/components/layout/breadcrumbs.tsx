'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't render visual breadcrumb on home page
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    
    // Format label: capitalize & format hyphenated words
    const formattedLabel = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      href,
      label: formattedLabel,
      isLast: index === pathSegments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-muted/20 border-b border-border/30 py-2.5 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-muted-foreground font-medium overflow-x-auto whitespace-nowrap">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>

        {breadcrumbs.map((crumb) => (
          <div key={crumb.href} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            {crumb.isLast ? (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
