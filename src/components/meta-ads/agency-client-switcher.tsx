"use client"

import { useState, useRef, useEffect } from "react"
import { Building, Users, ChevronDown, Check, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export interface AgencyAccountItem {
  id: string
  name: string
  clientsCount: number
}

export interface ClientAccountItem {
  id: string
  name: string
  category: string
  adAccountsCount: number
}

export interface AgencyClientSwitcherProps {
  onSelectClient?: (clientId: string) => void
}

/**
 * Agency & Client Multi-Tenant Switcher
 * Supports Agency -> Client -> Business -> Ad Account hierarchy.
 */
export function AgencyClientSwitcher({ onSelectClient }: AgencyClientSwitcherProps) {
  const { account } = useAuth()
  const workspaceName = account?.name || "Enterprise Workspace"

  const [clients, setClients] = useState<ClientAccountItem[]>([
    { id: "client_default", name: workspaceName, category: "Production", adAccountsCount: 1 }
  ])

  const [selectedClient, setSelectedClient] = useState<ClientAccountItem>({
    id: "client_default",
    name: workspaceName,
    category: "Production",
    adAccountsCount: 1
  })

  useEffect(() => {
    if (account?.name) {
      const updated = { id: "client_default", name: account.name, category: "Production", adAccountsCount: 1 }
      setClients([updated])
      setSelectedClient(updated)
    }
  }, [account?.name])

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (client: ClientAccountItem) => {
    setSelectedClient(client)
    setIsOpen(false)
    if (onSelectClient) onSelectClient(client.id)
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-2.5 rounded-xl border bg-background hover:bg-muted/40 font-bold transition-all cursor-pointer shadow-2xs"
      >
        <Building className="w-3.5 h-3.5 text-primary" />
        <span className="truncate max-w-[140px] text-foreground">{selectedClient.name}</span>
        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
          {selectedClient.category}
        </Badge>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 rounded-2xl border bg-popover text-popover-foreground shadow-2xl z-50 p-2 text-xs space-y-1">
          <div className="p-2 border-b bg-muted/20 rounded-xl space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Active Workspace</span>
            <p className="font-bold text-foreground truncate">{workspaceName}</p>
          </div>

          <div className="py-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground px-2">Connected Accounts</span>
            <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
              {clients.map(client => {
                const isSelected = client.id === selectedClient.id
                return (
                  <button
                    key={client.id}
                    onClick={() => handleSelect(client)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isSelected ? 'bg-primary/10 font-bold text-primary' : 'hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{client.name}</p>
                      <p className="text-[9px] text-muted-foreground">{client.category} • Active</p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-1 border-t">
            <Link
              href="/settings?tab=meta_ads"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-primary hover:bg-primary/10 transition-colors font-bold text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" /> Connect Another Ad Account / Client
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
