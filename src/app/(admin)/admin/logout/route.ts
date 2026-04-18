import { signOut } from "@/lib/auth";

/**
 * GET /admin/logout — signs the user out and redirects to /admin/login.
 * We expose it as a simple GET so the sidebar "Выйти" link works without
 * needing a client-side component or form.
 */
export async function GET() {
  await signOut({ redirectTo: "/admin/login" });
  // `signOut` throws a redirect that Next handles; this line is unreachable.
  return new Response(null, { status: 302 });
}
