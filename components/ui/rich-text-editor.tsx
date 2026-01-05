"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export interface RichTextEditorProps {
  content: JSONContent | null;
  onChange: (json: JSONContent) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/blog/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      toast.success("Image uploaded successfully!");
      return data.url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 underline cursor-pointer hover:text-blue-300",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || {
      type: "doc",
      content: [],
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[300px] p-4 bg-gray-900 text-white prose prose-invert max-w-none",
      },
    },
  });

  // Sync editor content when content prop changes (only if editor is not focused to avoid interrupting user)
  useEffect(() => {
    if (!editor || editor.isFocused) return;

    const currentContent = editor.getJSON();
    const isContentEqual =
      JSON.stringify(currentContent) === JSON.stringify(content);

    if (!isContentEqual && content !== null) {
      editor.commands.setContent(content);
    } else if (
      content === null &&
      currentContent.type === "doc" &&
      (!currentContent.content || currentContent.content.length === 0)
    ) {
      // Already empty, no need to update
      return;
    } else if (content === null) {
      editor.commands.setContent({
        type: "doc",
        content: [],
      });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      try {
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image added successfully!");
      } catch (error) {
        toast.error("Failed to add image");
      }
    }
  };

  const uploadImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const url = await handleImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          alert(
            error instanceof Error ? error.message : "Failed to upload image"
          );
        }
      }
    };
    input.click();
  };

  return (
    <div className="border border-gray-700 rounded-md bg-gray-800">
      {/* Toolbar */}
      <div className="border-b border-gray-700 bg-gray-800 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          &bull;
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          1.
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive({ textAlign: "left" })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          title="Align Left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="17" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive({ textAlign: "center" })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          title="Align Center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="10" x2="6" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive({ textAlign: "right" })
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          title="Align Right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="21" y1="10" x2="7" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("Enter URL:", previousUrl || "");

            if (url === null) {
              return;
            }

            if (url === "") {
              editor.chain().focus().unsetLink().run();
            } else if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("link")
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            uploadImage();
          }}
          className="px-3 py-1 rounded text-sm font-medium bg-gray-700 text-white hover:bg-gray-600"
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addImage();
          }}
          className="px-3 py-1 rounded text-sm font-medium bg-gray-700 text-white hover:bg-gray-600"
        >
          Image URL
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      {/* Editor Content */}
      <div className="[&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror]:bg-gray-900 [&_.ProseMirror]:text-white [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_p]:text-white [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:text-white [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:mb-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:mb-2 [&_.ProseMirror_li]:text-white [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_strong]:text-white [&_.ProseMirror_strong]:font-bold [&_.ProseMirror_em]:text-white [&_.ProseMirror_em]:italic [&_.ProseMirror_code]:text-white [&_.ProseMirror_code]:bg-gray-800 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded [&_.ProseMirror_a]:text-blue-400 [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:cursor-pointer [&_.ProseMirror_a:hover]:text-blue-300">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


export type { JSONContent };
