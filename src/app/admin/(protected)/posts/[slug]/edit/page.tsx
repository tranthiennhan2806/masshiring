"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TiptapEditor from "@/components/TiptapEditor";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // State quản lý đóng/mở Modal Preview
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Tin tức",
        imageUrl: "",
        date: "",
        status: "draft" as "draft" | "published",
    });

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/posts/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.post) {
                    setFormData({
                        title: data.post.title || "",
                        excerpt: data.post.excerpt || "",
                        content: data.post.content || "",
                        category: data.post.category || "",
                        imageUrl: data.post.imageUrl || "",
                        date: data.post.date || "",
                        status: data.post.status || "draft",
                    });
                } else setError("Không tìm thấy bài viết");
            })
            .catch(() => setError("Lỗi tải dữ liệu"))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (html: string) => {
        setFormData((prev) => ({ ...prev, content: html }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/posts/${slug}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Cập nhật thất bại");
            router.push("/admin/posts");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    }

    if (loading) return <div className="p-10 text-center text-gray-500">Đang tải...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
                <Link href="/admin/posts" className="text-gray-500 hover:underline">
                    &larr; Quay lại
                </Link>
            </div>

            {error && <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* CỘT TRÁI: FORM NHẬP LIỆU (Rộng hơn) */}
                <form
                    onSubmit={handleSubmit}
                    className="lg:col-span-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tiêu đề *</label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chuyên mục</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ngày hiển thị</label>
                            <input
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                placeholder="VD: 12/2026"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL Hình ảnh (Tuỳ chọn)</label>
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            placeholder="https://example.com/banner.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tóm tắt (Hiển thị ở danh sách)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={2}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bài viết</label>
                        <TiptapEditor
                            value={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        >
                            <option value="draft">Lưu nháp</option>
                            <option value="published">Xuất bản ngay</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>

                {/* CỘT PHẢI: NÚT MỞ PREVIEW */}
                <div className="hidden lg:col-span-4 lg:block">
                    <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Kiểm tra bài viết</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Xem lại toàn bộ nội dung và bố cục bài viết trước khi lưu thay đổi. Bản xem trước sẽ hiển thị đầy đủ hình ảnh và định dạng văn bản.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Xem trước bài viết
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL PREVIEW (Toàn màn hình) */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
                    <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header của Modal */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Bản xem trước bài viết</h3>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                                title="Đóng"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body của Modal (Có thể cuộn) */}
                        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-8">
                            <article className="mx-auto max-w-4xl rounded-2xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-gray-200">

                                {formData.imageUrl && (
                                    <div className="mb-8 w-full max-h-[500px] overflow-hidden rounded-2xl bg-gray-100">
                                        <img
                                            src={formData.imageUrl}
                                            alt={formData.title}
                                            className="w-full object-cover max-h-[500px]"
                                            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                        />
                                    </div>
                                )}

                                <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
                                    <span className="rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
                                        {formData.category || "Chuyên mục"}
                                    </span>
                                    <span>{formData.date}</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                                    {formData.title || "Tiêu đề bài viết"}
                                </h1>

                                {formData.excerpt && (
                                    <p className="mt-6 text-lg text-gray-700 font-medium leading-relaxed">
                                        {formData.excerpt}
                                    </p>
                                )}

                                {formData.content && (
                                    <div className="mt-8 border-t border-gray-100 pt-8">
                                        <div
                                            className="prose prose-base sm:prose-lg max-w-none text-gray-800"
                                            dangerouslySetInnerHTML={{ __html: formData.content }}
                                        />
                                    </div>
                                )}
                            </article>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}