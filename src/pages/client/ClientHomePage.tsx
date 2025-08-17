import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ClientProjectRequestForm from "@/components/ClientProjectRequestForm";
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { Clock, MailCheck, FileText } from "lucide-react";

type Quote = {
  id?: string;
  status?: string; // QuoteStatus
  projectType?: string;
  createdAt?: any;
};

type Project = {
  id?: string;
  title?: string;
  status?: string;
  createdAt?: any;
};

export default function ClientHomePage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Try ordered query first (requires a composite index).
    const orderedRef = query(
      collection(db, "quotes"),
      where("submittedByUserId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(12)
    );
    let cleanup = () => {};
    const unsub = onSnapshot(
      orderedRef,
      (snap) => {
        setQuotes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Quote)));
        setLoadingQuotes(false);
      },
      async () => {
        // Silent fallback without orderBy (avoids index requirement)
        const noOrderRef = query(
          collection(db, "quotes"),
          where("submittedByUserId", "==", user.uid),
          limit(12)
        );
        const unsubFallback = onSnapshot(
          noOrderRef,
          (snap2) => {
            setQuotes(
              snap2.docs.map((d) => ({ id: d.id, ...d.data() } as Quote))
            );
            setLoadingQuotes(false);
          },
          () => setLoadingQuotes(false)
        );
        cleanup = () => unsubFallback();
      }
    );
    cleanup = () => unsub();
    return () => cleanup();
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    // Projects can stay as a lightweight live list too
    const pRef = query(
      collection(db, "projects"),
      where("clientId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(8)
    );
    const unsub = onSnapshot(
      pRef,
      (snap) => {
        setProjects(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
        );
        setLoadingProjects(false);
      },
      (err) => {
        console.error(err);
        setLoadingProjects(false);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  const pending = quotes.filter(
    (q) => (q.status ?? "new") === "new" || q.status === "reviewed"
  );
  const responded = quotes.filter((q) =>
    ["quoted", "accepted", "declined", "archived"].includes(q.status ?? "")
  );

  return (
    <div className="space-y-8">
      {/* Hero row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Let’s build something great together
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Start a project request and we’ll reply with a tailored quote.
            You’ll also see your pending requests, responses, and projects
            below.
          </p>
          <div className="mt-4 hidden md:block">
            <ClientProjectRequestForm />
          </div>
        </div>

        {/* Compact form for small screens */}
        <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 md:hidden">
          <ClientProjectRequestForm />
        </div>
      </section>

      {/* Lists */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card
          title={
            <div className="flex items-center gap-2">
              <Clock size={16} /> <span>Pending requests</span>
            </div>
          }
          subtitle="Requests you’ve submitted that we’re reviewing."
          className="lg:col-span-1"
        >
          {loadingQuotes ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : pending.length === 0 ? (
            <Empty label="No pending requests" />
          ) : (
            <ul className="divide-y divide-white/5">
              {pending.map((q) => (
                <li
                  key={q.id}
                  className="py-3 flex items-center justify-between"
                >
                  <Link
                    to={`/client/requests/${q.id}`}
                    className="text-sm group"
                  >
                    <div className="font-medium capitalize group-hover:underline">
                      {q.projectType || "project"}
                    </div>
                    <div className="text-white/50">
                      #{q.id?.slice(0, 6)} • {readableDate(q.createdAt)}
                    </div>
                  </Link>
                  <StatusBadge status={(q.status as any) || "pending"} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <MailCheck size={16} /> <span>Quotes & responses</span>
            </div>
          }
          subtitle="We’ll notify you as soon as we reply."
          className="lg:col-span-1"
        >
          {loadingQuotes ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : responded.length === 0 ? (
            <Empty label="No responses yet" />
          ) : (
            <ul className="divide-y divide-white/5">
              {responded.map((q) => (
                <li
                  key={q.id}
                  className="py-3 flex items-center justify-between"
                >
                  <Link
                    to={`/client/requests/${q.id}`}
                    className="text-sm group"
                  >
                    <div className="font-medium capitalize group-hover:underline">
                      {q.projectType || "project"}
                    </div>
                    <div className="text-white/50">
                      #{q.id?.slice(0, 6)} • {readableDate(q.createdAt)}
                    </div>
                  </Link>
                  <StatusBadge status={(q.status as any) || "quoted"} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <FileText size={16} /> <span>Your projects</span>
            </div>
          }
          subtitle="Active and recent projects."
          className="lg:col-span-1"
        >
          {loadingProjects ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : projects.length === 0 ? (
            <Empty label="No projects yet" />
          ) : (
            <ul className="divide-y divide-white/5">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="text-sm">
                    <div className="font-medium">
                      {p.title || "Untitled project"}
                    </div>
                    <div className="text-white/50">
                      #{p.id?.slice(0, 6)} • {readableDate(p.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={(p.status as any) || "active"} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function Card({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 " +
        className
      }
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-sm text-white/60">{label}</div>;
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
