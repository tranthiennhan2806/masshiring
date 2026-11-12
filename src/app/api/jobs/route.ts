import { NextRequest, NextResponse } from "next/server";
import { getAllJobs, getActiveJobs, createJob } from "@/lib/jobs";
import { sendDiscordNotification } from "@/lib/discord";

export async function GET(req: NextRequest) {
  try {
    const all = req.nextUrl.searchParams.get("all") === "1";
    const jobs = all ? await getAllJobs() : await getActiveJobs();
    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error("Jobs GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Thêm imageUrl vào destructuring
    const { title, salary, location, type, quantity, deadline, industry, description, imageUrl, status } = body;

    if (!title || !location) {
      return NextResponse.json({ error: "Title and location are required" }, { status: 400 });
    }

    const job = await createJob({
      title,
      salary: salary || "",
      location,
      type: type || "",
      quantity: Number(quantity) || 0,
      deadline: deadline || "",
      industry: industry || "",
      description: description || "",
      imageUrl: imageUrl || "", // <-- Thêm dòng này
      status: status === "closed" ? "closed" : "active",
    });

    await sendDiscordNotification("📋 Tin tuyển dụng mới đã đăng", [
      { name: "Vị trí", value: job.title },
      { name: "Mức lương", value: job.salary || "—" },
      { name: "Địa điểm", value: job.location },
      { name: "Số lượng", value: String(job.quantity) },
      { name: "Hạn nộp", value: job.deadline || "—" },
      { name: "Job ID", value: job.id },
    ], 0x2563eb);

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: any) {
    console.error("Jobs POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}