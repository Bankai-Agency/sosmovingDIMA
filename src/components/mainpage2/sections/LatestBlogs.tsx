import { getBlogPosts } from "@/lib/data/blog";
import { LatestBlogsClient } from "./LatestBlogsClient";

export function LatestBlogs() {
  const { posts } = getBlogPosts({ limit: 6 });
  if (!posts.length) return null;
  return <LatestBlogsClient posts={posts} />;
}
