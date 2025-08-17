import React, { useMemo, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import type { QuoteProjectType } from "@/types/types";
// If your project has this helper, we'll use it; otherwise the import can be removed safely.
/* eslint-disable import/no-unresolved */

type Props = {
  onSubmitted?: () => void;
  defaultProjectType?: QuoteProjectType;
  className?: string;
};

const PROJECT_TYPES: QuoteProjectType[] = [
  "brochure",
  "booking",
  "ecommerce",
  "custom",
];

export default function ClientProjectRequestForm({
  onSubmitted,
  defaultProjectType = "brochure",
  className = "",
}: Props) {
  const { user, profile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [projectType, setProjectType] =
    useState<QuoteProjectType>(defaultProjectType);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [featuresRequested, setFeaturesRequested] = useState("");

  const clientName = useMemo(
    () => profile?.displayName || user?.displayName || "",
    [profile?.displayName, user?.displayName]
  );
  const email = useMemo(
    () => profile?.email || user?.email || "",
    [profile?.email, user?.email]
  );

  // Optional helper: dynamically import orgs util if available; supports either (email) or ({ email })
  async function tryUpsertOrgByDomain(email: string) {
    try {
      const mod: any = await import("@/utils/orgs");
      const fn: any = mod?.upsertOrganizationByDomain;
      if (typeof fn === "function") {
        try {
          return await fn(email);
        } catch {}
        try {
          return await fn({ email });
        } catch {}
      }
    } catch {}
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setBusy(true);
    setError(null);
    try {
      // Best-effort: ensure org exists/linked if missing
      let orgId: string | undefined =
        (profile as any)?.orgId ||
        (profile as any)?.organizationId ||
        undefined;

      if (!orgId && email) {
        try {
          // optional helper; if not present this will throw
          const org = await tryUpsertOrgByDomain(email);
          if (org?.id) orgId = org.id;
        } catch {
          // ignore; org will remain undefined
        }
      }

      const payload = {
        submittedByUserId: user.uid,
        orgId: orgId,
        clientName: clientName || "",
        email,
        projectType,
        budget: budget || undefined,
        timeline: timeline || undefined,
        details: details || undefined,
        featuresRequested: featuresRequested
          ? featuresRequested
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        status: "new",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "quotes"), payload);
      setSuccess(true);
      setBudget("");
      setTimeline("");
      setDetails("");
      setFeaturesRequested("");
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setError(
        err?.message || "Something went wrong while submitting your request."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "w-full rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 md:p-8 " +
        "shadow-lg hover:shadow-xl transition-shadow " +
        className
      }
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Start a project</h3>
        <p className="text-sm text-white/60 mt-1">
          Tell us a bit about what you want to build. We’ll reply with a quote.
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 text-sm rounded-lg border border-green-500/30 bg-green-500/10 p-3">
          Thanks! Your request was submitted. We’ll follow up shortly.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block md:col-span-2">
          <span className="text-sm text-white/80">Project type</span>
          <select
            className="mt-1 w-full rounded-lg bg-[#0B1120] border border-white/10 p-2 outline-none"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as QuoteProjectType)}
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-white/80">Budget (approx)</span>
          <input
            type="text"
            placeholder="$3k–$6k"
            className="mt-1 w-full rounded-lg bg-[#0B1120] border border-white/10 p-2 outline-none"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-white/80">Timeline</span>
          <input
            type="text"
            placeholder="ASAP, 2–4 weeks, flexible…"
            className="mt-1 w-full rounded-lg bg-[#0B1120] border border-white/10 p-2 outline-none"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />
        </label>

        <div className="md:col-span-2">
          <label className="block">
            <span className="text-sm text-white/80">Key features</span>
            <input
              type="text"
              placeholder="Blog, payments, booking, dashboard… (comma separated)"
              className="mt-1 w-full rounded-lg bg-[#0B1120] border border-white/10 p-2 outline-none"
              value={featuresRequested}
              onChange={(e) => setFeaturesRequested(e.target.value)}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block">
            <span className="text-sm text-white/80">Project details</span>
            <textarea
              placeholder="Tell us about your audience, goals, and anything else we should know."
              className="mt-1 min-h-28 w-full rounded-lg bg-[#0B1120] border border-white/10 p-3 outline-none"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl px-4 py-2 bg-[var(--accent-color1)] hover:bg-[var(--accent-color1-hover)] disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit request"}
        </button>
        <button
          type="button"
          onClick={() => {
            setBudget("");
            setTimeline("");
            setDetails("");
            setFeaturesRequested("");
          }}
          className="rounded-xl px-4 py-2 bg-[var(--color-card-hover)] border border-white/10 hover:bg-[#1b2540]"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
