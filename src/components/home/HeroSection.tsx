import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-900">
      {/* Background image placeholder - replace with real office photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />

      <div className="container-main relative py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Left content */}
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Tuyển lao động phổ thông số lượng lớn
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tuyển đủ
              <br />
              người.
              <br />
              <span className="text-brand">Trả phí theo ngày công.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-200 sm:text-lg">
              Mass Hiring tuyển lao động phổ thông qua mạng lưới HR Freelancer đăng tin bằng tài khoản thật.
              Doanh nghiệp không trả trước; người nghỉ, phí dừng.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/doanh-nghiep#gui-nhu-cau" className="btn-primary">
                Gửi nhu cầu tuyển
              </Link>
              <Link
                href="/doanh-nghiep#cach-tinh-phi"
                className="btn-secondary !border-white/30 !bg-white/10 !text-white hover:!bg-white/20"
              >
                Xem cách tính phí
              </Link>
            </div>
          </div>

          {/* Right - HR Nhân Hiệu card (mock social post) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  HR
                </div>
                <div>
                  <div className="font-semibold text-gray-900">HR Nhân Hiệu</div>
                  <div className="text-xs text-gray-500">
                    Tài khoản thật, đăng trong nhóm việc làm khu vực
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                Tuyển nhân viên đóng gói kho TMĐT, ca xoay, phỏng vấn tại kho. Không thu phí người lao động.
                Đăng ký ngay dưới bài nhé!
              </p>

              <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>Thích</span>
                <span>Bình luận</span>
                <span>Chia sẻ</span>
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-pink-300" />
                  Mình đăng ký nhé
                </div>
                <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  Cho mình hỏi làm ở đâu ạ?
                </div>
              </div>

              <p className="mt-3 text-center text-[11px] text-gray-400">
                Minh họa bài đăng tuyển dụng qua Nhân Hiệu
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
