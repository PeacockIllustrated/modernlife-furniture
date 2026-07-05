import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Tell us what you are after and we will find it. And if you have a piece the artists made, we buy.",
};

export default function EnquirePage() {
  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Enquire</span>
      </nav>

      <div className="page-head">
        <span className="mono eyebrow">We curate and explain</span>
        <h1>Enquire</h1>
        <p>
          The collection changes weekly and the best pieces rarely reach the
          website. Tell us what you are after and we will find it. And if you
          have a piece the artists made, we buy.
        </p>
      </div>

      <EnquiryForm />
    </main>
  );
}
