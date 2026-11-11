"use client";

import { useEffect, useState } from "react";
import type { AdminUser, AdminRole } from "@/lib/admins";

const ROLES: AdminRole[] = ["super_admin", "admin", "editor", "viewer"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
    else setError(data.error);
  }

  useEffect(() => { load(); }, []);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Users</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Thêm user</button>
      </div>

      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
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
            {users.map((u) => (
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
          </tbody>
        </table>
      </div>

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