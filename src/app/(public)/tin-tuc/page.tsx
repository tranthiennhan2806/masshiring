"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  date: string;
};

export default function TinTucPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16">
      <div className="container-main">
        <h1 className="section-title">Tin tức</h1>
        <p className="mt-3 text-gray-600">
          Bài viết dành cho doanh nghiệp, đối tác cung ứng và HR Freelancer.
        </p>

        {loading ? (
          <div className="mt-10 text-center text-gray-500">Đang tải bài viết...</div>
        ) : posts.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
            Chưa có bài viết nào.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:ring-brand/30 hover:shadow-md"
              >
                {post.imageUrl && (
                  <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover transition hover:scale-105" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-medium text-brand">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-gray-900">
                    {/* Chú ý: href trỏ đến post.id (chính là slug) */}
                    <Link href={`/tin-tuc/${post.id}`} className="hover:text-brand">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{post.excerpt}</p>
                  <Link
                    href={`/tin-tuc/${post.id}`}
                    className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
                  >
                    Đọc tiếp →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}