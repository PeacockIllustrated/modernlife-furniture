/**
 * Four numbered assurances after the highlighted range, the store's promises
 * set plainly: mono counters, prose lines, hairline divisions. Each line is a
 * fact a buyer cares about, nothing invented and nothing theatrical.
 */
const ASSURANCES = [
  "Every piece checked and photographed honestly.",
  "Provenance researched and written down.",
  "Delivered nationwide, placed in the room.",
  "Fourteen day returns.",
];

export default function TrustStrip() {
  return (
    <section className="trust-strip reveal" aria-label="How buying works">
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
