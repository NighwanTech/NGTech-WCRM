"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  onMeetingGenerated: (messageText: string) => void;
}

export function MeetingModal({ open, onOpenChange, contactId, onMeetingGenerated }: MeetingModalProps) {
  const [title, setTitle] = useState("Discovery Call");
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [googleCalLink, setGoogleCalLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Topic is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: contactId,
          title,
          meeting_link: meetingLink || null,
          scheduled_at: scheduledAt || null,
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.messageText) {
        toast.success("Meeting proposal generated!");
        onMeetingGenerated(data.messageText);
        
        // Generate Google Calendar Smart Link
        let gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent('Meeting booked via CRM. ' + (meetingLink ? `\nLink: ${meetingLink}` : ''))}`;
        
        if (scheduledAt) {
          const startDate = new Date(scheduledAt);
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
          
          // Format to YYYYMMDDTHHmmssZ
          const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
          gCalUrl += `&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
        }

        setGoogleCalLink(gCalUrl);

        // Don't close immediately if we want to show the sync button
        // onOpenChange(false);
      } else {
        toast.error(data.error || "Failed to schedule meeting.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setTitle("Discovery Call");
      setMeetingLink("");
      setScheduledAt("");
      setGoogleCalLink("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Propose Meeting</DialogTitle>
        </DialogHeader>
        {!googleCalLink ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. Discovery Call"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Booking Link (Optional)</label>
              <input
                type="url"
                placeholder="e.g. https://calendly.com/your-link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground">Paste your Calendly or meeting link here to share it easily.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Proposed Date/Time (Optional)</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate & Attach"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6 mt-4 text-center">
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <p className="font-medium">Meeting proposal added to chat!</p>
              <p className="text-sm mt-1">You can now sync this directly to your personal Google Calendar.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white"
                onClick={() => {
                  window.open(googleCalLink, '_blank');
                  handleClose();
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                </svg>
                Sync to Google Calendar
              </Button>
              
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
