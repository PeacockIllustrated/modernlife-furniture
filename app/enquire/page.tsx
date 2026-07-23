import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/forms/EnquiryForm";
import RoomVisual from "@/components/canvas/RoomVisual";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Tell us what you are after and we will find it. And if you have a piece the artists made, we buy.",
};

// The chrome around this page reads the owner-editable store settings, so
// refresh on the same cadence as the rest of the site.
export const revalidate = 60;

export default function EnquirePage() {
  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Enquire</span>
      </nav>

      <div className="page-head">
        <span className="mono eyebrow">Get in touch</span>
        <h1>Enquire</h1>
        <p>
          The collection changes weekly and the best pieces rarely reach the
          website. Tell us what you are after and we will find it. And if you
          have a piece the artists made, we buy.
        </p>
      </div>

      <div className="enquire-layout">
        <div className="enquire-panel">
          <EnquiryForm />
        </div>
        <aside className="enquire-aside" aria-hidden="true">
          <RoomVisual
            visual="rings"
            label=""
            scrollBound={false}
          />
          <span className="aside-note mono">Every piece leaves with its story</span>
        </aside>
      </div>
    </main>
  );
}
