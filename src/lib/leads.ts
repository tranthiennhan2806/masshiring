// src/lib/leads.ts
import { google } from "googleapis";
import { getAuth, getSheetData } from "./google-sheets";

const SHEETS: Record<string, string> = {
    "doanh-nghiep": "Leads_DN",
    "doi-tac": "Leads_Partner",
    "hr-freelancer": "Leads_HR",
    "ung-vien": "Applicants",
    "lien-he": "Contacts",
};

export type LeadTypeKey = keyof typeof SHEETS;

export interface LeadRow {
    rowNumber: number;
    data: Record<string, string>;
}

export function getSheetName(type: string): string | null {
    return SHEETS[type] || null;
}

export function isValidLeadType(type: string): type is LeadTypeKey {
    return type in SHEETS;
}

export async function getAllLeads(type: LeadTypeKey): Promise<{
    headers: string[];
    rows: LeadRow[];
}> {
    const sheetName = SHEETS[type];
    const rows = await getSheetData(sheetName);
    if (!rows || rows.length === 0) return { headers: [], rows: [] };

    const headers = (rows[0] as string[]).map((h) => String(h));
    const data: LeadRow[] = [];
    for (let i = 1; i < rows.length; i++) {
        const arr = rows[i] as any[];
        if (!arr || arr.length === 0) continue;
        const record: Record<string, string> = {};
        headers.forEach((h, idx) => {
            record[h] = String(arr[idx] ?? "");
        });
        data.push({ rowNumber: i + 1, data: record });
    }
    data.reverse();
    return { headers, rows: data };
}

async function getSheetsClient() {
    const { auth, spreadsheetId } = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    return { sheets, spreadsheetId };
}

export async function updateLead(
    type: LeadTypeKey,
    rowNumber: number,
    patch: Record<string, string>
): Promise<boolean> {
    const sheetName = SHEETS[type];
    const rows = await getSheetData(sheetName);
    if (!rows || rows.length === 0) return false;
    const headers = (rows[0] as string[]).map((h) => String(h));

    const current = (rows[rowNumber - 1] as any[]) || [];
    const newRow = headers.map((h, idx) => {
        if (h in patch) return patch[h];
        return String(current[idx] ?? "");
    });

    const { sheets, spreadsheetId } = await getSheetsClient();
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${rowNumber}:${columnLetter(headers.length)}${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [newRow] },
    });
    return true;
}

export async function deleteLead(
    type: LeadTypeKey,
    rowNumber: number
): Promise<boolean> {
    const sheetName = SHEETS[type];
    const { sheets, spreadsheetId } = await getSheetsClient();

    const meta = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: "sheets.properties",
    });
    const sheetMeta = meta.data.sheets?.find(
        (s) => s.properties?.title === sheetName
    );
    const sheetId = sheetMeta?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) return false;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: "ROWS",
                            startIndex: rowNumber - 1,
                            endIndex: rowNumber,
                        },
                    },
                },
            ],
        },
    });
    return true;
}

function columnLetter(n: number): string {
    let s = "";
    while (n > 0) {
        const rem = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s || "A";
} 