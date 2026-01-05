import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Get resume URL
 *     tags: [Resume]
 *     responses:
 *       200:
 *         description: Resume URL returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: Cloudinary URL of the resume
 *       404:
 *         description: Resume not found
 */
export async function GET() {
  const resumeUrl = process.env.CLOUDINARY_RESUME_URL;

  if (!resumeUrl) {
    return NextResponse.json(
      { error: "Resume not available" },
      { status: 404 }
    );
  }

  return NextResponse.json({ url: resumeUrl }, { status: 200 });
}
