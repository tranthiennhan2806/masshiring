"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tuyển dụng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các tin đang đăng trên website
          </p>
        </div>
        <Link href="/admin/jobs/new" className="btn-primary">
          + Đăng tin mới
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>
      ) : jobs.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-gray-200">
          <p className="text-gray-600">Chưa có tin tuyển dụng nào.</p>
          <Link
            href="/admin/jobs/new"
            className="btn-primary mt-4 inline-flex"
          >
            Đăng tin đầu tiên
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Vị trí</th>
                <th className="px-4 py-3 font-medium text-gray-600">Địa điểm</th>
                <th className="px-4 py-3 font-medium text-gray-600">Lương</th>
                <th className="px-4 py-3 font-medium text-gray-600">SL</th>
                <th className="px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 font-medium text-gray-600">Ngày tạo</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
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
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {job.createdAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <Link
                        href={`/viec-lam/${job.id}`}
                        target="_blank"
                        className="text-gray-500 hover:underline"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="text-brand hover:underline"
                      >
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
      )}
    </div>
  );
}