import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@/generated/prisma";

/**
 * @swagger
 * /api/blog/filter:
 *   get:
 *     summary: Filter blogs by search text and/or tags
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search text to match against title and excerpt
 *       - in: query
 *         name: tags
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags (e.g., tag1,tag2,tag3)
 *     responses:
 *       200:
 *         description: Filtered list of published blog posts
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search")?.trim() || "";
    const tagsParam = searchParams.get("tags");

    // Build where conditions
    const whereConditions: Prisma.BlogWhereInput = {
      published: true,
    };

    // Add tag filter if provided
    if (tagsParam) {
      const tagsArray = tagsParam
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tagsArray.length > 0) {
        whereConditions.tags = {
          hasSome: tagsArray,
        };
      }
    }

    // Add search filter if provided
    if (searchQuery) {
      whereConditions.OR = [
        {
          title: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ];
    }

    // Find blogs matching the filters
    const blogs = await prisma.blog.findMany({
      where: whereConditions,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error filtering blogs:", error);
    return NextResponse.json(
      { error: "Failed to filter blogs" },
      { status: 500 }
    );
  }
}

