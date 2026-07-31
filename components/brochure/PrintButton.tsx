"use client";

/**
 * The catalogue is a document, so it should behave like one. This hands the
 * page to the browser's print dialogue, which is also every phone and desktop's
 * save-as-PDF; the print stylesheet in brochure.css turns the dark bands to ink
 * on white, gives each leaf its own A4 page and swaps the buttons for the
 * address a reader on paper would actually use.
 */
export default function PrintButton({
  className = "br-btn br-btn-line",
  label = "Print or save as PDF",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      {label}
    </button>
  );
}
