"use client"

import { useState } from "react"
import { Building, Users, ChevronDown, Check, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
 * CTO Refinement #10 — Agency & Client Multi-Tenant Switcher
 * Supports Agency -> Client -> Business -> Ad Account hierarchy.
 */
export function AgencyClientSwitcher({ onSelectClient }: AgencyClientSwitcherProps) {
  const [agencies] = useState<AgencyAccountItem[]>([
    { id: "agency_1", name: "Apex Marketing Group (Agency)", clientsCount: 8 }
  ])

  const [clients, setClients] = useState<ClientAccountItem[]>([
    { id: "client_1", name: "Germopick Healthcare", category: "Healthcare & Hygiene", adAccountsCount: 2 },
    { id: "client_2", name: "Patna Housing Pvt Ltd", category: "Real Estate", adAccountsCount: 3 },
    { id: "client_3", name: "Bihari Sweets & Food", category: "Restaurant & Food", adAccountsCount: 1 },
    { id: "client_4", name: "St. Xavier Academy", category: "Education & School", adAccountsCount: 1 }
  ])

  const [selectedClient, setSelectedClient] = useState<ClientAccountItem>(clients[0])
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (client: ClientAccountItem) => {
    setSelectedClient(client)
    setIsOpen(false)
    if (onSelectClient) onSelectClient(client.id)
  }

  return (
    <div className="relative inline-block text-xs">
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
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Active Agency Workspace</span>
            <p className="font-bold text-foreground">{agencies[0].name}</p>
          </div>

          <div className="py-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground px-2">Select Client Account</span>
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
                      <p className="text-[9px] text-muted-foreground">{client.category} • {client.adAccountsCount} Ad Accounts</p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
