import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-main py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-xl font-extrabold text-white">Mass Hiring</div>
            <p className="text-sm leading-relaxed text-gray-400">
              Tuyển lao động phổ thông số lượng lớn qua mạng lưới Nhân Hiệu.
              Doanh nghiệp trả phí theo ngày công; người lao động không mất phí.
            </p>
            <div className="text-xs text-gray-500">
              <p>Công ty TNHH Mass Hiring</p>
              <p>Mã số doanh nghiệp: 0318240807</p>
              <p>Đăng ký lần đầu ngày 04/01/2024</p>
              <p>tại Phòng Đăng ký kinh doanh, Sở Tài chính TP. Hồ Chí Minh</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Mass Hiring
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/doanh-nghiep" className="hover:text-white transition">
                  Dịch vụ cho doanh nghiệp
                </Link>
              </li>
              <li>
                <Link href="/doi-tac-cung-ung" className="hover:text-white transition">
                  Hợp tác cung ứng
                </Link>
              </li>
              <li>
                <Link href="/hr-freelancer" className="hover:text-white transition">
                  Làm HR Freelancer
                </Link>
              </li>
              <li>
                <Link href="/viec-lam" className="hover:text-white transition">
                  Việc làm đang tuyển
                </Link>
              </li>
              <li>
                <Link href="/ve-chung-toi" className="hover:text-white transition">
                  Về Mass Hiring
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-white transition">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <a href="tel:0905966105" className="hover:text-white">
                  0905 966 105
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>
                  Số 2, Đường Số 2, Khu dân cư Cityland,
                  <br />
                  Phường Gò Vấp, TP. Hồ Chí Minh
                  <br />
                  Tòa nhà Workflow Space, Lầu 2
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Bắt đầu ngay
            </h3>
            <div className="space-y-3">
              <Link
                href="/doanh-nghiep#gui-nhu-cau"
                className="block w-full rounded-full bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark transition"
              >
                Gửi nhu cầu tuyển
              </Link>
              <Link
                href="/hr-freelancer#dang-ky"
                className="block w-full rounded-full border border-gray-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:border-white transition"
              >
                Đăng ký HR Freelancer
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 Công ty TNHH Mass Hiring. Fast Hiring · Real People · Right Network.</p>
          <Link href="/chinh-sach-bao-mat" className="hover:text-white">
            Chính sách bảo mật
          </Link>
        </div>
      </div>
    </footer>
  );
}
