'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  X,
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  DollarSign,
  Send,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  lead_source: string;
  status: string; // 'new', 'contacted', 'demo_scheduled', 'converted', 'lost'
  created_at: string;
  plan_slug?: string;
  agents_count?: string | number;
  monthly_leads?: string | number;
  expected_roi?: string;
  revenue_lift?: string;
  notes?: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          // Sample leads for demonstration if DB is empty
          setLeads([
            {
              id: 'lead_1',
              name: 'Sandeep Kumar',
              company_name: 'Nighwan Tech',
              email: 'sandeep@nighwantech.com',
              phone: '8985025794',
              lead_source: 'Free Trial Calculator Form',
              status: 'new',
              created_at: new Date().toISOString(),
              plan_slug: 'growth',
              agents_count: '4 Agents',
              monthly_leads: '10,000 Leads/mo',
              expected_roi: '40.4x Net ROI',
              revenue_lift: '₹1,57,500/mo',
              notes: 'Prospect submitted trial request with 4 agents & 10k monthly inquiries.'
            },
            {
              id: 'lead_2',
              name: 'Ramesh Sharma',
              company_name: 'BPTPIA Admissions Chain',
              email: 'ramesh@bptpia.org',
              phone: '9876543210',
              lead_source: 'Enterprise Demo Request',
              status: 'demo_scheduled',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              plan_slug: 'enterprise',
              agents_count: '15 Agents',
              monthly_leads: '50,000 Leads/mo',
              expected_roi: '120x Net ROI',
              revenue_lift: '₹6,50,000/mo',
              notes: 'Educational group looking for multi-campus WhatsApp routing & custom SLA.'
            }
          ]);
        }
      })
      .catch((err) => console.error('Error fetching leads:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLeads = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone?.includes(searchQuery)
  );

  if (loading) return <div className="p-8 text-xs font-mono">Loading leads database…</div>;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-500" /> Platform Leads & Requirements
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage inbound lead profiles, trial requests, and calculated business requirements.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, company..."
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 font-mono text-muted-foreground">
                <th className="px-6 py-3.5 text-left font-bold">PROSPECT</th>
                <th className="px-6 py-3.5 text-left font-bold">CONTACT INFO</th>
                <th className="px-6 py-3.5 text-left font-bold">CALCULATOR REQUIREMENTS</th>
                <th className="px-6 py-3.5 text-left font-bold">SOURCE</th>
                <th className="px-6 py-3.5 text-left font-bold">STATUS</th>
                <th className="px-6 py-3.5 text-left font-bold">DATE</th>
                <th className="px-6 py-3.5 text-right font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filteredLeads.map((lead) => {
                const planName = lead.plan_slug === 'enterprise' ? 'Enterprise' : lead.plan_slug === 'growth' ? 'Growth AI' : 'Starter';
                const agentsDisplay = lead.agents_count || '4 Agents';
                const volumeDisplay = lead.monthly_leads || '10,000 Leads/mo';
                const roiDisplay = lead.expected_roi || '40.4x ROI';

                return (
                  <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-foreground text-sm">{lead.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{lead.company_name || 'Individual'}</p>
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-foreground font-mono">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                        <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* Requirements & Telemetry Column */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-extrabold border border-emerald-500/30">
                          {planName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold">
                          {agentsDisplay}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold">
                          {volumeDisplay}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-extrabold">
                          {roiDisplay}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {lead.lead_source || 'Free Trial Form'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        className={`rounded-full px-3 py-1 text-[11px] font-bold appearance-none cursor-pointer outline-none border transition-colors ${
                          lead.status === 'new'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : lead.status === 'demo_scheduled'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : lead.status === 'contacted'
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                        defaultValue={lead.status || 'new'}
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="demo_scheduled">Demo Scheduled</option>
                        <option value="converted">Converted Client</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 font-mono text-muted-foreground text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                          title="View Full Requirements & Telemetry"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/create-client?name=${encodeURIComponent(lead.company_name || lead.name)}&email=${encodeURIComponent(lead.email)}`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                          title="Convert to Client Account"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAILS & REQUIREMENTS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-card border border-border/80 p-6 sm:p-8 space-y-6 relative shadow-2xl text-left">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-black uppercase">
                  Lead Telemetry & Requirements
                </span>
              </div>
              <h3 className="text-2xl font-black text-foreground">{selectedLead.name}</h3>
              <p className="text-xs text-muted-foreground font-mono">{selectedLead.company_name || 'Individual Prospect'}</p>
            </div>

            {/* Requirements Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                <p className="text-muted-foreground text-[10px]">SELECTED PLAN</p>
                <p className="font-extrabold text-emerald-400 text-sm">{selectedLead.plan_slug === 'enterprise' ? 'Enterprise Scale' : selectedLead.plan_slug === 'growth' ? 'Growth AI' : 'Starter'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                <p className="text-muted-foreground text-[10px]">AGENT SEATS REQUESTED</p>
                <p className="font-extrabold text-foreground text-sm">{selectedLead.agents_count || '4 Agents'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                <p className="text-muted-foreground text-[10px]">MONTHLY LEADS VOLUME</p>
                <p className="font-extrabold text-foreground text-sm">{selectedLead.monthly_leads || '10,000 / mo'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <p className="text-emerald-400 text-[10px]">ESTIMATED NET ROI</p>
                <p className="font-extrabold text-emerald-400 text-sm">{selectedLead.expected_roi || '40.4x ROI'}</p>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.name}, thank you for requesting the WCRM Free Trial! We noticed your requirement for ${selectedLead.agents_count || '4 Agents'} & ${selectedLead.monthly_leads || '10,000 inquiries/mo'}. When would be a good time for a quick 5-min demo?`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all gap-2 shadow-lg"
              >
                <Send className="h-4 w-4" /> Start Direct WhatsApp Chat ({selectedLead.phone})
              </a>
              <Link
                href={`/admin/create-client?name=${encodeURIComponent(selectedLead.company_name || selectedLead.name)}&email=${encodeURIComponent(selectedLead.email)}`}
                className="w-full flex h-12 items-center justify-center rounded-full border-2 border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-all"
              >
                Convert to Client Account →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
