import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderTipTapToHtml } from "@/lib/utils/tiptap";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Individual project page
 * This is a Server Component that fetches data directly from the database
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-mono relative">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link
          href="/projects"
          className="text-primary hover:underline mb-6 inline-flex items-center gap-2"
        >
          ← Back to Projects
        </Link>

        <article className="space-y-8 mt-6">
          {project.image && (
            <div className="relative w-full aspect-16/7 overflow-hidden rounded-xl border border-border/60 bg-muted">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-muted-foreground">
              {new Date(project.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex gap-2">
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    Source Code
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {project.title}
            </h1>
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
              dangerouslySetInnerHTML={{
                __html: renderTipTapToHtml(project.description),
              }}
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge
                  key={tag + "-tech"}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
