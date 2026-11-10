// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "masshiring2026";

    if (email !== expectedUser || password !== expectedPass) {
      return NextResponse.json(
        { success: false, message: "Sai tài khoản hoặc mật khẩu" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: "1", email, name: "Admin", role: "admin" },
      token: "admin_token_" + Date.now(),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}