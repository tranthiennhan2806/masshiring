import { HRForm } from "@/components/forms/HRForm";

export const metadata = {
  title: "HR Freelancer: việc làm online, thu nhập minh bạch",
  description:
    "Làm HR Freelancer cùng Mass Hiring: việc làm online, chỉ cần smartphone, đào tạo miễn phí, hoa hồng khi ứng viên được nghiệm thu, có chứng từ thuế TNCN.",
};

export default function HRFreelancerPage() {
  return (
    <>
      <section className="bg-gray-900 py-16 text-white">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Dành cho HR Freelancer
              </div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Việc làm online, thu nhập minh bạch cùng Mass Hiring
              </h1>
              <p className="mt-4 text-gray-300">
                Nhận dự án tuyển dụng, đăng tin bằng tài khoản thật, giới thiệu ứng viên và nhận hoa
                hồng khi ứng viên được nghiệm thu. Không cần kinh nghiệm: chỉ cần smartphone, đào tạo
                miễn phí.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#dang-ky" className="btn-primary">
                  Đăng ký HR Freelancer
                </a>
                <a href="#5-buoc" className="btn-secondary !border-white/30 !bg-white/10 !text-white">
                  Xem 5 bước tham gia
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-brand p-6">
                <div className="text-3xl font-bold">1</div>
                <div className="mt-1 text-sm text-white/80">smartphone là đủ để bắt đầu</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">0 đồng</div>
                <div className="mt-1 text-sm text-white/80">phí đào tạo & ký năng tuyển dụng</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">~1 triệu</div>
                <div className="mt-1 text-sm text-white/80">bài đăng tuyển dụng của mạng lưới</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 bước */}
      <section id="5-buoc" className="py-16">
        <div className="container-main">
          <h2 className="section-title text-center">5 bước tham gia, không cần kinh nghiệm</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-5">
            {[
              { n: "1", title: "Đăng ký", desc: "Chỉ cần smartphone." },
              { n: "2", title: "Đào tạo miễn phí", desc: "Quy trình, thông tin dự án." },
              { n: "3", title: "Nhận mã định danh", desc: "Link JD riêng cho từng dự án." },
              { n: "4", title: "Tuyển dụng online", desc: "Đăng tin bằng tài khoản thật." },
              { n: "5", title: "Nhận thu nhập", desc: "Khi ứng viên được nghiệm thu." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-gray-50 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.n}
                </div>
                <div className="mt-3 font-semibold text-gray-900">{s.title}</div>
                <div className="mt-1 text-sm text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="dang-ky" className="bg-gray-50 py-16">
        <div className="container-main">
          <div className="mx-auto max-w-2xl">
            <h2 className="section-title text-center">Đăng ký làm HR Freelancer</h2>
            <p className="mt-3 text-center text-gray-600">
              Team Mass Hiring liên hệ để hướng dẫn đào tạo miễn phí và cấp mã định danh.
            </p>
            <div className="mt-8 space-y-3 text-center text-sm text-gray-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 ring-1 ring-gray-200">
                ✓ Không cần kinh nghiệm
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 ring-1 ring-gray-200">
                ✓ Chỉ cần smartphone
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 ring-1 ring-gray-200">
                ✓ Ký hợp đồng cộng tác, thu nhập có chứng từ
              </div>
            </div>
            <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <HRForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
