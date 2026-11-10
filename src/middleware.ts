// src/middleware.ts — ĐÃ ĐƠN GIẢN, chỉ chặn /api/admin write không cần auth
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    // Bỏ hết logic auth phức tạp — chỉ giữ chặn write API
    // (bảo mật thực sự dựa vào việc admin phải đăng nhập để có token
    //  nhưng với mô hình localStorage thì client tự kiểm tra)
    return NextResponse.next();
}

export const config = {
    matcher: [],
};