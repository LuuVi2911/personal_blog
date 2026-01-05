import type {
  BlogPost,
  Project,
  ApiError,
  CreateBlogDto,
  UpdateBlogDto,
  CreateProjectDto,
  UpdateProjectDto,
} from "./types";

// Use relative URLs for same-origin requests (Next.js API routes)
const API_BASE_URL = "";

/**
 * Generic fetch wrapper for admin API calls with authentication
 * Automatically includes credentials (cookies) for NextAuth session
 */
async function fetchAdminApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Include cookies for NextAuth session
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`,
    }));

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        error.error || "Unauthorized: Admin access required"
      );
    }

    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Admin Blog API functions
 */
export const adminBlogApi = {
  /**
   * Get all blog posts (including unpublished)
   */
  getAll: async (): Promise<BlogPost[]> => {
    return fetchAdminApi<BlogPost[]>("/api/blog");
  },

  /**
   * Get a single blog post by slug
   */
  getBySlug: async (slug: string): Promise<BlogPost> => {
    return fetchAdminApi<BlogPost>(`/api/blog/${slug}`);
  },

  /**
   * Create a new blog post
   */
  create: async (data: CreateBlogDto): Promise<BlogPost> => {
    return fetchAdminApi<BlogPost>("/api/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a blog post
   */
  update: async (slug: string, data: UpdateBlogDto): Promise<BlogPost> => {
    return fetchAdminApi<BlogPost>(`/api/blog/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a blog post (if DELETE endpoint exists)
   */
  delete: async (slug: string): Promise<void> => {
    await fetchAdminApi(`/api/blog/${slug}`, {
      method: "DELETE",
    });
  },
};

/**
 * Admin Projects API functions
 */
export const adminProjectsApi = {
  /**
   * Get all projects
   */
  getAll: async (): Promise<Project[]> => {
    return fetchAdminApi<Project[]>("/api/projects");
  },

  /**
   * Get a single project by ID
   */
  getById: async (id: string): Promise<Project> => {
    return fetchAdminApi<Project>(`/api/projects/${id}`);
  },

  /**
   * Create a new project
   */
  create: async (data: CreateProjectDto): Promise<Project> => {
    return fetchAdminApi<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a project
   */
  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    return fetchAdminApi<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a project
   */
  delete: async (id: string): Promise<void> => {
    await fetchAdminApi(`/api/projects/${id}`, {
      method: "DELETE",
    });
  },
};

