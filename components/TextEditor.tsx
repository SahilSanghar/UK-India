"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold as BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Pilcrow,
  Strikethrough,
  Link2,
  Link2Off,
} from "lucide-react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (active: boolean) =>
    `inline-flex items-center justify-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors ${
      active ? "border-zinc-900 shadow-sm" : "border-zinc-200"
    }`;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const unsetLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 1 }))}
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={buttonClass(editor.isActive("paragraph"))}
        >
          <Pilcrow className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-zinc-200" />

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          <BoldIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          <ItalicIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-zinc-200 " />

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-zinc-200 " />

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={setLink}
          className={buttonClass(editor.isActive("link"))}
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={unsetLink}
          className={buttonClass(false)}
        >
          <Link2Off className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const TextEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        validate: (href) => /^https?:\/\//i.test(href),
      }),
    ],
    content,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <MenuBar editor={editor} />
      <div className="min-h-[140px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed focus-within:ring-2 focus-within:ring-zinc-900">
        <EditorContent
          editor={editor}
          className="tiptap text-sm leading-relaxed"
        />
      </div>

      {/* Simple global styles so headings, lists, and links are clearly visible */}
      <style jsx global>{`
        .tiptap {
          outline: none;
        }
        .tiptap h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .tiptap h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.9rem 0 0.4rem;
        }
        .tiptap h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0.8rem 0 0.35rem;
        }
        .tiptap p {
          margin: 0.35rem 0;
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.4rem 0;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.4rem 0;
        }
        .tiptap li {
          margin: 0.15rem 0;
        }
        .tiptap a {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }
        .tiptap a:hover {
          color: #1d4ed8;
        }
        .tiptap strong {
          font-weight: 600;
        }
        .tiptap em {
          font-style: italic;
        }
        .tiptap s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
