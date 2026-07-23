import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="page-head">
        <span className="mono eyebrow">Not in the collection</span>
        <h1>This piece has moved on</h1>
        <p>
          The page you are after is not here. It may have been rehomed, or the
          address may have a letter out of place. The collection carries
          everything currently for sale.
        </p>
      </div>
      <Link className="enquire" href="/collection">
        Back to the collection
      </Link>
    </main>
  );
}
