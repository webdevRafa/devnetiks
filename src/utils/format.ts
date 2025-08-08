// format.ts
// Common display formatters.

import { formatCents } from "./currency";
import { formatDate } from "./dates";

export const fmt = {
  money: formatCents,
  date: (d: Date | string | number) => formatDate(d, "en-US", { year: "numeric", month: "short", day: "2-digit" }),
  dateTime: (d: Date | string | number) =>
    formatDate(d, "en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
};
