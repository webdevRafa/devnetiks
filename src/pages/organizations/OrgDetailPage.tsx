import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import DetailCard from "@/components/DetailCard";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "@/utils/dates";

type Organization = import("@/types/types").Organization;

const OrgDetailPage: React.FC = () => {
  const { id } = useParams();
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ref = doc(db, paths.organization(id)).withConverter(
        passthroughConverter<Organization>()
      );
      const snap = await getDoc(ref);
      setOrg(snap.exists() ? snap.data() : null);
    })();
  }, [id]);

  if (!org) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{org.name}</h1>
        <Link
          to={`/organizations/${org.id}/edit`}
          className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Edit
        </Link>
      </div>
      <DetailCard title="Details">
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-500">Website:</span> {org.website || "-"}
          </div>
          <div>
            <div>
              <span className="text-gray-500">Created:</span>{" "}
              {formatDate(org.createdAt)}
            </div>
          </div>
        </div>
      </DetailCard>
    </div>
  );
};

export default OrgDetailPage;
