"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  salary: string;
  location: string;
  type: string;
  quantity: string;
  deadline: string;
  industry: string;
  status: string;
};

export default function ViecLamPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => {
        setJobs(d.jobs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    if (industry && j.industry !== industry) return false;
    if (area && !j.location.toLowerCase().includes(area.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="py-12">
      <div className="container-main">
        <h1 className="section-title">Việc làm đang tuyển</h1>
        <p className="mt-3 text-gray-600">
          Việc thật, gắn với dự án đã ký. Người lao động không mất bất kỳ khoản phí nào.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
          >
            <option value="">Nhóm ngành</option>
            <option value="Logistics, TMĐT">Logistics, TMĐT</option>
            <option value="Sản xuất, kho vận">Sản xuất, kho vận</option>
            <option value="F&B">F&B</option>
            <option value="Bán lẻ">Bán lẻ</option>
            <option value="BPO, số hóa">BPO, số hóa</option>
            <option value="Gia đình, chăm sóc">Gia đình, chăm sóc</option>
          </select>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
          >
            <option value="">Khu vực</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Bình Dương">Bình Dương</option>
            <option value="Đồng Nai">Đồng Nai</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-12 text-center text-sm text-gray-500">Đang tải việc làm...</div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center">
            <p className="text-gray-600">
              Chưa có vị trí phù hợp. Để lại thông tin, team dự án sẽ gọi khi có việc tại khu vực của bạn.
            </p>
            <Link href="/lien-he" className="btn-primary mt-4 inline-flex">
              Để lại thông tin
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {filtered.map((job) => (
              <Link
                key={job.id}
                href={`/viec-lam/${job.id}`}
                className="block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:ring-brand/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-brand">{job.industry}</div>
                    <h2 className="mt-1 text-lg font-semibold text-gray-900">{job.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      {job.salary && <span>💰 {job.salary}</span>}
                      <span>📍 {job.location}</span>
                      {job.type && <span>🕐 {job.type}</span>}
                      {job.quantity && <span>👥 {job.quantity} người</span>}
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="text-right text-sm text-gray-500">
                      Hạn nộp: {job.deadline}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
