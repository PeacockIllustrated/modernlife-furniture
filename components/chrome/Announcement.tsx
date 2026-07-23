import { getStoreSettings } from "@/lib/collection";

/**
 * The announcement line, a single quiet notice above the header. It sits in
 * normal flow so it scrolls away with the page while the fixed header stays.
 * At rest the header overlaps the strip and reads in bone through the global
 * difference blend, so the strip carries enough top padding to keep its own
 * line clear of the header's text. The copy is owner-editable through the
 * store settings; an empty line renders nothing.
 */
export default async function Announcement() {
  const settings = await getStoreSettings();
  const line = settings.announcement.trim();
  if (!line) return null;

  return <p className="announcement mono">{line}</p>;
}
