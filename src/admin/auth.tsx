"use client";

/**
 * Admin auth (admin brief §4.2). Replaces the app's useAppState() for the
 * admin: who is signed in, whether they're an admin, and sign-out.
 *
 * The role is read from the user's own profiles row (the same column the
 * app's isAdmin and the backend's requireAdmin read). No admin RPC runs until
 * that says "admin": the dashboard, and with it every poll, mounts only then.
 */

import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";

export type AuthState =
  | { kind: "loading" }
  | { kind: "signed-out"; notice: string | null }
  | { kind: "checking"; session: Session }
  | { kind: "profile-error"; session: Session; message: string }
  | { kind: "not-admin"; session: Session }
  | { kind: "admin"; session: Session };

/** Where to land after Google sign-in, which returns to plain /admin. */
const RETURN_KEY = "narsil-admin-return";
const EXPIRED = "Your session expired — sign in again.";

/** Messages that mean the session is no longer valid (lib, backend, PostgREST). */
export function isSessionError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /session (has )?expired|JWT expired|invalid JWT|Unauthorized/i.test(msg);
}

export function rememberReturnHash(): void {
  try {
    if (window.location.hash) sessionStorage.setItem(RETURN_KEY, window.location.hash);
  } catch {
    // Storage blocked — they land on Overview instead.
  }
}

function restoreReturnHash(): void {
  try {
    const hash = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    if (hash && !window.location.hash) history.replaceState(history.state, "", `${window.location.pathname}${hash}`);
  } catch {
    // Nothing stored.
  }
}

export function useAdminAuthState(): {
  state: AuthState;
  retryProfile: () => void;
  signOut: () => Promise<void>;
  expireSession: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({ kind: "loading" });
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);
  const manualSignOut = useRef(false);
  const hadSession = useRef(false);

  // Session changes. Supabase calls must not run inside this callback, so the
  // role check happens in the effect below.
  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (session === undefined) return;
    if (!session || !userId) {
      const notice = hadSession.current && !manualSignOut.current ? EXPIRED : null;
      manualSignOut.current = false;
      hadSession.current = false;
      setState({ kind: "signed-out", notice });
      return;
    }
    hadSession.current = true;
    let live = true;
    setState({ kind: "checking", session });
    void (async () => {
      const { data, error } = await supabase!.from("profiles").select("role").eq("id", userId).maybeSingle();
      if (!live) return;
      if (error) {
        setState({ kind: "profile-error", session, message: error.message });
      } else if ((data as { role?: string } | null)?.role === "admin") {
        restoreReturnHash();
        setState({ kind: "admin", session });
      } else {
        setState({ kind: "not-admin", session });
      }
    })();
    return () => {
      live = false;
    };
    // Token refreshes hand over a new Session for the same user: don't re-check for those.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, attempt, session === null]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    manualSignOut.current = true;
    try {
      sessionStorage.removeItem(RETURN_KEY);
    } catch {
      // ignore
    }
    const { error } = await supabase.auth.signOut();
    // A dead refresh token makes the server call fail; the local session is gone either way.
    if (error) await supabase.auth.signOut({ scope: "local" });
  }, []);

  /** A call said the session is invalid: try one refresh, else back to sign-in with a notice. */
  const expireSession = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.refreshSession();
    if (error) await supabase.auth.signOut({ scope: "local" });
  }, []);

  return { state, retryProfile: () => setAttempt((n) => n + 1), signOut, expireSession };
}

export interface AdminSession {
  userId: string;
  email: string | null;
  signOut: () => Promise<void>;
  /** Call when a request fails with an auth error. */
  expireSession: () => Promise<void>;
}

const AdminSessionContext = createContext<AdminSession | null>(null);
export const AdminSessionProvider = AdminSessionContext.Provider;

export function useAdminSession(): AdminSession {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useAdminSession outside the admin dashboard");
  return ctx;
}
