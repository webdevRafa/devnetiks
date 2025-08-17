import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import ClientProjectRequestForm from "@/components/ClientProjectRequestForm";
import StatusBadge from "@/components/StatusBadge";

type Quote = {
  id?: string;
  status?: string;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!user) return;
      try {
        const qRef = query(
          collection(db, "quotes"),
          where("submittedByUserId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const qSnap = await getDocs(qRef);
        const qRows = qSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Quote)
        );

        const pRef = query(
          collection(db, "projects"),
          where("clientId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const pSnap = await getDocs(pRef);
        const pRows = pSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Project)
        );

        if (isMounted) {
          setQuotes(qRows);
          setProjects(pRows);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

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
            You’ll also see your recent quotes and projects below.
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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          title="Recent quotes"
          subtitle="We’ll notify you when we respond."
        >
          {loading ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : quotes.length === 0 ? (
            <Empty label="No quotes yet" />
          ) : (
            <ul className="divide-y divide-white/5">
              {quotes.map((q) => (
                <li
                  key={q.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="text-sm">
                    <div className="font-medium capitalize">
                      {q.projectType || "project"}
                    </div>
                    <div className="text-white/50">
                      #{q.id?.slice(0, 6)} • {readableDate(q.createdAt)}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={(q.status as any) || "pending"} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Your projects" subtitle="Active and recent projects.">
          {loading ? (
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
                  <div>
                    <StatusBadge status={(p.status as any) || "active"} />
                  </div>
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
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
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
