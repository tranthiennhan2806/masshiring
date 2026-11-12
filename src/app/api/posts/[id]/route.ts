import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/posts";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const post = await getPostById(id);
        if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ post });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await updatePost(id, body);
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ ok: true, post: updated });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const ok = await deletePost(id);
        if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}