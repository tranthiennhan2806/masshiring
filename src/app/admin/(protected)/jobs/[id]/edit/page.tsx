"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const INDUSTRIES = [
    "Logistics, TMĐT",
    "Sản xuất, kho vận",
    "F&B",
    "Bán lẻ",
    "BPO, số hóa",
    "Gia đình, chăm sóc",
];

const EMPLOYMENT_TYPES = [
    { value: "Toàn thời gian", label: "Toàn thời gian" },
    { value: "Bán thời gian", label: "Bán thời gian" },
    { value: "Ca xoay 8 tiếng", label: "Ca xoay 8 tiếng" },
    { value: "Ca xoay 12 tiếng", label: "Ca xoay 12 tiếng" },
    { value: "Thời vụ / Ngắn hạn", label: "Thời vụ / Ngắn hạn" },
    { value: "Thực tập", label: "Thực tập" },
];

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        salary: "",
        location: "",
        type: "",
        quantity: 1,
        deadline: "",
        industry: "",
        description: "",
        imageUrl: "",
        status: "active",
    });

    // 1. Load dữ liệu cũ
    useEffect(() => {
        if (!id) return;
        fetch(`/api/jobs/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.job) {
                    setFormData({
                        title: data.job.title || "",
                        salary: data.job.salary || "",
                        location: data.job.location || "",
                        type: data.job.type || "",
                        quantity: data.job.quantity || 1,
                        deadline: data.job.deadline || "",
                        industry: data.job.industry || "",
                        description: data.job.description || "",
                        imageUrl: data.job.imageUrl || "", // <-- Load trường ảnh
                        status: data.job.status || "active",
                    });
                } else {
                    setError("Không tìm thấy công việc");
                }
            })
            .catch(() => setError("Lỗi khi tải dữ liệu"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    // 2. Submit cập nhật
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error((await res.json()).error || "Cập nhật thất bại");
            router.push("/admin/jobs");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tuyển dụng</h1>
                <Link href="/admin/jobs" className="text-gray-500 hover:underline">
                    &larr; Quay lại danh sách
                </Link>
            </div>

            {error && (
                <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* CỘT TRÁI: FORM */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Tiêu đề công việc *</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mức lương</label>
                            <input
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                min={1}
                                value={formData.quantity}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Địa điểm *</label>
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hạn nộp</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ngành nghề</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            >
                                <option value="">Chọn...</option>
                                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hình thức</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            >
                                <option value="">Chọn...</option>
                                {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                URL Hình ảnh <span className="text-gray-400 font-normal">(Tuỳ chọn)</span>
                            </label>
                            <input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Mô tả công việc</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>

                {/* CỘT PHẢI: PREVIEW */}
                <div className="hidden lg:col-span-5 lg:block">
                    <div className="sticky top-6">
                        <div className="mb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Bản xem trước (Preview)
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm">
                            {/* CHỈ HIỂN THỊ ẢNH KHI CÓ URL */}
                            {formData.imageUrl && (
                                <div className="aspect-[16/9] w-full bg-gray-100 relative">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="text-xs font-medium text-brand">
                                    {formData.industry || "Ngành nghề"}
                                </div>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900 break-words">
                                    {formData.title || "Tiêu đề công việc"}
                                </h2>

                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                                    {formData.salary && <span>💰 {formData.salary}</span>}
                                    <span>📍 {formData.location || "Địa điểm"}</span>
                                    {formData.type && <span>🕐 {formData.type}</span>}
                                    {formData.quantity > 0 && <span>👥 {formData.quantity} người</span>}
                                </div>

                                {formData.deadline && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                                        Hạn nộp: {formData.deadline}
                                    </div>
                                )}

                                {formData.description && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Mô tả công việc</h3>
                                        <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-6">
                                            {formData.description}
                                        </p>
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