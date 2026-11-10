import { appendToSheet, getSheetData, ensureHeaders } from "./google-sheets";

export type Role = "super_admin" | "admin" | "editor" | "viewer";

export type AdminUser = {
  id: string;
  username: string;
  password: string; // plain for simplicity (internal tool)
  name: string;
  role: Role;
  status: "active" | "disabled";
  createdAt: string;
};

const HEADERS = ["ID", "Username", "Password", "Name", "Role", "Status", "CreatedAt"];

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Biên tập",
  viewer: "Chỉ xem",
};

export function roleLabel(role: Role) {
  return ROLE_LABELS[role] || role;
}

/** Quyền theo vai trò */
export const PERMISSIONS = {
  manage_users: ["super_admin"] as Role[],
  manage_jobs: ["super_admin", "admin", "editor"] as Role[],
  view_leads: ["super_admin", "admin", "editor", "viewer"] as Role[],
  manage_settings: ["super_admin", "admin"] as Role[],
};

export function hasPermission(role: Role, action: keyof typeof PERMISSIONS) {
  return PERMISSIONS[action].includes(role);
}

function rowToUser(row: string[]): AdminUser {
  return {
    id: row[0] || "",
    username: row[1] || "",
    password: row[2] || "",
    name: row[3] || "",
    role: (row[4] as Role) || "viewer",
    status: (row[5] as "active" | "disabled") || "active",
    createdAt: row[6] || "",
  };
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  await ensureHeaders("Admins", HEADERS);
  const rows = await getSheetData("Admins");
  if (!rows || rows.length <= 1) return [];
  // Deduplicate by id, keep latest
  const map = new Map<string, AdminUser>();
  for (const row of rows.slice(1)) {
    const u = rowToUser(row);
    if (u.id) map.set(u.id, u);
  }
  return Array.from(map.values());
}

export async function findAdminByUsername(username: string): Promise<AdminUser | null> {
  const users = await getAllAdmins();
  return users.find((u) => u.username === username && u.status === "active") || null;
}

export async function createAdmin(
  data: Omit<AdminUser, "id" | "createdAt">
): Promise<AdminUser> {
  await ensureHeaders("Admins", HEADERS);
  const id = `admin-${Date.now()}`;
  const createdAt = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const user: AdminUser = { ...data, id, createdAt };

  await appendToSheet("Admins", [[
    user.id,
    user.username,
    user.password,
    user.name,
    user.role,
    user.status,
    user.createdAt,
  ]]);

  return user;
}

export async function updateAdmin(
  id: string,
  patch: Partial<Pick<AdminUser, "name" | "password" | "role" | "status">>
): Promise<AdminUser> {
  const existing = (await getAllAdmins()).find((u) => u.id === id);
  if (!existing) throw new Error("User not found");

  const updated: AdminUser = {
    ...existing,
    ...patch,
    createdAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
  };

  await appendToSheet("Admins", [[
    updated.id,
    updated.username,
    updated.password,
    updated.name,
    updated.role,
    updated.status,
    updated.createdAt,
  ]]);

  return updated;
}
