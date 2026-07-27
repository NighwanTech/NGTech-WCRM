'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CustomField, Tag } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Users,
  Tags,
  Filter,
  Upload,
  Loader2,
  ArrowRight,
  ArrowLeft,
  X,
  UserX,
  UserCheck,
  Search,
  Plus,
  CheckCircle2,
} from 'lucide-react';

type AudienceType = 'all' | 'tags' | 'custom_field' | 'csv' | 'specific_contacts';
type CustomFieldOperator = 'is' | 'is_not' | 'contains';

interface CustomFieldFilter {
  fieldId: string;
  operator: CustomFieldOperator;
  value: string;
}

interface AudienceConfig {
  type: AudienceType;
  tagIds?: string[];
  customField?: CustomFieldFilter;
  csvContacts?: { phone: string; name?: string }[];
  includeContactIds?: string[];
  excludeTagIds?: string[];
  excludeContactIds?: string[];
}

interface Step2Props {
  audience: AudienceConfig;
  onUpdate: (audience: AudienceConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const audienceOptions: {
  type: AudienceType;
  label: string;
  description: string;
  icon: typeof Users;
}[] = [
  {
    type: 'all',
    label: 'All Contacts',
    description: 'Send to every contact in your database',
    icon: Users,
  },
  {
    type: 'tags',
    label: 'Filter by Tags',
    description: 'Target contacts with specific tags',
    icon: Tags,
  },
  {
    type: 'specific_contacts',
    label: 'Specific Contacts',
    description: 'Select individual contacts by Name or Phone',
    icon: UserCheck,
  },
  {
    type: 'custom_field',
    label: 'Custom Field',
    description: 'Filter by a custom field value',
    icon: Filter,
  },
  {
    type: 'csv',
    label: 'Upload CSV',
    description: 'Upload a list of phone numbers',
    icon: Upload,
  },
];

const OPERATOR_OPTIONS: { value: CustomFieldOperator; label: string }[] = [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
  { value: 'contains', label: 'contains' },
];

export function Step2SelectAudience({
  audience,
  onUpdate,
  onNext,
  onBack,
}: Step2Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingFields, setLoadingFields] = useState(false);
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  // Individual contact INCLUSION state
  const [includeSearchQuery, setIncludeSearchQuery] = useState('');
  const [includeSearchResults, setIncludeSearchResults] = useState<{ id: string; name: string | null; phone: string | null; email: string | null }[]>([]);
  const [isIncludeSearching, setIsIncludeSearching] = useState(false);
  const [includedContactsInfo, setIncludedContactsInfo] = useState<{ id: string; name: string | null; phone: string | null; email: string | null }[]>([]);

  // Individual contact EXCLUSION state
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string | null; phone: string | null; email: string | null }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [excludedContactsInfo, setExcludedContactsInfo] = useState<{ id: string; name: string | null; phone: string | null; email: string | null }[]>([]);

  // Fetch info for included contacts
  useEffect(() => {
    const ids = audience.includeContactIds ?? [];
    if (ids.length === 0) {
      setIncludedContactsInfo([]);
      return;
    }
    async function fetchIncludedInfo() {
      const supabase = createClient();
      const { data } = await supabase
        .from('contacts')
        .select('id, name, phone, email')
        .in('id', ids);
      setIncludedContactsInfo(data ?? []);
    }
    fetchIncludedInfo();
  }, [audience.includeContactIds]);

