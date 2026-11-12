"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image"; // <-- Import extension Image

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true, // Cho phép ảnh nằm cùng dòng với chữ
        allowBase64: false, // Chỉ cho phép dùng URL (không nhận base64)
      }),
    ],
    content: value,
    immediatelyRender: false, // Bắt buộc cho Next.js SSR
    editorProps: {
      attributes: {
        // Class 'prose' giúp tự động style ảnh (bo góc, căn lề) đẹp hơn
        class:
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="p-4 text-gray-500">Đang tải trình soạn thảo...</div>;
  }

  // Hàm xử lý khi bấm nút chèn ảnh
  const addImage = () => {
    const url = window.prompt("Nhập URL hình ảnh:");
    if (url) {
      // Cập nhật lại nội dung: chèn ảnh vào vị trí con trỏ hiện tại
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-brand focus-within:border-brand">
      {/* Thanh công cụ */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("bold") ? "bg-brand text-white" : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          Đậm
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("italic") ? "bg-brand text-white" : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          Nghiêng
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("heading", { level: 2 }) ? "bg-brand text-white" : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          Tiêu đề 2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("bulletList") ? "bg-brand text-white" : "bg-white hover:bg-gray-100 text-gray-700"
          }`}
        >
          Danh sách
        </button>

        {/* Nút Chèn Ảnh */}
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-medium bg-white hover:bg-gray-100 text-gray-700 border-l ml-1 pl-3"
        >
          🖼️ Chèn Ảnh
        </button>
      </div>

      {/* Vùng soạn thảo */}
      <EditorContent editor={editor} />
    </div>
  );
}