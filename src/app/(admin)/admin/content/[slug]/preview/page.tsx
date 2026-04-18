import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { TopBar } from "@/components/admin/TopBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EditorReadOnly } from "@/components/admin/EditorReadOnly";
import { readPost } from "@/lib/admin/content-store";

/*
 * Why the EditorReadOnly wrapper:
 *   We can't truly preview against the production /blog/[slug] layout —
 *   that route still renders from Webflow-extracted HTML in public/pages/
 *   (see COMPONENTS-AND-PAGES.md). Our admin edits .md files; those are
 *   consumed by /category/[slug] listings and the sitemap, but NOT by the
 *   article page. Until the blog article template is migrated to React,
 *   the closest-to-reality preview is the Markdown rendered by the same
 *   BlockNote view the editor uses, in read-only mode.
 *
 *   BlockNote needs `window`, so EditorReadOnly is a client component that
 *   uses `dynamic({ ssr: false })` internally. Next 16 requires ssr:false
 *   to live in a "use client" module, hence the separate wrapper.
 */

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await readPost(slug);
  return { title: post ? `Превью · ${post.frontmatter.title}` : "Превью" };
}

export default async function PreviewPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  const status: "published" | "draft" | "scheduled" = fm.draft
    ? fm.publishAt && new Date(fm.publishAt) > new Date()
      ? "scheduled"
      : "draft"
    : "published";

  return (
    <AdminShell>
      <TopBar
        title={`Превью · ${fm.title || slug}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <Link
              href={`/admin/content/${slug}`}
              className="caption rounded-md border border-dark/12 px-3 py-2 text-dark hover:bg-dark/6"
            >
              ← Редактор
            </Link>
          </div>
        }
      />
      <div className="flex-1 p-6">
        <article className="mx-auto max-w-[720px]">
          {fm.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fm.featuredImage}
              alt=""
              className="mb-6 w-full rounded-xl object-cover"
              style={{ aspectRatio: "16/9" }}
            />
          )}
          <h1 className="h2 mb-3 text-dark">{fm.title}</h1>
          <div className="caption mb-8 flex items-center gap-3 text-dark/56">
            <span>{fm.publishDate || "—"}</span>
            {fm.category && (
              <>
                <span>·</span>
                <span>{fm.category}</span>
              </>
            )}
          </div>
          <EditorReadOnly initialMarkdown={post.content} />
        </article>
      </div>
    </AdminShell>
  );
}
