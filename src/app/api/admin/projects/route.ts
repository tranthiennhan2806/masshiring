import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/projects";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET() {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const projects = await getAllProjects();
        return NextResponse.json({ projects });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireSuperAdmin();
    if (!auth.ok) return auth.response;
    try {
        const body = await req.json();
        if (!body.name || !body.link) {
            return NextResponse.json({ error: "Thiếu name hoặc link" }, { status: 400 });
        }
        const project = await createProject({ name: body.name, link: body.link });
        return NextResponse.json({ success: true, project });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}