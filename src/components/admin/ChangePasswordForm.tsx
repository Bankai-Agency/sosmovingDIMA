"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/(admin)/admin/change-password/actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field name="current" label="Текущий пароль" autoComplete="current-password" disabled={pending} />
      <Field name="next" label="Новый пароль" autoComplete="new-password" disabled={pending} />
      <Field name="repeat" label="Повторить новый" autoComplete="new-password" disabled={pending} />

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
        {pending ? "Сохраняем…" : "Сменить пароль"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  autoComplete,
  disabled,
}: {
  name: string;
  label: string;
  autoComplete: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="caption text-dark/56">{label}</span>
      <input
        name={name}
        type="password"
        autoComplete={autoComplete}
        required
        disabled={disabled}
        className="h-12 rounded-md border border-dark/12 bg-surface px-4 text-[15px] leading-5 outline-none placeholder:text-dark/32 focus:border-dark disabled:opacity-50"
      />
    </label>
  );
}
