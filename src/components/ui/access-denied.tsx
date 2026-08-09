'use client'

import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccessDeniedProps {
  requiredPermission?: string
  title?: string
  message?: string
}

export function AccessDenied({
  requiredPermission = 'security:read',
  title = 'Access Restricted',
  message = 'You do not have the required permissions to view or manage this security module.',
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="rounded-full bg-rose-100 p-4 text-rose-600 mb-4 border border-rose-200">
        <ShieldAlert className="size-10" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      
      <p className="text-sm text-muted-foreground max-w-md mt-2 leading-relaxed">
        {message}
      </p>

      {requiredPermission && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-muted border text-muted-foreground">
          <Lock className="size-3 text-rose-500" />
          Required Permission: <span className="font-semibold text-rose-600">{requiredPermission}</span>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
