// src/pages/quotes/QuoteRespondPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import FormWrapper from "@/components/FormWrapper";

type Quote = {
  id: string;
  orgId?: string | null;
  clientName?: string | null;
  email: string;
  projectType: "brochure" | "booking" | "ecommerce" | "custom";
  details?: string | null;
};

type LineItem = {
  id: string;
  name: string;
  quantity: number;
  unitAmountCents: number;
};

function toCents(v: string): number {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : Math.round(n * 100);
}

export default function QuoteRespondPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [q, setQ] = useState<Quote | null>(null);
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), name: "", quantity: 1, unitAmountCents: 0 },
  ]);
  const [discountCents, setDiscountCents] = useState(0);
  const [taxCents, setTaxCents] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendNow, setSendNow] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const ref = doc(db, "quotes", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setQ({ id: snap.id, ...(snap.data() as any) });
    })();
  }, [id]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (it.quantity || 0) * (it.unitAmountCents || 0),
        0
      ),
    [items]
  );
  const total = useMemo(
    () => subtotal - (discountCents || 0) + (taxCents || 0),
    [subtotal, discountCents, taxCents]
  );

  function patchItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );
  }
  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", quantity: 1, unitAmountCents: 0 },
    ]);
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !q) return;
    setSending(true);
    try {
      const proposals = collection(db, "proposals");
      await addDoc(proposals, {
        quoteId: id,
        orgId: q.orgId || null,
        version: 1,
        status: sendNow ? "sent" : "draft",
        scopeItems: items,
        subtotal,
        discount: discountCents || null,
        tax: taxCents || null,
        total,
        notes: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "quotes", id), {
        status: "quoted",
        updatedAt: Timestamp.now(),
      });

      nav(`/app/quotes/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save proposal. Check console logs.");
    } finally {
      setSending(false);
    }
  }

  if (!q) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="px-1">
      <FormWrapper
        title="Respond to request"
        description={`Build a priced scope for ${
          q.clientName || q.email
        }. Amounts are in USD; stored in cents.`}
        onSubmit={onSubmit}
      >
        <div className="border rounded-xl bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Line items</div>
            <button
              type="button"
              onClick={addItem}
              className="text-sm px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50"
            >
              Add item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={it.id} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-6">
                  <label className="text-xs text-gray-600">Name</label>
                  <input
                    value={it.name}
                    onChange={(e) => patchItem(idx, { name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., Brochure site build"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-gray-600">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) =>
                      patchItem(idx, { quantity: Number(e.target.value || 1) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-gray-600">Unit (USD)</label>
                  <input
                    inputMode="decimal"
                    value={(it.unitAmountCents / 100).toString()}
                    onChange={(e) =>
                      patchItem(idx, {
                        unitAmountCents: toCents(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., 2000"
                  />
                </div>
                <div className="col-span-12 flex justify-between text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="hover:underline"
                  >
                    Remove
                  </button>
                  <div className="text-gray-900">
                    {(
                      ((it.quantity || 0) * (it.unitAmountCents || 0)) /
                      100
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>
                <div className="col-span-12 border-b border-gray-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-600">Discount (USD)</label>
            <input
              inputMode="decimal"
              value={(discountCents / 100).toString()}
              onChange={(e) => setDiscountCents(toCents(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Tax (USD)</label>
            <input
              inputMode="decimal"
              value={(taxCents / 100).toString()}
              onChange={(e) => setTaxCents(toCents(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-600">Total</div>
              <div className="text-xl font-semibold">
                {(total / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={sendNow}
              onChange={(e) => setSendNow(e.target.checked)}
            />
            Send to client now
          </label>
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Saving..." : "Save"}
          </button>
          <Link
            to={`/app/quotes/${id}`}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </FormWrapper>
    </div>
  );
}
