import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Image, KeyRound } from "lucide-react"

export function VisualMediaAISettingsCard({ config, onChange }: { config: any, onChange: (field: string, value: any) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visual & Media AI Settings</CardTitle>
            <CardDescription>Configure your provider for AI Image and Video generation</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visual-ai-enable" className="text-sm text-muted-foreground">Enable Media Generation</Label>
            <Switch 
              id="visual-ai-enable" 
              checked={config.visual_ai_enabled ?? false} 
              onCheckedChange={(c) => onChange('visual_ai_enabled', c)} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Visual AI Provider</Label>
            <Select 
              value={config.visual_ai_provider || 'dalle-3'} 
              onValueChange={(val) => onChange('visual_ai_provider', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dalle-3">OpenAI (DALL-E 3)</SelectItem>
                <SelectItem value="stability-ai">Stability AI (Stable Diffusion)</SelectItem>
                <SelectItem value="runway-ml">RunwayML (Video)</SelectItem>
                <SelectItem value="goapi-midjourney">GoAPI (Midjourney)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Select 
              value={config.visual_ai_model || 'dall-e-3'} 
              onValueChange={(val) => onChange('visual_ai_model', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dall-e-3">DALL-E 3 (High Quality)</SelectItem>
                <SelectItem value="sd3-large">SD3 Large</SelectItem>
                <SelectItem value="gen-3-alpha">Gen-3 Alpha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <KeyRound className="w-4 h-4 text-primary" /> API Key Credentials
          </div>
          <div className="space-y-2">
            <Label>Provider API Key</Label>
            <div className="flex gap-2">
              <Input 
                type="password" 
                placeholder="sk-..." 
                value={config.visual_ai_api_key_encrypted || ''} 
                onChange={(e) => onChange('visual_ai_api_key_encrypted', e.target.value)}
              />
              <Button variant="outline" size="sm">Test Connection</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This key will be securely encrypted in the database.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
