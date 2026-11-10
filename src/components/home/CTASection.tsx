import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container-main">
        <div className="rounded-3xl bg-brand px-8 py-12 text-center text-white shadow-xl sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Cần người cho đợt cao điểm sắp tới?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Gửi vị trí, số lượng, khu vực và thời gian cần người. Bộ phận Kinh doanh khảo sát và đề
            xuất phương án cho doanh nghiệp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/doanh-nghiep#gui-nhu-cau"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand shadow hover:bg-gray-50 transition"
            >
              Gửi nhu cầu tuyển
            </Link>
            <Link
              href="/hr-freelancer#dang-ky"
              className="rounded-full border-2 border-white/40 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Đăng ký HR Freelancer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
