export const metadata = {
  title: "Chính sách bảo mật dữ liệu",
  description: "Chính sách bảo vệ dữ liệu cá nhân của Công ty TNHH Mass Hiring.",
};

export default function ChinhSachBaoMatPage() {
  return (
    <section className="py-16">
      <div className="container-main">
        <div className="mx-auto max-w-3xl">
          <h1 className="section-title">Chính sách bảo mật dữ liệu</h1>
          <p className="mt-4 text-sm text-gray-500">
            Cập nhật lần cuối: Tháng 11/2026 · Công ty TNHH Mass Hiring
          </p>

          <div className="prose prose-gray mt-10 max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">1. Phạm vi áp dụng</h2>
              <p className="mt-2">
                Chính sách này áp dụng cho việc thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân
                của khách hàng doanh nghiệp, đối tác cung ứng, HR Freelancer và người lao động / ứng viên
                khi sử dụng website masshiring hoặc các dịch vụ của Công ty TNHH Mass Hiring (MST 0318240807).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">2. Dữ liệu chúng tôi thu thập</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Họ tên, số điện thoại, email</li>
                <li>Tên công ty, chức vụ (đối với doanh nghiệp / đối tác)</li>
                <li>Tỉnh/thành, khu vực làm việc mong muốn</li>
                <li>Thông tin ứng tuyển: vị trí, năm sinh (nếu có), mã HR giới thiệu</li>
                <li>Dữ liệu kỹ thuật: UTM, trang gửi form, thời gian gửi</li>
              </ul>
              <p className="mt-2">
                Chúng tôi <strong>không</strong> yêu cầu CCCD, ảnh giấy tờ hoặc địa chỉ nhà trên form website.
                Việc đối chiếu CCCD (nếu cần) chỉ thực hiện ở bước sàng lọc sau khi ứng viên đồng ý.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">3. Mục đích sử dụng</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Xử lý nhu cầu tuyển dụng / đơn hàng cung ứng / đăng ký HR Freelancer</li>
                <li>Liên hệ tư vấn, gửi phương án, hỗ trợ đào tạo</li>
                <li>Giới thiệu việc làm phù hợp cho ứng viên (trong phạm vi đồng ý)</li>
                <li>Cải thiện dịch vụ và báo cáo nội bộ</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">4. Thời hạn lưu trữ</h2>
              <p className="mt-2">
                Dữ liệu lead và ứng viên được lưu trong hệ thống quản lý tối đa theo nhu cầu nghiệp vụ
                và quy định pháp luật. Lead hết hạn hoặc yêu cầu xóa sẽ được xử lý theo quy trình nội bộ.
                Ứng viên đồng ý có thể được giới thiệu việc làm phù hợp khác trong thời hạn tối đa 06 tháng
                kể từ lần gửi thông tin gần nhất (trừ khi có thỏa thuận khác).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">5. Chia sẻ dữ liệu</h2>
              <p className="mt-2">
                Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được chia sẻ với:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Doanh nghiệp tuyển dụng (khi ứng viên đồng ý ứng tuyển)</li>
                <li>Đối tác cung ứng (theo thỏa thuận hợp tác, tôn trọng khách hàng của nhau)</li>
                <li>Nhà cung cấp dịch vụ kỹ thuật (hosting, email) theo hợp đồng bảo mật</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">6. Quyền của bạn</h2>
              <p className="mt-2">
                Bạn có quyền yêu cầu truy cập, chỉnh sửa, xóa hoặc hạn chế xử lý dữ liệu cá nhân của mình.
                Gửi yêu cầu về email / hotline công ty. Chúng tôi sẽ phản hồi trong thời hạn hợp lý theo quy định.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">7. Liên hệ</h2>
              <p className="mt-2">
                Công ty TNHH Mass Hiring<br />
                Địa chỉ: Số 2, Đường Số 2, KDC Cityland, Phường Gò Vấp, TP. Hồ Chí Minh<br />
                Hotline:{" "}
                <a href="tel:0905966105" className="text-brand underline">
                  0905 966 105
                </a>
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Tài liệu này là bản nháp tham khảo. Cần được pháp chế duyệt trước khi công bố chính thức
              theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và các văn bản hướng dẫn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
