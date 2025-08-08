// validators.ts
// Lightweight field checks that mirror your types without extra libs.

export function isEmail(x: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
  }
  
  export function isPhone(x: string) {
    const digits = x.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }
  
  export function required<T>(v: T | null | undefined): v is T {
    return v !== null && v !== undefined && `${v}`.trim() !== "";
  }
  