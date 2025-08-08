// jobs.ts
// Scheduling helpers to compute next run times from simple RRULE-like inputs.

export type Frequency = "MINUTELY" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface SimpleRule {
  freq: Frequency;
  interval?: number; // default 1
}

export function nextRun(from: Date, rule: SimpleRule) {
  const n = rule.interval ?? 1;
  const d = new Date(from);
  switch (rule.freq) {
    case "MINUTELY": d.setMinutes(d.getMinutes() + n); break;
    case "HOURLY": d.setHours(d.getHours() + n); break;
    case "DAILY": d.setDate(d.getDate() + n); break;
    case "WEEKLY": d.setDate(d.getDate() + n * 7); break;
    case "MONTHLY": d.setMonth(d.getMonth() + n); break;
  }
  return d;
}
