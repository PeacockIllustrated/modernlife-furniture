import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Only the admin and auth routes need a live session; the rest of the site
// stays static.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/auth/:path*"],
};
