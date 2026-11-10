// src/app/api/admin/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Thiếu email" },
                { status: 400 }
            );
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        const webhookUrl =
            process.env.ADMIN_DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content:
                            `🔐 **MÃ XÁC THỰC 2FA**\n\n` +
                            `👤 **Tài khoản:** ${email}\n` +
                            `🔑 **Mã OTP:** \`${otp}\`\n` +
                            `⏰ **Hiệu lực:** 5 phút`,
                    }),
                });
            } catch (e) {
                console.warn("Discord webhook failed:", e);
            }
        }

        return NextResponse.json({ success: true, otp });
    } catch {
        return NextResponse.json(
            { success: false, message: "Lỗi server" },
            { status: 500 }
        );
    }
}