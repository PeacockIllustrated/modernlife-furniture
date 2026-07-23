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
import { getStoreSettings } from "@/lib/collection";

// Prerender and serve from cache, refreshing at most once a minute, so
// navigation is instant rather than waiting on a database round-trip.
export const revalidate = 60;

/**
 * The store home, photo first: a photographic hero once the owner uploads
 * one (the Tide hero stands until then), the featured trio, the collection
 * compressed to a row of four category tiles with chairs first, the buying
 * band, the four assurances, collector words, then the manifesto and the
 * closing invitation. Every image slot falls back to a generative visual, so
 * the page reads deliberate before a single photograph exists.
 */
export default async function Home() {
  const settings = await getStoreSettings();

  return (
    <main>
      {settings.heroImage ? (
        <PhotoHero settings={settings} />
      ) : (
        <Hero>
          <Tide label="Tide, the hero field, the grain of time" />
        </Hero>
      )}

      <Highlighted />

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
