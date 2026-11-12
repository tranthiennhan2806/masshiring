import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject, type ProjectLink } from "@/lib/projects";
import { requireSuperAdmin } from "@/lib/auth";

function sanitizeLinks(input: any): ProjectLink[] {
    if (!Array.isArray(input)) return [];
    return input
        .filter((x) => x && typeof x === "object")
        .map((x) => ({
            name: String(x.name || "").trim(),
            url: String(x.url || "").trim(),
        }))
        .filter((x) => x.name && x.url);
}

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
        if (!body.name) {
            return NextResponse.json({ error: "Thiếu tên dự án" }, { status: 400 });
        }
        const links = sanitizeLinks(body.links);
        const project = await createProject({ name: body.name, links });
        return NextResponse.json({ success: true, project });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}