"use client";

import { revokeInviteAction } from "@/app/(admin)/admin/users/actions";

export function RevokeInviteButton({ id }: { id: string }) {
  return (
    <form
      action={revokeInviteAction}
      onSubmit={(e) => {
        if (!confirm("Отозвать приглашение? Ссылка перестанет работать.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="caption rounded-md border border-dark/12 px-3 py-1.5 text-dark/56 transition-colors hover:border-negative/32 hover:bg-negative-soft hover:text-negative"
      >
        Отозвать
      </button>
    </form>
  );
}
