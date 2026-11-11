import { appendToSheet, getSheetData, ensureHeaders } from "./google-sheets";
import bcrypt from "bcryptjs";
import type { AdminRole } from "./auth";

export type { AdminRole };

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  status: "active" | "disabled";
  createdAt: string;
}

const HEADERS = ["ID", "Username", "PasswordHash", "Name", "Role", "Status", "CreatedAt"];

function rowToUser(row: string[]): AdminUser {
  return {
    id: row[0] || "",
    username: row[1] || "",
    passwordHash: row[2] || "",
    name: row[3] || "",
    role: (row[4] as AdminRole) || "viewer",
    status: (row[5] as "active" | "disabled") || "active",
    createdAt: row[6] || "",
  };
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  await ensureHeaders("Admins", HEADERS);
  const rows = await getSheetData("Admins");
  if (!rows || rows.length <= 1) return [];
  const map = new Map<string, AdminUser>();
  for (const row of rows.slice(1)) {
    const u = rowToUser(row as string[]);
    if (u.id) map.set(u.id, u);
  }
  return Array.from(map.values());
}

export async function findAdminByUsername(username: string): Promise<AdminUser | null> {
  const users = await getAllAdmins();
  return users.find((u) => u.username === username && u.status === "active") || null;
}

export async function verifyPassword(user: AdminUser, password: string): Promise<boolean> {
  if (!user.passwordHash) return false;
  // Hỗ trợ cả bcrypt hash và plain (cho env admin cũ)
  if (user.passwordHash.startsWith("$2")) {
    return bcrypt.compare(password, user.passwordHash);
  }
  return user.passwordHash === password;
}

export async function createAdmin(input: {
  username: string;
  password: string;
  name: string;
  role: AdminRole;
  status?: "active" | "disabled";
}): Promise<AdminUser> {
  await ensureHeaders("Admins", HEADERS);
  const id = `admin-${Date.now()}`;
  const createdAt = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: AdminUser = {
    id,
    username: input.username,
    passwordHash,
    name: input.name,
    role: input.role,
    status: input.status || "active",
    createdAt,
  };
  await appendToSheet("Admins", [
    [user.id, user.username, user.passwordHash, user.name, user.role, user.status, user.createdAt],
  ]);
  return user;
}

/** Vì Sheet append, update = append row mới cùng id (getAllAdmins dedupe lấy bản mới) */
export async function updateAdmin(
  id: string,
  patch: Partial<Pick<AdminUser, "name" | "role" | "status" | "passwordHash">>
): Promise<AdminUser> {
  const existing = (await getAllAdmins()).find((u) => u.id === id);
  if (!existing) throw new Error("User not found");
  const updated: AdminUser = {
    ...existing,
    ...patch,
    createdAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
  };
  await appendToSheet("Admins", [
    [updated.id, updated.username, updated.passwordHash, updated.name, updated.role, updated.status, updated.createdAt],
  ]);
  return updated;
}

export async function deleteAdmin(id: string): Promise<void> {
  // Soft delete: status = disabled
  await updateAdmin(id, { status: "disabled" });
}