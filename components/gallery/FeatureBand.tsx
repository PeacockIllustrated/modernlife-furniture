import Link from "next/link";
import RoomVisual from "@/components/canvas/RoomVisual";
import type { RoomVisual as RoomVisualKind } from "@/content/landing";

/**
 * A dark band that closes an inner page: a faint generative study behind a
 * centred invitation, so a page ends on a designed note rather than trailing
 * off into plain text. Reused across the collection, piece and service pages.
 */
export default function FeatureBand({
  eyebrow,
  heading,
  body,
  cta,
  visual = "tide",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: { label: string; href: string };
  visual?: RoomVisualKind;
}) {
  const isInternal = cta?.href.startsWith("/");
  return (
    <section className="feature">
      <div className="feature-bg" aria-hidden="true">
        <RoomVisual visual={visual} label="" scrollBound={false} />
      </div>
      <div className="feature-inner">
        {eyebrow ? <span className="mono eyebrow">{eyebrow}</span> : null}
        <h2>{heading}</h2>
        {body ? <p>{body}</p> : null}
        {cta ? (
          isInternal ? (
            <Link className="enquire" href={cta.href}>
              {cta.label}
            </Link>
          ) : (
            <a className="enquire" href={cta.href}>
              {cta.label}
            </a>
          )
        ) : null}
      </div>
    </section>
  );
}
