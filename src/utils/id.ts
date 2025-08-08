// id.ts
// Simple ID helpers with optional prefixes per-entity.

const rand = () => Math.random().toString(36).slice(2, 8);

export function generateId(prefix?: string) {
  const core = `${Date.now().toString(36)}${rand()}`; // sortable-ish + random
  return prefix ? `${prefix}_${core}` : core;
}

export function idPrefixFor(collection: string) {
  // Map common collections to readable prefixes
  const map: Record<string, string> = {
    organizations: "org",
    contacts: "ctc",
    users: "usr",
    projects: "prj",
    milestones: "mls",
    tasks: "tsk",
    approvals: "apv",
    proposals: "pps",
    agreements: "agr",
    services: "svc",
    pricingRules: "prc",
    invoices: "inv",
    payments: "pay",
    subscriptions: "sub",
    environments: "env",
    deploys: "dpy",
    domains: "dom",
    tickets: "tkt",
    notifications: "ntf",
    activity: "act",
    jobs: "job",
    webhookEvents: "whk",
    files: "fil",
    forms: "frm",
    quotes: "qte",
  };
  return map[collection] ?? "id";
}

export function newEntityId(collection: string) {
  return generateId(idPrefixFor(collection));
}
