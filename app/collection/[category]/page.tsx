import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getPieces } from "@/lib/collection";
import { rooms } from "@/content/landing";
import CategoryBand from "@/components/collection/CategoryBand";
import SpecimenCard from "@/components/collection/SpecimenCard";
import FeatureBand from "@/components/gallery/FeatureBand";
import RevealObserver from "@/components/scroll/RevealObserver";

export const revalidate = 60;

export function generateStaticParams() {
  return rooms.map((r) => ({ category: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data) return { title: "Collection" };
  return { title: data.name, description: data.story };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  const room = rooms.find((r) => r.slug === category);
  if (!data || !room) notFound();

  // The same cached read as getCategoryBySlug, so the count costs nothing.
  const categories = await getCategories();
  const pieces = await getPieces(category);

  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/collection">Collection</Link>
        <span aria-hidden="true">/</span>
        <span>{data.name}</span>
      </nav>

      <CategoryBand
        visual={room.visual}
        label={room.canvasLabel}
        dark={room.variant === "dark"}
      />

      <div className="page-head">
        <span className="mono eyebrow">
          Era {String(data.position).padStart(2, "0")} of{" "}
          {String(categories.length).padStart(2, "0")}
        </span>
        <h1>{data.name}</h1>
        <p>{data.story}</p>
      </div>

      {pieces.length > 0 ? (
        <div className="specimen-index">
          {pieces.map((piece) => (
            <SpecimenCard key={piece.slug} piece={piece} />
          ))}
        </div>
      ) : (
        <p className="mono" style={{ opacity: 0.7 }}>
          No pieces are listed here at the moment. The best pieces rarely reach
          the website; tell us what you are after and we will find it.
        </p>
      )}

      <FeatureBand
        eyebrow="More chairs than reach the website"
        heading="Looking for something in particular"
        body="Tell us what you are after and we will find it. And if you have a piece the artists made, we buy."
        cta={{ label: "Make an enquiry", href: "/enquire" }}
        visual="rings"
      />

      <RevealObserver />
    </main>
  );
}
