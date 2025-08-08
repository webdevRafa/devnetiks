// dates.ts
// Timestamp helpers + ranges + formatting.

export function toISODate(d: Date | number | string) {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString();
  }
  
  export function startOfDay(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  
  export function endOfDay(d = new Date()) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  }
  
  export function addDays(d: Date, days: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
  }
  
  export function formatDate(d: Date | string | number, locale = "en-US", opts?: Intl.DateTimeFormatOptions) {
    const date = d instanceof Date ? d : new Date(d);
    return new Intl.DateTimeFormat(locale, opts ?? { year: "numeric", month: "short", day: "2-digit" }).format(date);
  }
  
  export function isPast(d: Date | string | number) {
    return new Date(d).getTime() < Date.now();
  }
  
  export function isFuture(d: Date | string | number) {
    return new Date(d).getTime() > Date.now();
  }
  