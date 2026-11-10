import Link from "next/link";

const audiences = [
  {
    href: "/doanh-nghiep",
    icon: "🏢",
    title: "Tuyển người cho doanh nghiệp",
    desc: "Trả phí theo ngày công thực làm",
  },
  {
    href: "/doi-tac-cung-ung",
    icon: "🤝",
    title: "Thêm nguồn cho đơn hàng cung ứng",
    desc: "Tôn trọng khách hàng của nhau",
  },
  {
    href: "/hr-freelancer",
    icon: "📱",
    title: "Làm HR Freelancer online",
    desc: "Đào tạo miễn phí, chỉ cần smartphone",
  },
  {
    href: "/viec-lam",
    icon: "👤",
    title: "Tìm việc làm phổ thông",
    desc: "Việc thật, không mất phí",
  },
];

export function AudienceCards() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container-main">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Bạn đến Mass Hiring để
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-brand/20"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-brand transition">
                  {item.title}
                </div>
                <div className="mt-1 text-sm text-gray-500">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
