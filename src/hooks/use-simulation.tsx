'use client'

import React, { createContext, useContext, useState } from 'react'

interface SimulationContextType {
  simulatedRole: string | null
  simulatedEmail: string | null
  isSimulating: boolean
  startSimulation: (role: string, email?: string) => void
  exitSimulation: () => void
}

const SimulationContext = createContext<SimulationContextType>({
  simulatedRole: null,
  simulatedEmail: null,
  isSimulating: false,
  startSimulation: () => {},
  exitSimulation: () => {},
})

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null)
  const [simulatedEmail, setSimulatedEmail] = useState<string | null>(null)

  const startSimulation = (role: string, email?: string) => {
    setSimulatedRole(role)
    setSimulatedEmail(email || 'simulated.user@workspace.local')
  }

  const exitSimulation = () => {
    setSimulatedRole(null)
    setSimulatedEmail(null)
  }

  return (
    <SimulationContext.Provider
      value={{
        simulatedRole,
        simulatedEmail,
        isSimulating: !!simulatedRole,
        startSimulation,
        exitSimulation,
      }}
    >
      {simulatedRole && (
        <div className="bg-amber-500 text-slate-950 font-medium px-4 py-1.5 text-xs flex items-center justify-between shadow-sm border-b border-amber-600 sticky top-0 z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px]">
              SIMULATION MODE ACTIVE
            </span>
            <span>
              Previewing UI experience as <strong className="underline">{simulatedRole}</strong> ({simulatedEmail})
            </span>
          </div>
          <button
            type="button"
            onClick={exitSimulation}
            className="bg-slate-950 hover:bg-slate-900 text-white px-2.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all"
          >
            Exit Simulation Mode ✖
          </button>
        </div>
      )}
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  return useContext(SimulationContext)
}
