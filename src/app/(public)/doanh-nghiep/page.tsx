import { BusinessForm } from "@/components/forms/BusinessForm";
import Link from "next/link";

export const metadata = {
  title: "Dịch vụ tuyển lao động phổ thông số lượng lớn",
  description:
    "Tuyển lao động phổ thông số lượng lớn cho logistics, sản xuất, F&B, bán lẻ. Không thu trước, trả phí theo ngày công thực làm, thay người không cộng dồn.",
};

export default function DoanhNghiepPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Dành cho doanh nghiệp
              </div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Tuyển lao động phổ thông số lượng lớn, trả phí theo ngày công
              </h1>
              <p className="mt-4 text-gray-300">
                Mass Hiring tuyển đủ người cho mùa cao điểm, nhà máy mới, ca xoay. Doanh nghiệp chỉ
                trả phí cho người đang làm, hàng tháng, theo bảng công đã xác nhận.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#gui-nhu-cau" className="btn-primary">
                  Gửi nhu cầu tuyển
                </a>
                <a
                  href="#cach-tinh-phi"
                  className="btn-secondary !border-white/30 !bg-white/10 !text-white"
                >
                  Xem cách tính phí
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-brand p-6">
                <div className="text-3xl font-bold">0 đồng</div>
                <div className="mt-1 text-sm text-white/80">thu trước</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">03</div>
                <div className="mt-1 text-sm text-white/80">ngày công đầu không tính phí</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-3xl font-bold">1</div>
                <div className="mt-1 text-sm text-white/80">đầu mối duy nhất (PM)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 vấn đề */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="section-title text-center">
            Bốn vấn đề khi tuyển số lượng lớn
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Tuyển không kịp", desc: "Cao điểm, nhà máy mới, ca xoay thiếu người liên tục." },
              { title: "Người mới nghỉ sớm", desc: "Phí tuyển 1 lần mất trắng nếu nghỉ sau 30 ngày." },
              { title: "Sai tiêu chí, hồ sơ ảo", desc: "Ứng viên không đúng nguồn, không đến phỏng vấn." },
              { title: "Rủi ro pháp lý, thương hiệu", desc: "Tin tuyển ảo làm mất uy tín doanh nghiệp." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-gray-50 p-6">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cách tính phí */}
      <section id="cach-tinh-phi" className="bg-gray-50 py-16">
        <div className="container-main">
          <h2 className="section-title text-center">
            Cách tính phí: chỉ trả khi người lao động đang làm
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Thanh toán hàng tháng theo bảng công đã xác nhận. Lợi ích cùng chiều: Mass Hiring chỉ
            có doanh thu khi người lao động còn đang làm.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Không thu trước", desc: "Doanh nghiệp trả phí hàng tháng, sau khi người lao động đã đi làm." },
              { title: "Người nghỉ, phí dừng", desc: "Không trả phí cho ngày người lao động không làm." },
              { title: "Thay người không cộng dồn", desc: "Mỗi vị trí chỉ tính phí cho người đang làm." },
              { title: "≤ 03 ngày công không tính phí", desc: "Người làm từ 03 ngày công trở xuống không phát sinh phí." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
                <div className="font-semibold text-brand">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="gui-nhu-cau" className="py-16">
        <div className="container-main">
          <div className="mx-auto max-w-2xl">
            <h2 className="section-title text-center">Gửi nhu cầu tuyển dụng</h2>
            <p className="mt-3 text-center text-gray-600">
              Bộ phận Kinh doanh sẽ liên hệ để đối thoại và gửi phương án cho doanh nghiệp.
            </p>
            <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <BusinessForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
