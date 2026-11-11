import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/projects";
import { requireSuperAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await updateProject(id, { name: body.name, link: body.link });
        return NextResponse.json({ success: true, project: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const { id } = await params;
        await deleteProject(id);
        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}