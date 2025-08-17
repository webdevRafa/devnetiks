// src/pages/quotes/QuoteDetailPage.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

type QuoteStatus =
  | "new"
  | "reviewed"
  | "quoted"
  | "accepted"
  | "declined"
  | "archived";

type Quote = {
  id: string;
  submittedByUserId?: string;
  orgId?: string | null;
  clientName?: string | null;
  email: string;
  phone?: string | null;
  projectType: "brochure" | "booking" | "ecommerce" | "custom";
  quoteType?: "fixed" | "hourly" | "retainer";
  budget?: string | null;
  timeline?: string | null;
  details?: string | null;
  featuresRequested?: string[];
  status: QuoteStatus;
  createdAt: any;
  updatedAt?: any;
};

export default function QuoteDetailPage() {
  const { id } = useParams();
  const [q, setQ] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      const ref = doc(db, "quotes", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setQ({ id: snap.id, ...(snap.data() as any) });
      setLoading(false);
    })();
  }, [id]);

  async function setStatus(status: QuoteStatus) {
    if (!id) return;
    const ref = doc(db, "quotes", id);
    await updateDoc(ref, { status, updatedAt: Timestamp.now() });
    setQ((prev) => (prev ? ({ ...prev, status } as Quote) : prev));
  }

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!q) return <div className="p-6 text-red-600">Request not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Request{" "}
          <span className="text-gray-500">
            #{q.id.slice(0, 6).toUpperCase()}
          </span>
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setStatus("reviewed")}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            Mark reviewed
          </button>
          <Link
            to={`/app/quotes/${q.id}/respond`}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Respond with quote
          </Link>
          <button
            onClick={() => setStatus("archived")}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            Archive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Project type:</span>
              <span className="px-2 py-1 text-sm rounded bg-gray-100 capitalize">
                {q.projectType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <div className="text-gray-500">Submitted</div>
                <div>
                  {q.createdAt?.seconds
                    ? new Date(q.createdAt.seconds * 1000).toLocaleString()
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Timeline</div>
                <div>{q.timeline || "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Budget</div>
                <div>{q.budget || "-"}</div>
              </div>
              <div>
                <div className="text-gray-500">Contact</div>
                <div>{q.clientName || q.email}</div>
                <div className="text-gray-600">{q.email}</div>
              </div>
            </div>

            {q.featuresRequested?.length ? (
              <div className="mt-6">
                <div className="text-gray-500 text-sm mb-1">Key features</div>
                <div className="flex flex-wrap gap-2">
                  {q.featuresRequested.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {q.details ? (
              <div className="mt-6">
                <div className="text-gray-500 text-sm mb-1">Details</div>
                <p className="text-gray-800 whitespace-pre-wrap">{q.details}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="text-gray-500 text-sm mb-2">Organization</div>
            {q.orgId ? (
              <Link
                to={`/app/organizations/${q.orgId}`}
                className="text-blue-600 hover:underline"
              >
                Open organization
              </Link>
            ) : (
              <div className="text-gray-600">No org declared.</div>
            )}
          </div>
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="text-gray-500 text-sm mb-2">Navigation</div>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/app/quotes"
                  className="text-blue-600 hover:underline"
                >
                  Back to requests
                </Link>
              </li>
              <li>
                <Link
                  to="/app/projects"
                  className="text-blue-600 hover:underline"
                >
                  Go to projects
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
