"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
    }

    return (
        <button onClick={handleLogout} className="text-red-600 hover:underline">
            Đăng xuất
        </button>
    );
}