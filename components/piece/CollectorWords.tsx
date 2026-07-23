import type { Word } from "@/lib/collection";

/**
 * Collector words: staff-chosen quotes typeset like exhibition wall labels,
 * the piece's own first and the site-wide set topping the count up to three.
 * No stars, no scores; the register itself is the proof.
 */
export default function CollectorWords({ words }: { words: Word[] }) {
  if (words.length === 0) return null;
  return (
    <section className="section-rule reveal" aria-labelledby="words-title">
      <h2 id="words-title" className="store-head">
        Collector words
      </h2>
      <div className="words-grid">
        {words.map((word, i) => (
          <figure key={`${i}-${word.name}`} className="word">
            <blockquote className="word-quote">{word.quote}</blockquote>
            <figcaption className="mono word-attr">
              {word.name}
              {word.context ? `, ${word.context}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
