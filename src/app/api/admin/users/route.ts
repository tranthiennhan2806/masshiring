import { NextRequest, NextResponse } from "next/server";
import { getAllAdmins, createAdmin, updateAdmin, type Role } from "@/lib/admins";

function checkAuth(req: NextRequest) {
  const role = req.headers.get("x-admin-role");
  const password = req.headers.get("x-admin-password");
  // Simple: require password match env OR any logged-in session header
  const adminPassword = process.env.ADMIN_PASSWORD || "masshiring2026";
  if (password !== adminPassword && !role) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const users = await getAllAdmins();
    // Không trả password ra ngoài
    const safe = users.map(({ password, ...u }) => u);
    return NextResponse.json({ users: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-admin-role") as Role;
    if (role !== "super_admin" && req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
      // Only super_admin can create users (or env admin)
      const pwd = req.headers.get("x-admin-password");
      if (pwd !== (process.env.ADMIN_PASSWORD || "masshiring2026")) {
        return NextResponse.json({ error: "Chỉ Super Admin mới được tạo user" }, { status: 403 });
      }
    }

    const body = await req.json();
    const { username, password, name, role: newRole, status } = body;

    if (!username || !password || !name) {
      return NextResponse.json({ error: "Thiếu username, password hoặc name" }, { status: 400 });
    }

    const validRoles: Role[] = ["super_admin", "admin", "editor", "viewer"];
    if (newRole && !validRoles.includes(newRole)) {
      return NextResponse.json({ error: "Vai trò không hợp lệ" }, { status: 400 });
    }

    const user = await createAdmin({
      username,
      password,
      name,
      role: newRole || "viewer",
      status: status === "disabled" ? "disabled" : "active",
    });

    const { password: _, ...safe } = user;
    return NextResponse.json({ success: true, user: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, password, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    }

    const updated = await updateAdmin(id, {
      ...(name !== undefined && { name }),
      ...(password !== undefined && { password }),
      ...(role !== undefined && { role }),
      ...(status !== undefined && { status }),
    });

    const { password: _, ...safe } = updated;
    return NextResponse.json({ success: true, user: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
