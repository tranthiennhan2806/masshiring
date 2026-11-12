"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
    id: string;
    title: string;
    category: string;
    date: string;
    status: "published" | "draft";
};

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/posts?all=1");
        const data = await res.json();
        setPosts(data.posts || []);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Xóa bài viết "${title}"? Không thể hoàn tác.`)) return;
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức</h1>
                    <p className="mt-1 text-sm text-gray-500">Quản lý bài viết hiển thị trên website</p>
                </div>
                <Link href="/admin/posts/new" className="btn-primary text-center">
                    + Viết bài mới
                </Link>
            </div>

            {loading ? (
                <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>
            ) : posts.length === 0 ? (
                <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-gray-200">
                    <p className="text-gray-600">Chưa có bài viết nào.</p>
                </div>
            ) : (
                <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                    <table className="w-full text-sm hidden md:table">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-600">Tiêu đề</th>
                                <th className="px-4 py-3 font-medium text-gray-600">Chuyên mục</th>
                                <th className="px-4 py-3 font-medium text-gray-600">Ngày</th>
                                <th className="px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                                <th className="px-4 py-3 font-medium text-gray-600 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((p) => (
                                <tr key={p.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-xs">{p.title}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.date}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "published" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {p.status === "published" ? "Đã đăng" : "Bản nháp"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex gap-3">
                                            <Link href={`/tin-tuc/${p.id}`} target="_blank" className="text-gray-500 hover:underline">Xem</Link>
                                            <Link href={`/admin/posts/${p.id}/edit`} className="text-brand hover:underline">Sửa</Link>
                                            <button onClick={() => handleDelete(p.id, p.title)} className="text-red-600 hover:underline">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {posts.map((p) => (
                            <div key={p.id} className="p-4">
                                <div className="font-medium text-gray-900">{p.title}</div>
                                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                    <span>{p.category}</span>
                                    <span>{p.date}</span>
                                    <span className={`px-2 py-0.5 rounded-full ${p.status === "published" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                        {p.status === "published" ? "Đã đăng" : "Nháp"}
                                    </span>
                                </div>
                                <div className="mt-3 flex gap-3 text-sm">
                                    <Link href={`/tin-tuc/${p.id}`} target="_blank" className="text-gray-500 hover:underline">Xem</Link>
                                    <Link href={`/admin/posts/${p.id}/edit`} className="text-brand hover:underline">Sửa</Link>
                                    <button onClick={() => handleDelete(p.id, p.title)} className="text-red-600 hover:underline">Xóa</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}