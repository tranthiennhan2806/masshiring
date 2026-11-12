"use client";

import { useEffect, useMemo, useState } from "react";

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

  // Filters
  const [search, setSearch] = useState("");
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads?type=${type}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải thất bại");
      setHeaders(data.headers || []);
      setRows(data.rows || []);
      setFieldFilters({});
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

  // Unique values per header for dropdown filters
  const uniqueValues = useMemo(() => {
    const map: Record<string, string[]> = {};
    headers.forEach((h) => {
      const set = new Set<string>();
      rows.forEach((r) => {
        const v = (r.data[h] || "").trim();
        if (v && v.length < 40) set.add(v); // chỉ những giá trị ngắn (tránh dropdown khổng lồ)
      });
      map[h] = Array.from(set).slice(0, 30);
    });
    return map;
  }, [headers, rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q) {
        const match = Object.values(r.data).some((v) =>
          (v || "").toLowerCase().includes(q)
        );
        if (!match) return false;
      }
      for (const [h, val] of Object.entries(fieldFilters)) {
        if (val && r.data[h] !== val) return false;
      }
      return true;
    });
  }, [rows, search, fieldFilters]);

  const activeFilterCount = Object.values(fieldFilters).filter(Boolean).length;

  function resetFilters() {
    setFieldFilters({});
    setSearch("");
  }

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
          <p className="mt-1 text-sm text-gray-500">Xem, sửa, xóa các bản ghi từ Google Sheet</p>
        </div>
      </div>

      {/* Type tabs */}
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

      {/* Search + filters */}
      {!loading && !error && headers.length > 0 && (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm toàn bộ dữ liệu..."
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ⚙ Bộ lọc
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
              <span className={`transition ${filtersOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
          </div>

          {filtersOpen && (
            <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {headers.map((h) => {
                  const opts = uniqueValues[h] || [];
                  if (opts.length === 0) {
                    return (
                      <div key={h}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{h}</label>
                        <input
                          value={fieldFilters[h] || ""}
                          onChange={(e) =>
                            setFieldFilters((prev) => ({ ...prev, [h]: e.target.value }))
                          }
                          placeholder="Lọc..."
                          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={h}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{h}</label>
                      <select
                        value={fieldFilters[h] || ""}
                        onChange={(e) =>
                          setFieldFilters((prev) => ({ ...prev, [h]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Tất cả</option>
                        {opts.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            {filtered.length} / {rows.length} bản ghi
          </div>
        </>
      )}

      {loading ? (
        <div className="mt-10 text-center text-sm text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="mt-10 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-gray-200">
          <p className="text-gray-600">
            {rows.length === 0 ? "Chưa có dữ liệu." : "Không tìm thấy bản ghi phù hợp."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-gray-200 lg:block">
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
                {filtered.map((r) => (
                  <tr key={r.rowNumber} className="border-t border-gray-100">
                    <td className="px-3 py-3 text-xs text-gray-500">{r.rowNumber}</td>
                    {headers.map((h) => (
                      <td key={h} className="max-w-xs truncate px-3 py-3 text-gray-700">
                        {r.data[h] || "—"}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-3 py-3 text-right">
                      <button onClick={() => setEditing(r)} className="text-brand hover:underline">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(r)} className="ml-3 text-red-600 hover:underline">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 lg:hidden">
            {filtered.map((r) => (
              <div key={r.rowNumber} className="rounded-2xl bg-white p-4 ring-1 ring-gray-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-400">Dòng #{r.rowNumber}</span>
                  <div className="flex gap-3 text-sm">
                    <button onClick={() => setEditing(r)} className="text-brand hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(r)} className="text-red-600 hover:underline">Xóa</button>
                  </div>
                </div>
                <dl className="mt-2 space-y-1.5 text-sm">
                  {headers.map((h) => (
                    <div key={h} className="flex gap-2">
                      <dt className="w-28 shrink-0 text-xs text-gray-400">{h}</dt>
                      <dd className="min-w-0 break-words text-gray-700">{r.data[h] || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit modal (giữ nguyên) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sửa dòng {editing.rowNumber}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">✕</button>
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
                <button type="button" onClick={() => setEditing(null)} className="rounded-xl border px-4 py-2 text-sm">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
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