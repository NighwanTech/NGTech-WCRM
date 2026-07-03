import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/30 text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="NGTech Logo" className="w-48 sm:w-64 h-auto object-contain" />
            </Link>
            
            <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
              <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="/solutions" className="hover:text-foreground transition-colors">Solutions</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login" className="hidden text-sm font-medium hover:text-primary md:block">
              Log in
            </Link>
            <Link href="/free-trial" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <img src="/logo.svg" alt="NGTech Logo" className="w-56 sm:w-64 h-auto object-contain" />
              </Link>
              <p className="text-sm text-muted-foreground pr-4">
                India's leading WhatsApp CRM platform for ambitious sales and support teams. Convert more leads and manage customer relationships on WhatsApp.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-primary">Integrations</Link></li>
                <li><Link href="/changelog" className="hover:text-primary">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Solutions</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/solutions/education" className="hover:text-primary">Education CRM</Link></li>
                <li><Link href="/solutions/real-estate" className="hover:text-primary">Real Estate</Link></li>
                <li><Link href="/solutions/ecommerce" className="hover:text-primary">E-commerce</Link></li>
                <li><Link href="/solutions/healthcare" className="hover:text-primary">Healthcare</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link href="/legal/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center justify-between border-t border-border/50 pt-8 sm:flex-row text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} NGTech WCRM. All rights reserved.</p>
            <div className="mt-4 flex gap-4 sm:mt-0">
              <Link href="/legal/terms" className="hover:text-primary">Terms</Link>
              <Link href="/legal/privacy-policy" className="hover:text-primary">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
