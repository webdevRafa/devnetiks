import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function StartProjectPage() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("Website");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const parsedBudget = budget ? Number(budget.replace(/[^\d.]/g, "")) : 0;
      await addDoc(collection(db, "quotes"), {
        createdAt: serverTimestamp(),
        status: "new",
        contact: { name, company, email },
        project: { type: projectType, budget: parsedBudget, details },
        source: "public_form",
      });
      nav("/thank-you", { replace: true });
    } catch (error: any) {
      setErr(error?.message || "Failed to submit request");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-1">Start a Project</h1>
        <p className="text-gray-600 mb-6">
          Tell us what you need and we’ll get back within 1 business day.
        </p>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="border rounded-xl px-3 py-2"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border rounded-xl px-3 py-2"
              placeholder="Company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              className="border rounded-xl px-3 py-2"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option>Website</option>
              <option>Booking system</option>
              <option>Web app (React + Firebase)</option>
              <option>E-commerce</option>
              <option>Something else</option>
            </select>
            <input
              className="border rounded-xl px-3 py-2"
              placeholder="Budget (USD)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <textarea
            className="border rounded-xl px-3 py-2 min-h-[120px]"
            placeholder="Project details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </div>
    </div>
  );
}
