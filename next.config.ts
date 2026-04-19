import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep admin-only heavy deps + static-asset folders out of serverless function
  // bundles. /api/upload was tracing `public/images/blog/` (262 MB of static
  // blog images) because image-store.ts calls join(process.cwd(), "public/...")
  // with existsSync — Next treats the referenced folder as a runtime dependency
  // and bundles the whole thing, blowing past the 250 MB Hobby function limit.
  // Public routes also previously dragged in @blocknote / drizzle / @octokit /
  // next-auth via transitive traces.
  outputFileTracingExcludes: {
    "/api/upload": [
      "public/**",
      ".next/**",
      "src/data/blog/**",
    ],
    "/api/cron/publish-scheduled": [
      "public/**",
      ".next/**",
    ],
    "/mainpage2": [
      "node_modules/@blocknote/**",
      "node_modules/@emotion/**",
      "node_modules/@mantine/**",
      "node_modules/@octokit/**",
      "node_modules/drizzle-orm/**",
      "node_modules/drizzle-kit/**",
      "node_modules/@neondatabase/**",
      "node_modules/bcryptjs/**",
      "node_modules/next-auth/**",
      "node_modules/cheerio/**",
    ],
    "/": [
      "node_modules/@blocknote/**",
      "node_modules/@emotion/**",
      "node_modules/@mantine/**",
      "node_modules/@octokit/**",
      "node_modules/drizzle-orm/**",
      "node_modules/drizzle-kit/**",
      "node_modules/@neondatabase/**",
      "node_modules/bcryptjs/**",
      "node_modules/next-auth/**",
      "node_modules/cheerio/**",
    ],
    "/blog/[slug]": [
      "node_modules/@blocknote/**",
      "node_modules/@emotion/**",
      "node_modules/@mantine/**",
      "node_modules/@octokit/**",
      "node_modules/drizzle-orm/**",
      "node_modules/drizzle-kit/**",
      "node_modules/@neondatabase/**",
      "node_modules/bcryptjs/**",
      "node_modules/cheerio/**",
    ],
    "/services/[slug]": [
      "node_modules/@blocknote/**",
      "node_modules/@emotion/**",
      "node_modules/@mantine/**",
      "node_modules/@octokit/**",
      "node_modules/drizzle-orm/**",
      "node_modules/drizzle-kit/**",
      "node_modules/@neondatabase/**",
      "node_modules/bcryptjs/**",
      "node_modules/cheerio/**",
    ],
    "/[citySlug]": [
      "node_modules/@blocknote/**",
      "node_modules/@emotion/**",
      "node_modules/@mantine/**",
      "node_modules/@octokit/**",
      "node_modules/drizzle-orm/**",
      "node_modules/drizzle-kit/**",
      "node_modules/@neondatabase/**",
      "node_modules/bcryptjs/**",
      "node_modules/cheerio/**",
    ],
    "/category/[slug]": [
      "node_modules/@blocknote/**",
      "node_modules/@emotion/**",
      "node_modules/@mantine/**",
      "node_modules/@octokit/**",
      "node_modules/drizzle-orm/**",
      "node_modules/drizzle-kit/**",
      "node_modules/@neondatabase/**",
      "node_modules/bcryptjs/**",
      "node_modules/cheerio/**",
    ],
  },
};

export default nextConfig;
