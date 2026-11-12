import Link from "next/link";

export const metadata = {
  title: "Tin tức Mass Hiring",
  description: "Bài viết về tuyển dụng lao động phổ thông, HR Freelancer, phí tuyển dụng theo ngày công.",
};

const posts = [
  {
    slug: "tuyen-lao-dong-thoi-vu-tet",
    title: "Tuyển lao động thời vụ cao điểm Tết: lập kế hoạch từ sớm",
    excerpt: "Cách doanh nghiệp chuẩn bị nguồn lao động thời vụ trước Tết Nguyên đán để tránh thiếu hụt.",
    date: "12/2026",
    category: "Doanh nghiệp",
  },
  {
    slug: "tinh-phi-tuyen-dung-theo-ngay-cong",
    title: "Tính phí tuyển dụng theo ngày công: doanh nghiệp trả gì, khi nào?",
    excerpt: "Giải thích mô hình trả phí theo ngày công thực làm, so với phí tuyển 1 lần truyền thống.",
    date: "12/2026",
    category: "Doanh nghiệp",
  },
  {
    slug: "hr-freelancer-la-gi",
    title: "HR Freelancer là gì? Cách làm tuyển dụng online có thu nhập",
    excerpt: "Giới thiệu mô hình HR Freelancer của Mass Hiring: chỉ cần smartphone, đào tạo miễn phí.",
    date: "12/2026",
    category: "HR Freelancer",
  },
  {
    slug: "tuyen-nhan-vien-kho-tmdt",
    title: "Tuyển nhân viên kho TMĐT mùa cao điểm: tiêu chí và cách giữ người 03 ngày đầu",
    excerpt: "Kinh nghiệm tuyển và giữ chân nhân viên kho trong mùa cao điểm thương mại điện tử.",
    date: "12/2026",
    category: "Doanh nghiệp",
  },
];

export default function TinTucPage() {
  return (
    <section className="py-16">
      <div className="container-main">
        <h1 className="section-title">Tin tức</h1>
        <p className="mt-3 text-gray-600">
          Bài viết dành cho doanh nghiệp, đối tác cung ứng và HR Freelancer.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:ring-brand/30"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-medium text-brand">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                <Link href={`/tin-tuc/${post.slug}`} className="hover:text-brand">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
              >
                Đọc tiếp →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            Nội dung bài viết đầy đủ đang được hoàn thiện theo kế hoạch 12 bài trong 3 tháng.
          </p>
        </div>
      </div>
    </section>
  );
}
