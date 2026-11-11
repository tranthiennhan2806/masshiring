"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(sessionStorage.getItem("admin_user") || "null"));
    } catch {}
    fetch("/api/jobs?all=1")
      .then((r) => r.json())
      .then((d) => setJobCount(d.jobs?.length ?? 0))
      .catch(() => setJobCount(0));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Xin chào{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Dashboard quản trị Mass Hiring
        {user?.role && (
          <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
            {user.role}
          </span>
        )}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm text-gray-500">Tin tuyển dụng</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {jobCount === null ? "..." : jobCount}
          </div>
          <Link href="/admin/jobs" className="mt-3 inline-block text-sm text-brand hover:underline">
            Quản lý tin →
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm text-gray-500">Lead & Ứng viên</div>
          <div className="mt-2 text-sm text-gray-600">Xem theo từng loại form</div>
          <Link href="/admin/leads" className="mt-3 inline-block text-sm text-brand hover:underline">
            Xem leads →
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm text-gray-500">Users & Vai trò</div>
          <div className="mt-2 text-sm text-gray-600">Phân quyền admin</div>
          <Link href="/admin/users" className="mt-3 inline-block text-sm text-brand hover:underline">
            Quản lý users →
          </Link>
        </div>

        <div className="rounded-2xl bg-brand p-6 text-white shadow-sm">
          <div className="text-sm text-white/80">Thao tác nhanh</div>
          <Link
            href="/admin/jobs/new"
            className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand"
          >
            + Đăng tin mới
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
          <h2 className="font-semibold text-gray-900">Phân quyền vai trò</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li><strong>Super Admin</strong> — Toàn quyền: users, jobs, leads</li>
            <li><strong>Admin</strong> — Jobs + leads (không quản lý users)</li>
            <li><strong>Biên tập (Editor)</strong> — Đăng/sửa tin, xem leads</li>
            <li><strong>Chỉ xem (Viewer)</strong> — Chỉ xem leads và tin</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
          <h2 className="font-semibold text-gray-900">Hướng dẫn</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>1. Đăng tin tại <strong>Đăng tin mới</strong> → hiện trên /viec-lam + Discord</li>
            <li>2. Lead từ form public lưu Google Sheet + Discord đầy đủ field</li>
            <li>3. Tạo thêm tài khoản admin tại <strong>Users & Vai trò</strong></li>
            <li>4. Tài khoản mặc định: <code>admin</code> / <code>masshiring2026</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
