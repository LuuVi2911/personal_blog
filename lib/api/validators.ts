import { z } from "zod";

/**
 * TipTap JSON content schema
 * This validates the structure of TipTap editor JSON output
 */
const tiptapContentSchema = z.object({
  type: z.string(),
  content: z.array(z.any()).optional(),
}).passthrough();

/**
 * Blog validation schemas
 */
export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  content: tiptapContentSchema,
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    )
    .optional(),
  content: tiptapContentSchema.optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export type CreateBlogDto = z.infer<typeof createBlogSchema>;
export type UpdateBlogDto = z.infer<typeof updateBlogSchema>;

/**
 * Project validation schemas
 */
const optionalUrlSchema = z.union([z.string().url(), z.literal("")]).optional();

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: tiptapContentSchema,
  image: optionalUrlSchema,
  github: optionalUrlSchema,
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, "Date must be in YYYY-MM-DD format")
    .or(z.string().datetime()),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: tiptapContentSchema.optional(),
  image: optionalUrlSchema,
  github: optionalUrlSchema,
  tags: z.array(z.string()).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, "Date must be in YYYY-MM-DD format")
    .or(z.string().datetime())
    .optional(),
});

export const projectQuerySchema = z.object({
  tags: z.string().optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type ProjectQueryDto = z.infer<typeof projectQuerySchema>;
