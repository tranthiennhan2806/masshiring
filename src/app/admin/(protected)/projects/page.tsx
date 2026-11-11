"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<Project | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        const res = await fetch("/api/admin/projects", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setProjects(data.projects || []);
        else setError(data.error);
    }

    useEffect(() => { load(); }, []);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: fd.get("name"), link: fd.get("link") }),
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
        const res = await fetch(`/api/admin/projects/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: fd.get("name"), link: fd.get("link") }),
        });
        if (res.ok) {
            setEditing(null);
            load();
        } else {
            setError((await res.json()).error);
        }
    }

    async function handleDelete(p: Project) {
        if (!confirm(`Xóa dự án "${p.name}"?`)) return;
        await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
        load();
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý Dự án</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary">+ Thêm dự án</button>
            </div>

            {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Tên</th>
                            <th className="px-4 py-3">Link</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Chưa có dự án.</td></tr>
                        ) : (
                            projects.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                                    <td className="px-4 py-3">{p.name}</td>
                                    <td className="px-4 py-3">
                                        <a href={p.link} target="_blank" rel="noreferrer" className="text-brand hover:underline">{p.link}</a>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setEditing(p)} className="text-brand hover:underline">Sửa</button>
                                        <button onClick={() => handleDelete(p)} className="ml-3 text-red-600 hover:underline">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
                    <form onSubmit={handleCreate} className="my-8 w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
                        <h2 className="text-lg font-semibold">Thêm dự án</h2>
                        <input name="name" placeholder="Tên dự án" required className="input" />
                        <input name="link" placeholder="https://..." required className="input" />
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
                        <h2 className="text-lg font-semibold">Sửa dự án</h2>
                        <input name="name" defaultValue={editing.name} required className="input" />
                        <input name="link" defaultValue={editing.link} required className="input" />
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