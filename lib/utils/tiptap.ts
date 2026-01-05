import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import type { JSONContent } from "@tiptap/react";
import type { TipTapContent, TipTapNode } from "@/lib/api/types";

// Extensions used to generate HTML from TipTap JSON
const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  ImageExtension.configure({
    inline: true,
  }),
  LinkExtension.configure({
    openOnClick: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

/**
 * Convert TipTap JSON content to HTML
 */
export function renderTipTapToHtml(content: TipTapContent | null | unknown): string {
  if (!content || typeof content !== "object" || !("type" in content)) {
    return "";
  }

  try {
    const html = generateHTML(content as JSONContent, extensions);

    // Ensure we have valid HTML
    if (!html || html.trim() === "") {
      return "";
    }

    return html;
  } catch (error) {
    console.error("Error generating HTML from TipTap JSON:", error);
    console.error("Content:", JSON.stringify(content, null, 2));
    return "";
  }
}

/**
 * Extract plain text from TipTap JSON content
 * Useful for displaying in cards, lists, and search
 */
export function extractTextFromTipTap(content: TipTapContent | null | unknown): string {
  if (!content || typeof content !== "object" || !("type" in content)) {
    // If it's already a string (legacy data), return it
    if (typeof content === "string") {
      return content;
    }
    return "";
  }

  const tipTapContent = content as TipTapContent;

  function extractText(node: TipTapNode): string {
    if (node.text) {
      return node.text;
    }

    if (node.content) {
      return node.content.map(extractText).join(" ");
    }

    return "";
  }

  if (tipTapContent.content) {
    return tipTapContent.content.map(extractText).join(" ").trim();
  }

  return "";
}
