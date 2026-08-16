import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react'

export const metadata = {
  title: 'Enterprise Security, Privacy & PBAC Governance | AIWCRM',
  description: 'Learn about AIWCRM enterprise security standards: 4-tier PBAC access controls, SHA-256 cryptographic audit logs, DPDP & GDPR compliance, AES-256 encryption, and AI safety.',
}

export default function SecurityPortalPage() {
  const securityPillars = [
    {
      title: '3-Tier PBAC Permission Matrix',
      desc: 'Granular access control matching Salesforce & Azure AD standards: Workspace Access → Feature Levels (None/Read/Write/Admin) → Action Permissions and Data Visibility Scopes (All, Department, Branch, Assigned, Own).',
      badge: 'RBAC / PBAC',
      icon: Sliders,
    },
    {
      title: 'SHA-256 Cryptographic Audit Trails',
      desc: 'Immutable, cryptographically verifiable ledger logging every user login, data export, role change, phone unmasking, and financial transaction for statutory compliance.',
      badge: 'Audit Ledger',
      icon: FileCheck,
    },
    {
      title: 'End-to-End Data Encryption',
      desc: 'All sensitive customer records, API keys, and financial data are encrypted at rest using AES-256 and in transit via TLS 1.3 encryption across isolated multi-region VPC nodes.',
      badge: 'AES-256',
      icon: Lock,
    },
    {
      title: 'Remote Session Revocation & MFA',
      desc: 'Instant remote session termination, automated token invalidation, multi-factor authentication (MFA), and super admin lockout guards preventing accidental administrative lockout.',
      badge: 'Identity & Access',
      icon: KeyRound,
    },
    {
      title: 'DPDP Act & GDPR Data Privacy',
      desc: 'Strict customer privacy enforcement with automated phone number masking for frontline reps, consent tracking, and localized data residency compliant with the Indian DPDP Act.',
      badge: 'Compliance',
      icon: ShieldCheck,
    },
    {
      title: 'AI Safety, Guardrails & BYOK Isolation',
      desc: 'Customer API keys are stored in encrypted client-side secret vaults. Zero data is shared with AI model providers for public training. Human-in-the-loop approvals for autonomous actions.',
      badge: 'AI Governance',
      icon: Eye,
    },
  ]

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Shield className="w-3.5 h-3.5" /> Enterprise Trust & Security
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
          Zero-Trust Security & Compliance{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            for Enterprise Scale.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          AIWCRM is architected from the ground up with bank-grade encryption, cryptographic auditability, and fine-grained policy-based access governance.
        </p>
      </div>

      {/* Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityPillars.map((sp) => {
          const Icon = sp.icon
          return (
            <div
              key={sp.title}
              className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded border text-muted-foreground">
                  {sp.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground">{sp.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{sp.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Compliance Matrix Bar */}
      <div className="p-6 sm:p-8 rounded-3xl border bg-muted/20 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Statutory & Regulatory Alignment</h2>
            <p className="text-xs text-muted-foreground">Built to satisfy demanding corporate compliance and legal mandates</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            100% Audit Ready
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Data Privacy</span>
            <div className="font-bold text-foreground">DPDP Act (India) & GDPR</div>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Statutory Tax</span>
            <div className="font-bold text-foreground">18% GST Compliant</div>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Uptime SLA</span>
            <div className="font-bold text-emerald-600">99.95% Guaranteed</div>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Deployment</span>
            <div className="font-bold text-foreground">Multi-Tenant / VPC</div>
          </div>
        </div>
      </div>

      {/* Dual CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Need a Custom Security Review or DPA?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Our security architecture team is available to assist your CISO with SOC2 reviews, penetration test reports, and custom DPAs.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          >
            Contact Security Team
          </Link>
          <Link
            href="/free-trial"
            className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-6 text-xs font-bold text-foreground shadow-sm transition-all hover:bg-muted"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}
