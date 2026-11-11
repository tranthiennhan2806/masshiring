import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "mh_admin_session";
const encoder = new TextEncoder();

async function getSession(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !process.env.JWT_SECRET) return null;
    try {
        const { payload } = await jwtVerify(token, encoder.encode(process.env.JWT_SECRET));
        if (typeof payload.sub !== "string") return null;
        return { username: payload.sub, role: payload.role as string };
    } catch {
        return null;
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public auth routes
    if (
        pathname === "/admin/login" ||
        pathname === "/api/admin/login" ||
        pathname === "/api/admin/verify-otp"
    ) {
        return NextResponse.next();
    }

    const session = await getSession(req);

    // Trang admin
    if (pathname.startsWith("/admin")) {
        if (!session) {
            const url = req.nextUrl.clone();
            url.pathname = "/admin/login";
            url.searchParams.set("next", pathname);
            return NextResponse.redirect(url);
        }
        // Super admin pages
        const superOnly = ["/admin/users", "/admin/projects"];
        if (superOnly.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
            if (session.role !== "super_admin") {
                const url = req.nextUrl.clone();
                url.pathname = "/admin";
                return NextResponse.redirect(url);
            }
        }
    }

    // API admin — trừ login/verify
    if (pathname.startsWith("/api/admin")) {
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (pathname.startsWith("/api/admin/users") || pathname.startsWith("/api/admin/projects")) {
            if (session.role !== "super_admin") {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }
    }

    // API jobs — write cần admin/editor/super
    if (pathname.startsWith("/api/jobs") && req.method !== "GET") {
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!["super_admin", "admin", "editor"].includes(session.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*", "/api/jobs/:path*"],
};