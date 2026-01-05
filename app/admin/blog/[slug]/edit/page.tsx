"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/api/types";
import {
  EditorWithToggle,
  type JSONContent,
} from "@/components/ui/editor-with-toggle";

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<JSONContent | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error("Blog post not found");
        }
        const data = await response.json();
        setBlog(data);
        // Content is now stored as TipTap JSON
        setContent(data.content || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog post"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Validate content exists
    if (!content || !content.content || content.content.length === 0) {
      toast.error("Content is required");
      setError("Content is required");
      setIsSubmitting(false);
      return;
    }

    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: content,
      excerpt: (formData.get("excerpt") as string) || undefined,
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      published: formData.get("published") === "on",
    };

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update blog post");
      }

      const updatedBlog = await response.json();
      toast.success("Blog post updated successfully!");
      // If slug changed, redirect to new slug
      if (updatedBlog.slug !== slug) {
        router.push(`/admin/blog/${updatedBlog.slug}/edit`);
      } else {
        router.refresh();
        setBlog(updatedBlog);
        setContent(updatedBlog.content || null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">
            {error || "Blog post not found"}
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/admin/blog"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to blog list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Blog Post
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Update blog post: {blog.title}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/blog"
            className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back to List
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div className="space-y-6 bg-white shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={blog.title}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                defaultValue={blog.slug}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">
                Lowercase alphanumeric with hyphens (e.g., my-blog-post)
              </p>
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700"
              >
                Excerpt
              </label>
              <textarea
                name="excerpt"
                id="excerpt"
                rows={3}
                defaultValue={blog.excerpt || ""}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <EditorWithToggle
                content={content}
                onChange={setContent}
                placeholder="Start writing your blog post..."
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                defaultValue={blog.tags?.join(", ") || ""}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="react, nextjs, typescript"
              />
            </div>

            <div className="flex items-center">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked={blog.published}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="published"
                className="ml-2 block text-sm text-gray-900"
              >
                Published
              </label>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Blog Post"}
            </button>
            <Link
              href="/admin/blog"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
