"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const INDUSTRIES = [
  "Logistics, TMĐT",
  "Sản xuất, kho vận",
  "F&B",
  "Bán lẻ",
  "BPO, số hóa",
  "Gia đình, chăm sóc",
];

const AREAS = ["Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Hà Nội"];

export default function ViecLamPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => {
        setJobs(d.jobs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const types = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.type).filter(Boolean))),
    [jobs]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (industry && j.industry !== industry) return false;
      if (area && !j.location?.toLowerCase().includes(area.toLowerCase())) return false;
      if (type && j.type !== type) return false;
      if (q && !(j.title.toLowerCase().includes(q) || j.industry?.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [jobs, industry, area, type, search]);

  const activeFilterCount = (industry ? 1 : 0) + (area ? 1 : 0) + (type ? 1 : 0);

  function resetFilters() {
    setIndustry("");
    setArea("");
    setType("");
    setSearch("");
  }

  return (
    <section className="py-12">
      <div className="container-main">
        <h1 className="section-title">Việc làm đang tuyển</h1>
        <p className="mt-3 text-gray-600">
          Việc thật, gắn với dự án đã ký. Người lao động không mất bất kỳ khoản phí nào.
        </p>

        {/* Search + filter toggle */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm việc theo vị trí hoặc ngành..."
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ⚙ Bộ lọc
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
            <span className={`transition ${filtersOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
        </div>

        {filtersOpen && (
          <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nhóm ngành</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Tất cả ngành</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Khu vực</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Tất cả khu vực</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hình thức</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Tất cả hình thức</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-sm text-gray-500">Đang tải việc làm...</div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center">
            <p className="text-gray-600">
              {jobs.length === 0
                ? "Chưa có vị trí phù hợp. Để lại thông tin, team dự án sẽ gọi khi có việc tại khu vực của bạn."
                : "Không tìm thấy việc làm phù hợp với bộ lọc."}
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
                    <div className="text-right text-sm text-gray-500">Hạn nộp: {job.deadline}</div>
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