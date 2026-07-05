import Link from "next/link";
import type { Fact } from "@/content/landing";

/**
 * The specimen label card: mono eyebrow, Fraunces h2, story paragraph, mono
 * interaction hint, a dl of facts and a bordered mono CTA. Mirrors the label
 * anatomy in DESIGN.md so piece pages can reuse it later.
 */
export default function SpecimenLabel({
  titleId,
  number,
  title,
  story,
  hint,
  facts,
  cta,
}: {
  titleId?: string;
  number: string;
  title: string;
  story: string;
  hint: string;
  facts: Fact[];
  cta: { label: string; href: string };
}) {
  return (
    <div className="label reveal">
      <span className="mono no">{number}</span>
      <h2 id={titleId}>{title}</h2>
      <p className="story">{story}</p>
      <span className="mono hint">{hint}</span>
      <dl>
        {facts.map((fact) => (
          <div key={fact.term} style={{ display: "contents" }}>
            <dt>{fact.term}</dt>
            <dd>{fact.detail}</dd>
          </div>
        ))}
      </dl>
      <Link className="enquire" href={cta.href}>
        {cta.label}
      </Link>
    </div>
  );
}
