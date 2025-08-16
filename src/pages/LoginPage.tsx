// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// IMPORTANT: use your initialized instances
// Make sure firebaseConfig.ts exports: app, auth, and googleProvider
import { auth, googleProvider } from "@/firebase/firebaseConfig"; // adjust alias if needed
import glogin from "../assets/google-cont.png";

export default function LoginPage() {
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
      const provider = googleProvider ?? new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      nav("/after-login", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white">
      {/* page glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-18rem] h-[36rem] -z-10"
        style={{
          background:
            "radial-gradient(800px circle at 50% 20%, rgba(47,122,251,0.22), transparent 40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-18rem] h-[36rem] -z-10"
        style={{
          background:
            "radial-gradient(800px circle at 50% 80%, rgba(47,207,154,0.18), transparent 40%)",
        }}
      />

      {/* Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-semibold tracking-tight hover:opacity-90">
          Devnetiks
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:bg-white/5"
        >
          Back home
        </Link>
      </header>

      {/* Card */}
      <main className="mx-auto max-w-5xl px-6 pb-20 mt-30">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 md:p-7">
          <h1 className="text-lg font-semibold">Log in</h1>
          <p className="mt-1 text-sm text-white/60">
            Choose Google or continue with email.
          </p>

          {/* Google */}
          <button
            onClick={googleLogin}
            disabled={busy}
            className="mt-5 w-full rounded-xl  px-4 py-2 transition hover:opacity-90 disabled:opacity-60"
          >
            <span className="sr-only">Continue with Google</span>
            <img
              src={glogin}
              alt="Continue with Google"
              className="mx-auto h-10"
              draggable={false}
            />
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="rounded-full bg-[var(--color-card)] px-2 text-xs uppercase text-white/40">
                or
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={emailLogin} className="space-y-3">
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                placeholder="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <input
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/40 outline-none ring-0 focus:border-white/25"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {err && <p className="pt-1 text-sm text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-[var(--accent-color1)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-color1-hover)] disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Log in"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-white/50">
            <Link to="/" className="underline-offset-4 hover:underline">
              Back home
            </Link>
            {/* <Link to="/reset-password" className="underline-offset-4 hover:underline">Forgot password?</Link> */}
          </div>
        </div>
      </main>
    </div>
  );
}
