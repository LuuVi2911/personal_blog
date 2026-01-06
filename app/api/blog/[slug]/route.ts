import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { updateBlogSchema } from "@/lib/api/validators";
import { checkAdminAuth } from "@/lib/auth-utils";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * @swagger
 * /api/blog/{slug}:
 *   get:
 *     summary: Get a single blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found
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
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Check if user is admin - admins can see unpublished blogs
    const isAdmin = await checkAdminAuth();

    const blog = await prisma.blog.findUnique({
      where: {
        slug,
        ...(isAdmin ? {} : { published: true }), // Admin can see all, public only sees published
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/blog/{slug}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blog]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       200:
 *         description: Blog post updated successfully
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
 *       404:
 *         description: Blog post not found
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
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const adminEmail = await checkAdminAuth();
    if (!adminEmail) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { slug } = await params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Handle JSON body
    const body = await request.json();
    const updateData: Partial<z.infer<typeof updateBlogSchema>> = body;

    // Validate data
    const validatedData = updateBlogSchema.parse(updateData);

    // Check if new slug conflicts with existing blog
    if (validatedData.slug && validatedData.slug !== slug) {
      const slugConflict = await prisma.blog.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "Blog post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Transform validated data to Prisma-compatible format
    const prismaUpdateData: Prisma.BlogUpdateInput = {
      ...validatedData,
      content: validatedData.content
        ? (validatedData.content as Prisma.InputJsonValue)
        : undefined,
    };

    // Update blog post
    const blog = await prisma.blog.update({
      where: { slug },
      data: prismaUpdateData,
    });

    return NextResponse.json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}
