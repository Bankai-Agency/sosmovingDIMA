"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

/**
 * Server action backing the login form. Called via `<form action={login}>`.
 *
 * signIn() with `redirect: true` (default) throws a `NEXT_REDIRECT` on
 * success — that's fine, Next re-throws it and navigates. On failure
 * Auth.js throws a CredentialsSignin (code "CredentialsSignin"); we
 * convert it to a URL search param so the page can render an error hint.
 */
export async function login(_prevState: string | undefined, formData: FormData): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
    return undefined;
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") return "Неверный логин или пароль";
      return "Ошибка входа. Попробуй ещё раз";
    }
    // Re-throw Next redirects — they must reach the framework.
    throw err;
  }
}
