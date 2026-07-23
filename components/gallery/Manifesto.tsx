import { manifesto } from "@/content/landing";
import { emphasise } from "@/components/typography/Em";

/**
 * The manifesto: one Fraunces 300 statement, centred, italic on the word that
 * carries the promise. The copy lives in content/landing.ts so the statement
 * cannot drift from the content layer; the asterisk convention marks the
 * emphasis word.
 */
export default function Manifesto() {
  return (
    <section className="manifesto">
      <p className="reveal">{emphasise(manifesto)}</p>
    </section>
  );
}
