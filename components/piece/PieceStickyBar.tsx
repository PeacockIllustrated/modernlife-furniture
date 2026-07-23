"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The mobile enquiry strip: a sentinel sits where the buy box scrolls away,
 * and once it has left through the top of the viewport a fixed bottom bar
 * carries the title, the price and a way back to the enquiry form. Desktop
 * never shows it; the sticky buy box does that work there. Reduced motion
 * drops the fade and simply shows or hides the bar at rest.
 */
export default function PieceStickyBar({
  title,
  price,
}: {
  title: string;
  price: string;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Only the upward exit counts: while the sentinel is below the fold the
      // buy box is still ahead of the reader, so the bar would only intrude.
      setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="sticky-sentinel" aria-hidden="true" />
      <div
        className="sticky-bar"
        data-show={show ? "true" : "false"}
        aria-hidden={show ? undefined : "true"}
      >
        <span className="sticky-bar-title">{title}</span>
        <span className="mono sticky-bar-price">{price}</span>
        <a className="enquire" href="#enquire" tabIndex={show ? 0 : -1}>
          Enquire
        </a>
      </div>
    </>
  );
}
