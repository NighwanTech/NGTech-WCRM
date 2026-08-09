'use client'

import React from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Permission } from '@/lib/security/permissions'

interface PermissionGuardProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Feature-level UI Guard Component.
 * Conditionally renders children if user possesses the permission, or renders fallback.
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { can } = usePermissions()

  if (!can(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
