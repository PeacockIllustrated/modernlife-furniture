import type { PieceStatus } from "./supabase/types";

/** Human label for a piece status, sentence case, British. */
export function statusLabel(status: PieceStatus): string {
  switch (status) {
    case "available":
      return "Available";
    case "reserved":
      return "Reserved";
    case "sold":
      return "Sold";
    case "restoration":
      return "Being prepared";
    case "draft":
      return "Draft";
  }
}

/** Price line: "Price on request" or a formatted sterling amount. */
export function priceLabel(
  priceOnRequest: boolean,
  pricePence: number | null,
): string {
  if (priceOnRequest || pricePence == null) return "Price on request";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(pricePence / 100);
}

/** Whether next/image may optimise a path. The optimiser's remote allow-list
    stops at supabase.co, so only local paths and Supabase storage URLs pass;
    anything else renders unoptimised rather than as a broken image. */
export function canOptimiseImage(path: string): boolean {
  if (path.startsWith("/")) return true;
  if (!path.startsWith("https://")) return false;
  try {
    const host = new URL(path).hostname;
    return host === "supabase.co" || host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

/** Period range, e.g. "1966 to 1972", falling back to the period label. */
export function periodRange(
  periodLabel: string,
  yearFrom: number | null,
  yearTo: number | null,
): string {
  if (yearFrom && yearTo) return `${yearFrom} to ${yearTo}`;
  if (yearFrom) return `${yearFrom}`;
  if (yearTo) return `${yearTo}`;
  return periodLabel;
}
