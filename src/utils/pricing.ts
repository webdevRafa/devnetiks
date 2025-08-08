// pricing.ts
// Apply pricing rules to services/quotes/proposals.

import { dollarsToCents } from "./currency";

export type PricingRuleType = "percentage" | "flat" | "tiered"; // keep simple

export interface PricingRule {
  id: string;
  appliesToServiceId?: string; // if omitted, considered global
  type: PricingRuleType;
  value: number; // percentage=%, flat=$, tiered=not implemented deeply here
  description?: string;
  active?: boolean;
}

export interface ServicePriceInput {
  basePriceCents: number;
  rules?: PricingRule[];
  serviceId?: string;
}

export function applyPricingRules({ basePriceCents, rules = [], serviceId }: ServicePriceInput) {
  let price = basePriceCents;
  for (const r of rules) {
    if (r.active === false) continue;
    if (r.appliesToServiceId && r.appliesToServiceId !== serviceId) continue;

    if (r.type === "percentage") {
      price += Math.round(price * (r.value / 100));
    } else if (r.type === "flat") {
      const add = dollarsToCents(r.value);
      price += add;
    } else {
      // tiered – placeholder for future tiers
    }
  }
  return price;
}