  // Search contacts for INCLUSION
  useEffect(() => {
    if (!includeSearchQuery.trim()) {
      setIncludeSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsIncludeSearching(true);
      try {
        const supabase = createClient();
        const term = `%${includeSearchQuery.trim()}%`;
        const { data } = await supabase
          .from('contacts')
          .select('id, name, phone, email')
          .or(`name.ilike.${term},phone.ilike.${term},email.ilike.${term}`)
          .limit(6);
        setIncludeSearchResults(data ?? []);
      } finally {
        setIsIncludeSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [includeSearchQuery]);

  function addIncludeContact(contact: { id: string; name: string | null; phone: string | null; email: string | null }) {
    const current = audience.includeContactIds ?? [];
    if (!current.includes(contact.id)) {
      onUpdate({ ...audience, includeContactIds: [...current, contact.id] });
    }
    setIncludeSearchQuery('');
    setIncludeSearchResults([]);
  }

  function removeIncludeContact(contactId: string) {
    const current = audience.includeContactIds ?? [];
    onUpdate({
      ...audience,
      includeContactIds: current.filter((id) => id !== contactId),
    });
  }

  // Fetch info for individual excluded contacts when excludeContactIds changes
  useEffect(() => {
    const ids = audience.excludeContactIds ?? [];
    if (ids.length === 0) {
      setExcludedContactsInfo([]);
      return;
    }
    async function fetchExcludedInfo() {
      const supabase = createClient();
      const { data } = await supabase
        .from('contacts')
        .select('id, name, phone, email')
        .in('id', ids);
      setExcludedContactsInfo(data ?? []);
    }
    fetchExcludedInfo();
  }, [audience.excludeContactIds]);

  // Search contacts for EXCLUSION
  useEffect(() => {
    if (!contactSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const supabase = createClient();
        const term = `%${contactSearchQuery.trim()}%`;
        const { data } = await supabase
          .from('contacts')
          .select('id, name, phone, email')
          .or(`name.ilike.${term},phone.ilike.${term},email.ilike.${term}`)
          .limit(6);
        setSearchResults(data ?? []);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [contactSearchQuery]);

  function addExcludeContact(contact: { id: string; name: string | null; phone: string | null; email: string | null }) {
    const current = audience.excludeContactIds ?? [];
    if (!current.includes(contact.id)) {
      onUpdate({ ...audience, excludeContactIds: [...current, contact.id] });
    }
    setContactSearchQuery('');
    setSearchResults([]);
  }

  function removeExcludeContact(contactId: string) {
    const current = audience.excludeContactIds ?? [];
    onUpdate({
      ...audience,
      excludeContactIds: current.filter((id) => id !== contactId),
    });
  }

  // Tags are used both by the primary "Filter by Tags" audience type
  // AND by the exclude-list below — so always load once on mount.
  useEffect(() => {
    async function fetchTags() {
      setLoadingTags(true);
      try {
        const supabase = createClient();
        const { data } = await supabase.from('tags').select('*').order('name');
        setTags(data ?? []);
      } finally {
        setLoadingTags(false);
      }
    }
    fetchTags();
  }, []);

  // Lazy-load custom fields only when that audience type is active.
  useEffect(() => {
    if (audience.type !== 'custom_field') return;
    async function fetchFields() {
      setLoadingFields(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('custom_fields')
          .select('*')
          .order('field_name');
        setCustomFields(data ?? []);
      } finally {
        setLoadingFields(false);
      }
    }
    fetchFields();
  }, [audience.type]);

  const fetchEstimatedCount = useCallback(async () => {
    setLoadingCount(true);
    try {
      const supabase = createClient();

      // Base query — produces the superset before exclude is applied.
      let baseIds: Set<string> | null = null; // null means "all contacts"

      if (audience.type === 'all') {
        // Handled below — full-table count adjusted by excludes.
      } else if (audience.type === 'specific_contacts') {
        baseIds = new Set(audience.includeContactIds ?? []);
      } else if (
        audience.type === 'tags' &&
        audience.tagIds &&
        audience.tagIds.length > 0
      ) {
        const { data } = await supabase
          .from('contact_tags')
          .select('contact_id')
          .in('tag_id', audience.tagIds);
        baseIds = new Set((data ?? []).map((r) => r.contact_id));
      } else if (
        audience.type === 'custom_field' &&
        audience.customField?.fieldId &&
        audience.customField.value
      ) {
        const { fieldId, operator, value } = audience.customField;
        let q = supabase
          .from('contact_custom_values')
          .select('contact_id')
          .eq('custom_field_id', fieldId);
        if (operator === 'is') q = q.eq('value', value);
        else if (operator === 'is_not') q = q.neq('value', value);
        else q = q.ilike('value', `%${value}%`);
        const { data } = await q;
        baseIds = new Set((data ?? []).map((r) => r.contact_id));
      } else if (
        audience.type === 'csv' &&
        audience.csvContacts &&
        audience.csvContacts.length > 0
      ) {
        setEstimatedCount(audience.csvContacts.length);
        return;
      } else if (audience.includeContactIds && audience.includeContactIds.length > 0) {
        baseIds = new Set(audience.includeContactIds);
      } else {
        // Partially-configured audience — wait for the user to finish.
        setEstimatedCount(null);
        return;
      }

      // Merge any additional includeContactIds into baseIds
      if (baseIds && audience.includeContactIds && audience.includeContactIds.length > 0) {
        for (const incId of audience.includeContactIds) {
          baseIds.add(incId);
        }
      }

      // Apply exclude tags & individual contacts
      let excludeSet: Set<string> | null = null;
      if (audience.excludeTagIds && audience.excludeTagIds.length > 0) {
        const { data: excludeRows } = await supabase
          .from('contact_tags')
          .select('contact_id')
          .in('tag_id', audience.excludeTagIds);
        excludeSet = new Set((excludeRows ?? []).map((r) => r.contact_id));
      }

      if (audience.excludeContactIds && audience.excludeContactIds.length > 0) {
        if (!excludeSet) excludeSet = new Set();
        for (const cid of audience.excludeContactIds) {
          excludeSet.add(cid);
        }
      }

      if (baseIds) {
        const effective = [...baseIds].filter(
          (id) => !excludeSet?.has(id),
        );
        setEstimatedCount(effective.length);
      } else {
        // "All" — fetch the total, then subtract exclude set if any.
        const { count } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true });
        const total = count ?? 0;
        setEstimatedCount(excludeSet ? Math.max(0, total - excludeSet.size) : total);
      }
    } finally {
      setLoadingCount(false);
    }
  }, [
    audience.type,
    audience.tagIds,
    audience.customField,
    audience.csvContacts,
    audience.includeContactIds,
    audience.excludeTagIds,
    audience.excludeContactIds,
  ]);

  useEffect(() => {
    fetchEstimatedCount();
  }, [fetchEstimatedCount]);

  function toggleTag(tagId: string) {
    const current = audience.tagIds ?? [];
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    onUpdate({ ...audience, tagIds: updated });
  }

  function toggleExcludeTag(tagId: string) {
    const current = audience.excludeTagIds ?? [];
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    onUpdate({ ...audience, excludeTagIds: updated });
  }

  function updateCustomField(patch: Partial<CustomFieldFilter>) {
    const prev = audience.customField ?? {
      fieldId: '',
      operator: 'is' as CustomFieldOperator,
      value: '',
    };
    onUpdate({ ...audience, customField: { ...prev, ...patch } });
  }

  const isValid =
    audience.type === 'all' ||
    (audience.type === 'tags' && audience.tagIds && audience.tagIds.length > 0) ||
    (audience.type === 'specific_contacts' && audience.includeContactIds && audience.includeContactIds.length > 0) ||
    (audience.type === 'custom_field' &&
      !!audience.customField?.fieldId &&
      audience.customField.value.length > 0) ||
    (audience.type === 'csv' &&
      audience.csvContacts &&
      audience.csvContacts.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Select Audience</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose who will receive this broadcast.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {audienceOptions.map((option) => {
          const isSelected = audience.type === option.type;
          const Icon = option.icon;
          return (
            <button
              key={option.type}
              onClick={() =>
                onUpdate({
                  ...audience,
                  type: option.type,
                  // Wipe shape fields from other types to avoid stale
                  // config leaking across selections.
                  tagIds: option.type === 'tags' ? audience.tagIds : undefined,
                  customField:
                    option.type === 'custom_field'
                      ? audience.customField
                      : undefined,
                  csvContacts:
                    option.type === 'csv' ? audience.csvContacts : undefined,
                })
              }
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                  : 'border-border bg-card/50 hover:border-border'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{option.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {audience.type === 'tags' && (
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Select Tags</p>
          {loadingTags ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : tags.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No tags found. Create tags in Settings.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = audience.tagIds?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-border bg-muted text-muted-foreground hover:border-border'
                    }`}
                  >
                    <span
                      className="mr-1.5 h-2 w-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {audience.type === 'custom_field' && (
        <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4">
          <p className="text-sm font-medium text-foreground">Custom Field Filter</p>
          {loadingFields ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : customFields.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No custom fields defined. Create one in Settings → Custom Fields.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)]">
              <select
                value={audience.customField?.fieldId ?? ''}
                onChange={(e) => updateCustomField({ fieldId: e.target.value })}
                className="h-9 rounded-lg border border-border bg-muted px-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select field…</option>
                {customFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.field_name}
                  </option>
                ))}
              </select>
              <select
                value={audience.customField?.operator ?? 'is'}
                onChange={(e) =>
                  updateCustomField({
                    operator: e.target.value as CustomFieldOperator,
                  })
                }
                className="h-9 rounded-lg border border-border bg-muted px-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {OPERATOR_OPTIONS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={audience.customField?.value ?? ''}
                onChange={(e) => updateCustomField({ value: e.target.value })}
                placeholder="Value"
                className="h-9 rounded-lg border border-border bg-muted px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
      )}

      {audience.type === 'csv' && (
        <div className="space-y-4 rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Upload Contact CSV File</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const sampleCsv = "Name,Phone\nSandeep Kumar,+919934005543\nSunil Kumar,+919876543210\nNiraj Kumar,+919123456789";
                const blob = new Blob([sampleCsv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sample_broadcast_contacts.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-xs text-primary underline hover:text-primary/80"
            >
              Download Sample CSV
            </button>
          </div>

          {(!audience.csvContacts || audience.csvContacts.length === 0) ? (
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop CSV</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Must include <code className="font-mono text-primary">Phone</code> column (and optional <code className="font-mono text-primary">Name</code> column)
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (!text) return;
                    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
                    if (lines.length === 0) return;
                    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
                    let phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('whatsapp') || h.includes('number') || h.includes('contact'));
                    let nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('client') || h.includes('user'));
                    const startRow = (phoneIdx !== -1 || nameIdx !== -1) ? 1 : 0;
                    if (phoneIdx === -1) phoneIdx = 0;
                    if (nameIdx === -1 && phoneIdx !== 1) nameIdx = 1;

                    const parsed: { phone: string; name?: string }[] = [];
                    const seen = new Set<string>();

                    for (let i = startRow; i < lines.length; i++) {
                      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
                      let rawPhone = cols[phoneIdx] || '';
                      let phone = rawPhone.replace(/[^\d+]/g, '');
                      if (!phone) continue;
                      const name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : undefined;
                      if (!seen.has(phone)) {
                        seen.add(phone);
                        parsed.push({ phone, name });
                      }
                    }
                    onUpdate({ ...audience, csvContacts: parsed });
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      CSV Uploaded Successfully!
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {audience.csvContacts.length} valid unique phone number{audience.csvContacts.length > 1 ? 's' : ''} parsed.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate({ ...audience, csvContacts: [] })}
                  className="text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600"
                >
                  Remove CSV
                </Button>
              </div>

              {/* CSV Contacts Preview Table */}
              <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-card p-2 text-xs space-y-1">
                <p className="font-semibold text-muted-foreground mb-1.5 px-2">Parsed Contacts Preview:</p>
                {audience.csvContacts.slice(0, 10).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between px-2 py-1 rounded hover:bg-muted font-mono">
                    <span className="truncate font-sans font-medium text-foreground">{c.name || 'Unnamed'}</span>
                    <span className="text-muted-foreground">{c.phone}</span>
                  </div>
                ))}
                {audience.csvContacts.length > 10 && (
                  <p className="text-[11px] text-center text-muted-foreground pt-1">
                    + {audience.csvContacts.length - 10} more contacts in CSV
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Include specific individual contacts — works standalone or combined with filters */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Include specific contacts (by Name or Phone)
            </p>
            <span className="text-xs text-muted-foreground">(optional / targeted)</span>
          </div>
          {includedContactsInfo.length > 0 && (
            <span className="text-xs font-semibold text-primary">
              {includedContactsInfo.length} contact{includedContactsInfo.length > 1 ? 's' : ''} targeted
            </span>
          )}
        </div>

        {/* Search input for inclusion */}
        <div className="relative mb-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={includeSearchQuery}
              onChange={(e) => setIncludeSearchQuery(e.target.value)}
              placeholder="Search contact by name or phone to include..."
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {isIncludeSearching && (
              <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Dropdown Results */}
          {includeSearchResults.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
              {includeSearchResults.map((contact) => {
                const isIncluded = audience.includeContactIds?.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => addIncludeContact(contact)}
                    disabled={isIncluded}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <div>
                      <p className="font-medium text-popover-foreground">
                        {contact.name || 'Unnamed Contact'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {contact.phone || contact.email || 'No phone'}
                      </p>
                    </div>
                    {isIncluded ? (
                      <span className="text-[11px] text-muted-foreground">Included</span>
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Included Chips */}
        {includedContactsInfo.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {includedContactsInfo.map((contact) => (
              <span
                key={contact.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                <span>{contact.name || contact.phone || 'Contact'}</span>
                {contact.phone && (
                  <span className="text-[10px] text-primary/80">({contact.phone})</span>
                )}
                <button
                  type="button"
                  onClick={() => removeIncludeContact(contact.id)}
                  className="rounded-full p-0.5 hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Exclude list — applies regardless of audience type */}
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <X className="h-4 w-4 text-red-400" />
          <p className="text-sm font-medium text-foreground">
            Exclude contacts with these tags
          </p>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tags available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isExcluded = audience.excludeTagIds?.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleExcludeTag(tag.id)}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    isExcluded
                      ? 'border-red-500/30 bg-red-500/10 text-red-300'
                      : 'border-border bg-muted text-muted-foreground hover:border-border'
                  }`}
                >
                  <span
                    className="mr-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Exclude specific individual contacts */}
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <UserX className="h-4 w-4 text-red-400" />
          <p className="text-sm font-medium text-foreground">
            Exclude specific contacts
          </p>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={contactSearchQuery}
              onChange={(e) => setContactSearchQuery(e.target.value)}
              placeholder="Search contact by name or phone to exclude..."
              className="h-9 w-full rounded-lg border border-border bg-muted pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
              {searchResults.map((contact) => {
                const isExcluded = audience.excludeContactIds?.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => addExcludeContact(contact)}
                    disabled={isExcluded}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <div>
                      <p className="font-medium text-popover-foreground">
                        {contact.name || 'Unnamed Contact'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {contact.phone || contact.email || 'No phone'}
                      </p>
                    </div>
                    {isExcluded ? (
                      <span className="text-[11px] text-red-400">Already excluded</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                        <Plus className="h-3 w-3" /> Exclude
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Excluded contacts chips */}
        {excludedContactsInfo.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {excludedContactsInfo.map((contact) => (
              <div
                key={contact.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400"
              >
                <span>
                  {contact.name || contact.phone || 'Unnamed Contact'}
                  {contact.phone && contact.name ? ` (${contact.phone})` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => removeExcludeContact(contact.id)}
                  className="rounded-full p-0.5 hover:bg-red-500/20 text-red-400"
                  aria-label="Remove contact from exclusion list"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No individual contacts excluded. Use the search bar above to exclude specific people.
          </p>
        )}
      </div>

      {/* Audience Summary */}
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <p className="mb-2 text-sm font-medium text-foreground">Audience Summary</p>
        {loadingCount ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Calculating…</span>
          </div>
        ) : estimatedCount !== null ? (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              {estimatedCount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">estimated recipients</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Select an audience type to see the estimate.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-border text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
