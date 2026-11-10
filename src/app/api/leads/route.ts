// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, getSheetData } from "@/lib/google-sheets";
import { sendDiscordNotification } from "@/lib/discord";
import { getAllLeads, isValidLeadType } from "@/lib/leads";

const SHEET_HEADERS: Record<string, string[]> = {
  Leads_DN: [
    "Timestamp", "Họ tên", "Công ty", "SĐT", "Vị trí", "Khu vực",
    "Email", "Số lượng", "Ghi chú", "utm_source", "utm_medium", "utm_campaign", "Page",
  ],
  Leads_Partner: [
    "Timestamp", "Họ tên", "Công ty", "SĐT", "Vị trí/ngành", "Khu vực",
    "Email", "Số lượng", "Ghi chú",
  ],
  Leads_HR: [
    "Timestamp", "Họ tên", "SĐT", "Tỉnh/TP", "Email", "Kinh nghiệm", "Facebook", "Thời gian",
  ],
  Applicants: [
    "Timestamp", "Họ tên", "SĐT", "Năm sinh", "Khu vực", "Mã HR",
    "Job ID", "Job Title", "utm_source", "utm_medium", "utm_campaign", "Page",
  ],
  Contacts: [
    "Timestamp", "Họ tên", "SĐT", "Email", "Nội dung", "Bạn là",
  ],
};

async function ensureSheetHeader(sheetName: string) {
  try {
    const data = await getSheetData(sheetName, "A1:A1");
    if (!data || data.length === 0) {
      const headers = SHEET_HEADERS[sheetName];
      if (headers) await appendToSheet(sheetName, [headers]);
    }
  } catch (err) {
    console.warn("ensureSheetHeader:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") || "doanh-nghiep";
    if (!isValidLeadType(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    const result = await getAllLeads(type);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Leads GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    let sheetName = "";
    let row: (string | number | null)[] = [];
    let discordTitle = "";
    let discordFields: { name: string; value: string; inline?: boolean }[] = [];

    switch (type) {
      case "doanh-nghiep": {
        sheetName = "Leads_DN";
        row = [
          timestamp, data.fullName || "", data.company || "", data.phone || "",
          data.position || "", data.area || "", data.email || "", data.quantity || "",
          data.note || "", data.utmSource || "", data.utmMedium || "",
          data.utmCampaign || "", data.page || "/doanh-nghiep",
        ];
        discordTitle = "🏢 Lead Doanh nghiệp mới";
        discordFields = [
          { name: "Họ tên", value: data.fullName },
          { name: "Công ty", value: data.company },
          { name: "Số điện thoại", value: data.phone },
          { name: "Email", value: data.email || "—" },
          { name: "Vị trí cần tuyển", value: data.position },
          { name: "Khu vực", value: data.area },
          { name: "Số lượng", value: data.quantity || "—" },
          { name: "Ghi chú", value: data.note || "—", inline: false },
          { name: "UTM Source", value: data.utmSource || "—" },
          { name: "UTM Medium", value: data.utmMedium || "—" },
          { name: "UTM Campaign", value: data.utmCampaign || "—" },
          { name: "Trang gửi", value: data.page || "/doanh-nghiep" },
          { name: "Thời gian", value: timestamp },
        ];
        break;
      }
      case "doi-tac": {
        sheetName = "Leads_Partner";
        row = [
          timestamp, data.fullName || "", data.company || "", data.phone || "",
          data.position || "", data.area || "", data.email || "",
          data.quantity || "", data.note || "",
        ];
        discordTitle = "🤝 Lead Đối tác cung ứng mới";
        discordFields = [
          { name: "Họ tên", value: data.fullName },
          { name: "Công ty", value: data.company },
          { name: "Số điện thoại", value: data.phone },
          { name: "Email", value: data.email || "—" },
          { name: "Vị trí / ngành đơn hàng", value: data.position },
          { name: "Khu vực", value: data.area },
          { name: "Số lượng / Thời hạn", value: data.quantity || "—" },
          { name: "Ghi chú", value: data.note || "—", inline: false },
          { name: "Thời gian", value: timestamp },
        ];
        break;
      }
      case "hr-freelancer": {
        sheetName = "Leads_HR";
        row = [
          timestamp, data.fullName || "", data.phone || "", data.province || "",
          data.email || "", data.experience || "", data.facebook || "",
          data.availableTime || "",
        ];
        discordTitle = "📱 Đăng ký HR Freelancer mới";
        discordFields = [
          { name: "Họ tên", value: data.fullName },
          { name: "SĐT / Zalo", value: data.phone },
          { name: "Tỉnh / Thành phố", value: data.province },
          { name: "Email", value: data.email || "—" },
          { name: "Kinh nghiệm", value: data.experience || "—" },
          { name: "Facebook", value: data.facebook || "—" },
          { name: "Thời gian có thể làm", value: data.availableTime || "—" },
          { name: "Thời gian đăng ký", value: timestamp },
        ];
        break;
      }
      case "ung-vien": {
        sheetName = "Applicants";
        row = [
          timestamp, data.fullName || "", data.phone || "", data.birthYear || "",
          data.area || "", data.hrCode || "", data.jobId || "", data.jobTitle || "",
          data.utmSource || "", data.utmMedium || "", data.utmCampaign || "",
          data.page || "",
        ];
        discordTitle = "👤 Ứng viên mới";
        discordFields = [
          { name: "Họ tên", value: data.fullName },
          { name: "Số điện thoại", value: data.phone },
          { name: "Năm sinh", value: data.birthYear || "—" },
          { name: "Khu vực", value: data.area },
          { name: "Mã HR giới thiệu", value: data.hrCode || "Không có" },
          { name: "Job ID", value: data.jobId || "—" },
          { name: "Vị trí ứng tuyển", value: data.jobTitle || "Chung" },
          { name: "UTM Source", value: data.utmSource || "—" },
          { name: "UTM Medium", value: data.utmMedium || "—" },
          { name: "UTM Campaign", value: data.utmCampaign || "—" },
          { name: "Trang gửi", value: data.page || "—" },
          { name: "Thời gian", value: timestamp },
        ];
        break;
      }
      case "lien-he": {
        sheetName = "Contacts";
        row = [
          timestamp, data.fullName || "", data.phone || "", data.email || "",
          data.message || "", data.role || "",
        ];
        discordTitle = "✉️ Liên hệ mới";
        discordFields = [
          { name: "Họ tên", value: data.fullName },
          { name: "Số điện thoại", value: data.phone },
          { name: "Email", value: data.email || "—" },
          { name: "Bạn là", value: data.role || "—" },
          { name: "Nội dung", value: data.message || "—", inline: false },
          { name: "Thời gian", value: timestamp },
        ];
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await ensureSheetHeader(sheetName);
    await appendToSheet(sheetName, [row]);
    await sendDiscordNotification(discordTitle, discordFields);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}