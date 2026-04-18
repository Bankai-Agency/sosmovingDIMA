"use client";

import { useActionState } from "react";
import {
  deleteUserAction,
  resetPasswordAction,
} from "@/app/(admin)/admin/users/actions";

type Props = {
  id: string;
  isSelf: boolean;
  isOwner: boolean;
};

/**
 * Per-row actions in the users table: reset password + delete. Split out
 * into a client component so we can use useActionState for the reset
 * (which returns a one-shot temporary password to display) and a confirm()
 * dialog on delete.
 */
export function UserRowActions({ id, isSelf, isOwner }: Props) {
  const [resetState, resetAction, resetPending] = useActionState(resetPasswordAction, {});

  // Owner cannot be deleted, and you can't delete yourself. Either disables the delete button.
  const deleteDisabled = isSelf || isOwner;

  return (
    <div className="flex items-center justify-end gap-2">
      <form action={resetAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={resetPending}
          className="caption rounded-md border border-dark/12 px-3 py-1.5 text-dark/56 transition-colors hover:border-dark/32 hover:text-dark disabled:opacity-50"
        >
          {resetPending ? "…" : "Сбросить пароль"}
        </button>
      </form>

      {resetState.ok && (
        <span className="caption max-w-[220px] rounded-md bg-warning-soft px-2 py-1 font-mono text-dark">
          {resetState.ok}
        </span>
      )}
      {resetState.error && (
        <span className="caption rounded-md bg-negative-soft px-2 py-1 text-negative">
          {resetState.error}
        </span>
      )}

      <form
        action={deleteUserAction}
        onSubmit={(e) => {
          if (!confirm("Удалить пользователя? Это действие необратимо.")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={deleteDisabled}
          title={isSelf ? "Нельзя удалить самого себя" : isOwner ? "Нельзя удалить владельца" : ""}
          className="caption rounded-md border border-negative/32 bg-negative-soft px-3 py-1.5 font-semibold text-negative transition-colors hover:bg-negative hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Удалить
        </button>
      </form>
    </div>
  );
}
