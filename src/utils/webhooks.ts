// webhooks.ts
// Generic signature verification placeholder. Adapt for provider-specific HMAC scheme.

export function safeJson<T = unknown>(body: string): { ok: true; data: T } | { ok: false; error: string } {
    try {
      return { ok: true, data: JSON.parse(body) as T };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }
  
  // Example HMAC verifier (provider should give algorithm/secret/headers)
  export async function verifyHmacSha256(payload: string, headerSignature: string, secret: string) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
    const digest = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
    // Many providers send hex or base64—adjust compare accordingly
    return digest === headerSignature.toLowerCase();
  }
  