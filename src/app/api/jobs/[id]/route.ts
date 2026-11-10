// src/app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getJobById, updateJob, closeJob, deleteJob } from "@/lib/jobs";
import { sendDiscordNotification } from "@/lib/discord";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        const { id } = await params;
        const job = await getJobById(id);
        if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ job });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const { id } = await params;
        const body = await req.json();

        const quantity =
            body.quantity !== undefined && body.quantity !== null && body.quantity !== ""
                ? Number(body.quantity)
                : undefined;

        if (quantity !== undefined && Number.isNaN(quantity)) {
            return NextResponse.json({ error: "quantity must be a number" }, { status: 400 });
        }

        const updated = await updateJob(id, {
            title: body.title,
            salary: body.salary,
            location: body.location,
            type: body.type,
            quantity,
            deadline: body.deadline,
            industry: body.industry,
            description: body.description,
            status:
                body.status === "closed"
                    ? "closed"
                    : body.status === "active"
                        ? "active"
                        : undefined,
        });
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await sendDiscordNotification(
            "✏️ Tin tuyển dụng đã cập nhật",
            [
                { name: "Job ID", value: updated.id },
                { name: "Vị trí", value: updated.title },
                { name: "Trạng thái", value: updated.status },
            ],
            0xf59e0b
        );

        return NextResponse.json({ ok: true, job: updated });
    } catch (err: any) {
        console.error("PATCH job error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        const { id } = await params;
        const hard = req.nextUrl.searchParams.get("hard") === "1";
        const job = hard ? await deleteJob(id) : await closeJob(id);
        if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await sendDiscordNotification(
            hard ? "🗑️ Tin tuyển dụng đã bị XOÁ" : "📁 Tin tuyển dụng đã đóng",
            [
                { name: "Job ID", value: job.id },
                { name: "Vị trí", value: job.title },
            ],
            0xef4444
        );

        return NextResponse.json({ ok: true, job });
    } catch (err: any) {
        console.error("DELETE job error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}