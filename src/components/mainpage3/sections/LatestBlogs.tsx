import { getBlogPosts } from "@/lib/data/blog";
import { Eyebrow } from "../ui/Eyebrow";

export function LatestBlogs() {
  const { posts } = getBlogPosts({ limit: 4 });
  return (
    <section
      className="m3-section"
      id="blog"
      style={{ borderTop: "1px solid var(--m3-border)" }}
    >
      <div className="m3-container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <div>
            <Eyebrow num="09" total="09">From the blog</Eyebrow>
            <h2 className="m3-text-h2" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
              Moving guides &amp;{" "}
              <span style={{ color: "var(--m3-accent)" }}>industry updates</span>.
            </h2>
          </div>
          <a href="/blog" className="m3-btn m3-btn--ghost">
            <span>View all articles</span>
            <span className="m3-btn-arrow">↗</span>
          </a>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--m3-border)",
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
        >
          {posts.map((p, i) => (
            <a
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(60px, 0.1fr) minmax(120px, 0.4fr) minmax(0, 1.5fr) minmax(0, 1fr) auto",
                gap: "2rem",
                alignItems: "center",
                padding: "1.5rem 0",
                borderBottom: "1px solid var(--m3-border)",
                transition: "background 0.2s ease",
              }}
            >
              <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                style={{
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  borderRadius: 4,
                  background: "var(--m3-surface)",
                }}
              >
                {p.featuredImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.featuredImage}
                    alt=""
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              <h3 className="m3-text-h3">{p.title}</h3>
              <span className="m3-text-mono-sm">
                {p.publishDate
                  ? new Date(p.publishDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </span>
              <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)" }}>
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
