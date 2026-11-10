import { NextRequest, NextResponse } from "next/server";
import { getJobById, updateJob, closeJob, deleteJob } from "@/lib/jobs";
import { sendDiscordNotification } from "@/lib/discord";

/** GET — public, ai cũng xem được (dùng cho trang detail nếu cần) */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const job = await getJobById(params.id);
        if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ job });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/** PATCH — cần auth, sửa job */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();

        // Chỉ chuyển quantity sang number khi client có gửi và không rỗng
        const quantity =
            body.quantity !== undefined && body.quantity !== null && body.quantity !== ""
                ? Number(body.quantity)
                : undefined;

        // Nếu client gửi quantity nhưng không phải số hợp lệ -> 400
        if (quantity !== undefined && Number.isNaN(quantity)) {
            return NextResponse.json({ error: "quantity must be a number" }, { status: 400 });
        }

        const updated = await updateJob(params.id, {
            title: body.title,
            salary: body.salary,
            location: body.location,
            type: body.type,
            quantity, // number | undefined
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

        // Notify Discord (optional)
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

/** DELETE — cần auth, đóng job (soft delete) hoặc xoá cứng nếu ?hard=1 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const hard = req.nextUrl.searchParams.get("hard") === "1";
        const job = hard ? await deleteJob(params.id) : await closeJob(params.id);
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