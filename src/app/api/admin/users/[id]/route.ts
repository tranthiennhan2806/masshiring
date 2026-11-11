import { NextRequest, NextResponse } from "next/server";
import { updateAdmin, deleteAdmin } from "@/lib/admins";
import { requireSuperAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const { id } = await params;
        const body = await req.json();
        const patch: any = {};
        if (body.name !== undefined) patch.name = body.name;
        if (body.role !== undefined) patch.role = body.role;
        if (body.status !== undefined) patch.status = body.status;
        if (body.password) patch.passwordHash = await bcrypt.hash(body.password, 10);
        const updated = await updateAdmin(id, patch);
        const { passwordHash, ...safe } = updated;
        return NextResponse.json({ success: true, user: safe });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const { id } = await params;
        await deleteAdmin(id);
        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}