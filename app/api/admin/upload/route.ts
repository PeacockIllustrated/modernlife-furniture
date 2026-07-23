import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Photography upload for the piece editor. Accepts one image as multipart
 * form data, stores it in the public modern-pieces bucket under the piece's
 * slug, and returns the public URL for the image path field. Gated like
 * every other admin route.
 */

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 8 * 1024 * 1024;

// Keep only safe filename characters so the storage key stays predictable.
function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
}

function safeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file given." }, { status: 400 });
  }
  if (!ALLOWED[file.type]) {
    return NextResponse.json(
      { error: "Photography should be a JPEG, PNG, WebP or AVIF file." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That file is larger than eight megabytes." },
      { status: 400 },
    );
  }

  const slugRaw = form.get("slug");
  const folder =
    (typeof slugRaw === "string" ? safeSlug(slugRaw) : "") || "unsorted";
  const base = safeName(file.name);
  const named = base.includes(".")
    ? base
    : `${base || "image"}.${ALLOWED[file.type]}`;
  const path = `${folder}/${Date.now()}-${named}`;

  const db = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { data, error } = await db.storage
    .from("modern-pieces")
    .upload(path, buffer, { contentType: file.type });
  if (error || !data) {
    return NextResponse.json(
      { error: "We could not store that image just now." },
      { status: 502 },
    );
  }
  const { data: pub } = db.storage
    .from("modern-pieces")
    .getPublicUrl(data.path);
  return NextResponse.json({ ok: true, path: pub.publicUrl });
}
