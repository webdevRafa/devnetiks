import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import glogin from "../assets/google-cont.png";

export default function LoginPage() {
  const auth = getAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const emailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Always route through role-aware redirect
      nav("/after-login", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = async () => {
    setBusy(true);
    setErr(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      // FIX: do not hard-route to /app/projects (admin). Let AfterLogin send clients to /client.
      nav("/after-login", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Log in to Devnetiks</h1>

        <button
          onClick={googleLogin}
          disabled={busy}
          className="w-full mb-4 px-4 py-2 rounded-xl hover:bg-gray-50 disabled:opacity-60"
        >
          <img src={glogin} alt="" />
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={emailLogin} className="space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : "Log in"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6">
          <Link to="/" className="underline">
            Back home
          </Link>
        </p>
      </div>
    </div>
  );
}
