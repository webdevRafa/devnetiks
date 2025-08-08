// domains.ts
// Normalize domains/URLs for hosting & deploys tracking.

export function normalizeDomain(input: string) {
    let x = input.trim().toLowerCase();
    x = x.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return x;
  }
  
  export function ensureHttps(url: string) {
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  }
  