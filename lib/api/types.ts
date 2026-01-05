/**
 * Type definitions for API responses
 */

/**
 * TipTap JSON content type
 * Represents the structure of TipTap editor JSON output
 */
export interface TipTapContent {
  type: string;
  content?: TipTapNode[];
  [key: string]: unknown;
}

/**
 * Type guard to check if a value is TipTapContent
 */
export function isTipTapContent(value: unknown): value is TipTapContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof (value as TipTapContent).type === "string"
  );
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
  [key: string]: unknown;
}

export interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: TipTapContent;
  excerpt?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: TipTapContent;
  image?: string;
  github?: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectQueryParams {
  tags?: string; // Comma-separated tags
}

export interface BlogFilterParams {
  search?: string;
  tags?: string; // Comma-separated tags
}

export interface ProjectFilterParams {
  search?: string;
  tags?: string; // Comma-separated tags
}

export interface ApiError {
  error: string;
  details?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * DTO types for creating/updating resources
 */
export interface CreateBlogDto {
  title: string;
  slug: string;
  content: TipTapContent;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdateBlogDto {
  title?: string;
  slug?: string;
  content?: TipTapContent;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
}

export interface CreateProjectDto {
  title: string;
  description: TipTapContent;
  image?: string;
  github?: string;
  tags: string[];
  date: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: TipTapContent;
  image?: string;
  github?: string;
  tags?: string[];
  date?: string;
}

/**
 * Global type declaration for Prisma Json type
 * This augments Prisma's Json type to be TipTapContent
 */
declare global {
  namespace PrismaJson {
    type JsonValue = TipTapContent | TipTapContent[] | null;
  }
}
