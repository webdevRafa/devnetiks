import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import DataTable from "@/components/TableComponent";

// Fallback formatter (safe whether createdAt is Timestamp or string)
const fmtDate = (d: any) => {
  try {
    if (!d) return "-";
    if ((d as Timestamp).toDate)
      return (d as Timestamp).toDate().toLocaleDateString();
    if (typeof d === "string") return new Date(d).toLocaleDateString();
    return "-";
  } catch {
    return "-";
  }
};

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
  orgId?: string;
  clientName?: string;
  email: string;
  phone?: string;
  projectType: "brochure" | "booking" | "ecommerce" | "custom";
  quoteType?: "fixed" | "hourly" | "retainer";
  budget?: string;
  timeline?: string;
  details?: string;
  featuresRequested?: string[];
  status: QuoteStatus;
  createdAt: any;
  updatedAt?: any;
};

export default function QuoteListPage() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<QuoteStatus | "all">("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const col = collection(db, "quotes");
      const q = query(col, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Quote[];
      setRows(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => (filter === "all" ? true : r.status === filter)),
    [rows, filter]
  );

  const columns = [
    {
      header: "Submitted",
      accessor: "createdAt" as const,
      render: (value: any) => (
        <span className="text-white/80">{fmtDate(value)}</span>
      ),
    },
    {
      header: "Client",
      accessor: "clientName" as const,
      render: (_: any, r: Quote) => (
        <div className="flex flex-col">
          <span className="text-white">{r.clientName || r.email}</span>
          <span className="text-white/40 text-xs">{r.email}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "projectType" as const,
      render: (value: string) => (
        <span className="px-2 py-1 rounded-lg bg-white/5 text-white/80 border border-white/10 capitalize">
          {value}
        </span>
      ),
    },
    {
      header: "Org",
      accessor: "orgId" as const,
      render: (value: string | undefined) =>
        value ? (
          <Link
            className="text-[var(--accent-color1)] hover:underline"
            to={`/app/organizations/${value}`}
          >
            View org
          </Link>
        ) : (
          <span className="text-white/40">—</span>
        ),
    },
    {
      header: "Status",
      accessor: "status" as const,
      render: (value: string) => (
        <span className="px-2 py-1 rounded-lg bg-white/5 text-white/80 border border-white/10 capitalize">
          {value}
        </span>
      ),
    },
    {
      header: "",
      accessor: "id" as const,
      render: (_: any, r: Quote) => (
        <div className="flex items-center justify-end">
          <Link
            to={`/app/quotes/${r.id}`}
            className="text-sm px-3 py-1 rounded-lg bg-[var(--accent-color1)] hover:bg-[var(--accent-color1-hover)] text-white"
          >
            Open
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Requests</h1>
          <p className="text-white/60 text-sm">
            All client project requests from the quotes collection.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="bg-[var(--color-card)] border border-white/10 rounded-xl px-3 py-2 text-white/90"
            value={filter}
            disabled={loading}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="quoted">Quoted</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] shadow-sm overflow-hidden">
        <div className="p-2">
          <DataTable<Quote> data={filtered} columns={columns as any} />
        </div>
      </div>
    </div>
  );
}
