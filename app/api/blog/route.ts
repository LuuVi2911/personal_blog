import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createBlogSchema } from "@/lib/api/validators";
import { checkAdminAuth } from "@/lib/auth-utils";
import { z } from "zod";

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all published blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of published blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPostListItem'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        // Don't include content in list view
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *                 pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
 *               content:
 *                 type: object
 *                 description: TipTap JSON content
 *               excerpt:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               published:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Blog post with slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminEmail = await checkAdminAuth();
    if (!adminEmail) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    // Handle JSON body
    const body = await request.json();
    const data: z.infer<typeof createBlogSchema> = body;

    // Validate data
    const validatedData = createBlogSchema.parse(data);

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog post with this slug already exists" },
        { status: 409 }
      );
    }

    // Create blog post
    const blog = await prisma.blog.create({
      data: validatedData,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
