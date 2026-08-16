"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, GitCommit, Sparkles, Check, RotateCcw, Copy, Eye, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export interface CreativeVersionItem {
  version: number
  name: string
  author: string
  headline: string
  primaryText: string
  thumbnail: string
  createdAt: string
  isActive?: boolean
}

export interface CreativeVersionManagerProps {
  adName?: string
  onRestoreVersion?: (version: CreativeVersionItem) => void
}

/**
 * CTO Refinement #3 — Git-Style Creative Version Manager (V1, V2, V3, V4)
 * Allows media buyers and designers to track creative iterations with Compare & Restore.
 */
export function CreativeVersionManager({
  adName = "Ad 01 - Poster Creative Hook",
  onRestoreVersion
}: CreativeVersionManagerProps) {
  const [versions, setVersions] = useState<CreativeVersionItem[]>([
    {
      version: 4,
      name: "V4 - Hinglish Hook & WhatsApp CTA (Active)",
      author: "AI Marketing Assistant",
      headline: "Need Verified Expert Support in Bihar? Chat Direct on WhatsApp",
      primaryText: "⚡ Instant pricing and local expert consultation in Patna. Chat live now.",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      createdAt: "Today at 14:20",
      isActive: true
    },
    {
      version: 3,
      name: "V3 - High Contrast Banner Hook",
      author: "Senior Designer @Designer",
      headline: "Book Authentic Consultation Online | Instant Support",
      primaryText: "🚀 Discover authentic verified services. Connect on WhatsApp today.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      createdAt: "Yesterday at 11:00",
      isActive: false
    },
    {
      version: 2,
      name: "V2 - Hindi Copy Polish",
      author: "Copywriter @Marketing",
      headline: "पटना में डायरेक्ट व्हाट्सएप कंसल्टेशन प्राप्त करें",
      primaryText: "सत्यापित सेवाओं की जानकारी तुरंत पाएं। आज ही चैट शुरू करें।",
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
      createdAt: "3 days ago",
      isActive: false
    },
    {
      version: 1,
      name: "V1 - Initial AI Generation",
      author: "AI Campaign Creator",
      headline: "Authentic Verified Services in Bihar",
      primaryText: "Contact our team online today.",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      createdAt: "5 days ago",
      isActive: false
    }
  ])

  const [compareVersions, setCompareVersions] = useState<[CreativeVersionItem, CreativeVersionItem] | null>(null)

  const handleRestore = (ver: CreativeVersionItem) => {
    setVersions(prev => prev.map(v => ({ ...v, isActive: v.version === ver.version })))
    toast.success(`Restored Creative Version V${ver.version} (${ver.name}) as active!`)
    if (onRestoreVersion) onRestoreVersion(ver)
  }

  return (
    <Card className="border bg-card shadow-xs overflow-hidden text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Git-Style Creative Version Manager
            </CardTitle>
            <CardDescription className="text-[10px]">
              Creative iteration history for {adName}
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {versions.length} Versions Recorded
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Version List */}
        <div className="space-y-2">
          {versions.map(ver => (
            <div
              key={ver.version}
              className={`p-3 rounded-xl border transition-all ${
                ver.isActive ? 'bg-primary/5 border-primary/40 shadow-xs' : 'bg-muted/10 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GitCommit className={`w-3.5 h-3.5 ${ver.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-bold text-foreground text-xs">{ver.name}</span>
                  {ver.isActive && (
                    <Badge className="bg-emerald-600 text-white font-mono text-[9px]">ACTIVE VERSION</Badge>
                  )}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{ver.createdAt} • by {ver.author}</span>
              </div>

              <div className="flex items-start gap-2 text-[11px] font-mono">
                <img src={ver.thumbnail} alt="version preview" className="w-12 h-12 rounded object-cover border shrink-0" />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-bold text-foreground truncate">{ver.headline}</p>
                  <p className="text-muted-foreground line-clamp-1">{ver.primaryText}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t flex justify-end gap-1.5">
                {!ver.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestore(ver)}
                    className="h-6 text-[10px] font-bold gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-primary" /> Restore V{ver.version}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompareVersions([versions[0], ver])}
                  className="h-6 text-[10px] font-bold gap-1"
                >
                  <Eye className="w-3 h-3" /> Compare Side-by-Side
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Side-by-Side Version Comparison Modal / Box */}
        {compareVersions && (
          <div className="p-3.5 rounded-xl border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs flex items-center gap-1.5 text-primary">
                <GitBranch className="w-3.5 h-3.5" /> Side-by-Side Version Diff (V{compareVersions[0].version} vs V{compareVersions[1].version})
              </span>
              <Button size="sm" variant="ghost" onClick={() => setCompareVersions(null)} className="h-6 text-[10px] font-bold">
                Close Diff
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="font-bold text-primary">{compareVersions[0].name}</span>
                <p className="font-bold text-foreground">{compareVersions[0].headline}</p>
                <p className="text-muted-foreground text-[10px]">{compareVersions[0].primaryText}</p>
              </div>
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="font-bold text-muted-foreground">{compareVersions[1].name}</span>
                <p className="font-bold text-foreground">{compareVersions[1].headline}</p>
                <p className="text-muted-foreground text-[10px]">{compareVersions[1].primaryText}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
