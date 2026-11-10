// src/app/api/admin/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, isValidLeadType } from "@/lib/leads";

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