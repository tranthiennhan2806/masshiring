"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [filterLinks, setFilterLinks] = useState<"all" | "with" | "without">("all");
    const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    async function load() {
        const res = await fetch("/api/admin/projects", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setProjects(data.projects || []);
        else setError(data.error);
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        let list = projects;
        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.id.toLowerCase().includes(q) ||
                    p.links.some(
                        (l) =>
                            l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
                    )
            );
        }
        if (filterLinks === "with") list = list.filter((p) => p.links.length > 0);
        if (filterLinks === "without") list = list.filter((p) => p.links.length === 0);
        if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "newest")
            list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        if (sort === "oldest")
            list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        return list;
    }, [projects, search, filterLinks, sort]);

    async function handleDelete(p: Project) {
        if (!confirm(`Xóa dự án "${p.name}"?`)) return;
        await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
        load();
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Dự án</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Mỗi dự án có thể chứa nhiều link chi tiết
                    </p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    + Thêm dự án
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Bộ lọc */}
            <div className="mt-6 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200 sm:grid-cols-3">
                <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-600">Tìm kiếm</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tên, ID, tên link..."
                        className="input mt-1"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600">Số link</label>
                    <select
                        value={filterLinks}
                        onChange={(e) => setFilterLinks(e.target.value as any)}
                        className="input mt-1"
                    >
                        <option value="all">Tất cả</option>
                        <option value="with">Có link</option>
                        <option value="without">Chưa có link</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600">Sắp xếp</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="input mt-1"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="name">Theo tên</option>
                    </select>
                </div>
            </div>

            {/* Bảng */}
            <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Tên dự án</th>
                            <th className="px-4 py-3">Số link</th>
                            <th className="px-4 py-3">Ngày tạo</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Không có dự án nào khớp.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                                            {p.links.length} link
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{p.createdAt}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex gap-3">
                                            <Link
                                                href={`/admin/projects/${p.id}`}
                                                className="text-gray-600 hover:underline"
                                            >
                                                Xem chi tiết
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && <ProjectFormModal onClose={() => setShowForm(false)} onSaved={load} />}
        </div>
    );
}

/* -------- Modal thêm dự án -------- */

function ProjectFormModal({
    onClose,
    onSaved,
}: {
    onClose: () => void;
    onSaved: () => void;
}) {
    const [name, setName] = useState("");
    const [links, setLinks] = useState<{ name: string; url: string }[]>([
        { name: "", url: "" },
    ]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function updateLink(i: number, field: "name" | "url", value: string) {
        setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
    }
    function addLink() {
        setLinks((prev) => [...prev, { name: "", url: "" }]);
    }
    function removeLink(i: number) {
        setLinks((prev) => prev.filter((_, idx) => idx !== i));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const cleaned = links.filter((l) => l.name.trim() && l.url.trim());
            const res = await fetch("/api/admin/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, links: cleaned }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Tạo dự án thất bại");
            onSaved();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
            <form
                onSubmit={submit}
                className="my-8 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6"
            >
                <h2 className="text-lg font-semibold">Thêm dự án</h2>
                <div>
                    <label className="block text-sm font-medium">Tên dự án *</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input mt-1"
                        placeholder="VD: Website Mass Hiring"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Các link chi tiết</label>
                        <button type="button" onClick={addLink} className="text-sm text-brand hover:underline">
                            + Thêm link
                        </button>
                    </div>
                    <div className="mt-2 space-y-2">
                        {links.map((l, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={l.name}
                                    onChange={(e) => updateLink(i, "name", e.target.value)}
                                    placeholder="Tên link (VD: Staging)"
                                    className="input flex-1"
                                />
                                <input
                                    value={l.url}
                                    onChange={(e) => updateLink(i, "url", e.target.value)}
                                    placeholder="https://..."
                                    className="input flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLink(i)}
                                    disabled={links.length === 1}
                                    className="rounded-lg px-2 text-red-600 hover:bg-red-50 disabled:opacity-30"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Hủy
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? "Đang tạo..." : "Tạo dự án"}
                    </button>
                </div>
            </form>
        </div>
    );
}