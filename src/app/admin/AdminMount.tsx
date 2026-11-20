"use client";

import dynamic from "next/dynamic";

/**
 * Client-only mount (the brief's Astro `client:only`): no server render, and
 * the admin code ships in its own chunk that only /admin loads.
 */
const AdminApp = dynamic(() => import("@/admin/AdminApp"), {
  ssr: false,
  loading: () => <p className="p-8 text-sm text-white/40">Loading…</p>,
});

export function AdminMount() {
  return (
    <div className="admin-root">
      <AdminApp />
    </div>
  );
}
