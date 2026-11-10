"use client";

import { useState } from "react";

export default function LienHePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      fullName: fd.get("fullName") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      message: fd.get("message") as string,
      role: fd.get("role") as string,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lien-he", data }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Lỗi gửi form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16">
      <div className="container-main">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="section-title">Liên hệ Mass Hiring</h1>
            <p className="mt-4 text-gray-600">
              Gửi nhu cầu tuyển dụng, đơn hàng cần thêm nguồn hoặc đăng ký HR Freelancer. Bộ phận
              phụ trách sẽ liên hệ lại.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3">
                <span>📞</span>
                <a href="tel:0905966105" className="font-medium text-brand">
                  0905 966 105
                </a>
              </li>
              <li className="flex gap-3">
                <span>📍</span>
                <span>
                  Số 2, Đường Số 2, Khu dân cư Cityland, Phường Gò Vấp, TP. Hồ Chí Minh
                  <br />
                  Tòa nhà Workflow Space, Lầu 2
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
            {success ? (
              <div className="text-center py-8">
                <div className="text-4xl">✅</div>
                <h3 className="mt-4 font-semibold text-green-800">Gửi thành công!</h3>
                <p className="mt-2 text-sm text-green-700">Chúng tôi sẽ phản hồi sớm.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium">Họ và tên *</label>
                  <input name="fullName" required className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">Số điện thoại *</label>
                    <input name="phone" type="tel" required className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input name="email" type="email" className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Bạn là</label>
                  <select name="role" className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand">
                    <option value="">Chọn...</option>
                    <option value="Doanh nghiệp">Doanh nghiệp</option>
                    <option value="Đối tác cung ứng">Đối tác cung ứng</option>
                    <option value="HR Freelancer">HR Freelancer</option>
                    <option value="Người tìm việc">Người tìm việc</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Nội dung *</label>
                  <textarea name="message" required rows={4} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand" />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" required id="c-consent" className="mt-1 h-4 w-4 rounded text-brand" />
                  <label htmlFor="c-consent" className="text-sm text-gray-600">
                    Tôi đồng ý xử lý dữ liệu theo <a href="/chinh-sach-bao-mat" className="text-brand underline">Chính sách bảo mật</a>.
                  </label>
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
