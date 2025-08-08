// support.ts
// Ticket helpers: status transitions + SLA-ish timestamps.

import { addDays } from "./dates";

export type TicketStatus = "open" | "in_progress" | "waiting" | "closed";

export function nextTicketStatus(from: TicketStatus): TicketStatus {
  if (from === "open") return "in_progress";
  if (from === "in_progress") return "waiting";
  if (from === "waiting") return "closed";
  return "closed";
}

export function dueBy(priority: "low" | "normal" | "high" | "urgent", createdAt: Date) {
  const map = { low: 7, normal: 3, high: 1, urgent: 0 };
  return addDays(createdAt, map[priority]);
}
