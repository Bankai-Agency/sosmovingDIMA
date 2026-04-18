"use client";

import { useActionState } from "react";
import { registerFromInvite } from "@/app/(admin)/admin/register/actions";

export function RegisterForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(registerFromInvite, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <label className="flex flex-col gap-2">
        <span className="caption text-dark/56">Логин</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          pattern="[a-zA-Z0-9_.\-]+"
          disabled={pending}
          placeholder="ivan-writer"
          className="h-12 rounded-md border border-dark/12 bg-surface px-4 text-[15px] outline-none placeholder:text-dark/32 focus:border-dark disabled:opacity-50"
        />
        <span className="caption text-dark/32">Латинские буквы, цифры, _ . -</span>
      </label>

      <label className="flex flex-col gap-2">
        <span className="caption text-dark/56">Пароль</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={pending}
          className="h-12 rounded-md border border-dark/12 bg-surface px-4 text-[15px] outline-none placeholder:text-dark/32 focus:border-dark disabled:opacity-50"
        />
        <span className="caption text-dark/32">Минимум 6 символов</span>
      </label>

      <label className="flex flex-col gap-2">
        <span className="caption text-dark/56">Повторить пароль</span>
        <input
          name="repeat"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={pending}
          className="h-12 rounded-md border border-dark/12 bg-surface px-4 text-[15px] outline-none placeholder:text-dark/32 focus:border-dark disabled:opacity-50"
        />
      </label>

      {state.error && (
        <div className="rounded-md border border-negative/32 bg-negative-soft px-4 py-3">
          <p className="caption font-semibold text-negative">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 h-12 rounded-md bg-dark px-4 text-[15px] font-semibold text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
      >
        {pending ? "Создаём…" : "Создать аккаунт"}
      </button>
    </form>
  );
}
