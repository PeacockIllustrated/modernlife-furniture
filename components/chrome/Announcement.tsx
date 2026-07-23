import { getStoreSettings } from "@/lib/collection";

/**
 * The announcement line, a single quiet notice under the header. It sits in
 * normal flow so it scrolls away with the page while the fixed header stays.
 * The strip carries enough top padding that its own line sits clear below
 * the opaque header bar at rest. The copy is owner-editable through the
 * store settings; an empty line renders nothing.
 */
export default async function Announcement() {
  const settings = await getStoreSettings();
  const line = settings.announcement.trim();
  if (!line) return null;

  return <p className="announcement mono">{line}</p>;
}
