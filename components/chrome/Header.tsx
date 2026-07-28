import Link from "next/link";

/**
 * Fixed header, a plain bar on the paper ground with a bottom hairline.
 * The shop leads the nav, per the conversion rules; the enquiry route closes
 * it so the next action is always one tap from anywhere.
 */
export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="mono" aria-label="House of Chairs, home">
        House of Chairs
      </Link>
      <nav className="mono" aria-label="Primary">
        <Link href="/collection">Shop</Link>
        <Link href="/sell">Sell to us</Link>
        <Link href="/enquire">Enquire</Link>
      </nav>
    </header>
  );
}
