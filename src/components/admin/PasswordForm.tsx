"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/(admin)/admin/settings/actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field name="current" label="Текущий пароль" disabled={pending} />
      <Field name="next" label="Новый пароль" disabled={pending} />
      <Field name="repeat" label="Повторить новый" disabled={pending} />

      {state.error && (
        <div className="rounded-md border border-negative/32 bg-negative-soft px-3 py-2">
          <p className="caption font-semibold text-negative">{state.error}</p>
        </div>
      )}
      {state.ok && (
        <div className="rounded-md border border-positive/32 bg-positive-soft px-3 py-2">
          <p className="caption font-semibold text-positive">{state.ok}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-md bg-dark px-4 text-[15px] font-semibold text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
        >
          {pending ? "Сохраняем…" : "Сменить пароль"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  disabled,
}: {
  label: string;
  name: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="caption text-dark/56">{label}</span>
      <input
        name={name}
        type="password"
        autoComplete={name === "current" ? "current-password" : "new-password"}
        required
        disabled={disabled}
        className="h-11 rounded-md border border-dark/12 bg-surface px-4 text-[15px] outline-none focus:border-dark disabled:opacity-50"
      />
    </label>
  );
}
