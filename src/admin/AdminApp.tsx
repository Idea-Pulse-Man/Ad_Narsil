"use client";

/**
 * /admin root (admin brief §4.2): sign-in, the admin-only gate, then the
 * dashboard. Loaded client-only from src/app/admin/AdminMount.tsx; nothing
 * outside src/admin imports this folder.
 */

import { useState, type FormEvent, type ReactNode } from "react";
import { AdminSessionProvider, rememberReturnHash, useAdminAuthState } from "./auth";
import { Dashboard } from "./Dashboard";
import { supabase, SUPABASE_ENABLED } from "./lib/supabase";

export default function AdminApp() {
  const { state, retryProfile, signOut, expireSession } = useAdminAuthState();

  if (!SUPABASE_ENABLED) {
    return (
      <Centered>
        <p className="text-sm text-white/60">
          Supabase isn&apos;t configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </Centered>
    );
  }

  switch (state.kind) {
    case "loading":
    case "checking":
      return (
        <Centered>
          <p className="text-sm text-white/50" role="status">
            Checking your session…
          </p>
        </Centered>
      );
    case "signed-out":
      return <SignIn notice={state.notice} />;
    case "profile-error":
      return (
        <Centered>
          <div role="alert" className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
            <p className="text-sm text-red-200">Couldn&apos;t check this account&apos;s role: {state.message}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={retryProfile} className="rounded-full border border-red-300/30 px-3 py-1 text-xs text-red-100">
                Try again
              </button>
              <SignOutButton onSignOut={signOut} />
            </div>
          </div>
        </Centered>
      );
    case "not-admin":
      return (
        <Centered>
          <p className="text-sm text-white/70">This account doesn&apos;t have admin access.</p>
          {state.session.user.email && <p className="mt-1 text-xs text-white/40">Signed in as {state.session.user.email}</p>}
          <div className="mt-4">
            <SignOutButton onSignOut={signOut} />
          </div>
        </Centered>
      );
    case "admin":
      return (
        <AdminSessionProvider
          value={{
            userId: state.session.user.id,
            email: state.session.user.email ?? null,
            signOut,
            expireSession,
          }}
        >
          <Dashboard key={state.session.user.id} />
        </AdminSessionProvider>
      );
  }
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <img src="/branding/crest-56.webp" width={28} height={28} alt="" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas">Narsil Admin</span>
        </div>
        {children}
      </div>
    </main>
  );
}

function SignOutButton({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void onSignOut().finally(() => setBusy(false));
      }}
      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 disabled:opacity-40"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

function SignIn({ notice }: { notice: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"password" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !supabase) return;
    setBusy("password");
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    // On success the auth listener takes over and this screen unmounts.
    if (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  const google = async () => {
    if (busy || !supabase) return;
    setBusy("google");
    setError(null);
    rememberReturnHash();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  const field =
    "mt-1 w-full rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2 text-sm text-canvas placeholder:text-white/35 focus:border-accent/60 focus:outline-none";

  return (
    <Centered>
      <h1 className="font-serif text-2xl text-canvas">Sign in</h1>
      <p className="mt-1 text-sm text-white/50">Admins only. Use your Narsil account.</p>

      {notice && (
        <p role="status" className="mt-4 rounded-lg border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
          {notice}
        </p>
      )}

      <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4">
        <label className="block text-xs text-white/60">
          Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block text-xs text-white/60">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy !== null}
          className="w-full rounded-full bg-canvas px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
        >
          {busy === "password" ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/30">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={() => void google()}
        disabled={busy !== null}
        className="w-full rounded-full border border-white/15 px-4 py-2 text-sm text-canvas hover:bg-white/[0.04] disabled:opacity-50"
      >
        {busy === "google" ? "Opening Google…" : "Continue with Google"}
      </button>
    </Centered>
  );
}
