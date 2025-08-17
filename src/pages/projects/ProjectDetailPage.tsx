// src/pages/projects/ProjectDetailPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

type Project = import("@/types/types").Project;

const pill = (value?: string) => (
  <span className="px-2 py-1 rounded-lg bg-white/5 text-white/80 border border-white/10 capitalize">
    {value || "unknown"}
  </span>
);

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const ref = doc(db, paths.project(id)).withConverter(
        passthroughConverter<Project>()
      );
      const snap = await getDoc(ref);
      setProject(snap.exists() ? snap.data() : null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-white/60">Loading…</div>;
  }
  if (!project) {
    return <div className="p-6 text-red-400">Project not found.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{project.name}</h1>
        <div className="flex gap-2">
          <Link
            to={`/projects/${project.id}/edit`}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[var(--color-card-hover)] text-sm"
          >
            Edit
          </Link>
          <Link
            to="/projects"
            className="px-3 py-2 rounded-xl bg-[var(--accent-color1)] hover:bg-[var(--accent-color1-hover)] text-white text-sm"
          >
            Back to list
          </Link>
        </div>
      </div>

      {/* Meta Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-4">
          <div className="text-white/60 text-sm mb-1">Status</div>
          <div className="text-white">{pill(project.status)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-4">
          <div className="text-white/60 text-sm mb-1">Organization</div>
          {project.organizationId ? (
            <Link
              to={`/organizations/${project.organizationId}`}
              className="text-[var(--accent-color1)] hover:underline"
            >
              {project.organizationId}
            </Link>
          ) : (
            <div className="text-white/60">—</div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-4">
          <div className="text-white/60 text-sm mb-1">Created</div>
          <div className="text-white">
            {project.createdAt
              ? new Date(project.createdAt).toLocaleString()
              : "-"}
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
        <div className="text-white/80 mb-2 font-medium">Details</div>
        <div className="text-sm text-white/80 space-y-1">
          <div>
            <span className="text-white/50">Project ID:</span> {project.id}
          </div>
          <div>
            <span className="text-white/50">Organization ID:</span>{" "}
            {project.organizationId || "—"}
          </div>
          <div>
            <span className="text-white/50">Status:</span>{" "}
            {project.status || "—"}
          </div>
          <div>
            <span className="text-white/50">Created:</span>{" "}
            {project.createdAt || "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
