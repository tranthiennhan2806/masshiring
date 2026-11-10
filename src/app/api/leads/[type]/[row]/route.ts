// src/app/api/admin/leads/[type]/[row]/route.ts
import { deleteLead, isValidLeadType, updateLead } from "@/lib/leads";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { type: string; row: string } }
) {
  try {
    if (!isValidLeadType(params.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    const rowNumber = Number(params.row);
    if (!Number.isInteger(rowNumber) || rowNumber < 2) {
      return NextResponse.json({ error: "Invalid row" }, { status: 400 });
    }
    const patch = await req.json();
    const ok = await updateLead(params.type, rowNumber, patch);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Lead PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { type: string; row: string } }
) {
  try {
    if (!isValidLeadType(params.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    const rowNumber = Number(params.row);
    if (!Number.isInteger(rowNumber) || rowNumber < 2) {
      return NextResponse.json({ error: "Invalid row" }, { status: 400 });
    }
    const ok = await deleteLead(params.type, rowNumber);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Lead DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}