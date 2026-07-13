import { supabaseAdmin } from '@/lib/flows/admin-client';

interface ScheduleDay {
  active: boolean;
  start: string;
  end: string;
}

interface BusinessHours {
  timezone: string;
  schedule: {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
    saturday: ScheduleDay;
    sunday: ScheduleDay;
  };
}

export async function checkBusinessHours(accountId: string): Promise<boolean> {
  try {
    const supabase = supabaseAdmin();
    const { data: account } = await supabase
      .from('accounts')
      .select('business_hours')
      .eq('id', accountId)
      .single();

    if (!account || !account.business_hours) return true; // Default to true if not configured

    const hours = account.business_hours as BusinessHours;
    if (!hours.timezone || !hours.schedule) return true;

    // Get current time in account timezone
    const now = new Date();
    
    // Format to get weekday in English
    const weekdayFormatter = new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      timeZone: hours.timezone 
    });
    
    // Format to get time as HH:mm
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: hours.timezone
    });

    const dayName = weekdayFormatter.format(now).toLowerCase() as keyof BusinessHours['schedule'];
    const timeStr = timeFormatter.format(now); // e.g. "14:30"

    const todaySchedule = hours.schedule[dayName];
    
    if (!todaySchedule || !todaySchedule.active) {
      return false;
    }

    const { start, end } = todaySchedule;
    if (!start || !end) return true;

    return timeStr >= start && timeStr <= end;
  } catch (err) {
    console.error('[business-hours] Error checking hours:', err);
    return true; // Fail open
  }
}
