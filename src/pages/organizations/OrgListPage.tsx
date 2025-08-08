import React, { useEffect, useState } from "react";

import { db } from "@/firebase/firebaseConfig"; // adjust path if needed
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { newEntityId } from "@/utils/id";

import DataTable from "@/components/TableComponent";
import { fmt } from "@/utils/format";
import { Link } from "react-router-dom";

type Organization = import("@/types/types").Organization;

const OrgListPage: React.FC = () => {
  const [rows, setRows] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, paths.organizations()).withConverter(passthroughConverter<Organization>()));
      setRows(snap.docs.map(d => d.data()));
      setLoading(false);
    })();
  }, []);

  const columns = [
    { header: "Name", accessor: "name" as keyof Organization, render: (v: any, r: Organization) => <Link className="text-blue-600" to={`/organizations/${r.id}`}>{String(v)}</Link> },
    { header: "Website", accessor: "website" as keyof Organization },
    { header: "Created", accessor: "createdAt" as keyof Organization, render: (v: any) => v ? fmt.date(v) : "-" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Organizations</h1>
        <Link to="/organizations/new" className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white">New Organization</Link>
      </div>
      {loading ? <div>Loading...</div> : <DataTable<Organization> data={rows} columns={columns} />}
    </div>
  );
};

export default OrgListPage;
