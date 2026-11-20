import type { Metadata } from "next";
import "@/admin/admin.css";
import { AdminMount } from "./AdminMount";

/**
 * Narsil's web admin (AD-WEBSITE-ADMIN-PROMPT.md). Never linked from the
 * public site. Headers (no-store, no-referrer, no framing, admin CSP) live in
 * next.config.ts; robots.ts disallows the path.
 */
export const metadata: Metadata = {
  title: "Narsil Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function AdminPage() {
  return <AdminMount />;
}
