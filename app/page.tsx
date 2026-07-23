import Hero from "@/components/gallery/Hero";
import PhotoHero from "@/components/gallery/PhotoHero";
import Highlighted from "@/components/gallery/Highlighted";
import RoomsRow from "@/components/gallery/RoomsRow";
import BuyingBand from "@/components/gallery/BuyingBand";
import TrustStrip from "@/components/gallery/TrustStrip";
import Manifesto from "@/components/gallery/Manifesto";
import Words from "@/components/gallery/Words";
import Closing from "@/components/gallery/Closing";
import Tide from "@/components/canvas/Tide";
import RevealObserver from "@/components/scroll/RevealObserver";
import {
  getFeaturedPieces,
  getPieceHeroImages,
  getStoreSettings,
} from "@/lib/collection";

// Prerender and serve from cache, refreshing at most once a minute, so
// navigation is instant rather than waiting on a database round-trip.
export const revalidate = 60;

/**
 * The store home, pieces first: the hero pairs the headline block with the
 * owner's starred pieces, over the hero photograph once one is uploaded and
 * over the Tide canvas until then. Under it the newest arrivals, the
 * collection compressed to a row of four category tiles with chairs first,
 * the buying band, the four assurances, collector words, then the manifesto
 * and the closing invitation. Every image slot falls back to a generative
 * visual, so the page reads deliberate before a single photograph exists.
 */
export default async function Home() {
  const [settings, featured] = await Promise.all([
    getStoreSettings(),
    getFeaturedPieces(),
  ]);
  // The rail holds the top three starred pieces in the owner's order; the
  // "New in" row below excludes them so the home never repeats itself.
  const starred = featured.slice(0, 3);
  const heroImages = await getPieceHeroImages(starred.map((p) => p.slug));

  return (
    <main>
      {settings.heroImage ? (
        <PhotoHero settings={settings} pieces={starred} images={heroImages} />
      ) : (
        <Hero settings={settings} pieces={starred} images={heroImages}>
          <Tide label="Tide, the hero field, the grain of time" />
        </Hero>
      )}

      <Highlighted exclude={starred.map((p) => p.slug)} />

      <RoomsRow />

      <BuyingBand image={settings.workshopImage} alt={settings.workshopAlt} />

      <TrustStrip />

      <Words />

      <Manifesto />

      <Closing />

      <RevealObserver />
    </main>
  );
}
