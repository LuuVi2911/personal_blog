import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@/generated/prisma";

/**
 * @swagger
 * /api/projects/filter:
 *   get:
 *     summary: Filter projects by search text and/or tags
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search text to match against title
 *       - in: query
 *         name: tags
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags (e.g., tag1,tag2,tag3)
 *     responses:
 *       200:
 *         description: Filtered list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
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
    const whereConditions: Prisma.ProjectWhereInput = {};

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

    // Add search filter if provided (search by title)
    if (searchQuery) {
      whereConditions.title = {
        contains: searchQuery,
        mode: "insensitive",
      };
    }

    // Find projects matching the filters
    const projects = await prisma.project.findMany({
      where: whereConditions,
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error filtering projects:", error);
    return NextResponse.json(
      { error: "Failed to filter projects" },
      { status: 500 }
    );
  }
}

