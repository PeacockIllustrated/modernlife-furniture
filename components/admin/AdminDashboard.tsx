"use client";

import { useCallback, useEffect, useState } from "react";
import { emptyAdminData } from "@/components/admin/types";
import type { AdminData } from "@/components/admin/types";
import PiecesPanel from "@/components/admin/PiecesPanel";
import WordsPanel from "@/components/admin/WordsPanel";
import QuestionsPanel from "@/components/admin/QuestionsPanel";
import SitePanel from "@/components/admin/SitePanel";
import EnquiriesPanel from "@/components/admin/EnquiriesPanel";
import InterestPanel from "@/components/admin/InterestPanel";
import SubscribersPanel from "@/components/admin/SubscribersPanel";

/**
 * The owner dashboard shell. Behind the username and password gate, it loads
 * everything once through GET /api/admin/data and hands slices to the tab
 * panels; writes go through the /api/admin routes, which use the service
 * role on the server. No Supabase session lives in the browser.
 */

const TABS = [
  { id: "pieces", label: "Pieces" },
  { id: "words", label: "Words" },
  { id: "questions", label: "Questions" },
  { id: "site", label: "Site" },
  { id: "enquiries", label: "Enquiries" },
  { id: "interest", label: "Interest" },
  { id: "list", label: "List" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData>(emptyAdminData);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState<TabId>("pieces");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error("load failed");
      const d = await res.json();
      setData({
        categories: d.categories ?? [],
        pieces: d.pieces ?? [],
        provenance: d.provenance ?? [],
        images: d.images ?? [],
        features: d.features ?? [],
        specs: d.specs ?? [],
        included: d.included ?? [],
        faqs: d.faqs ?? [],
        testimonials: d.testimonials ?? [],
        settings: d.settings ?? [],
        subscribers: d.subscribers ?? [],
        enquiries: d.enquiries ?? [],
        interest: d.interest ?? [],
      });
    } catch {
      setLoadError("Could not load the collection just now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/";
  }

  // Row removals update local state optimistically; a failed delete falls
  // back to a full reload so the list never lies.
  async function deleteEnquiry(id: string) {
    const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setData((d) => ({
        ...d,
        enquiries: d.enquiries.filter((x) => x.id !== id),
      }));
    } else loadAll();
  }

  async function clearInterest(pieceId: string) {
    const res = await fetch(
      `/api/admin/interest?pieceId=${encodeURIComponent(pieceId)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setData((d) => ({
        ...d,
        interest: d.interest.filter((x) => x.piece_id !== pieceId),
      }));
    } else loadAll();
  }

  async function removeSubscriber(id: string) {
    const res = await fetch(
      `/api/admin/subscribers?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setData((d) => ({
        ...d,
        subscribers: d.subscribers.filter((x) => x.id !== id),
      }));
    } else loadAll();
  }

  if (loading) {
    return (
      <p className="mono" style={{ opacity: 0.7 }}>
        Loading the collection…
      </p>
    );
  }

  return (
    <div className="admin">
      <div className="admin-bar mono">
        <span>Signed in</span>
        <button className="enquire" onClick={signOut} type="button">
          Sign out
        </button>
      </div>

      <nav className="admin-tabs" aria-label="Dashboard sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="admin-tab"
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {loadError ? (
        <p className="form-note mono" data-tone="error" role="status">
          {loadError}
        </p>
      ) : null}

      {tab === "pieces" ? <PiecesPanel data={data} onReload={loadAll} /> : null}
      {tab === "words" ? (
        <WordsPanel
          words={data.testimonials}
          pieces={data.pieces}
          onReload={loadAll}
        />
      ) : null}
      {tab === "questions" ? (
        <QuestionsPanel faqs={data.faqs} onReload={loadAll} />
      ) : null}
      {tab === "site" ? (
        <SitePanel settings={data.settings} onReload={loadAll} />
      ) : null}
      {tab === "enquiries" ? (
        <EnquiriesPanel enquiries={data.enquiries} onDelete={deleteEnquiry} />
      ) : null}
      {tab === "interest" ? (
        <InterestPanel
          interest={data.interest}
          pieces={data.pieces}
          onClear={clearInterest}
        />
      ) : null}
      {tab === "list" ? (
        <SubscribersPanel
          subscribers={data.subscribers}
          onRemove={removeSubscriber}
        />
      ) : null}
    </div>
  );
}
