"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import {
    ChevronDown,
    Filter,
    FileText,
    Calendar,
    FlaskConical,
    Tag,
    Archive,
    Eye,
    EyeOff,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────
const kode = [
    { jenis_pengujian: "GCFID" }, { jenis_pengujian: "GCMS" },
    { jenis_pengujian: "NMR" }, { jenis_pengujian: "AAS" },
    { jenis_pengujian: "FTIR" }, { jenis_pengujian: "TG DTA" },
    { jenis_pengujian: "HPLC" }, { jenis_pengujian: "UV VIS" },
    { jenis_pengujian: "Freezdry" }, { jenis_pengujian: "LCMSMS" },
    { jenis_pengujian: "XRD" },
];

const stats = [
    { status: "Sembunyikan" },
    { status: "Selesai" },
    { status: "Order Dibatalkan" },
];

const monthOption = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ── Helpers ────────────────────────────────────────────────
const getStatusStyle = (status) => {
    switch (status) {
        case "Selesai":
            return "bg-green-100 text-green-700";
        case "Order Dibatalkan":
            return "bg-red-100 text-red-600";
        case "Sembunyikan":
            return "bg-gray-100 text-gray-500";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

// ── Reusable FilterSelect ──────────────────────────────────
const FilterSelect = ({ icon: Icon, label, value, onChange, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" />
            {label}
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

// ── Main Component ─────────────────────────────────────────
export default function OrderList({ setActivePage, setNoInvoice, setIdInvoice }) {
    const [invoice, setInvoice] = useState([]);
    const [page, setPage] = useState(0);
    const [length, setLength] = useState(0);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [jenis_pengujian, setJenis_pengujian] = useState("");
    const [status, setStatus] = useState("");
    const [yearOption, setYearOption] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── handlers (logic tidak diubah) ─────────────────────────
    const handleArsip = async (id) => {
        try {
            const data = await axios.put(
                `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
                { status: "Sembunyikan", success: true },
                { withCredentials: true }
            );
            if (data.data.success) {
                alert("Arsip successfully!");
                window.location.reload();
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleShow = async (id) => {
        try {
            const data = await axios.put(
                `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
                { status: "Selesai", success: true },
                { withCredentials: true }
            );
            if (data.data.success) {
                alert("Arsip successfully!");
                window.location.reload();
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // ── data fetch (logic tidak diubah) ───────────────────────
    useEffect(() => {
        let arr = [];
        const yearMax = new Date().getFullYear() - 2023;
        for (let i = 0; i < yearMax; i++) {
            arr.push(2024 + i);
            setYearOption(arr);
        }

        async function getInvoice() {
            setLoading(true);
            try {
                const data = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/invoice?success=true&skip=${page * 15
                    }&limit=15${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""
                    }${jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}` : ""}${status
                        ? `&status=${status}`
                        : "&status=Sembunyikan&status=Selesai&status=Order Dibatalkan"
                    }`,
                    { withCredentials: true }
                );
                if (data.data.success) {
                    setInvoice(data.data.data);
                    setLength(data.data.length_total);
                }
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        }
        getInvoice();
    }, [page, month, year, jenis_pengujian, status]);

    // ── Render ─────────────────────────────────────────────────
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">

                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Arsip & History</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Kelola arsip invoice dan riwayat order
                    </p>
                </div>

                {/* ── Filter Panel ── */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-700">Filter</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FilterSelect
                            icon={Calendar}
                            label="Tahun"
                            value={year}
                            onChange={(e) => { setPage(0); setYear(e.target.value); }}
                        >
                            <option value="">Semua Tahun</option>
                            {yearOption.map((v, i) => (
                                <option key={i} value={v}>{v}</option>
                            ))}
                        </FilterSelect>

                        <FilterSelect
                            icon={Calendar}
                            label="Bulan"
                            value={month}
                            onChange={(e) => { setPage(0); setMonth(e.target.value); }}
                        >
                            <option value="">Semua Bulan</option>
                            {monthOption.map((v, i) => (
                                <option key={i} value={i}>{v}</option>
                            ))}
                        </FilterSelect>

                        <FilterSelect
                            icon={FlaskConical}
                            label="Jenis Pengujian"
                            value={jenis_pengujian}
                            onChange={(e) => { setPage(0); setJenis_pengujian(e.target.value); }}
                        >
                            <option value="">Semua Jenis</option>
                            {kode.map((v, i) => (
                                <option key={i} value={v.jenis_pengujian}>{v.jenis_pengujian}</option>
                            ))}
                        </FilterSelect>

                        <FilterSelect
                            icon={Tag}
                            label="Status"
                            value={status}
                            onChange={(e) => { setPage(0); setStatus(e.target.value); }}
                        >
                            <option value="">Semua Status</option>
                            {stats.map((v, i) => (
                                <option key={i} value={v.status}>{v.status}</option>
                            ))}
                        </FilterSelect>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {[
                                        { label: "No", w: "w-12" },
                                        { label: "Tanggal", w: "w-28" },
                                        { label: "Invoice", w: "w-40" },
                                        { label: "Nama Customer", w: "" },
                                        { label: "Jenis Pengujian", w: "w-36" },
                                        { label: "Harga", w: "w-32" },
                                        { label: "Status", w: "w-36" },
                                        { label: "Aksi", w: "w-28" },
                                    ].map((h) => (
                                        <th
                                            key={h.label}
                                            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${h.w}`}
                                        >
                                            {h.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    // Skeleton rows
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-3"><div className="h-3 w-6 bg-gray-200 rounded" /></td>
                                            <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                                            <td className="px-4 py-3"><div className="h-3 w-28 bg-gray-200 rounded" /></td>
                                            <td className="px-4 py-3"><div className="h-3 w-32 bg-gray-200 rounded" /></td>
                                            <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                                            <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                                            <td className="px-4 py-3"><div className="h-5 w-24 bg-gray-200 rounded-full" /></td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1.5">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : invoice.length > 0 ? (
                                    invoice.map((v, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            {/* No */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-gray-400">{i + 1 + page * 15}</span>
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-gray-600">{v.date_format}</span>
                                            </td>

                                            {/* Invoice */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-mono text-gray-700">{v.no_invoice}</span>
                                            </td>

                                            {/* Nama Customer */}
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {v.id_user[0].nama_lengkap}
                                                </span>
                                            </td>

                                            {/* Jenis Pengujian */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                                                    {v.jenis_pengujian}
                                                </span>
                                            </td>

                                            {/* Harga */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-gray-700 font-medium">{v.total_harga}</span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusStyle(v.status)}`}
                                                >
                                                    {v.status}
                                                </span>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    {/* Detail */}

                                                    <button
                                                        onClick={() => {
                                                            setNoInvoice(v.no_invoice);
                                                            setIdInvoice(v._id);
                                                            setActivePage("order-detail"); // ← arahkan ke detail
                                                        }}
                                                        title="Detail Order"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>

                                                    {/* Arsip / Munculkan / - */}
                                                    {v.status === "Order Dibatalkan" ? (
                                                        <span className="text-gray-300 text-lg leading-none px-2">—</span>
                                                    ) : v.status === "Sembunyikan" ? (
                                                        <button
                                                            onClick={() => handleShow(v._id)}
                                                            title="Munculkan"
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleArsip(v._id)}
                                                            title="Arsipkan"
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                                                        >
                                                            <Archive className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center">
                                            <Archive className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400">Tidak ada data arsip</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                            <p className="text-xs text-gray-500">
                                Menampilkan{" "}
                                <span className="font-medium text-gray-700">
                                    {page * 15 + 1}–{Math.min((page + 1) * 15, length)}
                                </span>
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