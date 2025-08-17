// src/pages/projects/ProjectListPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import DataTable from "@/components/TableComponent";

type Project = import("@/types/types").Project;
type Organization = import("@/types/types").Organization;

const statusPill = (value?: string) => (
  <span className="px-2 py-1 rounded-lg bg-white/5 text-white/80 border border-white/10 capitalize">
    {value || "unknown"}
  </span>
);

const ProjectListPage: React.FC = () => {
  const [rows, setRows] = useState<Project[]>([]);
  const [orgNames, setOrgNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const snap = await getDocs(
        query(
          collection(db, paths.projects()).withConverter(
            passthroughConverter<Project>()
          ),
          orderBy("createdAt", "desc")
        )
      );
      setRows(snap.docs.map((d) => d.data()));

      const os = await getDocs(
        collection(db, paths.organizations()).withConverter(
          passthroughConverter<Organization>()
        )
      );
      const map: Record<string, string> = {};
      os.docs.forEach((d) => (map[d.id] = (d.data() as Organization).name));
      setOrgNames(map);

      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchText =
        !s ||
        r.name?.toLowerCase().includes(s) ||
        r.id?.toLowerCase().includes(s) ||
        r.organizationId?.toLowerCase().includes(s);
      const matchStatus = status === "all" || r.status === status;
      return matchText && matchStatus;
    });
  }, [rows, search, status]);

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof Project,
      render: (v: any, r: Project) => (
        <Link
          className="text-[var(--accent-color1)] hover:underline"
          to={`/projects/${r.id}`}
        >
          {String(v || r.id)}
        </Link>
      ),
    },
    {
      header: "Organization",
      accessor: "organizationId" as keyof Project,
      render: (v: any) =>
        v ? (
          <Link
            className="text-[var(--accent-color1)] hover:underline"
            to={`/organizations/${String(v)}`}
          >
            {orgNames[String(v)] || String(v)}
          </Link>
        ) : (
          <span className="text-white/40">—</span>
        ),
    },
    {
      header: "Status",
      accessor: "status" as keyof Project,
      render: (v: any) => statusPill(String(v || "active")),
    },
    {
      header: "Created",
      accessor: "createdAt" as keyof Project,
      render: (v: any) => (
        <span className="text-white/70 text-sm">
          {v ? new Date(v).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="px-1">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
          <p className="text-white/60 text-sm">
            All projects across organizations.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/projects/new"
            className="px-3 py-2 rounded-xl bg-[var(--accent-color1)] hover:bg-[var(--accent-color1-hover)] text-white text-sm"
          >
            New Project
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-col sm:flex-row gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects…"
          className="w-full sm:max-w-sm bg-transparent border border-white/10 rounded-xl px-3 py-2 text-white/90 placeholder-white/40"
        />
        <select
          className="bg-[var(--color-card)] border border-white/10 rounded-xl px-3 py-2 text-white/90"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 text-white/60">
          Loading projects…
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] shadow-sm overflow-hidden">
          <div className="p-2">
            <DataTable<Project> data={filtered} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;
