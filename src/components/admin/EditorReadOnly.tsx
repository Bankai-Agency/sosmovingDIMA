"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper — BlockNote touches window at module load, so we
 * defer the import until the browser. Next 16 only accepts `ssr: false`
 * inside a "use client" module, which is why this tiny wrapper exists.
 */
const Editor = dynamic(() => import("./Editor").then((m) => m.Editor), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-xl bg-surface">
      <span className="caption text-dark/56">Загружаем превью…</span>
    </div>
  ),
});

export function EditorReadOnly({ initialMarkdown }: { initialMarkdown: string }) {
  return <Editor initialMarkdown={initialMarkdown} editable={false} />;
}
