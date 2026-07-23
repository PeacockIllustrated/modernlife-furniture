"use client";

import { useState } from "react";

/**
 * A small upload control shared by the image rows and the story bands. It
 * looks like the house .enquire button but is a label over a real file input,
 * so keyboard focus lands on the input and the label shows it via
 * focus-within. On success the parent receives the public URL for its path
 * field; failures surface through onNote as one human sentence.
 */

export default function UploadButton({
  slug,
  onUploaded,
  onNote,
}: {
  slug: string;
  onUploaded: (path: string) => void;
  onNote: (note: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Clear the input so choosing the same file again still fires a change.
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    onNote("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (slug) fd.append("slug", slug);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.path) {
        throw new Error(json.error ?? "Could not upload that image.");
      }
      onUploaded(json.path as string);
    } catch (err) {
      onNote(
        err instanceof Error ? err.message : "Could not upload that image.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="enquire admin-upload">
      {busy ? "Uploading" : "Upload"}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        disabled={busy}
      />
    </label>
  );
}
