import type { Metadata } from "next";
import { adminConfigured, isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured } from "@/lib/supabase/admin";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured || !adminDbConfigured) {
    return (
      <main className="page">
        <div className="page-head">
          <span className="mono eyebrow">Owner dashboard</span>
          <h1>Admin</h1>
          <p>
            Set the dashboard credentials and the database service role to
            manage the collection. Set ADMIN_USER and ADMIN_PASSWORD, and
            SUPABASE_SERVICE_ROLE_KEY alongside the public Supabase variables.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isSignedIn())) {
    return (
      <main className="page">
        <div className="page-head">
          <span className="mono eyebrow">Owner dashboard</span>
          <h1>Sign in</h1>
          <p>Enter your username and password to manage the collection.</p>
        </div>
        <AdminLogin />
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-head">
        <span className="mono eyebrow">Owner dashboard</span>
        <h1>The collection</h1>
        <p>
        Manage the collection, the collector words and questions, the site
        copy, and everyone who has written in.
      </p>
      </div>
      <AdminDashboard />
    </main>
  );
}
