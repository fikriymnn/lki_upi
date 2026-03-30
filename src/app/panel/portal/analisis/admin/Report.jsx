"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Navigasi from "@/components/Navigasi";
import {
  Search, Download, Filter, X, ChevronLeft, ChevronRight,
  FileSpreadsheet, AlertTriangle, Calendar
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────
const KODE_PENGUJIAN = [
  { jenis_pengujian: "GCFID",    kode_pengujian: "FID" },
  { jenis_pengujian: "GCMS",     kode_pengujian: "MS"  },
  { jenis_pengujian: "NMR",      kode_pengujian: "NMR" },
  { jenis_pengujian: "AAS",      kode_pengujian: "AS"  },
  { jenis_pengujian: "FTIR",     kode_pengujian: "IR"  },
  { jenis_pengujian: "TG DTA",   kode_pengujian: "TG"  },
  { jenis_pengujian: "HPLC",     kode_pengujian: "HP"  },
  { jenis_pengujian: "UV VIS",   kode_pengujian: "UV"  },
  { jenis_pengujian: "Freezdry", kode_pengujian: "FD"  },
  { jenis_pengujian: "LCMSMS",   kode_pengujian: "LC"  },
  { jenis_pengujian: "XRD",      kode_pengujian: "XRD" },
];

const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

const ROWS_PER_PAGE = 20;

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
        <Shimmer className="h-3 w-24 mb-3" />
        <Shimmer className="h-7 w-12 mb-2" />
        <Shimmer className="h-2.5 w-28" />
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["w-10","w-24","w-28","w-24","w-28","w-20","w-20","w-20"].map((w, i) => (
              <th key={i} className={`px-4 py-3 ${w}`}>
                <Shimmer className="h-3 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(8)].map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3"><Shimmer className="h-3 w-4" /></td>
              <td className="px-4 py-3"><Shimmer className="h-3 w-20" /></td>
              <td className="px-4 py-3"><Shimmer className="h-3 w-24" /></td>
              <td className="px-4 py-3"><Shimmer className="h-3 w-16" /></td>
              <td className="px-4 py-3"><Shimmer className="h-3 w-28" /></td>
              <td className="px-4 py-3"><Shimmer className="h-5 w-14 rounded-full" /></td>
              <td className="px-4 py-3"><Shimmer className="h-3 w-16" /></td>
              <td className="px-4 py-3"><Shimmer className="h-3 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function Report() {
  const [order, setOrder]                     = useState([]);
  const [invoice, setInvoice]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [yearOption, setYearOption]           = useState([]);
  const [year, setYear]                       = useState("");
  const [month, setMonth]                     = useState("");
  const [jenis_pengujian, setJenisPengujian]  = useState("");
  const [searchTerm, setSearchTerm]           = useState("");
  const [page, setPage]                       = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ── Build year options ──────────────────────────────────────────────────────
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2024; y <= currentYear; y++) years.push(y);
    setYearOption(years);
  }, []);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          status_pengujian: "success",
          status_report: "success",
          ...(month            && { month }),
          ...(year             && { year }),
          ...(jenis_pengujian  && { jenis_pengujian }),
        });

        const invoiceParams = new URLSearchParams({
          ...(month           && { month }),
          ...(year            && { year }),
          ...(jenis_pengujian && { jenis_pengujian }),
        });
        invoiceParams.append("status", "Selesai");
        invoiceParams.append("status", "Menunggu Konfirmasi Pembayaran");
        invoiceParams.append("status", "Menunggu Pembayaran");

        const [resOrder, resInvoice] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?${params}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice?${invoiceParams}`, { withCredentials: true }),
        ]);

        if (resOrder.data.success && resInvoice.data) {
          setOrder(resOrder.data.data);
          setInvoice(resInvoice.data.data);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
        setPage(0);
      }
    }
    fetchData();
  }, [year, month, jenis_pengujian]);

  // ── Filter + paginate ───────────────────────────────────────────────────────
  const filtered = order.filter(a => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.nama_lengkap?.toLowerCase().includes(q)    ||
      a.no_invoice?.toLowerCase().includes(q)       ||
      a.kode_pengujian?.toLowerCase().includes(q)   ||
      a.jenis_pengujian?.toLowerCase().includes(q)  ||
      a.nama_sample?.toLowerCase().includes(q)
    );
  });

  const totalPages  = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated   = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalHarga = invoice.reduce((sum, inv) => sum + (Number(inv?.total_harga) || 0), 0);
  const uniqueJenis = [...new Set(order.map(o => o.jenis_pengujian).filter(Boolean))].length;

  // ── Export to Excel ─────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = order.map((a, i) => ({
      "No":                  i + 1,
      "Tanggal":             a.date_format,
      "No Invoice":          a.no_invoice,
      "Kode Pengujian":      a.kode_pengujian,
      "Harga":               invoice[i]?.total_harga ?? "",
      "Catatan":             invoice[i]?.catatan ?? "",
      "Lama Pengerjaan":     a.lama_pengerjaan,
      "Operator":            a.operator_date ? a.operator_date.split(" ").slice(1).join(" ") : a.pj_date?.split(" ").slice(1).join(" ") ?? "",
      "PJ":                  a.pj_date ? a.pj_date.split(" ").slice(1).join(" ") : a.operator_date?.split(" ").slice(1).join(" ") ?? "",
      "Admin":               invoice[i]?.s8_date ? invoice[i].s8_date.split(" ").slice(1).join(" ") : a.pj_date?.split(" ").slice(1).join(" ") ?? "",
      "Nama":                a.nama_lengkap,
      "Jenis Institusi":     a.id_user?.[0]?.jenis_institusi ?? "",
      "Nama Institusi":      a.id_user?.[0]?.nama_institusi ?? "",
      "Fakultas":            a.id_user?.[0]?.fakultas ?? "",
      "Program Studi":       a.id_user?.[0]?.program_studi ?? "",
      "Nama Pembimbing":     a.nama_pembimbing ?? "",
      "Email":               a.id_user?.[0]?.email ?? "",
      "No Telepon":          a.id_user?.[0]?.no_telp ?? "",
      "No WhatsApp":         a.id_user?.[0]?.no_whatsapp ?? "",
      "Nama Sample":         a.nama_sample,
      "Jenis Pengujian":     a.jenis_pengujian,
      "Jumlah Sample":       a.jumlah_sample,
      "Wujud Sample":        a.wujud_sample,
      "Pelarut":             a.pelarut,
      "Preparasi Khusus":    a.preparasi_khusus ? "Ya" : "Tidak",
      "Target Senyawa":      a.target_senyawa,
      "Metode Parameter":    a.metode_parameter,
      "Sample Dikembalikan": a.sample_dikembalikan,
      "Deskripsi":           a.deskripsi_sample,
      "Riwayat Pengujian":   a.riwayat_pengujian,
      "Status":              invoice[i]?.status ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    const sheetName = `${month ? MONTHS[Number(month)] : "Semua"}_${year || new Date().getFullYear()}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const now = new Date();
    const filename = `report_${now.getDate()}_${MONTHS[now.getMonth()]}_${now.getFullYear()}_${now.getHours()}${now.getMinutes()}.xlsx`;
    saveAs(new Blob([buf], { type: "application/octet-stream" }), filename);
  };

  // ── Active filter count ─────────────────────────────────────────────────────
  const activeFilters = [year, month, jenis_pengujian].filter(Boolean).length;

  const resetFilters = () => {
    setYear("");
    setMonth("");
    setJenisPengujian("");
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-16">

        {/* Header */}
        <div className="my-6">
          <h1 className="text-2xl font-bold text-gray-900">Report Pengujian</h1>
          <p className="text-sm text-gray-500 mt-1">
            Data seluruh pengujian yang telah selesai dan memiliki laporan
          </p>
        </div>

        {loading ? (
          <>
            <StatsSkeleton />
            {/* Toolbar skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center justify-between gap-4">
              <Shimmer className="h-9 w-72 rounded-lg" />
              <div className="flex gap-2">
                <Shimmer className="h-9 w-32 rounded-lg" />
                <Shimmer className="h-9 w-44 rounded-lg" />
              </div>
            </div>
            <TableSkeleton />
          </>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Data",         value: order.length,                      sub: "Pengujian selesai",      color: "text-gray-900" },
                { label: "Hasil Filter",        value: filtered.length,                   sub: "Sesuai pencarian",       color: "text-blue-600" },
                { label: "Jenis Pengujian",     value: uniqueJenis,                       sub: "Tipe berbeda",           color: "text-purple-600" },
                {
                  label: "Total Pendapatan",
                  value: `Rp ${totalHarga.toLocaleString("id-ID")}`,
                  sub: "Dari invoice selesai",
                  color: "text-green-600",
                },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color} break-all`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, invoice, jenis pengujian..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    {activeFilters > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                        {activeFilters}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={order.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Download Excel
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilters > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Filter aktif:</span>
                  {year && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Tahun: {year}
                      <button onClick={() => setYear("")} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {month !== "" && month !== undefined && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Bulan: {MONTHS[Number(month)]}
                      <button onClick={() => setMonth("")} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {jenis_pengujian && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {jenis_pengujian}
                      <button onClick={() => setJenisPengujian("")} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 transition ml-1">
                    Reset semua
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px]">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      {[
                        { label: "No",               w: "w-10"  },
                        { label: "Tanggal",           w: "w-28"  },
                        { label: "No Invoice",        w: "w-36"  },
                        { label: "Nama",              w: ""      },
                        { label: "Jenis Pengujian",   w: "w-36"  },
                        { label: "Nama Sample",       w: "w-36"  },
                        { label: "Harga",             w: "w-32"  },
                        { label: "Status",            w: "w-40"  },
                        { label: "Operator",          w: "w-28"  },
                      ].map((h, i) => (
                        <th key={i} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${h.w}`}>
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginated.length > 0 ? paginated.map((a, i) => {
                      const globalIdx = page * ROWS_PER_PAGE + i;
                      const inv       = invoice[globalIdx];

                      const statusColors = {
                        "Selesai":                         "bg-green-100 text-green-700",
                        "Menunggu Konfirmasi Pembayaran":   "bg-yellow-100 text-yellow-700",
                        "Menunggu Pembayaran":              "bg-orange-100 text-orange-700",
                      };
                      const statusClass = statusColors[inv?.status] ?? "bg-gray-100 text-gray-600";

                      return (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-xs text-gray-400">{globalIdx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              {a.date_format}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-gray-700">{a.no_invoice}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 leading-tight">{a.nama_lengkap}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{a.id_user?.[0]?.nama_institusi ?? "—"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              {a.jenis_pengujian}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{a.nama_sample}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                            {inv?.total_harga
                              ? `Rp ${Number(inv.total_harga).toLocaleString("id-ID")}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {inv?.status
                              ? <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusClass}`}>{inv.status}</span>
                              : <span className="text-xs text-gray-400">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {a.operator_date
                              ? a.operator_date.split(" ").slice(1).join(" ")
                              : a.pj_date?.split(" ").slice(1).join(" ") ?? "—"}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="9" className="px-6 py-14 text-center">
                          <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Tidak ada data ditemukan</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} dari {filtered.length} data
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    if (totalPages <= 7 || i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1) {
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`w-9 h-9 text-sm rounded-lg border transition ${
                            page === i
                              ? "bg-red-600 text-white border-red-600"
                              : "border-gray-300 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                    if (Math.abs(i - page) === 2) {
                      return <span key={i} className="px-1 text-gray-400">…</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal Filter ──────────────────────────────────────────────────────── */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-8">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filter Data</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Tahun */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Tahun</option>
                  {yearOption.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Bulan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bulan</label>
                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Bulan</option>
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Jenis Pengujian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Pengujian</label>
                <select
                  value={jenis_pengujian}
                  onChange={e => setJenisPengujian(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Jenis</option>
                  {KODE_PENGUJIAN.map((k, i) => (
                    <option key={i} value={k.jenis_pengujian}>{k.jenis_pengujian}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { resetFilters(); setShowFilterModal(false); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}