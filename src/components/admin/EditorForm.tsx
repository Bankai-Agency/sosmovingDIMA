"use client";

import { useActionState } from "react";
import { Editor } from "./Editor";
import { savePost } from "@/app/(admin)/admin/content/actions";
import type { PostFrontmatter } from "@/lib/admin/content-store";

type Props = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

/**
 * Wraps the BlockNote editor + sidebar with frontmatter fields.
 * Uses a single server action `savePost` for the main save; publish /
 * unpublish / delete live in their own small forms in the header.
 */
export function EditorForm({ slug, frontmatter, content }: Props) {
  const [state, formAction, pending] = useActionState(savePost, {});

  const publishAtLocal = frontmatter.publishAt
    ? // <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" without tz.
      new Date(frontmatter.publishAt).toISOString().slice(0, 16)
    : "";

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Left — title + editor */}
      <div className="flex min-w-0 flex-col gap-4">
        <input
          name="title"
          defaultValue={frontmatter.title ?? ""}
          placeholder="Заголовок статьи"
          required
          className="h2 w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-dark outline-none transition-colors hover:border-dark/6 focus:border-dark/12 focus:bg-surface"
        />
        <input type="hidden" name="slug" value={slug} />
        <Editor initialMarkdown={content} hiddenInputName="content" />
      </div>

      {/* Right — frontmatter sidebar */}
      <aside className="flex flex-col gap-4">
        <div className="rounded-xl bg-surface p-5">
          <h3 className="h6 mb-4 text-dark">Публикация</h3>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 rounded-md border border-dark/12 px-3 py-3">
              <input
                type="checkbox"
                name="draft"
                defaultChecked={frontmatter.draft === true && !frontmatter.publishAt}
                className="h-4 w-4"
              />
              <span className="p2 text-dark">Оставить как черновик</span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="caption text-dark/56">Запланировать публикацию</span>
              <input
                type="datetime-local"
                name="publishAt"
                defaultValue={publishAtLocal}
                className="h-11 rounded-md border border-dark/12 bg-surface px-3 text-[15px] outline-none focus:border-dark"
              />
              <span className="caption text-dark/32">
                Если задано, пост станет публичным в указанное время (±5 мин, cron).
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 h-11 w-full rounded-md bg-dark px-4 text-[15px] font-semibold text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
          >
            {pending ? "Сохраняем…" : "Сохранить"}
          </button>

          {state.ok && <p className="caption mt-3 text-positive">Сохранено ✓</p>}
          {state.error && (
            <div className="mt-3 rounded-md border border-negative/32 bg-negative-soft px-3 py-2">
              <p className="caption font-semibold text-negative">{state.error}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-surface p-5">
          <h3 className="h6 mb-4 text-dark">SEO & Meta</h3>
          <div className="flex flex-col gap-4">
            <TextField name="metaDescription" label="Meta description" defaultValue={frontmatter.metaDescription ?? ""} multiline />
            <TextField name="category" label="Категория" defaultValue={frontmatter.category ?? ""} />
            <TextField name="featuredImage" label="Главное изображение (URL)" defaultValue={frontmatter.featuredImage ?? ""} />
          </div>
        </div>

        <div className="rounded-xl bg-surface p-5">
          <h3 className="h6 mb-2 text-dark">Технические данные</h3>
          <dl className="flex flex-col gap-2 caption">
            <div className="flex justify-between">
              <dt className="text-dark/56">slug</dt>
              <dd className="font-mono text-dark">{slug}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dark/56">Создано</dt>
              <dd className="text-dark">{frontmatter.publishDate || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dark/56">Обновлено</dt>
              <dd className="text-dark">{frontmatter.lastUpdated || "—"}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </form>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  multiline,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  multiline?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="caption text-dark/56">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className="resize-y rounded-md border border-dark/12 bg-surface px-3 py-2 text-[15px] outline-none focus:border-dark"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className="h-11 rounded-md border border-dark/12 bg-surface px-3 text-[15px] outline-none focus:border-dark"
        />
      )}
    </label>
  );
}
