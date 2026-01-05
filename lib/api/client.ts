import type { BlogPost, BlogPostListItem, Project, ProjectQueryParams, BlogFilterParams, ProjectFilterParams, ApiError } from './types';

// Use relative URLs for same-origin requests (Next.js API routes)
// Next.js handles relative URLs correctly in both server and client components
const API_BASE_URL = '';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let error: ApiError;
      try {
        error = await response.json();
      } catch {
        error = { error: `HTTP error! status: ${response.status}` };
      }

      // Handle 404 specifically
      if (response.status === 404) {
        throw new Error(error.error || 'Resource not found');
      }

      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    // Re-throw if it's already an Error with a message
    if (err instanceof Error) {
      throw err;
    }
    // Otherwise wrap in a generic error
    throw new Error(`Failed to fetch from ${url}: ${String(err)}`);
  }
}

/**
 * Blog API functions
 */
export const blogApi = {
  /**
   * Get all published blog posts (list view, without content)
   */
  getAll: async (): Promise<BlogPostListItem[]> => {
    return fetchApi<BlogPostListItem[]>('/api/blog');
  },

  /**
   * Get a single blog post by slug (with full content)
   */
  getBySlug: async (slug: string): Promise<BlogPost> => {
    return fetchApi<BlogPost>(`/api/blog/${slug}`);
  },

  /**
   * Filter blog posts by search text and/or tags
   */
  filter: async (params: BlogFilterParams): Promise<BlogPostListItem[]> => {
    const searchParams = new URLSearchParams();

    if (params.search) {
      searchParams.append('search', params.search);
    }

    if (params.tags) {
      searchParams.append('tags', params.tags);
    }

    const queryString = searchParams.toString();
    const path = `/api/blog/filter${queryString ? `?${queryString}` : ''}`;

    return fetchApi<BlogPostListItem[]>(path);
  },

  /**
   * Get all available blog tags
   */
  getTags: async (): Promise<string[]> => {
    const result = await fetchApi<{ tags: string[] }>('/api/blog/tags');
    return result.tags;
  },
};

/**
 * Projects API functions
 */
export const projectsApi = {
  /**
   * Get all projects with optional filters
   */
  getAll: async (params?: ProjectQueryParams): Promise<Project[]> => {
    const searchParams = new URLSearchParams();

    if (params?.tags) {
      searchParams.append('tags', params.tags);
    }

    const queryString = searchParams.toString();
    const path = `/api/projects${queryString ? `?${queryString}` : ''}`;

    return fetchApi<Project[]>(path);
  },

  /**
   * Get a single project by ID
   */
  getById: async (id: string): Promise<Project> => {
    return fetchApi<Project>(`/api/projects/${id}`);
  },

  /**
   * Get projects by tags
   */
  getByTags: async (tags: string[]): Promise<Project[]> => {
    return projectsApi.getAll({ tags: tags.join(',') });
  },

  /**
   * Filter projects by search text and/or tags
   */
  filter: async (params: ProjectFilterParams): Promise<Project[]> => {
    const searchParams = new URLSearchParams();

    if (params.search) {
      searchParams.append('search', params.search);
    }

    if (params.tags) {
      searchParams.append('tags', params.tags);
    }

    const queryString = searchParams.toString();
    const path = `/api/projects/filter${queryString ? `?${queryString}` : ''}`;

    return fetchApi<Project[]>(path);
  },

  /**
   * Get all available project tags
   */
  getTags: async (): Promise<string[]> => {
    const result = await fetchApi<{ tags: string[] }>('/api/projects/tags');
    return result.tags;
  },
};

