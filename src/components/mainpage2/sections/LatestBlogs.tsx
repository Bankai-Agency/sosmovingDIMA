import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";
import { getBlogPosts } from "@/lib/data/blog";

function formatDate(raw: string) {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function LatestBlogs() {
  const { posts } = getBlogPosts({ limit: 6 });

  if (!posts.length) return null;

  return (
    <section id="blog" className="py-20 md:py-28 overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <SectionLabel>Latest articles</SectionLabel>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]"
            >
              From the blog
            </RevealText>
          </div>
          <div className="self-start md:self-end">
            <Button href="/blog">View all articles</Button>
          </div>
        </div>
      </Container>

      {/* Horizontal scroll — with left/right edge fade (mirrors Reviews vertical fade) */}
      <div
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-8 pb-4 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 94%, transparent 100%)",
        }}
      >
        {posts.map((post) => {
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex-shrink-0 w-[82vw] sm:w-[440px] md:w-[480px] lg:w-[520px] snap-start flex flex-col rounded-3xl bg-white/[0.06] hover:bg-white/[0.1] transition-colors overflow-hidden"
            >
              <div className="flex flex-col gap-5 p-5 sm:p-6">
                {/* Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black">
                  {post.featuredImage && (
                    <Image
                      src={post.featuredImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 480px, 520px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-[1.75rem] font-semibold text-white leading-[1.15] tracking-[-0.02em] line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Bottom row */}
                <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                  <span className="inline-flex items-center gap-4 h-14 px-8 rounded-full bg-white/10 group-hover:bg-accent group-hover:text-accent-text text-white text-base font-semibold tracking-[-0.02em] transition-colors">
                    Read more
                    <ArrowIcon />
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon />
                        {post.readTime}
                      </span>
                    )}
                    {post.publishDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon />
                        {formatDate(post.publishDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
