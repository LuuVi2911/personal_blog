"use client";

import {
  RichTextEditor,
  type JSONContent,
} from "@/components/ui/rich-text-editor";

interface EditorWithToggleProps {
  content: JSONContent | null;
  onChange: (json: JSONContent) => void;
  placeholder?: string;
}

/**
 * Rich text editor component for blog content.
 * Uses TipTap editor with JSON content format.
 */
export function EditorWithToggle({
  content,
  onChange,
  placeholder = "Start writing…",
}: EditorWithToggleProps) {
  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 text-white">
      <div className="p-3">
        <div className="rounded-md border border-neutral-700 bg-neutral-900">
          <RichTextEditor
            content={content}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}

// Re-export JSONContent for convenience
export type { JSONContent };
