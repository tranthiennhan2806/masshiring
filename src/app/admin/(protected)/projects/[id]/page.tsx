"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Project, ProjectLink } from "@/lib/projects";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState("");
    const [savingName, setSavingName] = useState(false);

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [editingLink, setEditingLink] = useState<{ index: number; link: ProjectLink } | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch(`/api/admin/projects/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
            setProject(data.project);
            setNameDraft(data.project.name);
        } else setError(data.error);
        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const filteredLinks = useMemo(() => {
        if (!project) return [];
        const q = search.trim().toLowerCase();
        if (!q) return project.links;
        return project.links.filter(
            (l) => l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
        );
    }, [project, search]);

    async function saveName() {
        if (!project || !nameDraft.trim() || nameDraft === project.name) {
            setEditingName(false);
            return;
        }
        setSavingName(true);
        try {
            const res = await fetch(`/api/admin/projects/${project.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameDraft.trim() }),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            await load();
            setEditingName(false);
        } catch (err: any) {
            alert("Lỗi: " + err.message);
        } finally {
            setSavingName(false);
        }
    }

    async function deleteLink(index: number) {
        if (!project) return;
        if (!confirm("Xóa link này?")) return;
        const newLinks = project.links.filter((_, i) => i !== index);
        const res = await fetch(`/api/admin/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ links: newLinks }),
        });
        if (res.ok) load();
        else alert("Lỗi: " + (await res.json()).error);
    }

    if (loading) {
        return <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>;
    }
    if (!project) {
        return (
            <div className="mt-10 text-center">
                <p className="text-red-600">{error || "Không tìm thấy dự án"}</p>
                <Link href="/admin/projects" className="btn-primary mt-4 inline-flex">
                    Quay lại
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-500">
                <Link href="/admin/projects" className="hover:text-brand">
                    Dự án
                </Link>
                {" / "}
                <span className="text-gray-900">{project.name}</span>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1">
                    {editingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                className="input max-w-md text-lg font-bold"
                                autoFocus
                            />
                            <button
                                onClick={saveName}
                                disabled={savingName}
                                className="btn-primary text-sm"
                            >
                                {savingName ? "..." : "Lưu"}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingName(false);
                                    setNameDraft(project.name);
                                }}
                                className="btn-secondary text-sm"
                            >
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <h1
                            onClick={() => setEditingName(true)}
                            className="cursor-pointer text-2xl font-bold hover:text-brand"
                            title="Click để sửa tên"
                        >
                            {project.name}
                        </h1>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        ID: <code className="text-xs">{project.id}</code> · Tạo lúc: {project.createdAt}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingLink(null);
                        setShowLinkModal(true);
                    }}
                    className="btn-primary"
                >
                    + Thêm link
                </button>
            </div>

            {/* Search */}
            <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-gray-200">
                <label className="block text-xs font-medium text-gray-600">Tìm kiếm link</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tên link hoặc URL..."
                    className="input mt-1"
                />
                <p className="mt-2 text-xs text-gray-500">
                    {filteredLinks.length}/{project.links.length} link
                </p>
            </div>

            {/* Danh sách link */}
            <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Tên link</th>
                            <th className="px-4 py-3">URL</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLinks.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                    {project.links.length === 0
                                        ? "Dự án chưa có link nào. Bấm '+ Thêm link' để tạo."
                                        : "Không có link khớp tìm kiếm."}
                                </td>
                            </tr>
                        ) : (
                            filteredLinks.map((link, i) => {
                                const realIndex = project.links.indexOf(link);
                                return (
                                    <tr key={i} className="border-t">
                                        <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium">{link.name}</td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-brand hover:underline break-all"
                                            >
                                                {link.url}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => {
                                                    setEditingLink({ index: realIndex, link });
                                                    setShowLinkModal(true);
                                                }}
                                                className="text-brand hover:underline"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => deleteLink(realIndex)}
                                                className="ml-3 text-red-600 hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {showLinkModal && (
                <LinkModal
                    projectId={project.id}
                    existing={editingLink}
                    onClose={() => setShowLinkModal(false)}
                    onSaved={load}
                />
            )}
        </div>
    );
}

/* ---------- Modal thêm/sửa link ---------- */

function LinkModal({
    projectId,
    existing,
    onClose,
    onSaved,
}: {
    projectId: string;
    existing: { index: number; link: ProjectLink } | null;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [name, setName] = useState(existing?.link.name || "");
    const [url, setUrl] = useState(existing?.link.url || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/admin/projects/${projectId}`, { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const currentLinks: ProjectLink[] = data.project.links || [];

            let newLinks: ProjectLink[];
            if (existing) {
                newLinks = currentLinks.map((l, i) =>
                    i === existing.index ? { name, url } : l
                );
            } else {
                newLinks = [...currentLinks, { name, url }];
            }

            const saveRes = await fetch(`/api/admin/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links: newLinks }),
            });
            if (!saveRes.ok) throw new Error((await saveRes.json()).error);

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
            <form onSubmit={submit} className="my-8 w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
                <h2 className="text-lg font-semibold">
                    {existing ? "Sửa link" : "Thêm link"}
                </h2>
                <div>
                    <label className="block text-sm font-medium">Tên link *</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input mt-1"
                        placeholder="VD: Production, Staging, GitHub..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">URL *</label>
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        type="url"
                        className="input mt-1"
                        placeholder="https://..."
                    />
                </div>
                {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Hủy
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </form>
        </div>
    );
}