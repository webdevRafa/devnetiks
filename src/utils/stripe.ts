// stripe.ts
// Build Stripe line items + metadata from internal line items.

import { centsToDollars } from "./currency";

export interface StripeLikeLineItem {
  name: string;
  amount: number; // cents
  quantity: number;
  currency?: string; // default USD
  metadata?: Record<string, string>;
}

export function toStripeCheckoutItems(items: StripeLikeLineItem[]) {
  // For Stripe Checkout "price_data" inline
  return items.map((i) => ({
    price_data: {
      currency: i.currency ?? "usd",
      product_data: { name: i.name, metadata: i.metadata ?? {} },
      unit_amount: i.amount,
    },
    quantity: i.quantity,
  }));
}

export function buildOrderMetadata(meta: Record<string, unknown>) {
  // Flatten to string-only for Stripe metadata
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}

export function readableAmount(cents: number) {
  return `$${centsToDollars(cents).toFixed(2)}`;
}
