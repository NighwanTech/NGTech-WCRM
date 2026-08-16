'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SearchProvider, SearchResult } from '@/lib/services/search/provider'
import { useNavigation } from './navigation-provider'
import { 
  Search, 
  Loader2, 
  ArrowRight,
  Star,
  History,
  Command,
  LayoutDashboard,
  Zap,
  Users,
  Settings,
  GitBranch,
  Bot
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const { groups, favorites } = useNavigation()

  // Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Flatten nav config for local search
  const localModules: SearchResult[] = groups.flatMap(group => 
    group.items.map(item => ({
      id: item.id,
      title: item.label,
      subtitle: `Module in ${group.label}`,
      type: 'MODULE',
      url: item.href
    }))
  )

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      const res = await SearchProvider.search(query, localModules)
      setResults(res)
      setLoading(false)
    }

    const timer = setTimeout(fetchResults, 200) // Debounce typing
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (url: string) => {
    setOpen(false)
    setQuery('')
    router.push(url)
  }

  // Pre-calculated default state sections
  const favoriteItems = NAVIGATION_CONFIG.flatMap(g => g.items).filter(i => favorites.includes(i.id))
  
  const quickActions = [
    { title: 'Create Broadcast', subtitle: 'Launch a new WhatsApp campaign', icon: Zap, url: '/broadcasts/new', shortcut: '⇧ B' },
    { title: 'Add Contact', subtitle: 'Create a new CRM contact', icon: Users, url: '/contacts/new', shortcut: '⇧ C' },
    { title: 'View Pipelines', subtitle: 'Check your active deals', icon: GitBranch, url: '/pipelines', shortcut: '⇧ P' },
    { title: 'Ask AI Assistant', subtitle: 'Open Copilot for help', icon: Bot, url: '/ai-assistant', shortcut: '⇧ A' },
  ]

  // A helper to pick an icon for dynamic search results
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'CONTACT': return <Users className="w-4 h-4 text-blue-500" />
      case 'PIPELINE': return <GitBranch className="w-4 h-4 text-emerald-500" />
      case 'CAMPAIGN': return <Zap className="w-4 h-4 text-amber-500" />
      case 'MODULE': return <LayoutDashboard className="w-4 h-4 text-indigo-500" />
      default: return <Command className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden shadow-2xl rounded-2xl border border-border/80 gap-0",
          "!fixed !top-[62px] !left-3 sm:!left-4 md:!left-[18px] !translate-x-0 !translate-y-0",
          "w-[calc(100vw-24px)] sm:w-[500px] md:w-[540px] max-w-[560px]",
          "bg-popover/95 dark:bg-zinc-950/95 backdrop-blur-2xl",
          "ring-1 ring-black/5 dark:ring-white/10",
          "duration-200"
        )}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        
        {/* Search Input Area */}
        <div className="flex items-center border-b border-border/50 px-4 bg-transparent">
          <Search className="mr-3 h-5 w-5 shrink-0 opacity-50" />
          <Input 
            placeholder="Search Workspace, Contacts, Pipelines or type a command..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex h-16 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 text-muted-foreground ml-3 shrink-0" />
          ) : (
            <div className="flex items-center gap-1 ml-3 shrink-0">
              <kbd className="font-sans font-semibold bg-muted/50 border border-border rounded text-[10px] px-1.5 py-0.5 text-muted-foreground">esc</kbd>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 hide-scrollbar">
          
          {/* Default State (When query is empty) */}
          {!query && (
            <div className="space-y-4 py-2">
              
              {/* Favorites Section */}
              {favoriteItems.length > 0 && (
                <div className="px-2">
                  <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                    <Star className="w-3 h-3" /> Favorites
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {favoriteItems.map(item => (
                      <div 
                        key={`fav-${item.id}`}
                        className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-muted/60 transition-colors group"
                        onClick={() => handleSelect(item.href)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-background border shadow-sm group-hover:shadow transition-all text-foreground/70">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm text-foreground/90">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="px-2">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                  <Zap className="w-3 h-3" /> Quick Actions
                </h3>
                <div className="flex flex-col gap-1">
                  {quickActions.map(action => (
                    <div 
                      key={action.title}
                      className="flex items-center justify-between p-2.5 cursor-pointer rounded-lg hover:bg-muted/60 transition-colors group"
                      onClick={() => handleSelect(action.url)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-foreground/70 group-hover:bg-background group-hover:shadow-sm border border-transparent group-hover:border-border transition-all">
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground/90 leading-none">{action.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{action.subtitle}</p>
                        </div>
                      </div>
                      <kbd className="hidden sm:inline-flex font-sans font-medium bg-background border border-border rounded text-[10px] px-1.5 py-0.5 text-muted-foreground/70 group-hover:text-muted-foreground shadow-sm">
                        {action.shortcut}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && results.length === 0 && !loading && (
            <div className="py-14 text-center flex flex-col items-center justify-center text-muted-foreground">
              <Search className="w-8 h-8 mb-4 opacity-20" />
              <p className="text-sm font-medium text-foreground">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for contacts, modules, or settings.</p>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="py-2 px-2 flex flex-col gap-1">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
                Search Results
              </h3>
              {results.map(result => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-2.5 cursor-pointer rounded-lg hover:bg-muted/80 transition-colors group"
                  onClick={() => handleSelect(result.url)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-background border shadow-sm">
                      {getResultIcon(result.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground/90 flex items-center gap-2">
                        {result.title}
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5 uppercase font-bold tracking-wider bg-muted text-muted-foreground/80 border-0">{result.type}</Badge>
                      </div>
                      {result.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{result.subtitle}</p>}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-50 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
