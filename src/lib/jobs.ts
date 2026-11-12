import { google } from "googleapis";
import { appendToSheet, getSheetData, ensureHeaders } from "./google-sheets";
import type { Job, JobFormInput } from "@/types";

const JOBS_SHEET = "Jobs";

const JOBS_HEADERS = [
  "ID",
  "Title",
  "Salary",
  "Location",
  "Type",
  "Quantity",
  "Deadline",
  "Industry",
  "Description",
  "ImageUrl", // <-- Thêm cột này
  "Status",
  "CreatedAt",
];

async function getSheetsClient() {
  const { getAuth } = await import("./google-sheets");
  const { auth, spreadsheetId } = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, spreadsheetId };
}

function rowToJob(row: any[]): Job {
  return {
    id: String(row[0] ?? ""),
    title: String(row[1] ?? ""),
    salary: String(row[2] ?? ""),
    location: String(row[3] ?? ""),
    type: String(row[4] ?? ""),
    quantity: Number(row[5] ?? 0),
    deadline: String(row[6] ?? ""),
    industry: String(row[7] ?? ""),
    description: String(row[8] ?? ""),
    imageUrl: String(row[9] ?? ""), // <-- Map cột ImageUrl
    status: row[10] === "closed" ? "closed" : "active",
    createdAt: String(row[11] ?? ""),
  };
}

function jobToRow(j: Job): (string | number)[] {
  return [
    j.id,
    j.title,
    j.salary,
    j.location,
    j.type,
    j.quantity,
    j.deadline,
    j.industry,
    j.description,
    j.imageUrl || "", // <-- Map cột ImageUrl
    j.status,
    j.createdAt,
  ];
}

export async function ensureJobsSheet() {
  await ensureHeaders(JOBS_SHEET, JOBS_HEADERS);
}

export async function getAllJobs(): Promise<Job[]> {
  await ensureJobsSheet();
  const rows = await getSheetData(JOBS_SHEET, "A2:L"); // <-- Sửa thành L
  return (rows as any[][]).filter((r) => r[0]).map(rowToJob);
}

export async function getActiveJobs(): Promise<Job[]> {
  return (await getAllJobs()).filter((j) => j.status === "active");
}

export async function getJobById(id?: string): Promise<Job | null> {
  if (!id) return null;
  return (await getAllJobs()).find((j) => j.id === id) ?? null;
}

export function generateJobId(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${slug || "job"}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function createJob(input: JobFormInput): Promise<Job> {
  await ensureJobsSheet();
  const job: Job = {
    id: generateJobId(input.title),
    title: input.title,
    salary: input.salary,
    location: input.location,
    type: input.type,
    quantity: Number(input.quantity) || 0,
    deadline: input.deadline,
    industry: input.industry,
    description: input.description,
    imageUrl: input.imageUrl || "", // <-- Thêm
    status: input.status ?? "active",
    createdAt: new Date().toISOString(),
  };
  await appendToSheet(JOBS_SHEET, [jobToRow(job)]);
  return job;
}

async function findRowIndex(id: string): Promise<number | null> {
  const rows = await getSheetData(JOBS_SHEET, "A2:L"); // <-- Sửa thành L
  const arr = (rows as any[][]).filter((r) => r[0]);
  const idx = arr.findIndex((r) => String(r[0]) === id);
  return idx === -1 ? null : idx + 2;
}

export async function updateJob(
  id: string,
  patch: Partial<JobFormInput>
): Promise<Job | null> {
  await ensureJobsSheet();
  const rowNumber = await findRowIndex(id);
  if (!rowNumber) return null;

  const current = await getJobById(id);
  if (!current) return null;

  const updated: Job = {
    ...current,
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.salary !== undefined && { salary: patch.salary }),
    ...(patch.location !== undefined && { location: patch.location }),
    ...(patch.type !== undefined && { type: patch.type }),
    ...(patch.quantity !== undefined && { quantity: Number(patch.quantity) }),
    ...(patch.deadline !== undefined && { deadline: patch.deadline }),
    ...(patch.industry !== undefined && { industry: patch.industry }),
    ...(patch.description !== undefined && { description: patch.description }),
    ...(patch.imageUrl !== undefined && { imageUrl: patch.imageUrl }), // <-- Thêm
    ...(patch.status !== undefined && { status: patch.status }),
  };

  const { sheets, spreadsheetId } = await getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${JOBS_SHEET}!A${rowNumber}:L${rowNumber}`, // <-- Sửa thành L
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [jobToRow(updated)] },
  });
  return updated;
}

export async function closeJob(id: string): Promise<Job | null> {
  return updateJob(id, { status: "closed" });
}

export async function deleteJob(id: string): Promise<Job | null> {
  // ... (giữ nguyên như cũ)
  await ensureJobsSheet();
  const rowNumber = await findRowIndex(id);
  if (!rowNumber) return null;

  const current = await getJobById(id);
  if (!current) return null;

  const { sheets, spreadsheetId } = await getSheetsClient();
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties",
  });
  const sheetMeta = meta.data.sheets?.find(
    (s) => s.properties?.title === JOBS_SHEET
  );
  const sheetId = sheetMeta?.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) {
    throw new Error("Sheet Jobs not found");
  }

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
  return current;
}