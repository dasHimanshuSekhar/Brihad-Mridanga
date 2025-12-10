import { Timestamp } from 'firebase-admin/firestore';

// Returns current time as a Firestore Timestamp and a human/ISO-like string in IST (Asia/Kolkata).
export function istNow() {
  const now = new Date();
  const firestoreTs = Timestamp.fromDate(now);

  // Use Intl to format parts for Asia/Kolkata
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = fmt.formatToParts(now).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {} as Record<string, string>);

  // Build an ISO-like timestamp with explicit +05:30 offset
  const istString = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+05:30`;

  return { ts: firestoreTs, ist: istString };
}

// Helper to format an arbitrary Date into IST string
export function formatDateToIST(date: Date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {} as Record<string, string>);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+05:30`;
}

export default istNow;
