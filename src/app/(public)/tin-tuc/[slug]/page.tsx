"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  date: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string; // Lấy slug từ URL
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    // Gọi API theo slug (thực chất là ID trong DB)
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setPost(d.post || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Đang tải bài viết...</div>;
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="btn-primary mt-6 inline-flex">
          Quay lại Tin tức
        </Link>
      </div>
    );
  }

  return (
    <article className="py-16">
      <div className="container-main max-w-4xl mx-auto">
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/tin-tuc" className="hover:text-brand">Tin tức</Link> / <span>{post.category}</span>
        </div>

        {post.imageUrl && (
          <div className="mb-8 w-full max-h-[500px] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full object-cover max-h-[500px]"
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
            {post.category}
          </span>
          <span>{post.date}</span>
        </div>

        <p className="mt-6 text-lg text-gray-700 font-medium leading-relaxed">
          {post.excerpt}
        </p>

        {/* Render content với whitespace-pre-line để giữ nguyên format xuống dòng */}
        <div
          className="mt-8 prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 border-t pt-8 flex justify-center gap-4">
          <Link href="/tin-tuc" className="btn-secondary">
            Quay lại Tin tức
          </Link>
          <Link href="/doanh-nghiep" className="btn-primary">
            Gửi nhu cầu tuyển
          </Link>
        </div>
      </div>
    </article>
  );
}