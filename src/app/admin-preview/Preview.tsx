"use client";
// TEMPORARY screenshot harness — delete before commit.
import { AdminSessionProvider } from "@/admin/auth";
import { Dashboard } from "@/admin/Dashboard";
export default function Preview() {
  return (
    <div className="admin-root">
      <AdminSessionProvider value={{ userId: "preview", email: "admin@example.com", signOut: async () => {}, expireSession: async () => {} }}>
        <Dashboard />
      </AdminSessionProvider>
    </div>
  );
}
