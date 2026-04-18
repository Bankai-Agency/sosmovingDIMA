"use client";

import { useActionState, useState } from "react";
import { createInvite } from "@/app/(admin)/admin/users/actions";

/**
 * "+ Пригласить" form. On success shows the generated URL inline with a
 * copy button — we only show the URL once, so the admin either copies it
 * now or revokes the invite and issues a new one.
 */
export function InviteForm() {
  const [state, formAction, pending] = useActionState(createInvite, {});
  const [copied, setCopied] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-2">
        <span className="caption text-dark/56">Комментарий (необязательно)</span>
        <input
          name="label"
          type="text"
          maxLength={80}
          placeholder="Напр. Иван — новый автор"
          className="h-10 rounded-md border border-dark/12 bg-surface px-3 text-[15px] outline-none focus:border-dark"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-dark px-4 text-[15px] font-semibold text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
      >
        {pending ? "Генерируем…" : "Создать ссылку"}
      </button>

      {state.error && (
        <div className="rounded-md border border-negative/32 bg-negative-soft px-3 py-2">
          <p className="caption font-semibold text-negative">{state.error}</p>
        </div>
      )}

      {state.url && (
        <div className="flex flex-col gap-2 rounded-md border border-positive/32 bg-positive-soft p-3">
          <p className="caption font-semibold text-dark">Скопируй и отправь редактору (ссылка активна 7 дней):</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={state.url}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="h-10 flex-1 rounded-md border border-dark/12 bg-surface px-3 font-mono text-[13px] outline-none"
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(state.url!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  // ignore
                }
              }}
              className="h-10 rounded-md bg-dark px-3 text-[13px] font-semibold text-white transition-colors hover:bg-dark/90"
            >
              {copied ? "Скопировано ✓" : "Копировать"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
