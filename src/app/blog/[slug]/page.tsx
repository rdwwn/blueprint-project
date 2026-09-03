import { notFound } from "next/navigation";
import { POSTS, BlogPostContent } from "./post-content";

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return {
    title: `${post.title} | Blueprint Project`,
    description: post.content[0],
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!POSTS[slug]) notFound();
  return <BlogPostContent slug={slug} />;
}
