import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

/**
 * Two faces, the pairing the mark itself is built from.
 *
 * Montserrat carries the statement: every heading, the body and the labels.
 * Anaktoria is the accent, the calligraphic hand that sets the "of" in the
 * lockup and the "Timeless pieces for" line under it. Here it sets the one
 * emphasised word in a heading, and nothing else.
 *
 * Anaktoria is George Douros's, from Unicode Fonts for Ancient Scripts, and is
 * offered free for any use including redistribution, so it can be served from
 * our own origin. It ships one weight and no separate italic: its lowercase is
 * already a cursive hand. Never ask a browser to embolden or slant it, because
 * a synthesised weight on a calligraphic face smears it. Where emphasis is
 * wanted, change the face, not the weight.
 *
 * The file here is subset to Latin and converted by `npm run font:accent`:
 * 184KB of OpenType covering every ancient script becomes 18KB of the alphabet
 * this shop actually writes in.
 */

export const montserrat = Montserrat({
  subsets: ["latin"],
  // 300 for large display, 400 body, 500 labels, 600 for the rare hard stop.
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-montserrat",
});

export const anaktoria = localFont({
  src: "./fonts/Anaktoria-latin.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-anaktoria",
  // Next's automatic fallback metrics are derived for text faces; on this
  // hand they overshoot and the emphasis word jumps as it swaps.
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});
