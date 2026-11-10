// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { getTokenFromRequest, deleteSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
    deleteSession(getTokenFromRequest(req));
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return res;
}