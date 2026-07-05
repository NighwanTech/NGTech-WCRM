import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function HumanHandoffCard({ config, onChange }: any) {
  const handoff = config.handoff_rules || {};
  const escalateWhen = handoff.escalate_when || [];

  const toggleEscalation = (reason: string, checked: boolean) => {
    let newRules = [...escalateWhen];
    if (checked && !newRules.includes(reason)) newRules.push(reason);
    else if (!checked) newRules = newRules.filter(r => r !== reason);
    onChange('escalate_when', newRules, 'handoff_rules');
  };

  const options = [
    "Customer asks for price/quotation",
    "Customer requests demo",
    "Customer explicitly asks for human",
    "Customer is angry or abusive",
    "Customer asks legal questions",
    "Customer asks technical architecture"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Human Handoff</CardTitle>
        <CardDescription>Rules for transferring the conversation to a human agent.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Escalate When</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map(opt => (
              <div key={opt} className="flex items-center space-x-2 p-2 border rounded-md">
                <Checkbox id={opt} checked={escalateWhen.includes(opt)} onCheckedChange={(c) => toggleEscalation(opt, !!c)} />
                <label htmlFor={opt} className="text-sm font-medium leading-none cursor-pointer">{opt}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Assign To Department</Label>
            <Select value={handoff.assign_to || 'unassigned'} onValueChange={(v) => onChange('assign_to', v, 'handoff_rules')}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned (Inbox)</SelectItem>
                <SelectItem value="sales">Sales Team</SelectItem>
                <SelectItem value="support">Support Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fallback Message</Label>
            <Input 
              placeholder="I am transferring you to a human agent..." 
              value={handoff.fallback_message || ''} 
              onChange={(e) => onChange('fallback_message', e.target.value, 'handoff_rules')} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
