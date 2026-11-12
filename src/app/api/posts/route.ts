import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPublishedPosts, createPost } from "@/lib/posts";

export async function GET(req: NextRequest) {
    try {
        const all = req.nextUrl.searchParams.get("all") === "1";
        const posts = all ? await getAllPosts() : await getPublishedPosts();
        return NextResponse.json({ posts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        const post = await createPost({
            title: body.title,
            excerpt: body.excerpt || "",
            content: body.content || "",
            category: body.category || "Tin tức",
            imageUrl: body.imageUrl || "",
            date: body.date || new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
            status: body.status === "published" ? "published" : "draft",
        });
        return NextResponse.json({ success: true, post }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}