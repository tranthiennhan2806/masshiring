import { NextRequest, NextResponse } from "next/server";
import { updateLead, deleteLead, isValidLeadType } from "@/lib/leads";

type RouteContext = { params: Promise<{ type: string; row: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { type, row } = await context.params;
    if (!isValidLeadType(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    const rowNumber = Number(row);
    if (!Number.isInteger(rowNumber) || rowNumber < 2) {
      return NextResponse.json({ error: "Invalid row" }, { status: 400 });
    }
    const patch = await req.json();
    const ok = await updateLead(type, rowNumber, patch);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Lead PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { type, row } = await context.params;
    if (!isValidLeadType(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    const rowNumber = Number(row);
    if (!Number.isInteger(rowNumber) || rowNumber < 2) {
      return NextResponse.json({ error: "Invalid row" }, { status: 400 });
    }
    const ok = await deleteLead(type, rowNumber);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Lead DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}