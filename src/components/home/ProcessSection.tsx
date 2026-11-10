const steps = [
  {
    title: "Doanh nghiệp",
    desc: "Gửi nhu cầu, phỏng vấn, xác nhận ngày công",
    icon: "📋",
  },
  {
    title: "Mass Hiring",
    desc: "Vận hành dự án, team HR riêng",
    icon: "⚙️",
    highlight: true,
  },
  {
    title: "HR Freelancer",
    desc: "Đăng tin, sàng lọc ứng viên",
    icon: "📱",
  },
  {
    title: "Ứng viên",
    desc: "Được tư vấn đúng việc, miễn phí",
    icon: "👤",
  },
];

const commitments = [
  {
    title: "Không thu trước",
    desc: "Doanh nghiệp trả phí hàng tháng, sau khi người lao động đã đi làm.",
  },
  {
    title: "Người nghỉ, phí dừng",
    desc: "Không trả phí cho ngày người lao động không làm.",
  },
  {
    title: "Thay người không cộng dồn",
    desc: "Mỗi vị trí tính phí cho người đang làm.",
  },
  {
    title: "≤ 03 ngày công không tính phí",
    desc: "Người làm từ 03 ngày công trở xuống không phát sinh phí.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">
            Doanh nghiệp chỉ trả phí khi người lao động đang làm
          </h2>
          <p className="mt-4 text-gray-600">
            Doanh nghiệp ký hợp đồng lao động trực tiếp với người lao động. Mass Hiring tìm nguồn,
            sàng lọc, giới thiệu và đồng hành; phí tính hàng tháng theo bảng công doanh nghiệp đã
            xác nhận.
          </p>
        </div>

        {/* 4 bên */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`relative rounded-2xl p-6 text-center ${
                step.highlight
                  ? "bg-brand text-white shadow-lg"
                  : "bg-white ring-1 ring-gray-200"
              }`}
            >
              <div className="text-3xl">{step.icon}</div>
              <div className="mt-3 font-semibold">{step.title}</div>
              <div
                className={`mt-1 text-sm ${
                  step.highlight ? "text-white/80" : "text-gray-500"
                }`}
              >
                {step.desc}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-gray-300 lg:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 4 cam kết */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-brand-50 p-5 ring-1 ring-brand/10"
            >
              <div className="font-semibold text-brand">{item.title}</div>
              <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
