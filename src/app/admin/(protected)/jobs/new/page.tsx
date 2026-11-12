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

  // Chuyển sang State để có thể làm live-preview
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    quantity: "",
    location: "",
    type: "",
    deadline: "",
    industry: "",
    status: "active",
    description: "",
    imageUrl: "", // Thêm trường ảnh (optional)
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const salaryRaw = formData.salary.replace(/[^\d]/g, "");
    if (!salaryRaw) {
      setError("Mức lương phải là số (VD: 16000000)");
      setLoading(false);
      return;
    }

    const body = {
      title: formData.title,
      salary: salaryRaw,
      location: formData.location,
      type: formData.type,
      quantity: Number(formData.quantity) || 0,
      deadline: formData.deadline,
      industry: formData.industry,
      description: formData.description,
      imageUrl: formData.imageUrl,
      status: formData.status || "active",
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

      // Reset form sau khi thành công
      setFormData({
        title: "", salary: "", quantity: "", location: "", type: "",
        deadline: "", industry: "", status: "active", description: "", imageUrl: ""
      });

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

      {/* LƯỚI CHIA 2 CỘT: FORM (TRÁI) VÀ PREVIEW (PHẢI) */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* CỘT TRÁI: FORM NHẬP LIỆU (Chiếm 7/12) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8"
        >
          <div>
            <label className="block text-sm font-medium">Tên vị trí *</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
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
                value={formData.salary}
                onChange={handleChange}
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
                value={formData.quantity}
                onChange={handleChange}
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
              value={formData.location}
              onChange={handleChange}
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
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="" disabled>Chọn hình thức...</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Hạn nộp hồ sơ *</label>
              <input
                name="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Nhóm ngành</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Chọn...</option>
                {industries.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="active">Đang tuyển</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>

          {/* Trường URL Hình ảnh */}
          <div>
            <label className="block text-sm font-medium">
              URL Hình ảnh <span className="text-gray-400 font-normal">(Tuỳ chọn)</span>
            </label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mô tả công việc</label>
            <textarea
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="Mô tả chi tiết công việc, yêu cầu, quyền lợi..."
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              Đăng tin thành công! Đang chuyển về danh sách...
            </div>
          )}

          <div className="flex gap-3 pt-2">
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

        {/* CỘT PHẢI: PREVIEW (Chiếm 5/12) - Ẩn trên mobile */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-24">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Bản xem trước (Live Preview)
            </div>

            {/* KHỐI THẺ CÔNG VIỆC PREVIEW */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
              {/* Ảnh bìa */}
              {formData.imageUrl ? (
                <div className="aspect-[21/9] w-full bg-gray-100 relative">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Nếu link ảnh lỗi, ẩn thẻ img đi
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-[21/9] w-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  Chưa có hình ảnh
                </div>
              )}

              <div className="p-6">
                <div className="text-xs font-medium text-brand">
                  {formData.industry || "Nhóm ngành"}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-gray-900 break-words">
                  {formData.title || "Tên vị trí công việc"}
                </h2>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                  {formData.salary && (
                    <span>💰 {Number(formData.salary).toLocaleString('vi-VN')} VNĐ</span>
                  )}
                  <span>📍 {formData.location || "Địa điểm làm việc"}</span>
                  {formData.type && <span>🕐 {formData.type}</span>}
                  {Number(formData.quantity) > 0 && <span>👥 {formData.quantity} người</span>}
                </div>

                {formData.deadline && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    Hạn nộp: {new Date(formData.deadline).toLocaleDateString('vi-VN')}
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

            <p className="mt-4 text-center text-xs text-gray-400">
              * Giao diện hiển thị mang tính chất tương đối, dựa trên dữ liệu bạn đang nhập.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}