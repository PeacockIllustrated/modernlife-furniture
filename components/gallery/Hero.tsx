import { hero } from "@/content/landing";

/**
 * Hero room. The live Tide canvas (the grain of time) lands in session 3;
 * for now the field is a still stone ground so the wordmark and sub read as
 * intended. The wordmark treatment is "Modern / Life furniture", italic on
 * furniture, per CONTENT.md.
 */
export default function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section className="hero" aria-label="Modern Life Furniture">
      {children}
      <div className="hero-inner">
        <h1>
          Modern
          <br />
          Life <em>furniture</em>
        </h1>
        <div className="hero-sub">
          <p>{hero.sub}</p>
          <span className="mono scroll-cue">{hero.cue}</span>
        </div>
      </div>
    </section>
  );
}
