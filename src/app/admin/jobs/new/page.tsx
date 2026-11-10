"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const salaryRaw = String(fd.get("salary") || "").replace(/[^\d]/g, "");
    if (!salaryRaw) {
      setError("Mức lương phải là số (VD: 16000000)");
      setLoading(false);
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
      status: fd.get("status") || "active",
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tạo tin thất bại");
      setSuccess(true);
      form.reset();
      setTimeout(() => router.push("/admin/jobs"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Đăng tin tuyển dụng mới</h1>
      <p className="mt-1 text-sm text-gray-500">
        Tin sẽ hiển thị trên trang Việc làm và gửi thông báo Discord.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
      >
        <div>
          <label className="block text-sm font-medium">Tên vị trí *</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Ví dụ: Nhân viên kho TMĐT ca xoay"
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
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="16000000"
            />
            <p className="mt-1 text-xs text-gray-500">Nhập số, VD: 16000000</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Số lượng cần tuyển</label>
            <input
              name="quantity"
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Địa điểm làm việc *</label>
          <input
            name="location"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Kho ABC, Thủ Đức, TP. Hồ Chí Minh"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Hình thức *</label>
            <select
              name="type"
              required
              defaultValue=""
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
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Hạn nộp hồ sơ *</label>
            <input
              name="deadline"
              type="date"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Nhóm ngành</label>
            <select
              name="industry"
              defaultValue=""
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
              defaultValue="active"
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
            rows={6}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Mô tả chi tiết công việc, yêu cầu, quyền lợi..."
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            Đăng tin thành công! Đang chuyển về danh sách...
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Đang đăng..." : "Đăng tin tuyển dụng"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}