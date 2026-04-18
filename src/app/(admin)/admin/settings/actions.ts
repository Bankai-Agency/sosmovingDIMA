"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { updateProfile, changeOwnPassword } from "@/lib/admin/users";

type ProfileState = { error?: string; ok?: string };
type PasswordState = { error?: string; ok?: string };

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new Error("Not authenticated");
  return id;
}

export async function saveProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  try {
    const id = await requireUserId();
    const name = String(formData.get("name") ?? "").trim() || null;
    const email = String(formData.get("email") ?? "").trim() || null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Похоже на некорректный email" };
    }
    await updateProfile(id, { name, email });
    revalidatePath("/admin/settings");
    return { ok: "Сохранено" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось сохранить" };
  }
}

export async function changePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  try {
    const id = await requireUserId();
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const repeat = String(formData.get("repeat") ?? "");
    if (!current || !next || !repeat) return { error: "Заполните все поля" };
    if (next !== repeat) return { error: "Пароли не совпадают" };
    await changeOwnPassword(id, current, next);
    return { ok: "Пароль обновлён" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Не удалось сменить пароль" };
  }
}
