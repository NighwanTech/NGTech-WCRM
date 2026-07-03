"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/use-auth'
import { AgentScorecard } from '@/components/dashboard/agent-scorecard'

export default function TeamPerformancePage() {
  const t = useTranslations('Dashboard')
  const { accountRole } = useAuth()
  
  const [scorecard, setScorecard] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    setLoading(true)
    let url = '/api/analytics/scorecard?'
    if (startDate) url += `startDate=${startDate}&`
    if (endDate) url += `endDate=${endDate}&`
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setScorecard(data.leaderboard)
      })
      .catch((err) => console.error('[team-performance] scorecard failed:', err))
      .finally(() => setLoading(false))
  }, [startDate, endDate])

  const title = accountRole === 'agent' ? 'My Performance' : 'Team Performance'
  const subtitle = accountRole === 'agent' 
    ? 'View your personal metrics and SLA compliance.'
    : 'Evaluate response times, resolution rates, and client satisfaction metrics across your entire team.'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <AgentScorecard 
        data={scorecard} 
        loading={loading} 
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => {
          setStartDate(start)
          setEndDate(end)
        }}
      />
    </div>
  )
}
