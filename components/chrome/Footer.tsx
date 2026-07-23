import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { getStoreSettings } from "@/lib/collection";
import { rooms } from "@/content/landing";

/**
 * The store footer: the acquisitions list first, the site's map in three mono
 * columns, then the quiet legal line. Hairline separations only, per
 * DESIGN.md. The newsletter lead is owner-editable through the store
 * settings; the category links come from the same static rooms the landing
 * uses, so the two never drift apart.
 */
export default async function Footer() {
  const settings = await getStoreSettings();

  return (
    <footer className="store-footer">
      <div className="footer-news">
        <h2>The acquisitions list</h2>
        <p>{settings.newsletterLead}</p>
        <NewsletterForm />
      </div>

      <div className="footer-cols mono">
        <nav className="footer-col" aria-label="Collection">
          <span className="footer-col-h">Collection</span>
          {rooms.map((room) => (
            <Link key={room.slug} href={`/collection/${room.slug}`}>
              {room.title}
            </Link>
          ))}
        </nav>

        <nav className="footer-col" aria-label="The gallery">
          <span className="footer-col-h">The gallery</span>
          <Link href="/sell">Sell to us</Link>
          <Link href="/enquire">Enquire</Link>
          <Link href="/collection">Collection</Link>
        </nav>

        <div className="footer-col">
          <span className="footer-col-h">Contact</span>
          <a href="mailto:studio@modernlifefurniture.co.uk">
            studio@modernlifefurniture.co.uk
          </a>
          <span className="footer-addr">North East England</span>
        </div>
      </div>

      <div className="footer-legal mono">
        <span>Modern Life Furniture</span>
        <span>Bought, restored, rehomed</span>
        <span>Established in the last century&rsquo;s afterglow, MMXXVI</span>
      </div>
    </footer>
  );
}
