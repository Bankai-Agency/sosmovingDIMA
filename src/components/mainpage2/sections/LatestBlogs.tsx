import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { getBlogPosts } from "@/lib/data/blog";

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
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 self-start md:self-end rounded-full bg-accent hover:bg-accent-hover text-accent-text px-6 py-3 font-medium text-base tracking-[-0.02em] transition-colors"
          >
            View all articles
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Container>

      {/* Horizontal scroll — larger cards, last one intentionally runs off-screen */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-8 pb-4 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex-shrink-0 w-[82vw] sm:w-[440px] md:w-[480px] lg:w-[520px] snap-start flex flex-col rounded-3xl bg-surface border border-white/5 overflow-hidden hover:border-white/15 transition-colors"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
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
            <div className="flex flex-col gap-4 p-7 sm:p-8 lg:p-10">
              {post.publishDate && (
                <span className="font-mono text-xs text-text-muted uppercase tracking-[0.08em]">
                  {post.publishDate}
                </span>
              )}
              <h3 className="text-2xl md:text-[1.75rem] font-semibold text-white leading-[1.2] tracking-[-0.02em] group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-text-muted group-hover:text-white transition-colors">
                Read article
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
