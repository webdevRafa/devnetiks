// notifications.ts
// Build notification payloads for system -> user messages.

import { generateId } from "./id";

export type NotificationType =
  | "proposal_approved"
  | "agreement_signed"
  | "invoice_issued"
  | "invoice_overdue"
  | "payment_received"
  | "ticket_updated"
  | "project_updated";

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entity?: { type: string; id: string };
}

export function buildNotification(n: NotificationInput) {
  return {
    id: generateId("ntf"),
    ...n,
    read: false,
    createdAt: new Date().toISOString(),
  };
}
