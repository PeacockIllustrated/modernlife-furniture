import type { Metadata } from "next";
import Link from "next/link";
import ServiceBand from "@/components/service/ServiceBand";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Restoration",
  description:
    "Every piece comes apart before it comes back. French polishing, re-caning, reupholstery and re-chroming, turnaround from three weeks.",
};

const services = [
  {
    name: "French polishing",
    note: "Shellac built up by hand to a deep, even lustre, the finish the piece left the workshop with.",
  },
  {
    name: "Re-caning",
    note: "Seats and backs re-woven in natural cane, matched to the original pattern and gauge.",
  },
  {
    name: "Reupholstery",
    note: "Foam renewed and covers cut fresh in wool or leather, seams kept true to the maker's lines.",
  },
  {
    name: "Re-chroming",
    note: "Tubular frames stripped and re-plated, so the steel reads as bright as the day it was bent.",
  },
];

export default function RestorationPage() {
  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Restoration</span>
      </nav>

      <ServiceBand
        visual="bench"
        label="A mortise and tenon joint drawing apart, the conservator's method"
      />

      <div className="page-head">
        <span className="mono eyebrow">Nothing hidden</span>
        <h1>Restoration</h1>
        <p>
          Every piece comes apart before it comes back. We strip a chair to its
          parts, shell, upholstery, foam and frame, put right what the decades
          took, and reassemble it with nothing hidden. The drawing above is how
          we think.
        </p>
      </div>

      <div className="service-list">
        {services.map((s) => (
          <div key={s.name}>
            <h3>{s.name}</h3>
            <p>{s.note}</p>
          </div>
        ))}
      </div>

      <div className="block" style={{ maxWidth: "40rem", marginBottom: "3.5rem" }}>
        <span className="mono block-eyebrow">The practical matter</span>
        <dl>
          <dt>Turnaround</dt>
          <dd>From three weeks, depending on the work</dd>
          <dt>Collection</dt>
          <dd>North East England, courier nationwide</dd>
        </dl>
      </div>

      <section aria-label="Bring us a piece">
        <span
          className="mono eyebrow"
          style={{ display: "block", marginBottom: "1rem", opacity: 0.6 }}
        >
          Bring us a piece
        </span>
        <EnquiryForm defaultKind="restoration" />
      </section>
    </main>
  );
}
