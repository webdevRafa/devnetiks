// invoices.ts
// Totals, taxes, discounts using cents everywhere.

import { sumCents } from "./currency";

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitAmountCents: number;
  metadata?: Record<string, string | number>;
}

export interface InvoiceTotalsInput {
  items: LineItem[];
  taxRatePct?: number; // e.g. 8.25
  discountCents?: number;
}

export function calculateSubtotalCents(items: LineItem[]) {
  return sumCents(items.map(i => i.unitAmountCents * i.quantity));
}

export function calculateInvoiceTotals({
  items,
  taxRatePct = 0,
  discountCents = 0,
}: InvoiceTotalsInput) {
  const subtotal = calculateSubtotalCents(items);
  const tax = Math.round(subtotal * (taxRatePct / 100));
  const totalBeforeDiscount = subtotal + tax;
  const total = Math.max(0, totalBeforeDiscount - discountCents);
  return { subtotal, tax, discount: discountCents, total };
}
