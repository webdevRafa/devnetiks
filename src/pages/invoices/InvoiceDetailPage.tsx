import React, { useEffect, useState } from "react";

import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; // trimmed
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

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
      const ref = doc(db, paths.invoice(id)).withConverter(
        passthroughConverter<Invoice>()
      );
      const snap = await getDoc(ref);
      setInvoice(snap.exists() ? snap.data() : null);
    })();
  }, [id]);
  const items = (invoice as any).items ?? (invoice as any).lineItems ?? [];
  const subtotalCents =
    (invoice as any).subtotalCents ?? (invoice as any).totals?.subtotal ?? 0;
  const taxCents =
    (invoice as any).taxCents ?? (invoice as any).totals?.tax ?? 0;
  const totalCents =
    (invoice as any).totalCents ?? (invoice as any).totals?.total ?? 0;
  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoice {invoice.id}</h1>
        <div className="flex items-center gap-3">
          <StatusBadge status={invoice.status as any} />
          <Link
            to={`/invoices/${invoice.id}/edit`}
            className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm"
          >
            Edit
          </Link>
        </div>
      </div>

      <DetailCard title="Totals">
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-500">Subtotal:</span>{" "}
            {fmt.money(subtotalCents)}
          </div>
          <div>
            <span className="text-gray-500">Tax:</span> {fmt.money(taxCents)}
          </div>
          <div className="font-semibold">
            <span className="text-gray-500">Total:</span>{" "}
            {fmt.money(totalCents)}
          </div>
        </div>
      </DetailCard>

      <DetailCard title="Line Items">
        <div className="text-sm">
          {items.length === 0 ? (
            <div className="text-gray-500 italic">No items</div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-gray-500 text-xs uppercase">
                <tr>
                  <th className="py-1">Name</th>
                  <th className="py-1">Qty</th>
                  <th className="py-1">Unit</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((i: any) => (
                  <tr key={i.id}>
                    <td className="py-1">{i.name}</td>
                    <td className="py-1">{i.quantity}</td>
                    <td className="py-1">
                      {fmt.money(i.unitAmountCents ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
              {((invoice.items as any[]) || []).map((i) => (
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
