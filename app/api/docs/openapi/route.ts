import { NextResponse } from "next/server";
import { swaggerSpec } from "@/lib/swagger/config";

/**
 * GET /api/docs/openapi
 * Returns the OpenAPI specification in JSON format
 */
export async function GET() {
  return NextResponse.json(swaggerSpec);
}

