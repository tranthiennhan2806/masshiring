"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminUser, AdminRole } from "@/lib/admins";

const ROLES: AdminRole[] = ["super_admin", "admin", "editor", "viewer"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
    else setError(data.error);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q && !(u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)))
        return false;
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeFilterCount = (roleFilter ? 1 : 0) + (statusFilter ? 1 : 0);

  function resetFilters() {
    setRoleFilter("");
    setStatusFilter("");
    setSearch("");
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
        name: fd.get("name"),
        role: fd.get("role"),
        status: fd.get("status"),
      }),
    });
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      load();
    } else {
      setError((await res.json()).error);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const body: any = {
      name: fd.get("name"),
      role: fd.get("role"),
      status: fd.get("status"),
    };
    const pwd = String(fd.get("password") || "");
    if (pwd) body.password = pwd;

    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      setError((await res.json()).error);
    }
  }

  async function handleDelete(u: AdminUser) {
    if (!confirm(`Vô hiệu hóa user "${u.username}"?`)) return;
    await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Quản lý Users</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto">
          + Thêm user
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Search + filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo username hoặc tên..."
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
        <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Tất cả role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">active</option>
              <option value="disabled">disabled</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end">
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

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.username}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{u.status}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(u)} className="text-brand hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(u)} className="ml-3 text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  {users.length === 0 ? "Chưa có user nào." : "Không tìm thấy user phù hợp."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 ring-1 ring-gray-200">
            {users.length === 0 ? "Chưa có user nào." : "Không tìm thấy user phù hợp."}
          </div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className="rounded-2xl bg-white p-4 ring-1 ring-gray-200">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{u.username}</div>
                  <div className="text-xs text-gray-500">{u.name}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                  u.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>{u.status}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">Role: {u.role}</div>
              <div className="mt-3 flex gap-3 border-t border-gray-100 pt-3 text-sm">
                <button onClick={() => setEditing(u)} className="text-brand hover:underline">Sửa</button>
                <button onClick={() => handleDelete(u)} className="text-red-600 hover:underline">Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={handleCreate} className="my-8 w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
            <h2 className="text-lg font-semibold">Thêm user</h2>
            <input name="username" placeholder="Username" required className="input" />
            <input name="password" placeholder="Password" required className="input" />
            <input name="name" placeholder="Tên" required className="input" />
            <select name="role" required className="input">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select name="status" className="input">
              <option value="active">active</option>
              <option value="disabled">disabled</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Tạo</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={handleUpdate} className="my-8 w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
            <h2 className="text-lg font-semibold">Sửa: {editing.username}</h2>
            <input name="name" defaultValue={editing.name} required className="input" />
            <input name="password" placeholder="Đổi mật khẩu (để trống nếu không đổi)" className="input" />
            <select name="role" defaultValue={editing.role} className="input">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select name="status" defaultValue={editing.status} className="input">
              <option value="active">active</option>
              <option value="disabled">disabled</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}