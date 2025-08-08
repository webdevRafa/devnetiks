import React, { useEffect, useState } from "react";

import { db } from "@/firebase/firebaseConfig"; // adjust path if needed
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { newEntityId } from "@/utils/id";

import DetailCard from "@/components/DetailCard";
import StatusBadge from "@/components/StatusBadge";
import { fmt } from "@/utils/format";
import { Link, useParams } from "react-router-dom";

type Invoice = import("@/types/types").Invoice;

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ref = doc(db, paths.invoice(id)).withConverter(passthroughConverter<Invoice>());
      const snap = await getDoc(ref);
      setInvoice(snap.exists() ? snap.data() : null);
    })();
  }, [id]);

  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoice {invoice.id}</h1>
        <div className="flex items-center gap-3">
          <StatusBadge status={invoice.status as any} />
          <Link to={`/invoices/${invoice.id}/edit`} className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm">Edit</Link>
        </div>
      </div>

      <DetailCard title="Totals">
        <div className="text-sm space-y-1">
          <div><span className="text-gray-500">Subtotal:</span> {fmt.money(invoice.subtotalCents ?? 0)}</div>
          <div><span className="text-gray-500">Tax:</span> {fmt.money(invoice.taxCents ?? 0)}</div>
          <div className="font-semibold"><span className="text-gray-500">Total:</span> {fmt.money(invoice.totalCents ?? 0)}</div>
        </div>
      </DetailCard>

      <DetailCard title="Line Items">
        <div className="text-sm">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-1">Name</th>
                <th className="py-1">Qty</th>
                <th className="py-1">Unit</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items as any[] || []).map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="py-1">{i.name}</td>
                  <td className="py-1">{i.quantity}</td>
                  <td className="py-1">{fmt.money(i.unitAmountCents ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailCard>
    </div>
  );
};

export default InvoiceDetailPage;
