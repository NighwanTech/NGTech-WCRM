"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";

interface MeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  onMeetingGenerated: (messageText: string) => void;
}

export function MeetingModal({ open, onOpenChange, contactId, onMeetingGenerated }: MeetingModalProps) {
  const [title, setTitle] = useState("Discovery Call");
  const [meetingLink, setMeetingLink] = useState("");
  
  // Custom Date & Time selection states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleCalLink, setGoogleCalLink] = useState("");

  const localTimezone = typeof window !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC";

  // Get timezone abbreviation (e.g. IST, EST)
  const [tzAbbreviation, setTzAbbreviation] = useState("");
  useEffect(() => {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: localTimezone,
        timeZoneName: "short",
      }).formatToParts(new Date());
      const tzPart = parts.find((p) => p.type === "timeZoneName");
      if (tzPart) {
        setTzAbbreviation(tzPart.value);
      }
    } catch (e) {
      setTzAbbreviation(localTimezone);
    }
  }, [localTimezone]);

  // Generate 30-min time slots
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute === 0 ? "00" : "30";
      timeSlots.push(`${displayHour}:${displayMinute} ${ampm}`);
    }
  }

  // Parse time string to hours/minutes
  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  // Convert selected Date + Time to ISO string
  const getISOString = () => {
    if (!selectedDate || !selectedTime) return "";
    const { hours, minutes } = parseTime(selectedTime);
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes
    );
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Topic is required.");
      return;
    }

    const scheduledAtISO = getISOString();

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: contactId,
          title,
          meeting_link: meetingLink || null,
          scheduled_at: scheduledAtISO || null,
          timezone: localTimezone,
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.messageText) {
        toast.success("Meeting proposal generated!");
        onMeetingGenerated(data.messageText);
        
        // Generate Google Calendar Smart Link
        let gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent('Meeting booked via CRM. ' + (meetingLink ? `\nLink: ${meetingLink}` : ''))}`;
        
        if (scheduledAtISO) {
          const startDate = new Date(scheduledAtISO);
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
          
          // Format to YYYYMMDDTHHmmssZ
          const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
          gCalUrl += `&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
        }

        setGoogleCalLink(gCalUrl);
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
      setSelectedDate(null);
      setSelectedTime(null);
      setGoogleCalLink("");
    }, 300);
  };

  // Calendar rendering helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const blanks = Array(startDayOfWeek).fill(null);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

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
              <label className="text-sm font-medium text-foreground block">Proposed Date/Time (Optional)</label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10 px-3 border-border bg-background hover:bg-muted text-foreground transition-all duration-150"
                    />
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0 inline-block align-middle" />
                  {selectedDate ? (
                    <span className="text-sm inline-block align-middle">
                      {format(selectedDate, "PPP")} {selectedTime ? `at ${selectedTime}` : ""}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground inline-block align-middle">Pick a date & time</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 flex gap-4 md:flex-row flex-col select-none" align="start">
                  {/* Calendar Grid */}
                  <div className="flex flex-col gap-2 w-[250px]">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-semibold">
                        {format(currentMonth, "MMMM yyyy")}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={prevMonth}
                          className="h-7 w-7 p-0"
                          disabled={isBefore(monthStart, startOfDay(new Date()))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={nextMonth}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-1">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {blanks.map((_, i) => (
                        <div key={`blank-${i}`} className="h-8 w-8" />
                      ))}
                      {daysInMonth.map((day) => {
                        const isPast = isBefore(day, startOfDay(new Date()));
                        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                        const isTodayDay = isToday(day);

                        return (
                          <button
                            key={day.toString()}
                            type="button"
                            disabled={isPast}
                            onClick={() => setSelectedDate(day)}
                            className={`h-8 w-8 text-xs rounded-md flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm scale-105"
                                : isTodayDay
                                ? "border border-primary text-primary font-medium"
                                : "hover:bg-muted text-foreground"
                            } ${isPast ? "opacity-35 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"}`}
                          >
                            {format(day, "d")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots List */}
                  <div className="flex flex-col gap-2 w-32 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                    <span className="text-xs font-semibold px-2 text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Time Slots
                    </span>
                    <div className="h-[230px] overflow-y-auto flex flex-col gap-1 pr-1">
                      {timeSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {localTimezone && (
                <p className="text-[10px] text-muted-foreground text-right italic">
                  Timezone: {localTimezone} {tzAbbreviation && `(${tzAbbreviation})`}
                </p>
              )}
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
