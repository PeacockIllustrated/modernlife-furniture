"use client";

import { useCallback, useEffect, useState } from "react";
import { emptyAdminData } from "@/components/admin/types";
import type { AdminData } from "@/components/admin/types";
import OverviewPanel, { type PanelId } from "@/components/admin/OverviewPanel";
import PiecesPanel from "@/components/admin/PiecesPanel";
import WordsPanel from "@/components/admin/WordsPanel";
import QuestionsPanel from "@/components/admin/QuestionsPanel";
import SitePanel from "@/components/admin/SitePanel";
import EnquiriesPanel from "@/components/admin/EnquiriesPanel";
import InterestPanel from "@/components/admin/InterestPanel";
import SubscribersPanel from "@/components/admin/SubscribersPanel";

/**
 * The owner dashboard shell: a standing top bar, a grouped side navigation
 * and one panel at a time. Behind the username and password gate, it loads
 * everything once through GET /api/admin/data and hands slices to the
 * panels; writes go through the /api/admin routes, which use the service
 * role on the server. No Supabase session lives in the browser.
 *
 * The navigation is grouped by what the owner is doing rather than by table:
 * the collection they sell, the people who wrote in, and the words that sit
 * around both. Counts ride on the groups that fill up on their own, so the
 * inbox states show without opening anything.
 */

interface NavItem {
  id: PanelId;
  label: string;
  hint: string;
}

const NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "",
    items: [
      { id: "overview", label: "Overview", hint: "Today at a glance" },
    ],
  },
  {
    heading: "The collection",
    items: [
      { id: "pieces", label: "Pieces", hint: "Add, edit and photograph stock" },
    ],
  },
  {
    heading: "People",
    items: [
      { id: "enquiries", label: "Enquiries", hint: "Buyers who have written in" },
      { id: "interest", label: "Interest", hint: "Tell me when it is ready" },
      { id: "list", label: "Mailing list", hint: "The acquisitions list" },
    ],
  },
  {
    heading: "Words",
    items: [
      { id: "words", label: "Collector words", hint: "Quotes from buyers" },
      { id: "questions", label: "Questions", hint: "Answers shown on every piece" },
      { id: "site", label: "Site copy", hint: "Delivery, returns and care" },
    ],
  },
];

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData>(emptyAdminData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [panel, setPanel] = useState<PanelId>("overview");

  const loadAll = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const reload = useCallback(() => loadAll(), [loadAll]);

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
    } else reload();
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
    } else reload();
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
    } else reload();
  }

  // Only the counts that grow on their own are worth a badge; the pieces
  // count is the owner's own doing and reads on the overview instead.
  const badge = (id: PanelId): number | null => {
    if (id === "enquiries") return data.enquiries.length;
    if (id === "interest") return data.interest.length;
    if (id === "list") return data.subscribers.length;
    return null;
  };

  if (loading) {
    return (
      <p className="mono" style={{ opacity: 0.7 }}>
        Loading the collection…
      </p>
    );
  }

  return (
    <div className="dash">
      <header className="dash-top">
        <div className="dash-brand">
          <span className="dash-mark" aria-hidden="true" />
          <span>
            <strong>Modern Life Furniture</strong>
            <span className="mono dash-brand-sub">Owner dashboard</span>
          </span>
        </div>
        <div className="dash-top-actions mono">
          <button
            type="button"
            className="dash-ghost"
            onClick={() => loadAll(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
          <a
            className="dash-ghost"
            href="/"
            target="_blank"
            rel="noopener"
          >
            View the site
          </a>
          <button type="button" className="dash-ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="dash-body">
        <nav className="dash-nav" aria-label="Dashboard sections">
          {NAV.map((group, i) => (
            <div key={group.heading || `group-${i}`} className="dash-nav-group">
              {group.heading ? (
                <span className="mono dash-nav-heading">{group.heading}</span>
              ) : null}
              {group.items.map((item) => {
                const count = badge(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="dash-nav-item"
                    aria-current={panel === item.id ? "page" : undefined}
                    onClick={() => setPanel(item.id)}
                  >
                    <span className="dash-nav-label">
                      {item.label}
                      {count ? (
                        <span
                          className="dash-nav-badge"
                          data-tone={
                            item.id === "enquiries" ? "rose" : "plain"
                          }
                        >
                          {count}
                        </span>
                      ) : null}
                    </span>
                    <span className="dash-nav-hint">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="dash-main">
          {loadError ? (
            <p className="form-note mono" data-tone="error" role="status">
              {loadError}
            </p>
          ) : null}

          {panel === "overview" ? (
            <OverviewPanel data={data} onGo={setPanel} />
          ) : null}
          {panel === "pieces" ? (
            <PiecesPanel data={data} onReload={reload} />
          ) : null}
          {panel === "words" ? (
            <WordsPanel
              words={data.testimonials}
              pieces={data.pieces}
              onReload={reload}
            />
          ) : null}
          {panel === "questions" ? (
            <QuestionsPanel faqs={data.faqs} onReload={reload} />
          ) : null}
          {panel === "site" ? (
            <SitePanel settings={data.settings} onReload={reload} />
          ) : null}
          {panel === "enquiries" ? (
            <EnquiriesPanel enquiries={data.enquiries} onDelete={deleteEnquiry} />
          ) : null}
          {panel === "interest" ? (
            <InterestPanel
              interest={data.interest}
              pieces={data.pieces}
              onClear={clearInterest}
            />
          ) : null}
          {panel === "list" ? (
            <SubscribersPanel
              subscribers={data.subscribers}
              onRemove={removeSubscriber}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
