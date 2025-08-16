import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { formatDate } from "@/utils/dates";
import { Link } from "react-router-dom";

type Organization = import("@/types/types").Organization;
type Project = import("@/types/types").Project;

function withProtocol(url?: string | null) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const ClientOrgPage: React.FC = () => {
  const { profile } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        // accept either orgId or organizationId from the profile
        const orgId: string | null =
          ((profile as any)?.orgId as string | undefined) ??
          ((profile as any)?.organizationId as string | undefined) ??
          null;

        if (!orgId) {
          if (isMounted) {
            setError(
              "No organization linked to your account. Contact support."
            );
            setLoading(false);
          }
          return;
        }

        // --- Load organization ---
        const orgRef = doc(db, paths.organization(orgId)).withConverter(
          passthroughConverter<Organization>()
        );
        const orgSnap = await getDoc(orgRef);

        if (!orgSnap.exists()) {
          if (isMounted) {
            setError("Organization not found.");
            setLoading(false);
          }
          return;
        }

        // Strip any stored id; add Firestore doc id once
        const orgData = orgSnap.data() as Organization;
        const { id: _ignoreOrgId, ...orgRest } = (orgData || {}) as any;
        if (isMounted) setOrg({ ...orgRest, id: orgSnap.id });

        // --- Load projects (support both orgId and organizationId fields) ---
        try {
          const projRef = collection(db, paths.projects()).withConverter(
            passthroughConverter<Project>()
          );

          const [s1, s2] = await Promise.all([
            getDocs(query(projRef, where("orgId", "==", orgId))),
            getDocs(query(projRef, where("organizationId", "==", orgId))),
          ]);

          const map = new Map<string, Project>();

          for (const d of s1.docs) {
            const pd = d.data() as Project;
            const { id: _drop, ...rest } = (pd || {}) as any;
            map.set(d.id, { ...rest, id: d.id });
          }
          for (const d of s2.docs) {
            const pd = d.data() as Project;
            const { id: _drop2, ...rest2 } = (pd || {}) as any;
            map.set(d.id, { ...rest2, id: d.id });
          }

          if (isMounted) setProjects(Array.from(map.values()));
        } catch (e) {
          // don't block the page if project query fails
          console.error("Failed to load projects", e);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load organization.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
    // rerun when the linked org changes
  }, [(profile as any)?.orgId, (profile as any)?.organizationId]);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!org) return null;

  const isAdminish = ["admin", "manager", "staff"].includes(
    String(profile?.role)
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Organization</h2>
          {isAdminish && (
            <Link
              to={`/app/organizations/${org.id}`}
              className="text-sm text-blue-600 underline"
            >
              Open in Admin
            </Link>
          )}
        </div>

        <div className="mt-3 grid gap-2 text-sm">
          <div>
            <span className="text-gray-500">Name:</span> {org.name}
          </div>
          <div>
            <span className="text-gray-500">Website:</span>{" "}
            {org.website ? (
              <a
                href={withProtocol(org.website)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {org.website}
              </a>
            ) : (
              "-"
            )}
          </div>
          <div>
            <span className="text-gray-500">Created:</span>{" "}
            {org.createdAt ? formatDate(org.createdAt as any) : "-"}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold mb-3">Projects at {org.name}</h3>
        {projects.length === 0 ? (
          <div className="text-sm text-gray-600">No projects yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
            {projects.map((p) => (
              <li key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{(p as any).name || p.id}</div>
                  <div className="text-xs text-gray-500">
                    Created{" "}
                    {p.createdAt ? formatDate((p as any).createdAt) : "-"}
                  </div>
                </div>
                {isAdminish && (
                  <Link
                    to={`/app/projects/${p.id}`}
                    className="text-sm text-blue-600 underline"
                  >
                    View in Admin
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ClientOrgPage;
