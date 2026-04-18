import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EditorForm } from "@/components/admin/EditorForm";
import { readPost, isPublic } from "@/lib/admin/content-store";
import { publishNow, unpublish, removePost } from "../actions";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await readPost(slug);
  return { title: post ? `Редактор · ${post.frontmatter.title}` : "Редактор" };
}

export default async function EditPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  const status: "published" | "draft" | "scheduled" = fm.draft
    ? fm.publishAt && new Date(fm.publishAt) > new Date()
      ? "scheduled"
      : "draft"
    : "published";
  const publiclyVisible = isPublic(fm);

  return (
    <AdminShell>
      <TopBar
        title={fm.title || slug}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <Link
              href="/admin/content"
              className="caption rounded-md border border-dark/12 px-3 py-2 text-dark hover:bg-dark/6"
            >
              ← К списку
            </Link>
            {publiclyVisible && (
              <Link
                href={`/blog/${slug}`}
                target="_blank"
                className="caption rounded-md border border-dark/12 px-3 py-2 text-dark hover:bg-dark/6"
              >
                Открыть на сайте ↗
              </Link>
            )}
            {status !== "published" && (
              <form action={publishNow}>
                <input type="hidden" name="slug" value={slug} />
                <button
                  type="submit"
                  className="h-10 rounded-md bg-positive px-4 text-[15px] font-semibold text-white transition-colors hover:brightness-95"
                >
                  Опубликовать сейчас
                </button>
              </form>
            )}
            {status === "published" && (
              <form action={unpublish}>
                <input type="hidden" name="slug" value={slug} />
                <button
                  type="submit"
                  className="h-10 rounded-md border border-dark/12 bg-surface px-4 text-[15px] font-semibold text-dark transition-colors hover:bg-dark/6"
                >
                  Снять с публикации
                </button>
              </form>
            )}
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
          </div>
        }
      />
      <div className="flex-1 p-6">
        <EditorForm slug={slug} frontmatter={fm} content={post.content} />
      </div>
    </AdminShell>
  );
}
