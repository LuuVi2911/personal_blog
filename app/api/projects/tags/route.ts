import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

/**
 * @swagger
 * /api/projects/tags:
 *   get:
 *     summary: Get all unique tags from all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of unique tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        tags: true,
      },
    });

    // Extract all tags and get unique values
    const allTags = projects.flatMap((project) => project.tags);
    const uniqueTags = Array.from(new Set(allTags)).sort();

    return NextResponse.json({ tags: uniqueTags });
  } catch (error) {
    console.error("Error fetching project tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch project tags" },
      { status: 500 }
    );
  }
}

