"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/lib/masking";
import type { Contact, Deal, ContactNote, Tag, Conversation } from "@/types";
import {
  Phone,
  Mail,
  Copy,
  Check,
  User,
  Tag as TagIcon,
  DollarSign,
  StickyNote,
  Plus,
  Sparkles,
  CheckSquare,
  Calendar,
  Receipt,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

interface ContactSidebarProps {
  contact: Contact | null;
  conversation?: Conversation | null;
  onClose?: () => void;
}

export interface Meeting {
  id: string;
  title: string;
  meeting_link?: string;
  scheduled_at?: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  description: string;
  amount: number;
  currency: string;
  valid_until?: string;
  status: string;
  created_at: string;
}

export function ContactSidebar({
  contact,
  conversation,
  onClose,
}: ContactSidebarProps) {
  const { account, accountId, profile, isAgent } = useAuth();
  const agentName = profile?.full_name || "Your Agent";
  const [copied, setCopied] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [tags, setTags] = useState<(Tag & { contact_tag_id: string })[]>([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [summary, setSummary] = useState(conversation?.ai_summary || "");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [creatingTask, setCreatingTask] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<{ [key: string]: string }>({});
  const [savingMeetingNote, setSavingMeetingNote] = useState<{ [key: string]: boolean }>({});
  const [generatingFollowup, setGeneratingFollowup] = useState<{ [key: string]: boolean }>({});
  
  const [msgStats, setMsgStats] = useState({ bot: 0, agent: 0, customer: 0 });

  const handleGenerateFollowup = async (meeting: Meeting) => {
    const notesToUse = meetingNotes[meeting.id] ?? meeting.notes;
    if (!notesToUse) return;

    setGeneratingFollowup(prev => ({ ...prev, [meeting.id]: true }));
    try {
      const res = await fetch("/api/ai/meeting-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: notesToUse,
          contactName: contact?.name,
          meetingTitle: meeting.title,
          agentName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        await navigator.clipboard.writeText(data.message);
        toast.success("Follow-up drafted and copied to clipboard!");
      } else {
        toast.error(data.error || "Failed to generate follow-up");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate follow-up");
    } finally {
      setGeneratingFollowup(prev => ({ ...prev, [meeting.id]: false }));
    }
  };

  const handleSaveMeetingNote = async (meetingId: string) => {
    const note = meetingNotes[meetingId];
    if (note === undefined) return;
    
    setSavingMeetingNote(prev => ({ ...prev, [meetingId]: true }));
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: note }),
      });
      const data = await res.json();
      if (res.ok && data.meeting) {
        setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, notes: note } : m));
        toast.success("Meeting notes saved");
      } else {
        toast.error(data.error || "Failed to save meeting notes");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save meeting notes");
    } finally {
      setSavingMeetingNote(prev => ({ ...prev, [meetingId]: false }));
    }
  };

  const parsedSummary = useMemo(() => {
    if (!summary) return null;
    const parts = summary.split('ACTION:');
    if (parts.length > 1) {
      return {
        summaryText: parts[0].replace('SUMMARY:', '').trim(),
        actionText: parts[1].trim()
      };
    }
    return { summaryText: summary, actionText: null };
  }, [summary]);

  useEffect(() => {
    setSummary(conversation?.ai_summary || "");
  }, [conversation?.id, conversation?.ai_summary]);

  const handleGenerateSummary = useCallback(async () => {
    if (!conversation) return;
    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversation.id }),
      });
      const data = await res.json();
      if (res.ok && data.summary) {
        setSummary(data.summary);
      } else {
        toast.error(data.error || "Failed to generate summary");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate summary");
    } finally {
      setGeneratingSummary(false);
    }
  }, [conversation]);

  const handleCreateTask = useCallback(async (actionText: string) => {
    if (!contact) return;
    setCreatingTask(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Follow up",
          description: actionText,
          contact_id: contact.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.task) {
        setTasks((prev) => [data.task, ...prev]);
        toast.success("Task created!");
      } else {
        toast.error(data.error || "Failed to create task");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  }, [contact]);

  const handleUpdateTaskStatus = useCallback(async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.task) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
      } else {
        toast.error(data.error || "Failed to update task");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update task");
    }
  }, []);

  const fetchContactData = useCallback(async () => {
    if (!contact) return;

    const supabase = createClient();

    const [dealsRes, notesRes, tagsRes, tasksRes, meetingsRes, quotesRes] = await Promise.all([
      supabase
        .from("deals")
        .select("*, stage:pipeline_stages(*)")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_notes")
        .select("*")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_tags")
        .select("id, tag_id, tags(*)")
        .eq("contact_id", contact.id),
      fetch(`/api/tasks?contact_id=${contact.id}`).then(res => res.json()).catch(() => ({ tasks: [] })),
      supabase
        .from("meetings")
        .select("*")
        .eq("contact_id", contact.id)
        .order("scheduled_at", { ascending: true }),
      supabase
        .from("quotes")
        .select("*")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
    ]);

    // Fetch message stats if a conversation is active
    if (conversation?.id) {
      const [botRes, agentRes, custRes] = await Promise.all([
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("conversation_id", conversation.id).eq("sender_type", "bot"),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("conversation_id", conversation.id).eq("sender_type", "agent"),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("conversation_id", conversation.id).eq("sender_type", "customer"),
      ]);
      setMsgStats({
        bot: botRes.count || 0,
        agent: agentRes.count || 0,
        customer: custRes.count || 0,
      });
    } else {
      setMsgStats({ bot: 0, agent: 0, customer: 0 });
    }

    if (dealsRes.data) setDeals(dealsRes.data);
    if (notesRes.data) setNotes(notesRes.data);
    if (tasksRes?.tasks) setTasks(tasksRes.tasks);
    if (meetingsRes.data) setMeetings(meetingsRes.data);
    if (quotesRes.data) setQuotes(quotesRes.data);
    if (tagsRes.data) {
      const mapped = tagsRes.data
        .filter((ct: Record<string, unknown>) => ct.tags)
        .map((ct: Record<string, unknown>) => ({
          ...(ct.tags as Tag),
          contact_tag_id: ct.id as string,
        }));
      setTags(mapped);
    }
  }, [contact, conversation?.id]);

  // Load on contact change. setContactData/setTags run inside async
  // Supabase callbacks, not synchronously in the effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContactData();
  }, [fetchContactData]);

  const handleCopyPhone = useCallback(async () => {
    if (!contact?.phone) return;
    await navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Dep is the whole `contact` object (not `contact?.phone`) so the
    // React Compiler's inference agrees with the manual dep list —
    // fixes the `preserve-manual-memoization` lint error.
  }, [contact]);

  const handleAddNote = useCallback(async () => {
    if (!contact || !newNote.trim()) return;
    if (!accountId) return;
    setAddingNote(true);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    const { data, error } = await supabase
      .from("contact_notes")
      .insert({
        contact_id: contact.id,
        account_id: accountId,
        user_id: user?.id,
        note_text: newNote.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setNotes((prev) => [data, ...prev]);
      setNewNote("");
    }
    setAddingNote(false);
  }, [contact, newNote, accountId]);

  if (!contact) {
    return (
      <div className="flex h-full w-full items-center justify-center border-l border-border bg-card">
        <p className="text-sm text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  const maskedPhone = maskPhone(contact.phone, isAgent, account?.mask_agent_phones ?? false);
  const displayName = contact.name || maskedPhone;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-card relative">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 pt-6">
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 lg:hidden rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <User className="h-4 w-4 hidden" /> {/* Just to import, but using X from somewhere else? Wait, let's just use text 'X' or import X */}
              <span className="sr-only">Close</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </button>
          )}

          {/* Contact Info */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold text-foreground">
              {contact.avatar_url ? (
                <img
                  src={contact.avatar_url}
                  alt={displayName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {displayName}
            </h3>
            {contact.company && (
              <p className="text-xs text-muted-foreground">{contact.company}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleCopyPhone}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{maskedPhone}</span>
              {copied ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </button>

            {contact.email && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* AI Summary */}
          {conversation && (
            <div>
              <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-purple-500" />
                AI Summary
              </div>
              <div className="mt-2 space-y-2">
                {summary ? (
                  <div className="max-h-48 overflow-y-auto rounded-lg bg-muted px-3 py-2 space-y-2">
                    {parsedSummary?.actionText ? (
                      <>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap"><strong className="text-foreground">Summary:</strong><br />{parsedSummary.summaryText}</p>
                        <div className="border-t border-border pt-2 mt-2">
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap"><strong className="text-foreground">Action:</strong><br />{parsedSummary.actionText}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full text-xs h-7"
                            onClick={() => handleCreateTask(parsedSummary.actionText!)}
                            disabled={creatingTask}
                          >
                            <CheckSquare className="w-3 h-3 mr-2" />
                            {creatingTask ? "Creating..." : "Convert to Task"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">{summary}</p>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-muted-foreground"
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                  >
                    {generatingSummary ? "Generating..." : "Generate Summary"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Message Analytics */}
          {conversation && (
            <div>
              <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <MessageCircle className="h-3 w-3 text-blue-500" />
                Message Analytics
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted py-2">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">Bot</span>
                  <span className="text-lg font-bold text-foreground">{msgStats.bot}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted py-2">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">Agent</span>
                  <span className="text-lg font-bold text-foreground">{msgStats.agent}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted py-2">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">Customer</span>
                  <span className="text-lg font-bold text-foreground">{msgStats.customer}</span>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <TagIcon className="h-3 w-3" />
              Tags
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.length === 0 && (!conversation || !(conversation as any).ai_auto_tags?.length) ? (
                <p className="px-1 text-xs text-muted-foreground">No tags</p>
              ) : (
                <>
                  {tags.map((tag) => (
                    <span
                      key={tag.contact_tag_id}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                  {conversation && (conversation as any).ai_auto_tags?.map((tagStr: string, idx: number) => (
                    <span
                      key={`ai-tag-${idx}`}
                      className="rounded-full bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 text-[10px] font-medium flex items-center gap-0.5"
                    >
                      <span>🤖</span> {tagStr}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Active Deals */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Active Deals
            </div>
            <div className="mt-2 space-y-2">
              {deals.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">No deals</p>
              ) : (
                deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-lg bg-muted px-3 py-2"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {deal.title}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {deal.currency ?? "$"}
                        {deal.value.toLocaleString()}
                      </span>
                      {deal.stage && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[10px]"
                          style={{
                            backgroundColor: `${deal.stage.color}20`,
                            color: deal.stage.color,
                          }}
                        >
                          {deal.stage.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Quotes */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Receipt className="h-3 w-3" />
              Quotes
            </div>
            <div className="mt-2 space-y-2">
              {quotes.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">No quotes sent</p>
              ) : (
                quotes.map((quote) => (
                  <div key={quote.id} className="rounded-lg bg-muted px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{quote.description}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{quote.currency} {quote.amount.toLocaleString()}</span>
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", 
                        quote.status === 'accepted' ? "bg-green-100 text-green-700" :
                        quote.status === 'rejected' ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {quote.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Meetings */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Meetings
            </div>
            <div className="mt-2 space-y-3">
              {meetings.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">No meetings yet</p>
              ) : (
                meetings.map((meeting) => {
                  const isPast = meeting.scheduled_at ? new Date(meeting.scheduled_at) < new Date() : false;
                  const hasNotes = !!(meetingNotes[meeting.id] ?? meeting.notes);
                  return (
                    <div key={meeting.id} className={`rounded-lg px-3 py-2 border ${isPast ? 'bg-muted/50 border-border/40' : 'bg-muted border-border'}`}>
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground leading-snug">{meeting.title}</p>
                        <span className={`shrink-0 text-[9px] font-semibold uppercase rounded-full px-1.5 py-0.5 ${
                          meeting.status === 'completed' ? 'bg-green-500/15 text-green-500' :
                          meeting.status === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                          isPast ? 'bg-orange-500/15 text-orange-400' :
                          'bg-primary/15 text-primary'
                        }`}>
                          {meeting.status === 'completed' ? 'Done' : meeting.status === 'cancelled' ? 'Cancelled' : isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </div>

                      {/* Date + notes saved indicator */}
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {meeting.scheduled_at 
                            ? format(new Date(meeting.scheduled_at), "MMM d, yyyy · h:mm a") 
                            : "Date TBD"}
                        </span>
                        {hasNotes && (
                          <span className="flex items-center gap-1 text-green-500 text-[10px] font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                            Notes saved
                          </span>
                        )}
                      </div>

                      {/* Meeting link */}
                      {meeting.meeting_link && (
                        <a 
                          href={meeting.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center gap-1 text-[10px] text-primary hover:underline truncate"
                        >
                          🔗 {meeting.meeting_link}
                        </a>
                      )}

                      {/* Meeting Notes Editor */}
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Meeting Notes
                        </label>
                        <textarea
                          value={meetingNotes[meeting.id] ?? meeting.notes ?? ""}
                          onChange={(e) => setMeetingNotes(prev => ({ ...prev, [meeting.id]: e.target.value }))}
                          placeholder="Take notes during the call..."
                          rows={3}
                          className="mt-1 w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        />
                        <div className="mt-1 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 flex-1 text-[10px]"
                            onClick={() => handleSaveMeetingNote(meeting.id)}
                            disabled={savingMeetingNote[meeting.id] || (meetingNotes[meeting.id] === undefined && !meeting.notes)}
                          >
                            {savingMeetingNote[meeting.id] ? "Saving..." : "💾 Save Notes"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 flex-1 text-[10px] bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
                            onClick={() => handleGenerateFollowup(meeting)}
                            disabled={generatingFollowup[meeting.id] || !hasNotes}
                          >
                            {generatingFollowup[meeting.id] ? "Drafting..." : "✨ Follow-up"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Tasks */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <CheckSquare className="h-3 w-3" />
              Tasks
            </div>
            <div className="mt-2 space-y-2">
              {tasks.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">No pending tasks</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="rounded-lg bg-muted px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className={cn("rounded-full px-1.5 py-0.5", 
                        task.status === 'completed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {task.status.toUpperCase()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-2 text-[10px]"
                        onClick={() => handleUpdateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                      >
                        {task.status === 'completed' ? 'Undo' : 'Mark Done'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <StickyNote className="h-3 w-3" />
              Notes
            </div>
            <div className="mt-2">
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary/50"
                />
                <Button
                  size="sm"
                  className="h-auto bg-primary px-2 hover:bg-primary/90"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || addingNote}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="mt-2 space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg bg-muted px-3 py-2"
                  >
                    <p className="whitespace-pre-wrap text-xs text-muted-foreground">
                      {note.note_text}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {format(new Date(note.created_at), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
