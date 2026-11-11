// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    // Logic cũ của middleware (nếu có)
    // Ví dụ: chặn /admin nếu chưa có token trong cookie
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};