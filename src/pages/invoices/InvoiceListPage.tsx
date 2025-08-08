import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; // trimmed
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

import DataTable from "@/components/TableComponent";
import { Link } from "react-router-dom";
import { fmt } from "@/utils/format";

type Invoice = import("@/types/types").Invoice;

const InvoiceListPage: React.FC = () => {
  const [rows, setRows] = useState<Invoice[]>([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(
        collection(db, paths.invoices()).withConverter(
          passthroughConverter<Invoice>()
        )
      );
      setRows(snap.docs.map((d) => d.data()));
    })();
  }, []);

  const columns = [
    {
      header: "Invoice",
      accessor: "id" as keyof Invoice,
      render: (v: any, r: Invoice) => (
        <Link className="text-blue-600" to={`/invoices/${r.id}`}>
          {String(v)}
        </Link>
      ),
    },
    { header: "Status", accessor: "status" as keyof Invoice },
    {
      header: "Subtotal",
      accessor: "subtotalCents" as keyof Invoice,
      render: (v: any) => fmt.money(v ?? 0),
    },
    {
      header: "Total",
      accessor: "totalCents" as keyof Invoice,
      render: (v: any) => fmt.money(v ?? 0),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Link
          to="/invoices/new"
          className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white"
        >
          New Invoice
        </Link>
      </div>
      <DataTable<Invoice> data={rows} columns={columns} />
    </div>
  );
};

export default InvoiceListPage;
