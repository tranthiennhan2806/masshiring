import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const encoder = new TextEncoder();
export const COOKIE_NAME = "mh_admin_session";
const TTL_SECONDS = 60 * 60 * 2;

export type AdminRole = "super_admin" | "admin" | "editor" | "viewer";

function getSecret(): Uint8Array {
    const s = process.env.JWT_SECRET;
    if (!s || s.length < 32) throw new Error("JWT_SECRET missing or too short");
    return encoder.encode(s);
}

export interface SessionPayload {
    username: string;
    name: string;
    role: AdminRole;
    iat: number;
    exp: number;
}

export async function createSession(
    username: string,
    name: string,
    role: AdminRole
): Promise<string> {
    return new SignJWT({ name, role })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(username)
        .setIssuedAt()
        .setExpirationTime(`${TTL_SECONDS}s`)
        .sign(getSecret());
}

export async function verifySession(token?: string): Promise<SessionPayload | null> {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getSecret());
        if (typeof payload.sub !== "string") return null;
        const role = payload.role as AdminRole;
        if (!["super_admin", "admin", "editor", "viewer"].includes(role)) return null;
        return {
            username: payload.sub,
            name: (payload.name as string) || "",
            role,
            iat: payload.iat!,
            exp: payload.exp!,
        };
    } catch {
        return null;
    }
}

export function getTokenFromRequest(req: Request): string | undefined {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    return match?.[1];
}

export async function setAdminCookie(token: string) {
    const store = await cookies();
    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: TTL_SECONDS,
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const store = await cookies();
    return verifySession(store.get(COOKIE_NAME)?.value);
}

export async function requireSuperAdmin(): Promise<
    { ok: true; session: SessionPayload } | { ok: false; response: Response }
> {
    const session = await getSession();
    if (!session) {
        return {
            ok: false,
            response: new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }),
        };
    }
    if (session.role !== "super_admin") {
        return {
            ok: false,
            response: new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }),
        };
    }
    return { ok: true, session };
}

export function isEnvSuperAdmin(username: string): boolean {
    return username === process.env.SUPER_ADMIN_USERNAME;
}