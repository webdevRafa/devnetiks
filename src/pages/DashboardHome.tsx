// src/pages/DashboardHome.tsx (with CountUp animation)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  getCountFromServer,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

type Project = import("@/types/types").Project;
type Organization = import("@/types/types").Organization;
type Invoice = import("@/types/types").Invoice;

type Quote = {
  id: string;
  email?: string;
  clientName?: string;
  projectType?: string;
  status?: string;
  createdAt?: any;
  orgId?: string | null;
};

// Lightweight, dependency-free counter animation.
// Respects prefers-reduced-motion (no animation).
function CountUp({
  value,
  duration = 900,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  const from = useRef(0);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    if (raf.current) cancelAnimationFrame(raf.current);
    start.current = null;
    from.current = display;

    const step = (ts: number) => {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(1, elapsed / duration);

      // Ease-out (cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from.current + (value - from.current) * eased);
      setDisplay(next);

      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        raf.current = null;
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [value, duration, prefersReducedMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{display.toLocaleString()}</>;
}

function StatCard({
  label,
  value,
  to,
}: {
  label: string;
  value: number;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group relative block rounded-2xl border border-white/10 bg-[var(--color-card)] p-4 hover:bg-[var(--color-card-hover)] transition-colors"
    >
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">
        <CountUp value={value} />
      </div>
      <div className="mt-3 inline-flex items-center gap-2 text-[var(--accent-color1)] text-sm opacity-90 group-hover:opacity-100">
        Open {label.toLowerCase()} <span aria-hidden>↗</span>
      </div>
    </Link>
  );
}

function ItemRow({
  title,
  subtitle,
  to,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-start justify-between gap-4 rounded-xl px-3 py-2 hover:bg-[var(--color-card-hover)] transition-colors"
    >
      <div className="min-w-0">
        <div className="truncate text-white">{title}</div>
        {subtitle && (
          <div className="truncate text-xs text-white/60">{subtitle}</div>
        )}
      </div>
      <span className="text-white/40 text-sm">Open</span>
    </Link>
  );
}

export default function DashboardHome() {
  const [counts, setCounts] = useState({
    projects: 0,
    organizations: 0,
    requests: 0,
    invoices: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Counts — try getCountFromServer; fallback to getDocs().size
      async function countOf(colRef: any) {
        try {
          const snap = await getCountFromServer(colRef);
          return snap.data().count as number;
        } catch {
          const s = await getDocs(colRef);
          return s.size;
        }
      }

      const projCol = collection(db, paths.projects()).withConverter(
        passthroughConverter<Project>()
      );
      const orgCol = collection(db, paths.organizations()).withConverter(
        passthroughConverter<Organization>()
      );
      const invCol = collection(db, paths.invoices()).withConverter(
        passthroughConverter<Invoice>()
      );
      const quoteCol = collection(db, "quotes"); // requests

      const [pc, oc, ic, qc] = await Promise.all([
        countOf(projCol),
        countOf(orgCol),
        countOf(invCol),
        countOf(quoteCol),
      ]);

      setCounts({
        projects: pc,
        organizations: oc,
        invoices: ic,
        requests: qc,
      });

      // Recent projects
      const projSnap = await getDocs(
        query(projCol, orderBy("createdAt", "desc"), limit(5))
      );
      setRecentProjects(projSnap.docs.map((d) => d.data()));

      // Recent invoices
      const invSnap = await getDocs(
        query(invCol, orderBy("createdAt", "desc"), limit(5))
      );
      setRecentInvoices(invSnap.docs.map((d) => d.data()));

      // Recent requests (quotes)
      const quoteSnap = await getDocs(
        query(quoteCol, orderBy("createdAt", "desc"), limit(5))
      );
      setRecentQuotes(
        quoteSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      );

      setLoading(false);
    })();
  }, []);

  return (
    <div className="px-1">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/60 text-sm">
          Quick glance at activity across projects, requests, and billing.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects" value={counts.projects} to="/app/projects" />
        <StatCard
          label="Organizations"
          value={counts.organizations}
          to="/app/organizations"
        />
        <StatCard label="Requests" value={counts.requests} to="/app/quotes" />
        <StatCard label="Invoices" value={counts.invoices} to="/app/invoices" />
      </div>

      {/* Recent panels */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-white/80 font-medium">Recent requests</div>
            <Link
              to="/app/quotes"
              className="text-[var(--accent-color1)] text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="py-1">
            {loading ? (
              <div className="p-4 text-white/60">Loading…</div>
            ) : recentQuotes.length === 0 ? (
              <div className="p-4 text-white/60">No requests yet.</div>
            ) : (
              recentQuotes.map((q) => (
                <ItemRow
                  key={q.id}
                  title={q.clientName || q.email || "Unknown contact"}
                  subtitle={`${q.projectType ?? "project"} • ${
                    q.status ?? "new"
                  }`}
                  to={`/app/quotes/${q.id}`}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-white/80 font-medium">Recent projects</div>
            <Link
              to="/app/projects"
              className="text-[var(--accent-color1)] text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="py-1">
            {loading ? (
              <div className="p-4 text-white/60">Loading…</div>
            ) : recentProjects.length === 0 ? (
              <div className="p-4 text-white/60">No projects yet.</div>
            ) : (
              recentProjects.map((p) => (
                <ItemRow
                  key={p.id}
                  title={p.name ?? p.id}
                  subtitle={
                    p.organizationId ? `Org: ${p.organizationId}` : undefined
                  }
                  to={`/app/projects/${p.id}`}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-white/80 font-medium">Recent invoices</div>
            <Link
              to="/app/invoices"
              className="text-[var(--accent-color1)] text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="py-1">
            {loading ? (
              <div className="p-4 text-white/60">Loading…</div>
            ) : recentInvoices.length === 0 ? (
              <div className="p-4 text-white/60">No invoices yet.</div>
            ) : (
              recentInvoices.map((inv) => (
                <ItemRow
                  key={(inv as any).id}
                  title={`Invoice ${(inv as any).id}`}
                  subtitle={`Status: ${(inv as any).status ?? "unknown"}`}
                  to={`/app/invoices/${(inv as any).id}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
