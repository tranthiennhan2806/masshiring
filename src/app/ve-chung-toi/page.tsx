import Link from "next/link";

export const metadata = {
  title: "Về Mass Hiring: giá trị, đội ngũ, thông tin pháp lý",
  description:
    "Công ty TNHH Mass Hiring, MST 0318240807, tiền thân Mass Recruitment từ 2019. Fast Hiring, Real People, Right Network; trụ sở Gò Vấp, TP. Hồ Chí Minh.",
};

export default function VeChungToiPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Về Mass Hiring
              </div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Đối tác tuyển dụng tin cậy, tạo việc làm cho cộng đồng
              </h1>
              <p className="mt-4 text-gray-300">
                Công ty TNHH Mass Hiring tuyển lao động phổ thông số lượng lớn qua mạng lưới Nhân Hiệu.
                Tiền thân là Mass Recruitment, hoạt động từ năm 2019.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/lien-he" className="btn-primary">Liên hệ</Link>
                <a href="#phap-ly" className="btn-secondary !border-white/30 !bg-white/10 !text-white">
                  Thông tin pháp lý
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-brand p-6">
                <div className="text-3xl font-bold">2019</div>
                <div className="mt-1 text-sm text-white/80">khởi đầu từ Mass Recruitment</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-2xl font-bold">0318240807</div>
                <div className="mt-1 text-sm text-white/80">mã số doanh nghiệp</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">Toàn quốc</div>
                <div className="mt-1 text-sm text-white/80">6 nhóm ngành</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="section-title text-center">Giá trị cốt lõi</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Triết lý: tư duy đồng cảm. Phong cách: tập trung vào kết quả.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Fast Hiring", desc: "Tuyển nhanh: có ứng viên sớm, đúng mùa cao điểm." },
              { title: "Real People", desc: "Người thật, dữ liệu thật: ứng viên xác minh, có mã nguồn." },
              { title: "Right Network", desc: "Đúng mạng lưới, đúng người: đúng khu vực, đúng nhóm ứng viên." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-gray-50 p-6 text-center">
                <div className="text-lg font-bold text-brand">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Applicant", desc: "Con người là trung tâm." },
              { title: "Alignment", desc: "Tốc độ đi cùng chất lượng." },
              { title: "Advocate", desc: "Mỗi Nhân Hiệu lan tỏa cơ hội việc làm." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-4 text-center ring-1 ring-gray-200">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-1 text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 bên cùng có lợi */}
      <section className="bg-gray-50 py-16">
        <div className="container-main">
          <h2 className="section-title text-center">Một mô hình, bốn bên cùng có lợi</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Vòng tăng trưởng: thêm dự án, thêm HR Freelancer, độ phủ rộng hơn, tuyển nhanh hơn, thêm khách hàng.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Doanh nghiệp", desc: "Đủ người; chỉ trả phí cho người đang làm." },
              { title: "HR Freelancer", desc: "Thu nhập online; đào tạo miễn phí." },
              { title: "Người lao động", desc: "Việc làm thật, miễn phí, được đồng hành." },
              { title: "Cộng đồng", desc: "Thêm việc làm thật, ít tin ảo." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ban lãnh đạo */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="section-title text-center">Ban lãnh đạo và cơ cấu tổ chức</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Khách hàng làm việc với một đầu mối duy nhất là PM của Mass Hiring. HR Freelancer không trao đổi trực tiếp với khách hàng.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { name: "Bà Nguyễn Thị Thu Hà", role: "Founder, Giám đốc vận hành" },
              { name: "Ông Phạm Hùng Trung", role: "Founder, Giám đốc kinh doanh" },
              { name: "Ông Trần Quang Hải", role: "Đầu tư, Người đại diện theo pháp luật" },
            ].map((p) => (
              <div key={p.name} className="rounded-2xl bg-gray-900 p-6 text-center text-white">
                <div className="text-lg font-semibold">{p.name}</div>
                <div className="mt-1 text-sm text-gray-300">{p.role}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Hậu cần", desc: "Kế toán, hành chính nhân sự, hợp đồng công ty." },
              { title: "Team dự án", desc: "PM là đầu mối duy nhất với khách hàng; kỹ thuật tuyển, quản lý nguồn." },
              { title: "Đội HR Freelancer", desc: "Nhận dự án, đăng tin, sàng lọc, căn bản hỗ trợ khi cần." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-gray-50 p-5">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-1 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thông tin pháp lý */}
      <section id="phap-ly" className="bg-gray-50 py-16">
        <div className="container-main">
          <h2 className="section-title text-center">Thông tin pháp lý</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
            Theo Giấy chứng nhận đăng ký doanh nghiệp do Phòng Đăng ký kinh doanh, Sở Tài chính TP. Hồ Chí Minh cấp.
          </p>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Tên doanh nghiệp", "CÔNG TY TNHH MASS HIRING"],
                  ["Tên tiếng Anh", "MASS HIRING COMPANY LIMITED"],
                  ["Mã số doanh nghiệp, MST", "0318240807"],
                  ["Đăng ký lần đầu", "04/01/2024"],
                  ["Loại hình", "Công ty TNHH hai thành viên trở lên"],
                  ["Trụ sở chính", "Số 2, Đường Số 2, Khu dân cư Cityland, Phường Gò Vấp, TP. Hồ Chí Minh"],
                  ["Vốn điều lệ", "1.000.000.000 đồng"],
                  ["Người đại diện theo pháp luật", "Ông Trần Quang Hải, Giám đốc"],
                ].map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-6 py-3 font-medium text-gray-700 w-2/5">{label}</td>
                    <td className="px-6 py-3 text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <h3 className="font-semibold text-gray-900">Văn phòng làm việc</h3>
            <p className="mt-2 text-sm text-gray-600">
              Tòa nhà Workflow Space, Lầu 2, góc Đường Số 2, KDC Cityland Park Hills, Phường Gò Vấp.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
