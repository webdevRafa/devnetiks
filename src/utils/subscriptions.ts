// subscriptions.ts
// Very light recurring date math and proration placeholder.

export type Interval = "day" | "week" | "month" | "year";

export function nextBillingDate(from: Date, interval: Interval, count = 1) {
  const d = new Date(from);
  if (interval === "day") d.setDate(d.getDate() + count);
  else if (interval === "week") d.setDate(d.getDate() + count * 7);
  else if (interval === "month") d.setMonth(d.getMonth() + count);
  else d.setFullYear(d.getFullYear() + count);
  return d;
}

// Basic proration fraction between now and next period end.
export function prorationFraction(now: Date, currentPeriodEnd: Date, previousPeriodEnd: Date) {
  const span = currentPeriodEnd.getTime() - previousPeriodEnd.getTime();
  const used = now.getTime() - previousPeriodEnd.getTime();
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, used / span));
}
