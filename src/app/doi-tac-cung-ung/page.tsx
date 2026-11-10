"use client";

import { useState } from "react";
import Link from "next/link";

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

function PartnerForm() {
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
      company: fd.get("company") as string,
      phone: fd.get("phone") as string,
      position: fd.get("position") as string,
      area: fd.get("area") as string,
      email: fd.get("email") as string,
      quantity: fd.get("quantity") as string,
      note: fd.get("note") as string,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "doi-tac", data }),
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
        <h3 className="mt-4 text-lg font-semibold text-green-800">Gửi thành công!</h3>
        <p className="mt-2 text-sm text-green-700">
          Bộ phận Đối tác sẽ liên hệ bạn trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Họ và tên <span className="text-brand">*</span></label>
          <input name="fullName" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên công ty <span className="text-brand">*</span></label>
          <input name="company" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại <span className="text-brand">*</span></label>
          <input name="phone" type="tel" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vị trí / ngành đơn hàng <span className="text-brand">*</span></label>
          <input name="position" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" placeholder="Ví dụ: Nhân viên kho, shipper..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Khu vực <span className="text-brand">*</span></label>
          <select name="area" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
            <option value="">Chọn...</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Số lượng / Thời hạn giao người</label>
        <input name="quantity" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <textarea name="note" rows={3} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" required id="partner-consent" className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
        <label htmlFor="partner-consent" className="text-sm text-gray-600">
          Tôi đồng ý để Mass Hiring xử lý dữ liệu theo{" "}
          <Link href="/chinh-sach-bao-mat" className="text-brand underline">Chính sách bảo mật</Link>.
        </label>
      </div>
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Đang gửi..." : "Chia sẻ đơn hàng"}
      </button>
    </form>
  );
}

export default function DoiTacPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Dành cho đối tác cung ứng
              </div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Cùng mở rộng nguồn lao động với Mass Hiring
              </h1>
              <p className="mt-4 text-gray-300">
                Cần thêm nguồn cho đơn hàng cung ứng? Mass Hiring tuyển qua mạng lưới Nhân Hiệu toàn quốc,
                cập nhật từng ứng viên, tôn trọng khách hàng của đối tác.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#hop-tac" className="btn-primary">Chia sẻ đơn hàng</a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-brand p-6">
                <div className="text-3xl font-bold">6</div>
                <div className="mt-1 text-sm text-white/80">nhóm ngành</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">~1 triệu</div>
                <div className="mt-1 text-sm text-white/80">bài đăng</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">2 chiều</div>
                <div className="mt-1 text-sm text-white/80">tôn trọng khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lợi ích */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="section-title text-center">Đối tác nhận được</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Thêm nguồn", desc: "Ứng viên từ mạng lưới HR Freelancer toàn quốc." },
              { title: "Ứng viên đã sàng lọc", desc: "Đối chiếu CCCD, có lịch phỏng vấn." },
              { title: "Cập nhật từng ứng viên", desc: "Theo dõi trạng thái realtime." },
              { title: "Đồng hành sau nhận việc", desc: "Hỗ trợ thay người khi cần." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-gray-50 p-6">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nguyên tắc */}
      <section id="nguyen-tac" className="bg-gray-50 py-16">
        <div className="container-main">
          <h2 className="section-title text-center">Nguyên tắc hợp tác</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Không làm việc trực tiếp với khách hàng của nhau — áp dụng hai chiều.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Luân chuyển ứng viên", desc: "Ứng viên chưa đạt hoặc đã nghỉ có thể chuyển sang job phù hợp khác." },
              { title: "Không lôi kéo", desc: "Không tiếp cận người đang làm việc tại khách hàng của đối tác." },
              { title: "Tôn trọng hai chiều", desc: "Mass Hiring cũng không làm việc trực tiếp với khách hàng của đối tác." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
                <div className="font-semibold text-brand">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="hop-tac" className="py-16">
        <div className="container-main">
          <div className="mx-auto max-w-2xl">
            <h2 className="section-title text-center">Chia sẻ đơn hàng</h2>
            <p className="mt-3 text-center text-gray-600">
              Gửi thông tin đơn hàng cần thêm nguồn. Team sẽ liên hệ thống nhất cách làm.
            </p>
            <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <PartnerForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
