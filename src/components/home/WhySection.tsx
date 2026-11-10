const problems = [
  "Tin tuyển dụng tràn lan, khó kiểm chứng",
  "Người tìm việc dễ gặp tin ảo, bị thu phí",
  "Kênh truyền thống chậm, khó tuyển gấp",
];

const solutions = [
  {
    title: "Không thu phí người lao động",
    desc: "Doanh nghiệp là bên trả phí dịch vụ.",
  },
  {
    title: "Thông tin rõ ràng",
    desc: "Công việc, địa điểm, quyền lợi.",
  },
  {
    title: "Bảo mật dữ liệu",
    desc: "Chỉ xử lý khi ứng viên đồng ý.",
  },
  {
    title: "Việc làm thật",
    desc: "Mọi tin gắn với dự án đã ký.",
  },
  {
    title: "Tài khoản thật",
    desc: "Danh tính thật, nội dung đã duyệt.",
  },
  {
    title: "Xử lý vi phạm",
    desc: "Vi phạm tiêu chuẩn cộng đồng bị xử lý theo quy định.",
  },
];

export function WhySection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container-main">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-gray-900 p-8 text-white">
            <h3 className="text-lg font-semibold">Thị trường hiện nay</h3>
            <ul className="mt-6 space-y-4">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-0.5 text-red-400">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-8 ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Cách Mass Hiring làm
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {solutions.map((s) => (
                <div key={s.title}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand">
                    <span>✓</span> {s.title}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
