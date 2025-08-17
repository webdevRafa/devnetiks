import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import StatusBadge from "@/components/StatusBadge";
import { ArrowLeft, FileText, Info } from "lucide-react";

type QuoteDoc = {
  id?: string;
  submittedByUserId?: string;
  orgId?: string;
  clientName?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  details?: string;
  featuresRequested?: string[];
  status?: string;
  createdAt?: any;
  updatedAt?: any;
};

export default function ClientRequestPage() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const [quote, setQuote] = useState<QuoteDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quoteId) return;
    const ref = doc(db, "quotes", quoteId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists())
          setQuote({ id: snap.id, ...snap.data() } as QuoteDoc);
        else setQuote(null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [quoteId]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/client"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--color-card)] px-3 py-2 text-sm hover:bg-[var(--color-card-hover)]"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <FileText size={18} /> Request
            {quote?.id ? (
              <span className="text-white/50 text-sm">
                #{quote.id.slice(0, 6)}
              </span>
            ) : null}
          </h1>
          {quote?.status ? <StatusBadge status={quote.status as any} /> : null}
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-white/60">Loading…</div>
        ) : !quote ? (
          <div className="mt-4 text-sm text-white/60">
            This request was not found.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <Row
              label="Project type"
              value={capitalize(quote.projectType || "project")}
            />
            <Row label="Submitted on" value={readableDate(quote.createdAt)} />
            {quote.budget && <Row label="Budget" value={quote.budget} />}
            {quote.timeline && <Row label="Timeline" value={quote.timeline} />}
            {Array.isArray(quote.featuresRequested) &&
              quote.featuresRequested.length > 0 && (
                <div>
                  <div className="text-sm text-white/50">Key features</div>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {quote.featuresRequested.map((f, idx) => (
                      <li
                        key={idx}
                        className="rounded-lg border border-white/10 bg-[var(--color-card-hover)] px-2 py-1 text-xs"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {quote.details && (
              <div>
                <div className="text-sm text-white/50">Details</div>
                <p className="mt-1 text-sm leading-6 text-white/80 whitespace-pre-line">
                  {quote.details}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-[var(--color-card-hover)] p-4 text-xs text-white/70 flex items-start gap-2">
              <Info size={14} className="mt-0.5" />
              <div>
                We’ll follow up in this thread with any questions and a quote.
                You’ll receive an email notification and see updates here as the
                request status changes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-white/50 text-sm">{label}</div>
      <div className="text-sm">{value}</div>
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

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
