import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPieceBySlug, getCategoryBySlug } from "@/lib/collection";
import { rooms } from "@/content/landing";
import { staticPieces } from "@/content/pieces";
import { statusLabel, priceLabel, periodRange } from "@/lib/format";
import PieceFigure from "@/components/piece/PieceFigure";
import ProvenanceDiagram from "@/components/piece/ProvenanceDiagram";
import EnquiryForm from "@/components/forms/EnquiryForm";
import RevealObserver from "@/components/scroll/RevealObserver";

export function generateStaticParams() {
  return staticPieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = await getPieceBySlug(slug);
  if (!piece) return { title: "Piece" };
  return {
    title: piece.title,
    description: `${piece.attribution}. ${piece.story}`,
  };
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = await getPieceBySlug(slug);
  if (!piece) notFound();

  const room = rooms.find((r) => r.slug === piece.categorySlug);
  const category = await getCategoryBySlug(piece.categorySlug);
  const visual = room?.visual ?? "rings";
  const canvasLabel = room?.canvasLabel ?? piece.title;

  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/collection">Collection</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/collection/${piece.categorySlug}`}>
          {category?.name ?? "Category"}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{piece.title}</span>
      </nav>

      <div className="piece">
        <PieceFigure visual={visual} label={canvasLabel} images={piece.images} />

        <div className="piece-body">
          <span className="mono attribution">{piece.attribution}</span>
          <h1>{piece.title}</h1>
          {piece.placeholder ? (
            <span className="mono" style={{ opacity: 0.55, display: "block", marginBottom: "1.4rem" }}>
              Placeholder listing, details to be confirmed
            </span>
          ) : null}
          <p className="story">{piece.story}</p>

          <dl>
            <dt>Attribution</dt>
            <dd>{piece.attribution}</dd>
            <dt>Period</dt>
            <dd>{periodRange(piece.periodLabel, piece.yearFrom, piece.yearTo)}</dd>
            <dt>Origin</dt>
            <dd>{piece.origin}</dd>
            <dt>Materials</dt>
            <dd>{piece.materials.join(", ")}</dd>
            <dt>Status</dt>
            <dd>{statusLabel(piece.status)}</dd>
            <dt>Price</dt>
            <dd>{priceLabel(piece.priceOnRequest, piece.pricePence)}</dd>
          </dl>

          {piece.restorationNotes ? (
            <div className="section-rule">
              <span className="mono eyebrow">Restoration</span>
              <p>{piece.restorationNotes}</p>
            </div>
          ) : null}
        </div>
      </div>

      {piece.provenance.length > 0 ? (
        <section className="section-rule reveal" aria-label="Provenance">
          <span className="mono eyebrow">Provenance</span>
          <ProvenanceDiagram
            provenance={piece.provenance}
            label={`Provenance rings for the ${piece.title}`}
          />
        </section>
      ) : null}

      <section className="section-rule" aria-label="Enquire about this piece">
        <span className="mono eyebrow">Enquire</span>
        <p style={{ maxWidth: "40ch", marginBottom: "1.6rem" }}>
          {piece.status === "sold"
            ? "This piece has been rehomed. Tell us what you are after and we will find its like."
            : "To arrange a viewing or ask about this piece, send us a note."}
        </p>
        <EnquiryForm
          defaultKind="piece"
          pieceSlug={piece.slug}
          pieceTitle={piece.title}
        />
      </section>

      <RevealObserver />
    </main>
  );
}
