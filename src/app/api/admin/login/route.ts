import { NextRequest, NextResponse } from "next/server";
import { findAdminByUsername, verifyPassword } from "@/lib/admins";
import { createOtp } from "@/lib/otp-store";
import { sendOtpToDiscord } from "@/lib/discord";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 1. Super Admin từ env — ưu tiên cao nhất
    const superUser = process.env.SUPER_ADMIN_USERNAME;
    const superPass = process.env.SUPER_ADMIN_PASSWORD;
    if (superUser && superPass && username === superUser && password === superPass) {
      const { challengeId, code } = createOtp(superUser, "Super Admin", "super_admin");
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
      await sendOtpToDiscord(superUser, code, ip);
      return NextResponse.json({ ok: true, challengeId });
    }

    // 2. Admin thường từ env (fallback)
    const envUser = process.env.ADMIN_USERNAME || "admin";
    const envPass = process.env.ADMIN_PASSWORD || "masshiring2026";
    if (username === envUser && password === envPass) {
      const { challengeId, code } = createOtp(envUser, "Admin", "admin");
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
      await sendOtpToDiscord(envUser, code, ip);
      return NextResponse.json({ ok: true, challengeId });
    }

    // 3. User từ Google Sheet
    const user = await findAdminByUsername(username);
    if (!user) {
      return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
    }
    const ok = await verifyPassword(user, password);
    if (!ok) {
      return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
    }

    const { challengeId, code } = createOtp(user.username, user.name, user.role);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    await sendOtpToDiscord(user.username, code, ip);

    return NextResponse.json({ ok: true, challengeId });
  } catch (err: any) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}