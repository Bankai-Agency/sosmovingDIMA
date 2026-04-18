import { handlers } from "@/lib/auth";

/**
 * Re-export Auth.js v5 handlers to /api/auth/[...nextauth]/*.
 * Both GET and POST are required (GET for session, POST for sign-in/out).
 */
export const { GET, POST } = handlers;
