import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mass Hiring: tuyển lao động phổ thông số lượng lớn",
    template: "%s | Mass Hiring",
  },
  description:
    "Tuyển lao động phổ thông số lượng lớn cho 6 nhóm ngành qua mạng lưới HR Freelancer. Không thu trước, người nghỉ phí dừng, người lao động không mất phí.",
  keywords: [
    "Mass Hiring",
    "tuyển dụng số lượng lớn",
    "tuyển lao động phổ thông",
    "HR Freelancer",
    "tuyển công nhân",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Mass Hiring",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}