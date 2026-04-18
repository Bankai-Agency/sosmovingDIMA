"use client";

import { useEffect, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

type Props = {
  initialMarkdown: string;
  /**
   * The editor is uncontrolled internally. When the user submits the form,
   * this ref-like prop is asked for the current Markdown via a named
   * hidden input — we sync on every block change. Unused when editable=false.
   */
  hiddenInputName?: string;
  /** When false, renders the editor in read-only mode (preview). */
  editable?: boolean;
};

/**
 * Notion-like block editor (BlockNote) with Markdown I/O.
 *
 * Flow:
 *   - On mount: parse the incoming Markdown into BlockNote blocks and replace
 *     the editor's document. BlockNote's `tryParseMarkdownToBlocks` is
 *     intentionally lossy for complex MD (callouts, nested tables, etc.) —
 *     we accept that for the MVP; round-tripping covers 95% of our existing
 *     posts which are plain prose + headings + lists.
 *   - On every doc change: serialize back to Markdown and stuff it into a
 *     hidden `<input>` so the parent <form> submits the current content.
 */
/**
 * BlockNote upload handler — BlockNote passes a File, we return the
 * public URL. Errors bubble up to BlockNote which shows its built-in
 * "upload failed" indicator.
 */
async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(error ?? `Upload failed (${res.status})`);
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}

export function Editor({ initialMarkdown, hiddenInputName, editable = true }: Props) {
  const editor: BlockNoteEditor = useCreateBlockNote({ uploadFile });
  const [serialized, setSerialized] = useState<string>(initialMarkdown);
  const [ready, setReady] = useState(false);

  // Import markdown once on mount.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const blocks = await editor.tryParseMarkdownToBlocks(initialMarkdown || " ");
        if (!mounted) return;
        editor.replaceBlocks(editor.document, blocks);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // Serialize on every change.
  useEffect(() => {
    if (!ready) return;
    const unsub = editor.onChange(async () => {
      try {
        const md = await editor.blocksToMarkdownLossy(editor.document);
        setSerialized(md);
      } catch {
        // swallow — we keep the last good value
      }
    });
    return () => {
      unsub?.();
    };
  }, [editor, ready]);

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-surface">
        <BlockNoteView editor={editor} theme="light" editable={editable} />
      </div>
      {/* Hidden — form submit carries the Markdown. Only needed when editable. */}
      {editable && hiddenInputName ? (
        <input type="hidden" name={hiddenInputName} value={serialized} readOnly />
      ) : null}
    </>
  );
}
