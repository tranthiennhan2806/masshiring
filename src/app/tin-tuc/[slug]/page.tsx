import Link from "next/link";

export default function BlogPostPage() {
  return (
    <section className="py-16">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="section-title">Bài viết đang được hoàn thiện</h1>
          <p className="mt-4 text-gray-600">
            Nội dung chi tiết sẽ được cập nhật theo kế hoạch 12 bài trong 3 tháng (từ 12/2026).
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/tin-tuc" className="btn-secondary">
              Quay lại Tin tức
            </Link>
            <Link href="/doanh-nghiep" className="btn-primary">
              Gửi nhu cầu tuyển
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
