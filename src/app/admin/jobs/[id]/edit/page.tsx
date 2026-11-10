// src/app/admin/jobs/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const industries = [
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

type Job = {
    id: string;
    title: string;
    salary: string;
    location: string;
    type: string;
    quantity: number;
    deadline: string;
    industry: string;
    description: string;
    status: "active" | "closed";
    createdAt: string;
};

function toDateInput(value: string): string {
    if (!value) return "";
    // Nếu đã đúng format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // Nếu là dd/mm/yyyy
    const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
        const [, d, mo, y] = m;
        return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    // Fallback: parse Date
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return "";
}

export default function EditJobPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/jobs/${id}`, { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
                if (d.job) setJob(d.job);
                else setError(d.error || "Không tìm thấy tin");
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const fd = new FormData(e.currentTarget);

        const salaryRaw = String(fd.get("salary") || "").replace(/[^\d]/g, "");
        if (!salaryRaw) {
            setError("Mức lương phải là số (VD: 16000000)");
            setSaving(false);
            return;
        }

        const body = {
            title: fd.get("title"),
            salary: salaryRaw,
            location: fd.get("location"),
            type: fd.get("type"),
            quantity: Number(fd.get("quantity")) || 0,
            deadline: fd.get("deadline"),
            industry: fd.get("industry"),
            description: fd.get("description"),
            status: fd.get("status"),
        };

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Cập nhật thất bại");
            router.push("/admin/jobs");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading)
        return <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>;
    if (!job)
        return (
            <div className="mt-10 text-center text-sm text-red-600">
                {error || "Không tìm thấy tin"}
            </div>
        );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Sửa tin tuyển dụng</h1>
            <p className="mt-1 text-sm text-gray-500">Job ID: {job.id}</p>

            <form
                onSubmit={handleSubmit}
                className="mt-8 max-w-2xl space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
            >
                <div>
                    <label className="block text-sm font-medium">Tên vị trí *</label>
                    <input
                        name="title"
                        required
                        defaultValue={job.title}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium">Mức lương (VNĐ) *</label>
                        <input
                            name="salary"
                            type="number"
                            min={0}
                            step={1000}
                            required
                            defaultValue={String(job.salary || "").replace(/[^\d]/g, "")}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            placeholder="16000000"
                        />
                        <p className="mt-1 text-xs text-gray-500">Nhập số, VD: 16000000</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Số lượng</label>
                        <input
                            name="quantity"
                            type="number"
                            min={0}
                            defaultValue={job.quantity}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Địa điểm *</label>
                    <input
                        name="location"
                        required
                        defaultValue={job.location}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium">Hình thức *</label>
                        <select
                            name="type"
                            required
                            defaultValue={job.type || ""}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        >
                            <option value="" disabled>
                                Chọn hình thức...
                            </option>
                            {EMPLOYMENT_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                            {/* Nếu giá trị cũ không nằm trong danh sách, vẫn hiển thị */}
                            {job.type && !EMPLOYMENT_TYPES.some((t) => t.value === job.type) && (
                                <option value={job.type}>{job.type}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hạn nộp *</label>
                        <input
                            name="deadline"
                            type="date"
                            required
                            defaultValue={toDateInput(job.deadline)}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium">Nhóm ngành</label>
                        <select
                            name="industry"
                            defaultValue={job.industry || ""}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        >
                            <option value="">Chọn...</option>
                            {industries.map((i) => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Trạng thái</label>
                        <select
                            name="status"
                            defaultValue={job.status}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        >
                            <option value="active">Đang tuyển</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Mô tả công việc</label>
                    <textarea
                        name="description"
                        rows={8}
                        defaultValue={job.description}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button type="button" onClick={() => router.back()} className="btn-secondary">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}