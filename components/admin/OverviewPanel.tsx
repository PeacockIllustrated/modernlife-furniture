"use client";

import { useMemo } from "react";
import type { AdminData } from "@/components/admin/types";

/**
 * Overview: the first screen of the dashboard. It answers two questions
 * before any editing starts, where the shop stands and what needs the owner
 * today. Everything here is derived from the single dashboard load, so the
 * screen costs no extra requests and can never disagree with the panels.
 */

export type PanelId =
  | "overview"
  | "pieces"
  | "enquiries"
  | "interest"
  | "list"
  | "words"
  | "questions"
  | "site";

/** A number worth watching, with the panel it belongs to. */
interface Stat {
  label: string;
  value: number;
  note: string;
  tone?: "sea" | "rose" | "amber";
  go: PanelId;
}

/** Something the owner should do, most consequential first. */
interface Job {
  id: string;
  count: number;
  title: string;
  detail: string;
  action: string;
  tone: "rose" | "amber";
  go: PanelId;
}

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

export default function OverviewPanel({
  data,
  onGo,
}: {
  data: AdminData;
  onGo: (panel: PanelId) => void;
}) {
  const { stats, jobs, recent } = useMemo(() => {
    const count = (s: string) =>
      data.pieces.filter((p) => p.status === s).length;

    // A piece counts as photographed once any image row carries a path; the
    // dashboard's own thumbnails follow the same rule.
    const photographed = new Set(
      data.images.filter((i) => i.path).map((i) => i.piece_id),
    );
    const listed = data.pieces.filter((p) => p.status !== "draft");
    const unphotographed = listed.filter((p) => !photographed.has(p.id));
    const placeholders = data.pieces.filter((p) => p.placeholder);
    const drafts = data.pieces.filter((p) => p.status === "draft");

    const stats: Stat[] = [
      {
        label: "Available",
        value: count("available"),
        note: "for sale on the site",
        tone: "sea",
        go: "pieces",
      },
      {
        label: "Reserved",
        value: count("reserved"),
        note: "held for a buyer",
        tone: "rose",
        go: "pieces",
      },
      {
        label: "Being prepared",
        value: count("restoration"),
        note: "not yet listed for sale",
        tone: "amber",
        go: "pieces",
      },
      {
        label: "Sold",
        value: count("sold"),
        note: "rehomed to date",
        go: "pieces",
      },
      {
        label: "Enquiries",
        value: data.enquiries.length,
        note: "waiting for a reply",
        tone: data.enquiries.length > 0 ? "rose" : undefined,
        go: "enquiries",
      },
      {
        label: "Interest",
        value: data.interest.length,
        note: "people asking to be told",
        go: "interest",
      },
      {
        label: "Mailing list",
        value: data.subscribers.length,
        note: "addresses to write to",
        go: "list",
      },
    ];

    const jobs: Job[] = [];
    if (data.enquiries.length > 0) {
      jobs.push({
        id: "enquiries",
        count: data.enquiries.length,
        title: `${plural(data.enquiries.length, "enquiry", "enquiries")} waiting for a reply`,
        detail:
          "Someone has written in about a piece. Enquiries stay here until you clear them.",
        action: "Read them",
        tone: "rose",
        go: "enquiries",
      });
    }
    if (unphotographed.length > 0) {
      jobs.push({
        id: "photos",
        count: unphotographed.length,
        title: `${plural(unphotographed.length, "listed piece has", "listed pieces have")} no photograph`,
        detail:
          "Photography is the whole sell. A piece without one shows a drawing where the chair should be.",
        action: "Add photographs",
        tone: "rose",
        go: "pieces",
      });
    }
    if (placeholders.length > 0) {
      jobs.push({
        id: "placeholder",
        count: placeholders.length,
        title: `${plural(placeholders.length, "listing is", "listings are")} still marked placeholder`,
        detail:
          "The details were written for you to check. Confirm the measurements, attribution and price, then untick placeholder.",
        action: "Check the details",
        tone: "amber",
        go: "pieces",
      });
    }
    if (drafts.length > 0) {
      jobs.push({
        id: "drafts",
        count: drafts.length,
        title: `${plural(drafts.length, "piece is", "pieces are")} still a draft`,
        detail:
          "Drafts are invisible to buyers. Set the status to available when the piece is ready to sell.",
        action: "Open the drafts",
        tone: "amber",
        go: "pieces",
      });
    }

    const recent = [...data.enquiries]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 3);

    return { stats, jobs, recent };
  }, [data]);

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h2 className="dash-h">Overview</h2>
          <p className="dash-sub">
            Where the collection stands today, and anything waiting on you.
          </p>
        </div>
      </div>

      <div className="dash-stats">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            className="dash-stat"
            data-tone={s.tone ?? "plain"}
            onClick={() => onGo(s.go)}
          >
            <span className="mono dash-stat-label">{s.label}</span>
            <span className="dash-stat-value">{s.value}</span>
            <span className="dash-stat-note">{s.note}</span>
          </button>
        ))}
      </div>

      <div className="dash-columns">
        <div className="dash-block">
          <h3 className="dash-block-h">Needs your attention</h3>
          {jobs.length === 0 ? (
            <p className="dash-clear">
              Nothing is waiting. Every listed piece is photographed, every
              listing is confirmed, and no enquiry is unanswered.
            </p>
          ) : (
            <ul className="dash-jobs">
              {jobs.map((job) => (
                <li key={job.id} className="dash-job" data-tone={job.tone}>
                  <span className="dash-job-count">{job.count}</span>
                  <div className="dash-job-body">
                    <strong>{job.title}</strong>
                    <p>{job.detail}</p>
                    <button
                      type="button"
                      className="dash-link"
                      onClick={() => onGo(job.go)}
                    >
                      {job.action}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash-block">
          <h3 className="dash-block-h">Latest enquiries</h3>
          {recent.length === 0 ? (
            <p className="dash-clear">
              No one has written in yet. Enquiries from every piece page land
              here.
            </p>
          ) : (
            <>
              <ul className="dash-recent">
                {recent.map((en) => (
                  <li key={en.id}>
                    <span className="mono dash-recent-meta">
                      {new Date(en.created_at).toLocaleDateString("en-GB")} ·{" "}
                      {en.kind}
                    </span>
                    <strong>{en.name}</strong>
                    <p>{en.message}</p>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="dash-link"
                onClick={() => onGo("enquiries")}
              >
                Open all enquiries
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
