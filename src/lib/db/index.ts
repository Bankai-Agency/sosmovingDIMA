import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Drizzle + Neon HTTP serverless driver (lazy).
 *
 * Why `neon-http` and not `node-postgres`:
 *   - Next.js admin routes run as Vercel serverless functions; each request
 *     is a cold process. `neon-http` sends queries over HTTPS, avoiding the
 *     TCP connection/pool ritual of pg.
 *   - Admin traffic is tiny, per-query HTTP overhead is fine.
 *
 * Why lazy:
 *   - `next build` imports this file during route graph generation, well
 *     before .env.local is loaded for runtime requests. Throwing at module
 *     load would break every CI build. We throw on first actual query
 *     instead — the error then shows up in the admin request, not in the
 *     sitemap generation.
 */

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getClient() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. See .env.example for the expected format (postgresql://…). " +
        "For local dev: create `.env.local`. For prod: set it in Vercel project env vars.",
    );
  }
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

/**
 * Proxy around the lazy client. Any property access triggers init on first use.
 * Typed as the full drizzle client so call sites don't see `| null`.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});

export { schema };
