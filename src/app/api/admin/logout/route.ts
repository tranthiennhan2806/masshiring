// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Với mô hình localStorage, logout làm hoàn toàn ở client
  // (xóa admin_token, admin_user khỏi localStorage).
  // Endpoint này chỉ để tương thích nếu client gọi.
  return NextResponse.json({ ok: true });
}