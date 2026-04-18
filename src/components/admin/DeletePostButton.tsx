"use client";

import { removePost } from "@/app/(admin)/admin/content/actions";

/**
 * Small client component around the delete server action so we can hook
 * `onSubmit` for a native confirm() dialog. Server components can't carry
 * event handlers, hence the separate client wrapper.
 */
export function DeletePostButton({ slug }: { slug: string }) {
  return (
    <form
      action={removePost}
      onSubmit={(e) => {
        if (!confirm("Удалить статью? Это действие необратимо.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="h-10 rounded-md border border-negative/32 bg-negative-soft px-4 text-[15px] font-semibold text-negative transition-colors hover:bg-negative hover:text-white"
      >
        Удалить
      </button>
    </form>
  );
}
