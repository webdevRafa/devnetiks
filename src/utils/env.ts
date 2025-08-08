// env.ts
// Typed env getter with clear errors in dev.

function req(name: string, optional = false) {
  // Cast import.meta.env to a generic record for dynamic access
  const envVars = import.meta.env as unknown as Record<string, string | undefined>;
  const v = envVars[name];

  if (!v && !optional) {
    if (import.meta.env.MODE !== "production") {
      console.warn(`Missing required env var: ${name}`);
    }
  }
  return v ?? "";
}

export const ENV = {
  MODE: req("MODE", true),
  VITE_FIREBASE_API_KEY: req("VITE_FIREBASE_API_KEY"),
  VITE_STRIPE_PUBLISHABLE_KEY: req("VITE_STRIPE_PUBLISHABLE_KEY", true),
  VITE_APP_URL: req("VITE_APP_URL", true),
};
