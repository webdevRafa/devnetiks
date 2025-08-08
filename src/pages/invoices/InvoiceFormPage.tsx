import React, { useMemo, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore"; // trimmed
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { newEntityId } from "@/utils/id";

import FormWrapper from "@/components/FormWrapper";
import TextInput from "@/components/TextInput";
import { useNavigate, useParams } from "react-router-dom";
import { calculateInvoiceTotals } from "@/utils/invoices";
import { dollarsToCents } from "@/utils/currency";

type Invoice = import("@/types/types").Invoice;

interface EditableLineItem {
  id: string;
  name: string;
  quantity: number;
  unitAmount: string; // dollars input, we convert to cents
}

const InvoiceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const [items, setItems] = useState<EditableLineItem[]>([
    { id: "li_1", name: "", quantity: 1, unitAmount: "" },
  ]);
  const [taxRate, setTaxRate] = useState("0");

  const totals = useMemo(() => {
    const normalized = items
      .filter((i) => i.name && i.quantity > 0 && i.unitAmount !== "")
      .map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitAmountCents: dollarsToCents(Number(i.unitAmount || 0)),
      }));
    return calculateInvoiceTotals({
      items: normalized,
      taxRatePct: Number(taxRate || 0),
    });
  }, [items, taxRate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entityId = id ?? newEntityId("inv");
    const ref = doc(db, paths.invoice(entityId)).withConverter(
      passthroughConverter<Invoice>()
    );
    const lineItems = items
      .filter((i) => i.name && i.quantity > 0 && i.unitAmount !== "")
      .map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitAmountCents: dollarsToCents(Number(i.unitAmount || 0)),
      }));

    const payload: Invoice = {
      id: entityId,
      status: "unpaid" as any,
      items: lineItems as any,
      subtotalCents: totals.subtotal,
      taxCents: totals.tax,
      totalCents: totals.total,
      createdAt: new Date().toISOString(),
    } as any;

    await setDoc(ref, payload, { merge: true });
    navigate(`/invoices/${entityId}`);
  };

  return (
    <FormWrapper
      title={editing ? "Edit Invoice" : "New Invoice"}
      onSubmit={onSubmit}
    >
      <div className="space-y-3">
        {items.map((li) => (
          <div key={li.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TextInput
              placeholder="Item name"
              value={li.name}
              onChange={(e) =>
                setItems((v) =>
                  v.map((x) =>
                    x.id === li.id ? { ...x, name: e.target.value } : x
                  )
                )
              }
            />
            <TextInput
              type="number"
              placeholder="Qty"
              value={String(li.quantity)}
              onChange={(e) =>
                setItems((v) =>
                  v.map((x) =>
                    x.id === li.id
                      ? { ...x, quantity: Number(e.target.value || 1) }
                      : x
                  )
                )
              }
            />
            <TextInput
              type="number"
              placeholder="Unit ($)"
              value={li.unitAmount}
              onChange={(e) =>
                setItems((v) =>
                  v.map((x) =>
                    x.id === li.id ? { ...x, unitAmount: e.target.value } : x
                  )
                )
              }
            />
            <button
              type="button"
              className="text-sm px-3 py-2 rounded-md bg-gray-100"
              onClick={() => setItems((v) => v.filter((x) => x.id !== li.id))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm px-3 py-2 rounded-md bg-gray-100"
          onClick={() =>
            setItems((v) =>
              v.concat({
                id: "li_" + (v.length + 1),
                name: "",
                quantity: 1,
                unitAmount: "",
              })
            )
          }
        >
          + Add line
        </button>
      </div>

      <TextInput
        label="Tax rate (%)"
        type="number"
        value={taxRate}
        onChange={(e) => setTaxRate(e.target.value)}
      />

      <div className="text-sm text-gray-700 space-y-1">
        <div>Subtotal: ${(totals.subtotal / 100).toFixed(2)}</div>
        <div>Tax: ${(totals.tax / 100).toFixed(2)}</div>
        <div className="font-semibold">
          Total: ${(totals.total / 100).toFixed(2)}
        </div>
      </div>

      <button
        className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
        type="submit"
      >
        {editing ? "Save Changes" : "Create"}
      </button>
    </FormWrapper>
  );
};

export default InvoiceFormPage;
