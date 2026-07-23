import Link from "next/link";

/**
 * Fixed header, a plain bar on the paper ground with a bottom hairline.
 * Chairs lead the nav, per the conversion rules; the enquiry route closes it
 * so the next action is always one tap from anywhere.
 */
export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="mono" aria-label="Modern Life Furniture, home">
        Modern Life Furniture
      </Link>
      <nav className="mono" aria-label="Primary">
        <Link href="/collection/chairs">Chairs</Link>
        <Link href="/collection">Collection</Link>
        <Link href="/sell">Sell to us</Link>
        <Link href="/enquire">Enquire</Link>
      </nav>
    </header>
  );
}
