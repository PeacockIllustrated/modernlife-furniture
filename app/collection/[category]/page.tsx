import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCategoryBySlug, getPieces } from "@/lib/collection";
import { rooms } from "@/content/landing";
import CategoryBand from "@/components/collection/CategoryBand";
import SpecimenCard from "@/components/collection/SpecimenCard";
import RevealObserver from "@/components/scroll/RevealObserver";

const productSlugs = rooms
  .filter((r) => r.slug !== "restoration")
  .map((r) => r.slug);

export function generateStaticParams() {
  return productSlugs.map((category) => ({ category }));
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
  // Restoration is a service, not a product listing.
  if (category === "restoration") redirect("/restoration");

  const data = await getCategoryBySlug(category);
  const room = rooms.find((r) => r.slug === category);
  if (!data || !room) notFound();

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
          Category {String(data.position).padStart(2, "0")} of 05
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

      <RevealObserver />
    </main>
  );
}
