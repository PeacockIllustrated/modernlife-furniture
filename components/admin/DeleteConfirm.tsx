"use client";

import { useState } from "react";

/**
 * The two-step delete used across the dashboard lists. The first press swaps
 * the button for an inline question with Confirm and Cancel, so nothing is
 * removed on a single click and no browser dialogue interrupts the flow.
 * Focus lands on Cancel, the safe answer, when the question appears.
 */

export default function DeleteConfirm({
  label,
  message,
  onConfirm,
}: {
  label: string;
  message: string;
  onConfirm: () => void | Promise<void>;
}) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button className="enquire" type="button" onClick={() => setAsking(true)}>
        {label}
      </button>
    );
  }

  return (
    <span className="admin-confirm mono">
      <span className="admin-confirm-note">{message}</span>
      <button
        className="enquire"
        type="button"
        onClick={() => {
          setAsking(false);
          void onConfirm();
        }}
      >
        Confirm
      </button>
      <button
        autoFocus
        className="enquire"
        type="button"
        onClick={() => setAsking(false)}
      >
        Cancel
      </button>
    </span>
  );
}
