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
        <div className="container-main flex items-center justify-between py-3">
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="font-semibold">Dashboard</Link>
            <Link href="/admin/jobs">Jobs</Link>
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