// src/pages/StartProjectPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { upsertOrganizationByDomain } from "@/utils/orgs";
import { paths } from "@/utils/paths";
import { newEntityId } from "@/utils/id";

// StartProjectPage — Devnetiks Design
// - Dark modern palette via CSS variables in index.css
// - Clean two-column layout (copy + form)
// - Preserves original Firestore flow: org -> contact -> project -> (optional) membership -> quotes
export default function StartProjectPage() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("Website");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    try {
      const parsedBudget = budget ? Number(budget.replace(/[^\d.]/g, "")) : 0;

      // 1) Upsert organization (by provided company or fallback to contact name)
      const org = await upsertOrganizationByDomain({
        name: company || `${name || "Unknown"} Org`,
      });

      // 2) Create/Upsert contact
      if (email) {
        const contactId = newEntityId("contacts");
        await setDoc(
          doc(db, paths.contact(contactId)),
          {
            id: contactId,
            name: name || null,
            email,
            orgId: org.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            source: "public_form",
          },
          { merge: true }
        );
      }

      // 3) Create a draft/lead project
      const projectId = newEntityId("projects");
      const projectName = details?.trim()
        ? details.trim().slice(0, 80)
        : `${projectType} for ${company || name || "New Client"}`;

      await setDoc(
        doc(db, paths.project(projectId)),
        {
          id: projectId,
          name: projectName,
          orgId: org.id,
          status: "lead",
          source: "public_form",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        } as any,
        { merge: true }
      );

      // 4) Link signed-in user to org + project (optional)
      if (user) {
        await setDoc(
          doc(db, paths.user(user.uid)),
          { orgId: org.id, updatedAt: serverTimestamp() },
          { merge: true }
        );

        const pmId = newEntityId("projectMembers");
        await setDoc(
          doc(db, paths.projectMember(pmId)),
          {
            id: pmId,
            projectId,
            userId: user.uid,
            role: "owner",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      // 5) Preserve quotes write for ops/analytics
      await addDoc(collection(db, "quotes"), {
        createdAt: serverTimestamp(),
        status: "new",
        contact: { name, company, email },
        project: { type: projectType, budget: parsedBudget, details },
        source: "public_form",
        orgId: org.id,
        projectId,
      });

      // 6) Done
      nav("/thank-you", { replace: true });
    } catch (error: any) {
      console.error(error);
      setErr(error?.message || "Failed to submit request");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-background)] text-white overflow-hidden">
      {/* decorative page glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-18rem] h-[36rem] z-0"
        style={{
          background:
            "radial-gradient(800px circle at 50% 20%, rgba(47,122,251,0.22), transparent 40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-18rem] h-[36rem] z-0"
        style={{
          background:
            "radial-gradient(800px circle at 50% 80%, rgba(47,207,154,0.18), transparent 40%)",
        }}
      />

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-semibold tracking-tight hover:opacity-90">
          Devnetiks
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:bg-white/5"
          >
            Log in
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-20 md:grid-cols-2 md:gap-12">
        {/* Left: pitch */}
        <section className="self-start">
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
            Start a project
          </h1>
          <p className="mt-3 max-w-xl text-white/70 md:text-lg">
            Tell us what you need and we’ll scope it quickly. We build modern
            React + TypeScript apps with Tailwind and Firebase—ranging from
            sleek brochure sites to data-backed dashboards to booking &
            payments.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-5">
              <div className="text-sm font-semibold text-white">
                What you get
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
                <li>Clear scope & quote within 1 business day</li>
                <li>Lean MVP plan with an upgrade path</li>
                <li>Ownership of your code & data</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-5">
              <div className="text-sm font-semibold text-white">
                How it works
              </div>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/70">
                <li>Share a bit about your project</li>
                <li>We propose scope, timeline, and budget</li>
                <li>Build, launch, and iterate</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Right: form */}
        <section className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 md:p-7">
          <h2 className="text-lg font-semibold">Tell us about your project</h2>
          <p className="mt-1 text-sm text-white/60">
            A few basics help us tailor the plan.
          </p>

          <form onSubmit={submit} className="mt-5 grid gap-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="block">
                <span className="sr-only">Your name</span>
                <input
                  className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="sr-only">Company</span>
                <input
                  className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="sr-only">Email</span>
              <input
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                placeholder="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="block">
                <span className="sr-only">Project type</span>
                <select
                  className="w-full appearance-none rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white outline-none ring-0 focus:border-white/25"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option className="bg-[var(--color-card)]">Website</option>
                  <option className="bg-[var(--color-card)]">
                    Booking system
                  </option>
                  <option className="bg-[var(--color-card)]">
                    Web app (React + Firebase)
                  </option>
                  <option className="bg-[var(--color-card)]">E-commerce</option>
                  <option className="bg-[var(--color-card)]">
                    Something else
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="sr-only">Budget</span>
                <input
                  className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                  placeholder="Budget (USD)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  inputMode="decimal"
                />
              </label>
            </div>

            <label className="block">
              <span className="sr-only">Project details</span>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                placeholder="Project details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </label>

            {err && <p className="pt-1 text-sm text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[var(--accent-color1)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-color1-hover)] disabled:opacity-60"
            >
              {busy ? "Submitting…" : "Submit request"}
            </button>
          </form>

          <p className="mt-4 text-xs text-white/50">
            By submitting, you agree to be contacted about your project. We’ll
            reply within 1 business day.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 text-xs text-white/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <span>© {new Date().getFullYear()} Devnetiks LLC</span>
          <div className="flex items-center gap-3">
            <span className="text-white/60">Built with</span>
            <span className="rounded-md border border-white/10 bg-[var(--color-card)] px-2 py-1">
              React
            </span>
            <span className="rounded-md border border-white/10 bg-[var(--color-card)] px-2 py-1">
              Tailwind
            </span>
            <span className="rounded-md border border-white/10 bg-[var(--color-card)] px-2 py-1">
              Firebase
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
