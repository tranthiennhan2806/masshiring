import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject, type ProjectLink } from "@/lib/projects";
import { requireSuperAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

function sanitizeLinks(input: any): ProjectLink[] | undefined {
    if (!Array.isArray(input)) return undefined;
    return input
        .filter((x) => x && typeof x === "object")
        .map((x) => ({
            name: String(x.name || "").trim(),
            url: String(x.url || "").trim(),
        }))
        .filter((x) => x.name && x.url);
}

export async function GET(_req: NextRequest, { params }: Ctx) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const { id } = await params;
        const { getProjectById } = await import("@/lib/projects");
        const project = await getProjectById(id);
        if (!project) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ project });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const { id } = await params;
        const body = await req.json();
        const patch: any = {};
        if (body.name !== undefined) patch.name = body.name;
        const links = sanitizeLinks(body.links);
        if (links !== undefined) patch.links = links;
        const updated = await updateProject(id, patch);
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