/**
 * Admin protection proxy (renamed from middleware.ts — Next 16 deprecated
 * the "middleware" file convention in favor of "proxy"). Uses the Auth.js v5
 * `auth` helper, which has the same (NextRequest) → NextResponse signature
 * and runs the `authorized` callback defined in src/lib/auth.ts.
 */
export { auth as proxy } from "@/lib/auth";

export const config = {
  // Only run for /admin/* — zero overhead on the 900+ public pages.
  matcher: ["/admin/:path*"],
};
