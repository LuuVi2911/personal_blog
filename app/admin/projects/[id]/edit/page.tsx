"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import type { Project } from "@/lib/api/types";
import {
  EditorWithToggle,
  type JSONContent,
} from "@/components/ui/editor-with-toggle";

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<JSONContent | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);
        setDescription(data.description || null);
        setImageUrl(data.image || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
      );
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/projects/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      setImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate description exists
    if (
      !description ||
      !description.content ||
      description.content.length === 0
    ) {
      toast.error("Description is required");
      setError("Description is required");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: description,
      image: imageUrl || undefined,
      github: (formData.get("github") as string) || undefined,
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: formData.get("date") as string,
    };

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      const updatedProject = await response.json();
      toast.success("Project updated successfully!");
      setProject(updatedProject);
      setDescription(updatedProject.description || null);
      setImageUrl(updatedProject.image || null);
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      toast.success("Project deleted successfully!");
      router.push("/admin/projects");
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

  if (error || !project) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">
            {error || "Project not found"}
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/admin/projects"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to projects list
          </Link>
        </div>
      </div>
    );
  }

  // Format date for input field (YYYY-MM-DD)
  const dateValue = new Date(project.date).toISOString().split("T")[0];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update project: {project.title}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/projects"
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
                defaultValue={project.title}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <EditorWithToggle
                content={description}
                onChange={setDescription}
                placeholder="Describe your project..."
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Project Image
              </label>
              <div className="mt-1 space-y-4">
                {imageUrl && (
                  <div className="relative inline-block">
                    <Image
                      src={imageUrl}
                      alt="Project preview"
                      width={200}
                      height={150}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  {isUploadingImage && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, GIF, or WebP. Max 10MB.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="github"
                className="block text-sm font-medium text-gray-700"
              >
                GitHub URL
              </label>
              <input
                type="url"
                name="github"
                id="github"
                defaultValue={project.github || ""}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags (comma-separated) *
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                required
                defaultValue={project.tags.join(", ")}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="react, nextjs, typescript"
              />
              <p className="mt-2 text-sm text-gray-500">
                At least one tag is required
              </p>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date *
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                defaultValue={dateValue}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Project"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || isUploadingImage}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <Link
              href="/admin/projects"
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
