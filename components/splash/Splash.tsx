import SplashCanvas from "./SplashCanvas";

/**
 * The splash overlay, rendered on the server so the curtain is already there
 * in the first paint and the site never flashes before it. Only the home page
 * mounts it: a piece page opened from a social post is the money page and
 * loads straight into the piece.
 *
 * Three things must be true of it, and all three are handled here rather than
 * in the canvas, so they hold even if the script never runs:
 *
 *   1. It always leaves. A CSS animation clears the overlay a few seconds in
 *      whatever happens, and the inline script below schedules its own
 *      release of the scroll lock, so a bundle that never loads cannot leave
 *      the page frozen behind a curtain.
 *   2. It never repeats in a session, and never runs under reduced motion.
 *      Both are decided by a tiny script before first paint, so a returning
 *      visitor gets no flash of curtain at all.
 *   3. It is not read out. The overlay is decorative and hidden from
 *      assistive technology; the page underneath is the document.
 */

// Runs before paint: a second visit in the same session, or a stated
// preference for less motion, and the curtain is never shown.
const PREPAINT = `(function(){try{
var s=document.getElementById('splash');if(!s)return;
var seen=sessionStorage.getItem('hoc-splash');
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(seen||still){s.dataset.state='gone';return;}
var h=document.documentElement;h.classList.add('splash-locked');
setTimeout(function(){h.classList.remove('splash-locked')},5200);
}catch(e){}})();`;

export default function Splash() {
  return (
    <>
      <div id="splash" className="splash" aria-hidden="true">
        <SplashCanvas />
        {/* The logo assembles itself over the falling chairs. It is the
            exported asset, played straight from public/logo, so the splash and
            anything else the logo is used in can never drift apart. An <img>
            keeps the 35KB of artwork out of the page HTML and still runs the
            CSS animation inside the file; the preload scanner finds it in the
            first bytes of the document, so it starts on time. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image
            would proxy and rasterise the SVG, and the CSS animation inside the
            file would never run. A plain img is the only thing that plays it. */}
        <img
          className="splash-logo"
          src="/logo/house-of-chairs-animated.svg"
          alt=""
          width={2440}
          height={1241}
          fetchPriority="high"
        />
      </div>
      <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
    </>
  );
}
