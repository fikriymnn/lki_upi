"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import {
  ChevronDown, Filter, FileText,
  Calendar, FlaskConical, MapPin
} from "lucide-react";

const kode = [
  { jenis_pengujian: "GCFID" }, { jenis_pengujian: "GCMS" },
  { jenis_pengujian: "NMR"   }, { jenis_pengujian: "AAS"  },
  { jenis_pengujian: "FTIR"  }, { jenis_pengujian: "TG DTA" },
  { jenis_pengujian: "HPLC"  }, { jenis_pengujian: "UV VIS" },
  { jenis_pengujian: "Freezdry" }, { jenis_pengujian: "LCMSMS" },
  { jenis_pengujian: "XRD"   },
];

const monthOption = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Selesai":                          return "bg-green-100 text-green-700";
    case "Menunggu Pembayaran":
    case "Menunggu Konfirmasi Pembayaran":   return "bg-amber-100 text-amber-700";
    case "menunggu form dikonfirmasi":
    case "Form Dikonfirmasi":                return "bg-blue-100 text-blue-700";
    case "Sample Dikerjakan Operator":
    case "Sample Diterima Admin":            return "bg-purple-100 text-purple-700";
    case "Menunggu Verifikasi":              return "bg-orange-100 text-orange-700";
    default:                                 return "bg-gray-100 text-gray-600";
  }
};

const FilterSelect = ({ icon: Icon, label, value, onChange, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />{label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 cursor-pointer transition"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

export default function OrderList({
  setActivePage, setNoInvoice, setIdInvoice,
  orderState, setOrderState   // ← props persist
}) {
  // ── Inisialisasi dari parent state ───────────────────────────────────
  const [invoice, setInvoice]                   = useState(orderState.invoice);
  const [page, setPage]                         = useState(orderState.page);
  const [length, setLength]                     = useState(orderState.length);
  const [year, setYear]                         = useState(orderState.year);
  const [month, setMonth]                       = useState(orderState.month);
  const [jenis_pengujian, setJenis_pengujian]   = useState(orderState.jenis_pengujian);
  const [yearOption, setYearOption]             = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState(null);

  // ── Refs ─────────────────────────────────────────────────────────────
  const abortControllerRef = useRef(null);
  const isFirstMount       = useRef(true);
  const prevStateRef       = useRef(orderState);

  // ── Inisialisasi yearOption ──────────────────────────────────────────
  useEffect(() => {
    const yearMax = new Date().getFullYear() - 2023;
    setYearOption(Array.from({ length: yearMax }, (_, i) => 2024 + i));
  }, []);

  // ── Cleanup abort saat unmount ───────────────────────────────────────
  useEffect(() => {
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  // ── Sync state lokal → parent (hanya jika ada perubahan nyata) ───────
  useEffect(() => {
    const next = { invoice, page, length, year, month, jenis_pengujian };
    const prev = prevStateRef.current;
    const changed = Object.keys(next).some(k =>
      k === 'invoice' ? next[k].length !== prev[k].length : next[k] !== prev[k]
    );
    if (changed) {
      prevStateRef.current = next;
      setOrderState(next);
    }
  }, [invoice, page, length, year, month, jenis_pengujian]);

  // ── Core fetch ───────────────────────────────────────────────────────
  const getInvoice = useCallback(async (currentPage = page) => {
    // Cancel request sebelumnya
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/invoice`
        + `?status=Sample Dikerjakan Operator`
        + `&skip=${currentPage * 15}&limit=15`
        + (year            ? `&year=${year}`                         : "")
        + (month           ? `&month=${month}`                       : "")
        + (jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}`   : ""),
        { withCredentials: true, signal: controller.signal }
      );

      if (res.data.success) {
        setInvoice(res.data.data);
        setLength(res.data.length_total);
      }
    } catch (err) {
      // Abaikan error dari abort — bukan network error sungguhan
      if (axios.isCancel(err) || err.name === "CanceledError") return;
      console.error("Fetch order error:", err.message);
      setError("Gagal memuat data. Periksa koneksi dan coba lagi.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [page, year, month, jenis_pengujian]);

  // ── Mount pertama: skip fetch jika data sudah ada dari parent ────────
  // ── Filter berubah: reset page ke 0 & fetch ulang ────────────────────
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (orderState.invoice.length > 0) return; // data sudah ada, skip fetch
      getInvoice(0);
      return;
    }
    setPage(0);
    getInvoice(0);
  }, [year, month, jenis_pengujian]);

  // ── Page berubah via pagination ───────────────────────────────────────
  useEffect(() => {
    if (isFirstMount.current) return;
    getInvoice(page);
  }, [page]);

  return (
    <div className="p-6">
      <div className="max-w-[90rem] mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Operator</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar order yang sedang dikerjakan operator</p>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => { setError(null); getInvoice(page); }}
              className="text-xs text-red-600 font-medium underline ml-4 flex-shrink-0"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* ── Filter Panel ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Filter className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-semibold text-gray-700">Filter</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterSelect icon={Calendar} label="Tahun" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Semua Tahun</option>
              {yearOption.map((v, i) => <option key={i} value={v}>{v}</option>)}
            </FilterSelect>

            <FilterSelect icon={Calendar} label="Bulan" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Semua Bulan</option>
              {monthOption.map((v, i) => <option key={i} value={i + 1}>{v}</option>)}
            </FilterSelect>

            <FilterSelect icon={FlaskConical} label="Jenis Pengujian" value={jenis_pengujian} onChange={(e) => setJenis_pengujian(e.target.value)}>
              <option value="">Semua Jenis</option>
              {kode.map((v, i) => <option key={i} value={v.jenis_pengujian}>{v.jenis_pengujian}</option>)}
            </FilterSelect>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    { label: "No",              w: "w-10"  },
                    { label: "Tanggal",         w: "w-32"  },
                    { label: "No. Invoice",     w: "w-48"  },
                    { label: "Nama Customer",   w: ""      },
                    { label: "Jenis Pengujian", w: "w-36"  },
                    { label: "Status",          w: "w-44"  },
                    { label: "Aksi",            w: "w-24"  },
                  ].map((h) => (
                    <th key={h.label} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${h.w}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-3 w-6 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-28 bg-gray-200 rounded-lg" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-32 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-28 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : invoice.length > 0 ? invoice.map((v, i) => (
                  <tr key={v._id ?? i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-400">{i + 1 + page * 15}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{v.date_format}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap">
                        {v.no_invoice || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{v.nama_lengkap}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                        {v.jenis_pengujian}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusStyle(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setNoInvoice(v.no_invoice); setIdInvoice(v._id); setActivePage('order-detail'); }}
                          title="Detail Order"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setNoInvoice(v.no_invoice); setIdInvoice(v._id); setActivePage('order-tracking'); }}
                          title="Tracking / Konfirmasi"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Tidak ada data order</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-gray-500">
                Menampilkan{" "}
                <span className="font-medium text-gray-700">{page * 15 + 1}–{Math.min((page + 1) * 15, length)}</span>
                {" "}dari{" "}
                <span className="font-medium text-gray-700">{length}</span> data
              </p>
              <Pagination
                currentPage={page + 1}
                totalPages={Math.ceil(length / 15)}
                onPageChange={(a) => setPage(a - 1)}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}