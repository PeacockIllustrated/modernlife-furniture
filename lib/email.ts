import "server-only";

/**
 * Owner notifications via Resend. Best-effort: the enquiry or interest is
 * already stored in Supabase before this runs, so a failed or unconfigured
 * send never blocks the visitor. Configure with three environment variables:
 *   RESEND_API_KEY   the Resend API key
 *   MLF_OWNER_EMAIL  where notifications land (the owner's inbox)
 *   MLF_FROM_EMAIL   the verified sender, optional; a sensible default otherwise
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = process.env.MLF_OWNER_EMAIL;
const FROM_EMAIL =
  process.env.MLF_FROM_EMAIL ??
  "Modern Life Furniture <notifications@modernlifefurniture.co.uk>";

/** Whether owner notifications can be sent. */
export const emailConfigured = Boolean(RESEND_API_KEY && OWNER_EMAIL);

/**
 * Send the owner a plain-text notification. Never throws; returns whether the
 * send was attempted and accepted.
 */
export async function notifyOwner(
  subject: string,
  lines: string[],
): Promise<boolean> {
  if (!emailConfigured) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject,
        text: lines.join("\n"),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
