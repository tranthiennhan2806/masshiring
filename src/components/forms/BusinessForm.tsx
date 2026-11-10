"use client";

import { useState } from "react";

const areas = [
  "TP. Hồ Chí Minh",
  "Bình Dương",
  "Đồng Nai",
  "Long An",
  "Hà Nội",
  "Bắc Ninh",
  "Hải Phòng",
  "Đà Nẵng",
  "Khác",
];

export function BusinessForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      fullName: formData.get("fullName") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      position: formData.get("position") as string,
      area: formData.get("area") as string,
      email: formData.get("email") as string,
      quantity: formData.get("quantity") as string,
      note: formData.get("note") as string,
      page: "/doanh-nghiep",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "doanh-nghiep", data }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gửi thất bại");
      }

      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center ring-1 ring-green-200">
        <div className="text-4xl">✅</div>
        <h3 className="mt-4 text-lg font-semibold text-green-800">
          Gửi nhu cầu thành công!
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Bộ phận Kinh doanh sẽ liên hệ bạn trong thời gian sớm nhất.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-medium text-brand underline"
        >
          Gửi thêm nhu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Họ và tên <span className="text-brand">*</span>
          </label>
          <input
            name="fullName"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên công ty <span className="text-brand">*</span>
          </label>
          <input
            name="company"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Công ty TNHH ABC"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại <span className="text-brand">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="0901234567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="email@company.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vị trí cần tuyển <span className="text-brand">*</span>
          </label>
          <input
            name="position"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Ví dụ: Nhân viên kho, công nhân đóng gói"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Khu vực làm việc <span className="text-brand">*</span>
          </label>
          <select
            name="area"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">Chọn...</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
        <input
          name="quantity"
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="Ví dụ: 50 người"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
        <textarea
          name="note"
          rows={3}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="Thời gian cần người, yêu cầu đặc biệt..."
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          required
          id="consent"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
        />
        <label htmlFor="consent" className="text-sm text-gray-600">
          Tôi đồng ý để Mass Hiring xử lý dữ liệu cá nhân nhằm hỗ trợ nhu cầu tuyển dụng, theo{" "}
          <a href="/chinh-sach-bao-mat" className="text-brand underline">
            Chính sách bảo mật
          </a>
          .
        </label>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi nhu cầu tuyển dụng"}
      </button>
    </form>
  );
}
