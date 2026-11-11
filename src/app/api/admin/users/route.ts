import { NextRequest, NextResponse } from "next/server";
import { getAllAdmins, createAdmin } from "@/lib/admins";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return auth.response;
  try {
    const users = await getAllAdmins();
    const safe = users.map(({ passwordHash, ...u }) => u);
    return NextResponse.json({ users: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = await req.json();
    const { username, password, name, role, status } = body;
    if (!username || !password || !name) {
      return NextResponse.json({ error: "Thiếu username, password hoặc name" }, { status: 400 });
    }

    // Không cho trùng username super admin env
    if (username === process.env.SUPER_ADMIN_USERNAME) {
      return NextResponse.json(
        { error: "Username này được dành riêng cho Super Admin env" },
        { status: 400 }
      );
    }

    const user = await createAdmin({
      username,
      password,
      name,
      role: role || "viewer",
      status: status === "disabled" ? "disabled" : "active",
    });
    const { passwordHash, ...safe } = user;
    return NextResponse.json({ success: true, user: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}