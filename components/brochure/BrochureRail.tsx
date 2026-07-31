"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * The running head. A printed brochure carries the issue on one side of the
 * rule and the page number on the other; this is the same device, sticky under
 * the site header, with two things paper cannot do: a hairline that fills as
 * you read, and the enquiry kept one tap away from every plate.
 *
 * Cheap by construction. One rAF-throttled scroll listener writing a transform
 * on a single hairline, one IntersectionObserver reading the leaf you are on,
 * and one ResizeObserver keeping the rail parked against the header. Nothing
 * reads layout in the scroll handler beyond the document height, and the fill
 * is a transform, so it never triggers layout.
 */
export default function BrochureRail({
  issueLine,
  total,
}: {
  issueLine: string;
  total: number;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [folio, setFolio] = useState("01");
  const [head, setHead] = useState(issueLine);

  /* Park the rail against the bottom of the fixed site header. The CSS carries
     a sensible default for the first paint, but the header is a wrapping flex
     bar whose height changes with the viewport, and a guess that is 20px out
     leaves a strip of the document scrolling between the two. Measuring is
     exact and costs one observer. */
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header || !rail.current) return;
    const apply = () => {
      rail.current?.style.setProperty(
        "--br-head",
        `${Math.round(header.getBoundingClientRect().height)}px`,
      );
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
        if (fill.current) {
          fill.current.style.transform = `scaleX(${progress})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const leaves = Array.from(
      document.querySelectorAll<HTMLElement>("[data-folio]"),
    );
    if (!leaves.length) return;

    /* The observer reports changes, not state, so the leaf you are on has to
       be tracked across callbacks: an entry that stopped intersecting and one
       that started can arrive together, and the leaf that is still in the band
       from three callbacks ago never arrives at all. Keeping the set and
       taking the first still in it, in document order, is what makes the folio
       agree with what is on screen. */
    const inBand = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        });
        const current = leaves.find((leaf) => inBand.has(leaf));
        if (!current) return;
        setFolio(current.dataset.folio ?? "01");
        setHead(current.dataset.head || issueLine);
      },
      // A band across the upper third of the viewport: the leaf being read.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    leaves.forEach((leaf) => io.observe(leaf));
    return () => io.disconnect();
  }, [issueLine]);

  return (
    <div className="br-rail mono" ref={rail}>
      <span className="br-rail-issue">{head}</span>
      <span className="br-rail-track" aria-hidden="true">
        <span className="br-rail-fill" ref={fill} />
      </span>
      <span className="br-rail-folio">
        {folio} <span aria-hidden="true">/</span>{" "}
        {String(total).padStart(2, "0")}
      </span>
      <Link className="br-rail-cta" href="/enquire">
        Enquire
      </Link>
    </div>
  );
}
