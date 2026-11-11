import { google } from "googleapis";
import { appendToSheet, getSheetData, ensureHeaders, getAuth } from "./google-sheets";

export interface Project {
    id: string;
    name: string;
    link: string;
    createdAt: string;
}

const SHEET = "Projects";
const HEADERS = ["ID", "Name", "Link", "CreatedAt"];

function rowToProject(row: string[]): Project {
    return {
        id: row[0] || "",
        name: row[1] || "",
        link: row[2] || "",
        createdAt: row[3] || "",
    };
}

export async function getAllProjects(): Promise<Project[]> {
    await ensureHeaders(SHEET, HEADERS);
    const rows = await getSheetData(SHEET);
    if (!rows || rows.length <= 1) return [];
    const map = new Map<string, Project>();
    for (const row of rows.slice(1)) {
        const p = rowToProject(row as string[]);
        if (p.id) map.set(p.id, p);
    }
    return Array.from(map.values());
}

export async function createProject(input: { name: string; link: string }): Promise<Project> {
    await ensureHeaders(SHEET, HEADERS);
    const p: Project = {
        id: "proj-" + Date.now(),
        name: input.name,
        link: input.link,
        createdAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    };
    await appendToSheet(SHEET, [[p.id, p.name, p.link, p.createdAt]]);
    return p;
}

export async function updateProject(
    id: string,
    patch: Partial<Pick<Project, "name" | "link">>
): Promise<Project> {
    const projects = await getAllProjects();
    const existing = projects.find((p) => p.id === id);
    if (!existing) throw new Error("Project not found");

    // Update row trong sheet (Projects có id duy nhất, không cần dedupe)
    const rows = await getSheetData(SHEET);
    const headers = (rows[0] as string[]).map(String);
    const dataRows = rows.slice(1) as any[][];
    const idx = dataRows.findIndex((r) => String(r[0]) === id);
    if (idx === -1) throw new Error("Project not found");

    const current = rowToProject(dataRows[idx] as string[]);
    const updated: Project = {
        ...current,
        ...(patch.name !== undefined && { name: patch.name }),
        ...(patch.link !== undefined && { link: patch.link }),
    };

    const { auth, spreadsheetId } = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rowNumber = idx + 2; // +1 header, +1 vì data bắt đầu A2
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET}!A${rowNumber}:D${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[updated.id, updated.name, updated.link, updated.createdAt]],
        },
    });
    return updated;
}

export async function deleteProject(id: string): Promise<void> {
    const rows = await getSheetData(SHEET);
    if (!rows || rows.length <= 1) throw new Error("Project not found");
    const dataRows = rows.slice(1) as any[][];
    const idx = dataRows.findIndex((r) => String(r[0]) === id);
    if (idx === -1) throw new Error("Project not found");

    const { auth, spreadsheetId } = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties" });
    const sheetMeta = meta.data.sheets?.find((s) => s.properties?.title === SHEET);
    const sheetId = sheetMeta?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) throw new Error("Sheet not found");

    const rowNumber = idx + 2;
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: { sheetId, dimension: "ROWS", startIndex: rowNumber - 1, endIndex: rowNumber },
                    },
                },
            ],
        },
    });
}