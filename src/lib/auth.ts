// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const encoder = new TextEncoder();
export const COOKIE_NAME = "mh_admin_session";
const TTL_SECONDS = 60 * 60 * 2;

function getSecret(): Uint8Array {
    const s = process.env.JWT_SECRET;
    if (!s || s.length < 32) throw new Error("JWT_SECRET missing or too short");
    return encoder.encode(s);
}

export interface SessionPayload {
    username: string;
    role: "admin";
    iat: number;
    exp: number;
}

export async function createSession(username: string): Promise<string> {
    return new SignJWT({ role: "admin" })
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
        if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
        return {
            username: payload.sub,
            role: "admin",
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