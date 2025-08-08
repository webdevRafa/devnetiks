// activity.ts
// Normalized activity event builder.

import { generateId } from "./id";

export type ActivityVerb =
  | "created"
  | "updated"
  | "deleted"
  | "commented"
  | "approved"
  | "rejected"
  | "signed"
  | "paid"
  | "notified";

export interface ActivityInput {
  actorId: string;
  entityType: string; // e.g. "project", "invoice"
  entityId: string;
  verb: ActivityVerb;
  meta?: Record<string, unknown>;
}

export function buildActivity(input: ActivityInput) {
  return {
    id: generateId("act"),
    ...input,
    createdAt: new Date().toISOString(),
  };
}
