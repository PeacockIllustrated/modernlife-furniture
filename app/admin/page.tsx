import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import AdminSignIn from "@/components/admin/AdminSignIn";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="page">
        <div className="page-head">
          <span className="mono eyebrow">Owner dashboard</span>
          <h1>Admin</h1>
          <p>
            Connect a Supabase project to manage the collection. Set
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, run the
            migrations in supabase/, and add yourself to modern_owners.
          </p>
        </div>
      </main>
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="page">
        <div className="page-head">
          <span className="mono eyebrow">Owner dashboard</span>
          <h1>Sign in</h1>
          <p>Enter your email and we will send a sign-in link.</p>
        </div>
        <AdminSignIn />
      </main>
    );
  }

  const { data: owner } = await supabase
    .from("modern_owners")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!owner) {
    return (
      <main className="page">
        <div className="page-head">
          <span className="mono eyebrow">Owner dashboard</span>
          <h1>Not an owner</h1>
          <p>
            You are signed in as {user.email}, but this account is not on the
            owners roster. Add its user id to modern_owners to gain access.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-head">
        <span className="mono eyebrow">Owner dashboard</span>
        <h1>The collection</h1>
        <p>Manage pieces, provenance, images and enquiries.</p>
      </div>
      <AdminDashboard email={user.email ?? ""} />
    </main>
  );
}
