"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
};

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Biên tập (Editor)" },
  { value: "viewer", label: "Chỉ xem (Viewer)" },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Biên tập",
  viewer: "Chỉ xem",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("admin_user") || "null");
    } catch {
      return null;
    }
  })();

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      "x-admin-password": sessionStorage.getItem("admin_password") || "",
      "x-admin-role": currentUser?.role || "",
    };
  }

  function loadUsers() {
    setLoading(true);
    fetch("/api/admin/users", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    const fd = new FormData(e.currentTarget);
    const body = {
      username: fd.get("username"),
      password: fd.get("password"),
      name: fd.get("name"),
      role: fd.get("role"),
      status: "active",
    };
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tạo thất bại");
      setSuccess("Tạo user thành công!");
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(user: User) {
    const newStatus = user.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function changeRole(user: User, role: string) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ id: user.id, role }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Vai trò</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản admin và phân quyền
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Đóng form" : "+ Thêm user"}
        </button>
      </div>

      {/* Role legend */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { role: "Super Admin", desc: "Toàn quyền: user, jobs, leads, settings" },
          { role: "Admin", desc: "Jobs, leads, settings — không quản lý user" },
          { role: "Biên tập", desc: "Đăng/sửa tin tuyển dụng, xem leads" },
          { role: "Chỉ xem", desc: "Chỉ xem leads và tin tuyển dụng" },
        ].map((r) => (
          <div key={r.role} className="rounded-xl bg-white p-4 ring-1 ring-gray-200">
            <div className="text-sm font-semibold text-gray-900">{r.role}</div>
            <div className="mt-1 text-xs text-gray-500">{r.desc}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-gray-200"
        >
          <h2 className="font-semibold text-gray-900">Thêm user mới</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Họ tên *</label>
              <input name="name" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium">Username *</label>
              <input name="username" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium">Mật khẩu *</label>
              <input name="password" type="password" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium">Vai trò *</label>
              <select name="role" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Đang tạo..." : "Tạo user"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>
      ) : users.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-gray-200">
          <p className="text-gray-600">
            Chưa có user nào trong hệ thống. Tài khoản <code>admin</code> (env) vẫn dùng được.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Bấm &quot;Thêm user&quot; để tạo tài khoản đầu tiên.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Họ tên</th>
                <th className="px-4 py-3 font-medium text-gray-600">Username</th>
                <th className="px-4 py-3 font-medium text-gray-600">Vai trò</th>
                <th className="px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 font-medium text-gray-600">Ngày tạo</th>
                <th className="px-4 py-3 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id + u.createdAt} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.username}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.status === "active" ? "Hoạt động" : "Vô hiệu"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u)}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      {u.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
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
