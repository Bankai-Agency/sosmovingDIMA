"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/(admin)/admin/settings/actions";

type Props = {
  username: string;
  initialName: string;
  initialEmail: string;
};

export function ProfileForm({ username, initialName, initialEmail }: Props) {
  const [state, formAction, pending] = useActionState(saveProfile, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Логин" defaultValue={username} readOnly hint="Нельзя сменить." />
      <Field label="Имя" name="name" defaultValue={initialName} />
      <Field label="Email" name="email" type="email" defaultValue={initialEmail} hint="Для будущего password recovery (опционально)." />

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
          {pending ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  hint,
  readOnly,
  type = "text",
}: {
  label: string;
  name?: string;
  defaultValue?: string;
  hint?: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="caption text-dark/56">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="h-11 rounded-md border border-dark/12 bg-surface px-4 text-[15px] outline-none focus:border-dark read-only:bg-dark/6 read-only:text-dark/56"
      />
      {hint && <span className="caption text-dark/32">{hint}</span>}
    </label>
  );
}
