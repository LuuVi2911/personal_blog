'use client';

import { useEffect, useState } from 'react';
import { blogApi, projectsApi } from './client';
import type { BlogPost, BlogPostListItem, Project, ProjectQueryParams } from './types';

/**
 * Hook to fetch all blog posts (list view)
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await blogApi.getAll();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blog posts'));
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await blogApi.getBySlug(slug);
        setPost(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blog post'));
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
}

/**
 * Hook to fetch all projects
 */
export function useProjects(params?: ProjectQueryParams) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await projectsApi.getAll(params);
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [params?.tags]);

  return { projects, loading, error };
}

/**
 * Hook to fetch a single project by ID
 */
export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const data = await projectsApi.getById(id);
        setProject(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch project'));
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id]);

  return { project, loading, error };
}

