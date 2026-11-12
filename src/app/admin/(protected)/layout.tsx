import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const isSuper = session.role === "super_admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container-main flex flex-wrap items-center justify-between py-3 gap-y-3">
          {/* Thêm flex-wrap để tab tự xuống dòng nếu màn hình nhỏ */}
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/admin" className="font-semibold">Dashboard</Link>
            <Link href="/admin/jobs">Jobs</Link>
            <Link href="/admin/posts">Bài Viết</Link> {/* <-- Thêm tab Posts ở đây */}
            <Link href="/admin/leads">Leads</Link>
            {isSuper && (
              <>
                <Link href="/admin/users">Users</Link>
                <Link href="/admin/projects">Projects</Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">
              {session.name} ({session.role})
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container-main py-8">{children}</main>
    </div>
  );
}