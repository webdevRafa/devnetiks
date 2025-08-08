import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig"; // adjust path if needed
import { collection, getDocs } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

import DataTable from "@/components/TableComponent";
import { Link } from "react-router-dom";

type Project = import("@/types/types").Project;

const ProjectListPage: React.FC = () => {
  const [rows, setRows] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(
        collection(db, paths.projects()).withConverter(
          passthroughConverter<Project>()
        )
      );
      setRows(snap.docs.map((d) => d.data()));
    })();
  }, []);

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof Project,
      render: (v: any, r: Project) => (
        <Link className="text-blue-600" to={`/projects/${r.id}`}>
          {String(v)}
        </Link>
      ),
    },
    { header: "Organization", accessor: "organizationId" as keyof Project },
    { header: "Status", accessor: "status" as keyof Project },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projects</h1>
        <Link
          to="/projects/new"
          className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white"
        >
          New Project
        </Link>
      </div>
      <DataTable<Project> data={rows} columns={columns} />
    </div>
  );
};

export default ProjectListPage;
