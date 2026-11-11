import { randomInt, randomUUID } from "crypto";
import type { AdminRole } from "./auth";

interface OtpEntry {
    code: string;
    username: string;
    name: string;
    role: AdminRole;
    expiresAt: number;
    attempts: number;
}

const TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalForOtp = globalThis as unknown as { __otpStore?: Map<string, OtpEntry> };
const store = globalForOtp.__otpStore ?? new Map<string, OtpEntry>();
if (!globalForOtp.__otpStore) globalForOtp.__otpStore = store;

export function createOtp(username: string, name: string, role: AdminRole) {
    const now = Date.now();
    for (const [k, v] of store) if (v.expiresAt < now) store.delete(k);
    const challengeId = randomUUID();
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    store.set(challengeId, { code, username, name, role, expiresAt: now + TTL_MS, attempts: 0 });
    return { challengeId, code };
}

export function verifyOtp(challengeId: string, code: string) {
    const entry = store.get(challengeId);
    if (!entry) return { ok: false as const, reason: "invalid_challenge" };
    if (entry.expiresAt < Date.now()) {
        store.delete(challengeId);
        return { ok: false as const, reason: "expired" };
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
        store.delete(challengeId);
        return { ok: false as const, reason: "too_many_attempts" };
    }
    entry.attempts++;
    const normalized = String(code).replace(/\D/g, "");
    if (entry.code !== normalized) return { ok: false as const, reason: "wrong_code" };
    store.delete(challengeId);
    return {
        ok: true as const,
        username: entry.username,
        name: entry.name,
        role: entry.role,
    };
}