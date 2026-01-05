import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { createProjectSchema, projectQuerySchema } from '@/lib/api/validators';
import { checkAdminAuth } from '@/lib/auth-utils';
import { z } from 'zod';

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects with optional filters
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags (e.g., react,nextjs)
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid query parameters
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = {
      tags: searchParams.get('tags') || undefined,
    };

    // Validate query params
    const validatedQuery = projectQuerySchema.parse(query);

    // Build where clause
    const where: Record<string, unknown> = {};

    if (validatedQuery.tags) {
      const tagsArray = validatedQuery.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      if (tagsArray.length > 0) {
        where.tags = {
          hasSome: tagsArray,
        };
      }
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
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
 *               - description
 *               - tags
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               github:
 *                 type: string
 *                 format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
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

    const body = await request.json();

    // Validate data
    const validatedData = createProjectSchema.parse({
      ...body,
      date: body.date ? new Date(body.date).toISOString() : undefined,
    });

    // Create project
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

