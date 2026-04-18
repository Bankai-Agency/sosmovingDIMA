"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { consumeInvite } from "@/lib/admin/users";

type State = { error?: string };

/**
 * Server action behind the /admin/register form. Consumes the invite token,
 * creates the user, then signs them in via Credentials and hops to the
 * dashboard. Any validation / uniqueness error bubbles up as a string.
 */
export async function registerFromInvite(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const token = String(formData.get("token") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  if (!token) return { error: "Приглашение не указано" };
  if (password !== repeat) return { error: "Пароли не совпадают" };

  try {
    await consumeInvite({ token, username, password });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось создать пользователя" };
  }

  // Log the brand-new user in right away so they don't have to type again.
  try {
    await signIn("credentials", {
      username: username.toLowerCase(),
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Пользователь создан, но логин не прошёл. Попробуй войти вручную." };
    throw err;
  }

  redirect("/admin/dashboard");
}
