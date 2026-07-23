/**
 * Four numbered assurances after the highlighted range, the store's promises
 * set in the specimen register: mono counters, prose lines, hairline
 * divisions. The copy states what the gallery does; it does not sell.
 */
const ASSURANCES = [
  "Every piece restored on our bench, not sold as found.",
  "Provenance researched and written down.",
  "Delivered nationwide, placed in the room.",
  "Fourteen day returns, no unsure collectors.",
];

export default function TrustStrip() {
  return (
    <section className="trust-strip reveal" aria-label="How the gallery works">
      {ASSURANCES.map((line, i) => (
        <div className="trust-item" key={line}>
          <span className="trust-no mono" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p>{line}</p>
        </div>
      ))}
    </section>
  );
}
