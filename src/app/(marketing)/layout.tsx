import React from 'react'
import Link from 'next/link'
import { MarketingMobileMenu } from '@/components/layout/marketing-mobile-menu'
import { EnterpriseFooter } from '@/components/layout/enterprise-footer'
import { AiChatbot } from '@/components/marketing/ai-chatbot'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/30 text-foreground overflow-x-clip">
      {/* ─── Header Navbar ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <Link href="/" className="flex items-center shrink-0 group">
              <img src="/logo.svg" alt="AIWCRM Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
            </Link>

            <nav className="hidden xl:flex items-center gap-1 min-w-0">
              {[
                { href: '/platform', label: 'Platform' },
                { href: '/features', label: 'Features' },
                { href: '/use-cases', label: 'Use Cases' },
                { href: '/why-aiwcrm', label: 'Why AIWCRM' },
                { href: '/solutions', label: 'Solutions' },
                { href: '/vs', label: 'Compare' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/docs', label: 'Docs' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group px-2 py-1.5 text-[11px] font-bold tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
                >
                  <span>{item.label}</span>
                  <span className="absolute inset-x-2 -bottom-px h-[2px] bg-gradient-to-r from-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/918092225777"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden 2xl:inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white px-3.5 py-1.5 rounded-full border border-[#25D366]/20 transition-all duration-300 whitespace-nowrap shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </a>
            <Link href="/login" className="hidden lg:inline-flex h-8 items-center justify-center rounded-full border border-border/60 bg-transparent px-4 text-xs font-semibold text-foreground/80 transition-all duration-200 hover:bg-card hover:border-primary/30 hover:text-foreground shrink-0">
              Log in
            </Link>
            <Link href="/free-trial" className="inline-flex h-8 sm:h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 border-0 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] whitespace-nowrap shrink-0">
              Start Free Trial
            </Link>
            <MarketingMobileMenu />
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1">
        <Breadcrumbs />
        {children}
      </main>

      {/* ─── Enterprise Footer ─── */}
      <EnterpriseFooter />

      {/* ─── Global AI Chatbot Widget ─── */}
      <AiChatbot />
    </div>
  )
}
