// utils/dates.ts
// Timestamp helpers + ranges + formatting (+ Firestore support).

/** Things we might get back for a date field. */
export type FirestoreLikeTimestamp =
  | { seconds: number; nanoseconds: number }  // the plain object you often see from JSON
  | { toDate: () => Date };                   // Firebase Timestamp instance

type AnyDateish = Date | string | number | FirestoreLikeTimestamp | null | undefined;

/** True if value looks like a Firestore Timestamp (object). */
export function isFirestoreTimestamp(v: unknown): v is FirestoreLikeTimestamp {
  // duck-typing: either a toDate() method or seconds/nanoseconds fields
  return !!v && (typeof (v as any).toDate === "function" ||
    (typeof (v as any).seconds === "number" && typeof (v as any).nanoseconds === "number"));
}

/** Convert anything "date-ish" into a real Date. (Falls back to new Date(0) if invalid.) */
export function asDate(v: AnyDateish): Date {
  if (v == null) return new Date(0);

  if (v instanceof Date) return v;

  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? new Date(0) : d;
  }

  if (isFirestoreTimestamp(v)) {
    if (typeof (v as any).toDate === "function") {
      return (v as any).toDate();
    }
    const { seconds, nanoseconds } = v as { seconds: number; nanoseconds: number };
    return new Date(seconds * 1000 + Math.floor(nanoseconds / 1e6));
  }

  // Last-resort parse attempt
  const d = new Date(v as any);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

/** Milliseconds since epoch from anything "date-ish". */
export function toMillis(v: AnyDateish): number {
  return asDate(v).getTime();
}

/** ISO string from anything date-ish. */
export function toISODate(d: AnyDateish) {
  return asDate(d).toISOString();
}

export function startOfDay(d: AnyDateish = new Date()) {
  const x = asDate(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: AnyDateish = new Date()) {
  const x = asDate(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function addDays(d: AnyDateish, days: number) {
  const x = asDate(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** Format anything "date-ish". */
export function formatDate(
  d: AnyDateish,
  locale = "en-US",
  opts?: Intl.DateTimeFormatOptions
) {
  const date = asDate(d);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(
    locale,
    opts ?? { year: "numeric", month: "short", day: "2-digit" }
  ).format(date);
}

export function isPast(d: AnyDateish) {
  return toMillis(d) < Date.now();
}

export function isFuture(d: AnyDateish) {
  return toMillis(d) > Date.now();
}
