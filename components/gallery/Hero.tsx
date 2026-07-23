import Link from "next/link";
import { hero } from "@/content/landing";

/**
 * Hero banner. The live Tide canvas (the grain of time) sits behind the
 * wordmark, tagline and the two shop calls to action. The wordmark treatment
 * is "Modern / Life furniture", italic on furniture, per CONTENT.md.
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
          <div className="hero-cta">
            <Link className="btn btn-solid" href="/collection/chairs">
              See the chairs
            </Link>
            <Link className="btn btn-line" href="/collection">
              Browse the collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
