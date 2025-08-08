import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import DetailCard from "@/components/DetailCard";
import { Link, useParams } from "react-router-dom";

type Project = import("@/types/types").Project;

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ref = doc(db, paths.project(id)).withConverter(
        passthroughConverter<Project>()
      );
      const snap = await getDoc(ref);
      setProject(snap.exists() ? snap.data() : null);
    })();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <Link
          to={`/projects/${project.id}/edit`}
          className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm"
        >
          Edit
        </Link>
      </div>
      <DetailCard title="Details">
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-500">Organization:</span>{" "}
            {project.organizationId}
          </div>
          <div>
            <span className="text-gray-500">Status:</span> {project.status}
          </div>
          <div>
            <span className="text-gray-500">Created:</span> {project.createdAt}
          </div>
        </div>
      </DetailCard>
    </div>
  );
};

export default ProjectDetailPage;
