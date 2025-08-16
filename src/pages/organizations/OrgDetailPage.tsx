// src/pages/organizations/OrgDetailPage.tsx
import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import DetailCard from "@/components/DetailCard";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "@/utils/dates"; // <-- fix this import

type Organization = import("@/types/types").Organization;

function withProtocol(url?: string | null) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const OrgDetailPage: React.FC = () => {
  const params = useParams();
  const id = (params.id || (params as any).orgId) as string | undefined;

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      // validate route param
      if (!id || id === ":id") {
        if (isMounted) {
          setError("Missing or invalid organization id.");
          setLoading(false);
        }
        return;
      }

      try {
        const ref = doc(db, paths.organization(id)).withConverter(
          passthroughConverter<Organization>()
        );
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          if (isMounted) setError("Organization not found.");
        } else {
          // Avoid duplicate `id` prop: strip any stored id, then add the doc id once.
          const data = snap.data() as Organization;
          const { id: _ignore, ...rest } = (data || {}) as any;
          if (isMounted) setOrg({ ...rest, id: snap.id });
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load organization.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (error)
    return (
      <div className="p-6">
        <div className="mb-4 text-red-600">{error}</div>
        <Link to="/app/organizations" className="text-blue-600 underline">
          Back to organizations
        </Link>
      </div>
    );
  if (!org) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{org.name}</h1>
        <Link
          to={`/app/organizations/${org.id}/edit`}
          className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Edit
        </Link>
      </div>

      <DetailCard title="Details">
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-500">Website:</span>{" "}
            {org.website ? (
              <a
                className="text-blue-600 underline"
                href={withProtocol(org.website)}
                target="_blank"
                rel="noreferrer"
              >
                {org.website}
              </a>
            ) : (
              "-"
            )}
          </div>
          <div>
            <span className="text-gray-500">Created:</span>{" "}
            {formatDate(org.createdAt)}
          </div>
        </div>
      </DetailCard>
    </div>
  );
};

export default OrgDetailPage;
