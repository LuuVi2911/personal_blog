import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderTipTapToHtml } from "@/lib/utils/tiptap";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Individual blog post page
 * This is a Server Component that fetches data directly from the database
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blog.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    notFound();
  }

  const htmlContent = renderTipTapToHtml(post.content);

  return (
    <div className="min-h-screen bg-background font-mono relative">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/blog"
          className="text-primary hover:underline mb-6 inline-flex items-center gap-2"
        >
          ← Back
        </Link>

        <article className="space-y-8 mt-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <Button variant="outline" size="sm">
              SHARE
            </Button>
          </div>

          <div className="space-y-4">
            <Badge variant="secondary" className="uppercase tracking-wide">
              {post.tags?.[0] ?? "Writing"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/60 p-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-border/60">
              <Image
                src="/images/hero.jpg"
                alt="Author"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Author
              </p>
              <p className="font-semibold">Luu Vi</p>
              <p className="text-xs text-muted-foreground">
                Author & Developer
              </p>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-foreground
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground
              [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
              [&_li]:text-foreground [&_li]:my-1
              [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
              [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4
              [&_strong]:font-bold [&_strong]:text-foreground
              [&_em]:italic [&_em]:text-foreground
              [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-foreground"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </div>
  );
}
