/**
 * src/v8/adapters/chambersStatus.ts
 *
 * Real-time Chambers Operational Status Engine computed from Indian Standard Time (IST, UTC+5:30).
 * Operating Schedule:
 * - Monday to Friday: 09:30 to 18:30 IST
 * - Saturday: 10:00 to 14:00 IST
 * - Sunday: Closed
 *
 * Next opening callback queue transitions:
 * - Mon–Thu after hours (>= 18:30): Tomorrow 09:30 AM
 * - Friday after hours (>= 18:30): Saturday 10:00 AM
 * - Saturday after hours (>= 14:00) & all day Sunday: Monday 09:30 AM
 * - Before hours on Mon–Fri (< 09:30): Today 09:30 AM
 * - Before hours on Saturday (< 10:00): Today 10:00 AM
 */

export interface ChambersStatus {
  isOpen: boolean;
  statusLabel: string; // e.g. "Chambers Open · Partner Desk Active" | "Chambers Closed · Callback Queued for 09:30 AM"
  detailLabel: string; // e.g. "Until 18:30 IST" | "Until 14:00 IST" | "Callback Queued for 09:30 AM"
  nextOpeningTime: string; // "09:30 AM" | "10:00 AM"
  istTimeFormatted: string; // e.g. "14:30 IST"
  istDayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

/** Offset in milliseconds for IST (UTC+05:30) with zero Daylight Saving Time */
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 19,800,000 ms

/**
 * Returns a Date object shifted into IST relative to UTC.
 * Uses UTC methods (getUTCDay, getUTCHours, getUTCMinutes) for deterministic timezone evaluation.
 */
export function getISTDate(date?: Date): Date {
  const d = date ? new Date(date.getTime()) : new Date();
  return new Date(d.getTime() + IST_OFFSET_MS);
}

/**
 * Computes live operational chambers status based on IST operating hours and callback queue logic.
 * Accepts optional testDate for deterministic testing and snapshot evaluation.
 */
export function getChambersStatus(testDate?: Date): ChambersStatus {
  const targetDate = testDate ? new Date(testDate.getTime()) : new Date();
  const istDate = getISTDate(targetDate);

  const day = istDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const currentMinutes = hours * 60 + minutes;

  const istHoursStr = String(hours).padStart(2, '0');
  const istMinutesStr = String(minutes).padStart(2, '0');
  const istTimeFormatted = `${istHoursStr}:${istMinutesStr} IST`;

  let isOpen = false;
  let nextOpeningTime = '09:30 AM';
  let detailLabel = '';

  if (day >= 1 && day <= 5) {
    // Monday to Friday: 09:30 (570) to 18:30 (1110) IST
    const openMin = 9 * 60 + 30; // 570
    const closeMin = 18 * 60 + 30; // 1110

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      isOpen = true;
      detailLabel = 'Until 18:30 IST';
      // If Friday afternoon, next opening after closing is Saturday 10:00 AM; otherwise Mon-Thu next is 09:30 AM
      nextOpeningTime = day === 5 ? '10:00 AM' : '09:30 AM';
    } else if (currentMinutes < openMin) {
      isOpen = false;
      nextOpeningTime = '09:30 AM';
      detailLabel = 'Callback Queued for 09:30 AM';
    } else {
      // After hours on Mon-Fri
      isOpen = false;
      nextOpeningTime = day === 5 ? '10:00 AM' : '09:30 AM';
      detailLabel = `Callback Queued for ${nextOpeningTime}`;
    }
  } else if (day === 6) {
    // Saturday: 10:00 (600) to 14:00 (840) IST
    const openMin = 10 * 60; // 600
    const closeMin = 14 * 60; // 840

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      isOpen = true;
      detailLabel = 'Until 14:00 IST';
      nextOpeningTime = '09:30 AM'; // Next opening is Monday 09:30 AM
    } else if (currentMinutes < openMin) {
      isOpen = false;
      nextOpeningTime = '10:00 AM';
      detailLabel = 'Callback Queued for 10:00 AM';
    } else {
      // After hours on Saturday -> Sunday closed, next is Monday 09:30 AM
      isOpen = false;
      nextOpeningTime = '09:30 AM';
      detailLabel = 'Callback Queued for 09:30 AM';
    }
  } else {
    // Sunday (day === 0): Closed all day -> next is Monday 09:30 AM
    isOpen = false;
    nextOpeningTime = '09:30 AM';
    detailLabel = 'Callback Queued for 09:30 AM';
  }

  const statusLabel = isOpen
    ? 'Chambers Open · Partner Desk Active'
    : `Chambers Closed · Callback Queued for ${nextOpeningTime}`;

  return {
    isOpen,
    statusLabel,
    detailLabel,
    nextOpeningTime,
    istTimeFormatted,
    istDayOfWeek: day,
  };
}
