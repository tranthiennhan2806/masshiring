"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TiptapEditor from "@/components/TiptapEditor"; // <-- Import Editor

export default function NewPostPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Tin tức",
        imageUrl: "",
        date: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
        status: "draft" as "draft" | "published",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm riêng cho Editor vì nó trả về HTML
    const handleContentChange = (html: string) => {
        setFormData((prev) => ({ ...prev, content: html }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Lưu thất bại");
            router.push("/admin/posts");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Viết bài mới</h1>
                <Link href="/admin/posts" className="text-gray-500 hover:underline">&larr; Quay lại</Link>
            </div>

            {error && <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tiêu đề *</label>
                        <input required name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chuyên mục</label>
                            <input name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ngày hiển thị</label>
                            <input name="date" value={formData.date} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" placeholder="VD: 12/2026" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL Hình ảnh (Tuỳ chọn)</label>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" placeholder="https://example.com/banner.jpg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tóm tắt (Hiển thị ở danh sách)</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bài viết</label>
                        {/* Thay thế textarea bằng Tiptap Editor */}
                        <TiptapEditor
                            value={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                            <option value="draft">Lưu nháp</option>
                            <option value="published">Xuất bản ngay</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                            {saving ? "Đang lưu..." : "Lưu bài viết"}
                        </button>
                    </div>
                </form>

                {/* CỘT PHẢI: PREVIEW */}
                <div className="hidden lg:col-span-5 lg:block">
                    <div className="sticky top-6">
                        <div className="mb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">Bản xem trước</div>
                        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm">
                            {formData.imageUrl && (
                                <div className="aspect-[16/9] w-full bg-gray-100">
                                    <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-medium text-brand">{formData.category || "Chuyên mục"}</span>
                                    <span>{formData.date}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 break-words">{formData.title || "Tiêu đề bài viết"}</h2>
                                {formData.excerpt && <p className="mt-3 text-sm text-gray-600 line-clamp-3">{formData.excerpt}</p>}
                                {formData.content && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        {/* Sử dụng dangerouslySetInnerHTML để render đúng định dạng HTML của Tiptap */}
                                        <div
                                            className="text-sm text-gray-700 line-clamp-6 prose prose-sm"
                                            dangerouslySetInnerHTML={{ __html: formData.content }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}