import Link from "next/link";

/**
 * Fixed header with mix-blend-mode difference, so the mark inverts as it
 * passes over the light and dark rooms.
 */
export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="mono" aria-label="Modern Life Furniture, home">
        Modern Life Furniture
      </Link>
      <nav className="mono" aria-label="Primary">
        <Link href="/collection">Collection</Link>
        <Link href="/restoration">Restoration</Link>
        <Link href="/enquire">Enquire</Link>
      </nav>
    </header>
  );
}
