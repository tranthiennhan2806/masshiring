// src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Trang login không cần check
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ready) return <div className="p-8 text-center text-sm text-gray-500">Đang tải...</div>;

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_login_time");
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container-main flex items-center justify-between py-3">
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="font-semibold">Dashboard</Link>
            <Link href="/admin/jobs">Jobs</Link>
            <Link href="/admin/leads">Leads</Link>
            <Link href="/admin/users">Users</Link>
          </nav>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="container-main py-8">{children}</main>
    </div>
  );
}