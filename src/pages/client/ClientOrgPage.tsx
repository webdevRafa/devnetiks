import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type Organization = {
  id: string;
  name: string;
  website?: string;
  billingEmail?: string;
  domain?: string;
  createdAt?: any;
};

type Project = {
  id: string;
  title?: string;
  status?: string;
  createdAt?: any;
};

export default function ClientOrgPage() {
  const { user, profile } = useAuth();
  const existingOrgId =
    (profile as any)?.orgId || (profile as any)?.organizationId || null;

  const [org, setOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [orgName, setOrgName] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const emailDomain = useMemo(
    () => (user?.email ? user.email.split("@")[1] : ""),
    [user?.email]
  );

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!user) return;
      try {
        if (existingOrgId) {
          const ref = doc(db, "organizations", existingOrgId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() } as Organization;
            if (isMounted) setOrg(data);
          }
          // projects for this org
          const pRef = query(
            collection(db, "projects"),
            where("orgId", "==", existingOrgId),
            orderBy("createdAt", "desc"),
            limit(10)
          );
          const pSnap = await getDocs(pRef);
          if (isMounted)
            setProjects(
              pSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
            );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [user?.uid, existingOrgId]);

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const id = crypto.randomUUID();
      const payload: Organization = {
        id,
        name: orgName.trim(),
        website: website || undefined,
        billingEmail: user.email || undefined,
        domain: websiteDomain(website) || emailDomain || undefined,
        createdAt: serverTimestamp() as any,
      };
      await setDoc(doc(db, "organizations", id), payload, { merge: true });
      // Link to user profile
      await setDoc(
        doc(db, "users", user.uid),
        { orgId: id, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setOrg(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold">Organization</h2>
        {loading ? (
          <div className="text-sm text-white/60 mt-2">Loading…</div>
        ) : org ? (
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Name" value={org.name} />
            {org.website && <Row label="Website" value={org.website} />}
            {org.billingEmail && (
              <Row label="Billing Email" value={org.billingEmail} />
            )}
            {org.domain && <Row label="Domain" value={org.domain} />}
          </div>
        ) : (
          <div className="mt-3 text-white/70">
            No organization linked yet. Create one below to associate your
            requests and projects.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
        <h3 className="text-base font-semibold">
          Create or claim your organization
        </h3>
        <p className="text-sm text-white/60 mt-1">
          We’ll use your email domain (
          <span className="text-white/80">{emailDomain || "unknown"}</span>) to
          help match your org. You can set a website to override the domain.
        </p>

        <form onSubmit={handleCreateOrg} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm text-white/80">Organization name</span>
            <input
              required
              className="mt-1 w-full rounded-lg bg-[#0B1120] border border-white/10 p-2 outline-none"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Inc."
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/80">Website</span>
            <input
              className="mt-1 w-full rounded-lg bg-[#0B1120] border border-white/10 p-2 outline-none"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://acme.com"
            />
          </label>

          <button
            disabled={saving || !orgName.trim()}
            className="mt-2 rounded-xl px-4 py-2 bg-[var(--accent-color2)] hover:bg-[var(--accent-color2-hover)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save & link to my account"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold">Recent projects</h2>
        {loading ? (
          <div className="text-sm text-white/60 mt-2">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="text-sm text-white/60 mt-2">No projects yet.</div>
        ) : (
          <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {projects.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-white/10 bg-[var(--color-card-hover)] p-4"
              >
                <div className="font-medium">
                  {p.title || "Untitled project"}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  #{p.id.slice(0, 6)} • {readableDate(p.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-white/50 text-sm">{label}</div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

function readableDate(ts: any) {
  if (!ts) return "";
  // Firestore Timestamp
  // @ts-ignore
  if (ts?.toDate) return ts.toDate().toLocaleDateString();
  // seconds/nanos object
  if (typeof ts?.seconds === "number")
    return new Date(ts.seconds * 1000).toLocaleDateString();
  // string or Date
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
  } catch {}
  return "";
}

function websiteDomain(url: string) {
  if (!url) return "";
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
