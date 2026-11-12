import { google } from "googleapis";
import { appendToSheet, getSheetData, ensureHeaders } from "./google-sheets";
import type { Post, PostFormInput } from "@/types";

const POSTS_SHEET = "Posts";

const POSTS_HEADERS = [
    "ID",
    "Title",
    "Excerpt",
    "Content",
    "Category",
    "ImageUrl",
    "Date",
    "Status",
    "CreatedAt",
];

async function getSheetsClient() {
    const { getAuth } = await import("./google-sheets");
    const { auth, spreadsheetId } = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    return { sheets, spreadsheetId };
}

function rowToPost(row: any[]): Post {
    return {
        id: String(row[0] ?? ""),
        title: String(row[1] ?? ""),
        excerpt: String(row[2] ?? ""),
        content: String(row[3] ?? ""),
        category: String(row[4] ?? ""),
        imageUrl: String(row[5] ?? ""),
        date: String(row[6] ?? ""),
        status: row[7] === "draft" ? "draft" : "published",
        createdAt: String(row[8] ?? ""),
    };
}

function postToRow(p: Post): (string | number)[] {
    return [
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.category,
        p.imageUrl || "",
        p.date,
        p.status,
        p.createdAt,
    ];
}

export async function ensurePostsSheet() {
    await ensureHeaders(POSTS_SHEET, POSTS_HEADERS);
}

export async function getAllPosts(): Promise<Post[]> {
    await ensurePostsSheet();
    const rows = await getSheetData(POSTS_SHEET, "A2:I");
    return (rows as any[][]).filter((r) => r[0]).map(rowToPost);
}

export async function getPublishedPosts(): Promise<Post[]> {
    return (await getAllPosts()).filter((p) => p.status === "published");
}

export async function getPostById(id: string): Promise<Post | null> {
    if (!id) return null;
    return (await getAllPosts()).find((p) => p.id === id) ?? null;
}

export function generatePostId(title: string): string {
    const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);
    return `${slug || "post"}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function createPost(input: PostFormInput): Promise<Post> {
    await ensurePostsSheet();
    const post: Post = {
        id: generatePostId(input.title),
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        category: input.category,
        imageUrl: input.imageUrl || "",
        date: input.date,
        status: input.status ?? "draft",
        createdAt: new Date().toISOString(),
    };
    await appendToSheet(POSTS_SHEET, [postToRow(post)]);
    return post;
}

async function findRowIndex(id: string): Promise<number | null> {
    const rows = await getSheetData(POSTS_SHEET, "A2:I");
    const arr = (rows as any[][]).filter((r) => r[0]);
    const idx = arr.findIndex((r) => String(r[0]) === id);
    return idx === -1 ? null : idx + 2;
}

export async function updatePost(
    id: string,
    patch: Partial<PostFormInput>
): Promise<Post | null> {
    await ensurePostsSheet();
    const rowNumber = await findRowIndex(id);
    if (!rowNumber) return null;

    const current = await getPostById(id);
    if (!current) return null;

    const updated: Post = {
        ...current,
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.excerpt !== undefined && { excerpt: patch.excerpt }),
        ...(patch.content !== undefined && { content: patch.content }),
        ...(patch.category !== undefined && { category: patch.category }),
        ...(patch.imageUrl !== undefined && { imageUrl: patch.imageUrl }),
        ...(patch.date !== undefined && { date: patch.date }),
        ...(patch.status !== undefined && { status: patch.status }),
    };

    const { sheets, spreadsheetId } = await getSheetsClient();
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${POSTS_SHEET}!A${rowNumber}:I${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [postToRow(updated)] },
    });
    return updated;
}

export async function deletePost(id: string): Promise<boolean> {
    await ensurePostsSheet();
    const rowNumber = await findRowIndex(id);
    if (!rowNumber) return false;

    const { sheets, spreadsheetId } = await getSheetsClient();
    const meta = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: "sheets.properties",
    });
    const sheetMeta = meta.data.sheets?.find((s) => s.properties?.title === POSTS_SHEET);
    const sheetId = sheetMeta?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) throw new Error("Sheet Posts not found");

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