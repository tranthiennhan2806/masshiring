// src/app/admin/leads/page.tsx
"use client";

import { useEffect, useState } from "react";

const TYPES = [
  { key: "doanh-nghiep", label: "Doanh nghiệp" },
  { key: "doi-tac", label: "Đối tác" },
  { key: "hr-freelancer", label: "HR Freelancer" },
  { key: "ung-vien", label: "Ứng viên" },
  { key: "lien-he", label: "Liên hệ" },
] as const;

type LeadRow = { rowNumber: number; data: Record<string, string> };

export default function AdminLeadsPage() {
  const [type, setType] = useState<string>("doanh-nghiep");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<LeadRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads?type=${type}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải thất bại");
      setHeaders(data.headers || []);
      setRows(data.rows || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function handleDelete(row: LeadRow) {
    if (!confirm(`Xóa dòng ${row.rowNumber}? Không thể hoàn tác.`)) return;
    try {
      const res = await fetch(`/api/admin/leads/${type}/${row.rowNumber}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error || "Xóa thất bại");
      await load();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const patch: Record<string, string> = {};
    headers.forEach((h) => {
      const v = fd.get(h);
      if (v !== null) patch[h] = String(v);
    });
    try {
      const res = await fetch(`/api/admin/leads/${type}/${editing.rowNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Lưu thất bại");
      setEditing(null);
      await load();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem, sửa, xóa các bản ghi từ Google Sheet
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${type === t.key
                ? "bg-brand text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="mt-10 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-gray-200">
          <p className="text-gray-600">Chưa có dữ liệu.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-3 font-medium text-gray-600">#</th>
                {headers.map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-3 font-medium text-gray-600">
                    {h}
                  </th>
                ))}
                <th className="px-3 py-3 font-medium text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rowNumber} className="border-t border-gray-100">
                  <td className="px-3 py-3 text-xs text-gray-500">{r.rowNumber}</td>
                  {headers.map((h) => (
                    <td key={h} className="max-w-xs truncate px-3 py-3 text-gray-700">
                      {r.data[h] || "—"}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <button
                      onClick={() => setEditing(r)}
                      className="text-brand hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(r)}
                      className="ml-3 text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Sửa dòng {editing.rowNumber}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {headers.map((h) => (
                <div key={h}>
                  <label className="block text-sm font-medium text-gray-700">{h}</label>
                  <textarea
                    name={h}
                    defaultValue={editing.data[h] || ""}
                    rows={String(editing.data[h] || "").length > 60 ? 3 : 1}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border px-4 py-2 text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}