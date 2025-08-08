// proposals.ts
// Proposal versioning + total pricing from line items.

import { calculateSubtotalCents } from "./invoices";

export interface ProposalItem {
  id: string;
  name: string;
  quantity: number;
  unitAmountCents: number;
}

export function nextProposalVersion(current?: number) {
  return (current ?? 0) + 1;
}

export function proposalSubtotal(items: ProposalItem[]) {
  return calculateSubtotalCents(items);
}
