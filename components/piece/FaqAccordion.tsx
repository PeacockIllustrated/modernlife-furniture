import type { Faq } from "@/lib/collection";

/**
 * Questions: the piece's own first, then the site-wide set, as native details
 * elements styled square. The open affordance is a rotating hairline plus
 * rather than a chevron, and the unfold is a measured quarter second handled
 * entirely in CSS; a browser that cannot interpolate details content simply
 * opens at once, which is also the reduced motion behaviour.
 */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="section-rule reveal" aria-labelledby="questions-title">
      <h2 id="questions-title" className="store-head">
        Questions
      </h2>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <details key={`${i}-${faq.question}`} className="faq-item">
            <summary>
              <span className="mono faq-no" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="faq-q">{faq.question}</span>
              <span className="faq-plus" aria-hidden="true" />
            </summary>
            <p className="faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
