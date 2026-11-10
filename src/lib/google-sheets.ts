// src/lib/google-sheets.ts (đảm bảo export getAuth)
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets credentials in environment variables");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return { auth, spreadsheetId };
}

async function ensureSheetExists(sheets: any, spreadsheetId: string, sheetName: string) {
  try {
    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });
    const exists = meta.data.sheets?.some(
      (s: any) => s.properties?.title === sheetName
    );
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      });
    }
  } catch (err: any) {
    console.warn("ensureSheetExists warning:", err.message);
  }
}

export async function appendToSheet(
  sheetName: string,
  values: (string | number | boolean | null)[][]
) {
  const { auth, spreadsheetId } = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await ensureSheetExists(sheets, spreadsheetId, sheetName);

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
  return response.data;
}

export async function getSheetData(sheetName: string, range = "A:Z") {
  const { auth, spreadsheetId } = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await ensureSheetExists(sheets, spreadsheetId, sheetName);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${range}`,
  });
  return response.data.values || [];
}

export async function ensureHeaders(sheetName: string, headers: string[]) {
  const data = await getSheetData(sheetName, "A1:Z1");
  if (!data || data.length === 0) {
    await appendToSheet(sheetName, [headers]);
  }
}