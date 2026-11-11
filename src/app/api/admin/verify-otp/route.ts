import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const challengeId: string = body.challengeId;
        const code: string = String(body.code || "").replace(/\D/g, "");

        if (!challengeId || code.length !== 6) {
            return NextResponse.json({ error: "Invalid input", reason: "bad_input" }, { status: 400 });
        }

        const result = verifyOtp(challengeId, code);
        if (!result.ok) {
            return NextResponse.json(
                { error: "Mã OTP không đúng hoặc đã hết hạn", reason: result.reason },
                { status: 401 }
            );
        }

        const token = await createSession(result.username, result.name, result.role);

        const res = NextResponse.json({
            ok: true,
            user: { username: result.username, name: result.name, role: result.role },
        });
        res.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 2,
        });
        return res;
    } catch (err: any) {
        console.error("verify-otp error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}