"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Job = {
  id: string;
  title: string;
  salary: string;
  location: string;
  type: string;
  quantity: string;
  deadline: string;
  industry: string;
  description: string;
  status: string;
};

function ApplyForm({ job }: { job: Job }) {
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
      birthYear: fd.get("birthYear") as string,
      area: fd.get("area") as string,
      hrCode: fd.get("hrCode") as string,
      jobId: job.id,
      jobTitle: job.title,
      page: `/viec-lam/${job.id}`,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ung-vien", data }),
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
      <div className="rounded-2xl bg-green-50 p-6 text-center ring-1 ring-green-200">
        <div className="text-3xl">✅</div>
        <h3 className="mt-3 font-semibold text-green-800">Ứng tuyển thành công!</h3>
        <p className="mt-1 text-sm text-green-700">
          Team dự án sẽ liên hệ tư vấn và hẹn phỏng vấn.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Họ và tên *</label>
        <input name="fullName" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
      </div>
      <div>
        <label className="block text-sm font-medium">Số điện thoại *</label>
        <input name="phone" type="tel" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
      </div>
      <div>
        <label className="block text-sm font-medium">Năm sinh</label>
        <input name="birthYear" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" placeholder="Ví dụ: 1995" />
      </div>
      <div>
        <label className="block text-sm font-medium">Bạn đang ở *</label>
        <select name="area" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
          <option value="">Chọn...</option>
          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Bình Dương">Bình Dương</option>
          <option value="Đồng Nai">Đồng Nai</option>
          <option value="Khác">Khác</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Mã HR giới thiệu (nếu có)</label>
        <input name="hrCode" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" required id="apply-consent" className="mt-1 h-4 w-4 rounded border-gray-300 text-brand" />
        <label htmlFor="apply-consent" className="text-xs text-gray-600">
          Tôi đồng ý để Mass Hiring xử lý dữ liệu cá nhân và được giới thiệu việc làm phù hợp khác trong 06 tháng, theo{" "}
          <Link href="/chinh-sach-bao-mat" className="text-brand underline">Chính sách bảo mật</Link>.
        </label>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Đang gửi..." : "Ứng tuyển ngay"}
      </button>
    </form>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch("/api/jobs?all=1")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.jobs || []).find((j: Job) => j.id === id);
        setJob(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">Đang tải...</p>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy tin tuyển dụng</h1>
        <Link href="/viec-lam" className="btn-primary mt-6 inline-flex">
          Xem việc làm đang tuyển
        </Link>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-main">
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/viec-lam" className="hover:text-brand">Việc làm</Link>
          {" / "}
          <span>{job.industry}</span>
          {" / "}
          <span className="text-gray-900">{job.title}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-brand">{job.industry}</div>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Mass Hiring tuyển cho doanh nghiệp đối tác
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {job.salary && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Thu nhập</div>
                  <div className="mt-1 font-semibold">{job.salary}</div>
                </div>
              )}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xs text-gray-500">Nơi làm việc</div>
                <div className="mt-1 font-semibold">{job.location}</div>
              </div>
              {job.type && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Hình thức</div>
                  <div className="mt-1 font-semibold">{job.type}</div>
                </div>
              )}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xs text-gray-500">Số lượng / Hạn nộp</div>
                <div className="mt-1 font-semibold">
                  {job.quantity ? `${job.quantity} người` : "—"}
                  {job.deadline ? ` · ${job.deadline}` : ""}
                </div>
              </div>
            </div>

            {job.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Mô tả công việc</h2>
                <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {job.description}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-xl bg-brand/5 p-4 text-sm text-brand ring-1 ring-brand/20">
              Mass Hiring không thu phí người lao động. Nếu ai yêu cầu bạn đóng tiền để nhận việc này,
              hãy báo ngay hotline 0905 966 105.
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <h2 className="font-semibold text-gray-900">Ứng tuyển vị trí này</h2>
              <p className="mt-1 text-xs text-gray-500">
                Điền thông tin, team dự án sẽ gọi tư vấn và hẹn phỏng vấn.
              </p>
              <div className="mt-6">
                <ApplyForm job={job} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
