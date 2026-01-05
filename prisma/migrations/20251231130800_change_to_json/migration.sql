/*
  Warnings:

  - Changed the type of `content` on the `blogs` table from TEXT to JSON.
  - Changed the type of `description` on the `projects` table from TEXT to JSON.

  This migration converts existing text content to TipTap JSON format.
*/

-- AlterTable: blogs - Convert text content to TipTap JSON format
-- First, add a temporary column for the new JSON content
ALTER TABLE "blogs" ADD COLUMN "content_json" JSON;

-- Convert existing text content to TipTap JSON format
-- This creates a basic TipTap document with a single paragraph containing the text
UPDATE "blogs" SET "content_json" = jsonb_build_object(
  'type', 'doc',
  'content', jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content', jsonb_build_array(
        jsonb_build_object('type', 'text', 'text', COALESCE("content", ''))
      )
    )
  )
);

-- Drop the old column and rename the new one
ALTER TABLE "blogs" DROP COLUMN "content";
ALTER TABLE "blogs" RENAME COLUMN "content_json" TO "content";
ALTER TABLE "blogs" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable: projects - Convert text description to TipTap JSON format
-- First, add a temporary column for the new JSON description
ALTER TABLE "projects" ADD COLUMN "description_json" JSON;

-- Convert existing text description to TipTap JSON format
UPDATE "projects" SET "description_json" = jsonb_build_object(
  'type', 'doc',
  'content', jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content', jsonb_build_array(
        jsonb_build_object('type', 'text', 'text', COALESCE("description", ''))
      )
    )
  )
);

-- Drop the old column and rename the new one
ALTER TABLE "projects" DROP COLUMN "description";
ALTER TABLE "projects" RENAME COLUMN "description_json" TO "description";
ALTER TABLE "projects" ALTER COLUMN "description" SET NOT NULL;
