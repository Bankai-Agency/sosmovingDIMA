#!/usr/bin/env node
/**
 * scripts/seed-admin-user.mjs
 *
 * Creates (or updates) the single "owner" user in the admin DB.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-admin-user.mjs
 *
 * What it does:
 *   - Hashes SEED_PASSWORD (env) with bcrypt cost 12.
 *   - Upserts a row into `users` with username = SEED_USERNAME, role = 'owner',
 *     must_change_password = true (so the seed password is treated as temporary).
 *   - Safe to re-run: on conflict it updates the password_hash only.
 *
 * Defaults come from .env.local:
 *   SEED_USERNAME=capitalism
 *   SEED_PASSWORD=666999
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
const SEED_USERNAME = (process.env.SEED_USERNAME ?? "capitalism").trim().toLowerCase();
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "666999";

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Did you run with --env-file=.env.local ?");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  const hash = await bcrypt.hash(SEED_PASSWORD, 12);

  // On conflict: refresh password_hash + role, but do NOT overwrite name/email
  // if an editor has already filled them in.
  const rows = await sql`
    INSERT INTO users (username, password_hash, role, must_change_password)
    VALUES (${SEED_USERNAME}, ${hash}, 'owner', true)
    ON CONFLICT (username) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          role = 'owner',
          must_change_password = true
    RETURNING id, username, role, created_at
  `;

  console.log("✅ Seed user ready:");
  console.table(rows);
  console.log(`\n   Username: ${SEED_USERNAME}`);
  console.log(`   Password: ${SEED_PASSWORD}  (change on first login)`);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
