"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, FileText } from "lucide-react";
import { blogApi, projectsApi } from "@/lib/api/client";
import type { BlogPostListItem, Project } from "@/lib/api/types";
import { extractTextFromTipTap } from "@/lib/utils/tiptap";

export default function Home() {
  const [blogs, setBlogs] = useState<BlogPostListItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await blogApi.getAll();
        // Sort by createdAt desc and take latest 3
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBlogs(sorted.slice(0, 3));
      } catch (e) {
        setBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    }
    loadBlogs();
  }, []);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (e) {
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);
  const hasBlogs = useMemo(() => blogs.length > 0, [blogs]);

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-border animate-float">
            <Image
              src="/images/hero.jpg"
              alt="Luu Vi"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance tracking-tight">
              Luu Vi
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-mono">
              {">"} Software Developer
            </p>
          </div>

          <div className="max-w-2xl space-y-6">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              I'm <strong>Luu Vi</strong>, a Software Engineering student at
              Tampere University, focused on{" "}
              <strong>software development</strong> with a growing interest in{" "}
              <strong>Machine Learning</strong> and <strong>AI</strong>.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              This is where I store my projects and blog posts!
            </p>
            <p className="text-xl md:text-2xl font-semibold">
              Welcome to my website!
            </p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center"></div>

          <div className="flex gap-4 pt-4">
            <Link
              href="https://github.com/LuuVi2911"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 hover:scale-110 transition-all"
            >
              <Github className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/luuvi2911/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 hover:scale-110 transition-all"
            >
              <Linkedin className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="/resume"
              className="hover:opacity-70 hover:scale-110 transition-all"
            >
              <FileText className="w-6 h-6" />
              <span className="sr-only">Resume</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/40">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Luu Vi</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Hi, I'm <strong>Luu Vi</strong>, student of Software Engineering
              at Tampere University. I'm aiming to become a{" "}
              <strong>Fullstack Developer</strong>.
            </p>
          </div>

          {/* Focus Areas */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What I'm Currently Exploring
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-lg mb-2">
                  Software Engineering
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Designing and building modern full-stack applications with
                  clean architecture, scalability, and user experience in mind.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-lg mb-2">Machine Learning</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Learning the fundamentals of data-driven models and applying
                  machine learning concepts to real-world problems.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-lg mb-2">
                  Deep Learning & LLMs
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Exploring deep learning concepts and learning how to integrate{" "}
                  <strong>Large Language Model (LLM) APIs</strong> into
                  applications to build intelligent features.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-lg mb-2">
                  Computer Vision (Practical Focus)
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Experimenting with computer vision techniques and applying
                  them in practice, such as image processing and visual
                  understanding tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/40">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Recent Blogs</h2>
          <Button
            variant="ghost"
            className="font-mono"
            render={<Link href="/blog" />}
            nativeButton={false}
          >
            View all →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingBlogs &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="hover:border-primary transition-all bg-card/50 backdrop-blur"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          {!loadingBlogs &&
            hasBlogs &&
            blogs.map((post) => (
              <Card
                key={post.id}
                className="hover:border-primary transition-all hover:scale-[1.02] bg-card/50 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          {!loadingBlogs && !hasBlogs && (
            <p className="text-muted-foreground">No blog posts yet.</p>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/40">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
          <Button
            variant="ghost"
            className="font-mono"
            render={<Link href="/projects" />}
            nativeButton={false}
          >
            View all →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingProjects &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="hover:border-primary transition-all bg-card/50 backdrop-blur"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          {!loadingProjects &&
            hasProjects &&
            projects.map((project) => (
              <Card
                key={project.id}
                className="hover:border-primary transition-all hover:scale-[1.02] bg-card/50 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="aspect-video relative overflow-hidden bg-muted rounded-lg mb-4">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:underline"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {extractTextFromTipTap(project.description)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          {!loadingProjects && !hasProjects && (
            <p className="text-muted-foreground">No projects yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
