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
      return "In restoration";
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
