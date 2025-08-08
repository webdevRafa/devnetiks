// currency.ts
// All monetary values are stored in cents. Keep it consistent.

export function dollarsToCents(amount: number): number {
    // supports floats like 19.99 -> 1999
    return Math.round(amount * 100);
  }
  
  export function centsToDollars(cents: number): number {
    return Math.round(cents) / 100;
  }
  
  export function parseMoneyToCents(input: string): number {
    const normalized = input.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const num = Number(normalized);
    if (Number.isNaN(num)) return 0;
    return dollarsToCents(num);
  }
  
  export function formatCents(cents: number, currency = "USD", locale = "en-US") {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
      centsToDollars(cents)
    );
  }
  
  export function sumCents(values: number[]) {
    return values.reduce((a, b) => a + b, 0);
  }
  