import type { Config } from "drizzle-kit";

/**
 * drizzle-kit config — used by `npm run db:push` / `db:generate`.
 *
 * Loads DATABASE_URL from .env.local (Node 22+ supports this natively via
 * --env-file; see scripts in package.json).
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
} satisfies Config;
