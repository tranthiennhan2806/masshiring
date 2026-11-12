"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  title: string;
  salary: string;
  location: string;
  type: string;
  quantity: number;
  deadline: string;
  industry: string;
  status: "active" | "closed";
  createdAt: string;
};

const INDUSTRIES = [
  "Logistics, TMĐT",
  "Sản xuất, kho vận",
  "F&B",
  "Bán lẻ",
  "BPO, số hóa",
  "Gia đình, chăm sóc",
];

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/jobs?all=1", { cache: "no-store" });
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))),
    [jobs]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (
        q &&
        !(
          j.title.toLowerCase().includes(q) ||
          j.industry?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q)
        )
      )
        return false;
      if (industry && j.industry !== industry) return false;
      if (status && j.status !== status) return false;
      if (location && j.location !== location) return false;
      return true;
    });
  }, [jobs, search, industry, status, location]);

  const activeFilterCount =
    (industry ? 1 : 0) + (status ? 1 : 0) + (location ? 1 : 0);

  function resetFilters() {
    setIndustry("");
    setStatus("");
    setLocation("");
    setSearch("");
  }

  async function handleDelete(job: Job, hard: boolean) {
    const msg = hard
      ? `XOÁ VĨNH VIỄN "${job.title}"? Không thể hoàn tác.`
      : `Đóng tin "${job.title}"? Ứng viên sẽ không thấy tin này nữa.`;
    if (!confirm(msg)) return;
    setBusyId(job.id);
    try {
      const res = await fetch(`/api/jobs/${job.id}${hard ? "?hard=1" : ""}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error || "Xóa thất bại");
      await load();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(job: Job) {
    setBusyId(job.id);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: job.status === "active" ? "closed" : "active",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tuyển dụng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các tin đang đăng trên website
          </p>
        </div>
        <Link href="/admin/jobs/new" className="btn-primary w-full sm:w-auto text-center">
          + Đăng tin mới
        </Link>
      </div>

      {/* Search + filter toggle */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo vị trí, ngành, địa điểm..."
            className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
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

      {/* Collapsible filters */}
      {filtersOpen && (
        <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ngành</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Tất cả ngành</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Địa điểm</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Tất cả địa điểm</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang tuyển</option>
              <option value="closed">Đã đóng</option>
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
        <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-gray-200">
          <p className="text-gray-600">
            {jobs.length === 0 ? "Chưa có tin tuyển dụng nào." : "Không tìm thấy tin phù hợp."}
          </p>
          {jobs.length === 0 && (
            <Link href="/admin/jobs/new" className="btn-primary mt-4 inline-flex">
              Đăng tin đầu tiên
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Vị trí</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Địa điểm</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Lương</th>
                  <th className="px-4 py-3 font-medium text-gray-600">SL</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Ngày tạo</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.industry}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.location}</td>
                    <td className="px-4 py-3 text-gray-600">{job.salary}</td>
                    <td className="px-4 py-3 text-gray-600">{job.quantity}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(job)}
                        disabled={busyId === job.id}
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${job.status === "active"
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        title="Bấm để đổi trạng thái"
                      >
                        {job.status === "active" ? "Đang tuyển" : "Đã đóng"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{job.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-3">
                        <Link href={`/viec-lam/${job.id}`} target="_blank" className="text-gray-500 hover:underline">
                          Xem
                        </Link>
                        <Link href={`/admin/jobs/${job.id}/edit`} className="text-brand hover:underline">
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(job, false)}
                          disabled={busyId === job.id}
                          className="text-amber-600 hover:underline disabled:opacity-50"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => handleDelete(job, true)}
                          disabled={busyId === job.id}
                          className="text-red-600 hover:underline disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {filtered.map((job) => (
              <div key={job.id} className="rounded-2xl bg-white p-4 ring-1 ring-gray-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.industry}</div>
                  </div>
                  <button
                    onClick={() => toggleStatus(job)}
                    disabled={busyId === job.id}
                    className={`shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${job.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {job.status === "active" ? "Đang tuyển" : "Đã đóng"}
                  </button>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><dt className="text-xs text-gray-400">Địa điểm</dt><dd>{job.location}</dd></div>
                  <div><dt className="text-xs text-gray-400">Lương</dt><dd>{job.salary}</dd></div>
                  <div><dt className="text-xs text-gray-400">Số lượng</dt><dd>{job.quantity}</dd></div>
                  <div><dt className="text-xs text-gray-400">Ngày tạo</dt><dd className="text-xs">{job.createdAt}</dd></div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-sm">
                  <Link href={`/viec-lam/${job.id}`} target="_blank" className="text-gray-500 hover:underline">Xem</Link>
                  <Link href={`/admin/jobs/${job.id}/edit`} className="text-brand hover:underline">Sửa</Link>
                  <button onClick={() => handleDelete(job, false)} disabled={busyId === job.id} className="text-amber-600 hover:underline disabled:opacity-50">Đóng</button>
                  <button onClick={() => handleDelete(job, true)} disabled={busyId === job.id} className="text-red-600 hover:underline disabled:opacity-50">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}