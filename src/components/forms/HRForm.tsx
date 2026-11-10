"use client";

import { useState } from "react";

const provinces = [
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

export function HRForm() {
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
      phone: formData.get("phone") as string,
      province: formData.get("province") as string,
      email: formData.get("email") as string,
      experience: formData.get("experience") as string,
      facebook: formData.get("facebook") as string,
      availableTime: formData.get("availableTime") as string,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "hr-freelancer", data }),
      });

      if (!res.ok) throw new Error((await res.json()).error || "Gửi thất bại");
      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center ring-1 ring-green-200">
        <div className="text-4xl">✅</div>
        <h3 className="mt-4 text-lg font-semibold text-green-800">Đăng ký thành công!</h3>
        <p className="mt-2 text-sm text-green-700">
          Team Mass Hiring sẽ liên hệ hướng dẫn đào tạo miễn phí và cấp mã định danh.
        </p>
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
          <input name="fullName" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại (Zalo) <span className="text-brand">*</span>
          </label>
          <input name="phone" type="tel" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tỉnh/thành bạn sống <span className="text-brand">*</span>
          </label>
          <select name="province" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
            <option value="">Chọn...</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kinh nghiệm tuyển dụng</label>
        <select name="experience" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
          <option value="">Chọn...</option>
          <option value="Chưa có">Chưa có</option>
          <option value="Dưới 1 năm">Dưới 1 năm</option>
          <option value="1-3 năm">1-3 năm</option>
          <option value="Trên 3 năm">Trên 3 năm</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Link Facebook cá nhân (tài khoản thật)</label>
        <input name="facebook" placeholder="https://facebook.com/..." className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" required id="hr-consent" className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
        <label htmlFor="hr-consent" className="text-sm text-gray-600">
          Tôi đồng ý để Mass Hiring xử lý dữ liệu cá nhân để nhận hỗ trợ đào tạo và cấp mã định danh, theo{" "}
          <a href="/chinh-sach-bao-mat" className="text-brand underline">Chính sách bảo mật</a>.
        </label>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Đang gửi..." : "Đăng ký HR Freelancer"}
      </button>
    </form>
  );
}
