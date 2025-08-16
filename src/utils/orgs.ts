// src/utils/orgs.ts
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { paths } from "@/utils/paths";
import { newEntityId } from "@/utils/id";

type Organization = import("@/types/types").Organization;

export function normalizeDomain(input?: string | null): string | null {
  if (!input) return null;
  const raw = String(input).trim(); // <- available to try/catch

  try {
    const urlish = raw.includes("://") ? raw : `https://${raw}`;
    const u = new URL(urlish);
    // strip www.
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    return host || null;
  } catch {
    // last-gasp: treat as plain domain
    return (
      raw
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .toLowerCase() || null
    );
  }
}

export async function upsertOrganizationByDomain(args: {
  name: string;
  website?: string | null;
}) {
  const { name, website } = args;
  const domain = normalizeDomain(website || name);

  // Try to find existing org by normalized domain
  if (domain) {
    const ref = collection(db, paths.organizations());
    const q = query(ref, where("domain", "==", domain));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      const data = d.data() as Organization;
      const { id: _ignore, ...rest } = (data || {}) as any; // avoid duplicate id
      return { ...rest, id: d.id } as Organization;
    }
  }

  // Create new org
  const id = newEntityId("organizations");
  const now = serverTimestamp() as any;

  const org: Organization = {
    id,
    name,
    website: website || null,
    domain: domain || null, // add this field to your Organization type if not present
    createdAt: now,
    updatedAt: now,
  } as any;

  await setDoc(doc(db, paths.organization(id)), org, { merge: true });
  return org;
}
