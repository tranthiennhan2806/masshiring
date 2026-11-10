const stats = [
  {
    value: "2019",
    label: "khởi đầu từ Mass Recruitment, tiền thân của Mass Hiring",
  },
  {
    value: "6",
    label: "nhóm ngành lao động phổ thông được phục vụ",
  },
  {
    value: "~1 triệu",
    label: "bài đăng tuyển dụng của mạng lưới #MassHiring, #MassRecruitment",
  },
  {
    value: "0 đồng",
    label: "thu trước từ doanh nghiệp; người lao động không mất phí",
  },
];

export function StatsSection() {
  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center lg:text-left">
              <div className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm leading-snug text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
