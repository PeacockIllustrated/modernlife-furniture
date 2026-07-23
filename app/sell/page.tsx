import type { Metadata } from "next";
import Link from "next/link";
import ServiceBand from "@/components/service/ServiceBand";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Sell a piece",
  description:
    "If you have a piece the artists made, we buy. Chairs, casework, tables and shelving from the last century, restored and rehomed.",
};

// The chrome around this page reads the owner-editable store settings, so
// refresh on the same cadence as the rest of the site.
export const revalidate = 60;

const looks = [
  {
    name: "What we look for",
    note: "Chairs, casework, tables and shelving from the last century, by the schools and workshops that shaped modern furniture. Condition matters less than you might think.",
  },
  {
    name: "How it works",
    note: "Send a few photographs and whatever you know of the history. We will tell you what we can about it, and make an offer if it is a piece for us.",
  },
  {
    name: "What happens next",
    note: "We collect across the North East and arrange a courier nationwide. The piece comes to the bench, and on to its next home with the story intact.",
  },
];

export default function SellPage() {
  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Sell a piece</span>
      </nav>

      <ServiceBand
        visual="rings"
        label="Rings of grain and ownership"
        dark
      />

      <div className="page-head">
        <span className="mono eyebrow">We buy</span>
        <h1>Sell a piece</h1>
        <p>
          If you have a piece the artists made, we buy. The best pieces rarely
          reach the open market, and a good one deserves the bench and a next
          home rather than a skip.
        </p>
      </div>

      <div className="service-list">
        {looks.map((l) => (
          <div key={l.name}>
            <h3>{l.name}</h3>
            <p>{l.note}</p>
          </div>
        ))}
      </div>

      <section aria-label="Tell us about your piece">
        <span className="mono eyebrow" style={{ display: "block", marginBottom: "1rem", opacity: 0.6 }}>
          Tell us about your piece
        </span>
        <EnquiryForm defaultKind="selling" />
      </section>
    </main>
  );
}
