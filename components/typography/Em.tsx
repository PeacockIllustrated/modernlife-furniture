/**
 * House emphasis. A span wrapped in asterisks becomes an em, which the
 * surrounding display styles set in Fraunces italic, so "Restored on the
 * *bench*" reads as the owner typed it and the dashboard needs no rich text.
 * Server-safe: no state, no effects, just markup.
 */
import type { ReactNode } from "react";

export function emphasise(text: string): ReactNode {
  // Split on complete asterisk pairs; odd indices are the emphasised spans.
  // A lone asterisk never matches, so it renders literally rather than
  // swallowing the rest of the line.
  const parts = text.split(/\*([^*]+)\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : part,
  );
}
