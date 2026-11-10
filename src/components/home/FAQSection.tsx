"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Mass Hiring thu phí doanh nghiệp như thế nào?",
    a: "Doanh nghiệp chỉ trả phí khi người lao động đang làm. Phí tính hàng tháng theo bảng công đã xác nhận. Không thu trước. Người nghỉ, phí dừng. Thay người không cộng dồn. ≤ 03 ngày công không tính phí.",
  },
  {
    q: "Người lao động có phải trả phí không?",
    a: "Không. Mass Hiring không thu phí người lao động. Mọi chi phí dịch vụ do doanh nghiệp chi trả.",
  },
  {
    q: "Ai ký hợp đồng lao động với người lao động?",
    a: "Doanh nghiệp ký hợp đồng lao động trực tiếp với người lao động. Mass Hiring chỉ hỗ trợ tìm nguồn, sàng lọc và đồng hành.",
  },
  {
    q: "Mass Hiring tuyển những vị trí nào?",
    a: "Lao động phổ thông thuộc 6 nhóm ngành: Logistics/TMĐT, Sản xuất/kho vận, F&B, Bán lẻ, BPO/số hóa, Gia đình/chăm sóc.",
  },
  {
    q: "HR Freelancer là ai?",
    a: "HR Freelancer là cộng tác viên tuyển dụng online của Mass Hiring. Họ đăng tin bằng tài khoản thật trong mạng lưới Nhân Hiệu, giới thiệu ứng viên và nhận hoa hồng khi ứng viên được nghiệm thu.",
  },
  {
    q: "Mass Hiring hoạt động ở khu vực nào?",
    a: "Phủ toàn quốc, tập trung các tỉnh/thành có nhu cầu lao động phổ thông lớn (TP.HCM, Bình Dương, Đồng Nai, Hà Nội, Bắc Ninh…).",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container-main">
        <h2 className="section-title text-center">Câu hỏi thường gặp</h2>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white ring-1 ring-gray-200 overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <span className="ml-4 text-xl text-gray-400">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <div
                className={cn(
                  "px-6 text-sm text-gray-600 transition-all",
                  openIndex === i ? "pb-5 max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                )}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
