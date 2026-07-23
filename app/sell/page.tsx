import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Sell your chair to us",
  description:
    "We buy chairs and other pieces by the designers of the last century. Send photographs and we reply with a view, and an offer if it suits.",
};

// The chrome around this page reads the owner-editable store settings, so
// refresh on the same cadence as the rest of the site.
export const revalidate = 60;

/* What we look for, three plain lines rather than a sales pitch. */
const lookFor = [
  "Designer attribution, even unconfirmed; tell us what you know and we will research the rest.",
  "Honest condition; wear is expected in pieces this age, so describe it plainly and we will price accordingly.",
  "Original parts and finishes, which matter more to us than a recent repair.",
];

export default function SellPage() {
  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Sell to us</span>
      </nav>

      <div className="page-head">
        <span className="mono eyebrow">We buy</span>
        <h1>Sell your chair to us</h1>
        <p>
          We buy chairs, and other pieces, by the designers of the last
          century. Send a few photographs and whatever you know of the
          history; we reply with a view, and an offer if it is a piece for
          us.
        </p>
      </div>

      <section aria-label="What we look for">
        <span
          className="mono eyebrow"
          style={{ display: "block", opacity: 0.6 }}
        >
          What we look for
        </span>
        <ul className="sell-points">
          {lookFor.map((line, i) => (
            <li key={line}>
              <span className="mono" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p>{line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Tell us about your piece">
        <span
          className="mono eyebrow"
          style={{ display: "block", marginBottom: "1rem", opacity: 0.6 }}
        >
          Tell us about your piece
        </span>
        <EnquiryForm defaultKind="selling" />
      </section>
    </main>
  );
}
