import { getGlobalWords } from "@/lib/collection";

/**
 * Collector words on the home page: up to three staff curated quotes from
 * getGlobalWords, set like the piece page words, Fraunces for the voice and
 * mono for the attribution. No stars and no ratings, per the locked
 * decisions; the section disappears entirely when there is nothing to say.
 */
export default async function Words() {
  const words = await getGlobalWords(3);
  if (words.length === 0) return null;

  return (
    <section className="words-band" aria-labelledby="collector-words-title">
      <h2 id="collector-words-title" className="reveal">
        Collector words
      </h2>
      <div className="words-band-grid">
        {words.map((word) => (
          <figure
            className="words-item reveal"
            key={`${word.position}-${word.name}`}
          >
            <blockquote>
              <p>{word.quote}</p>
            </blockquote>
            <figcaption className="mono">
              {[word.name, word.context].filter(Boolean).join(", ")}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
