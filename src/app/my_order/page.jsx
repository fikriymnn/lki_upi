"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import {
  Search, ChevronDown, Filter, FileText,
  Calendar, MapPin, Pencil, Tag, Building2, FlaskConical,
} from "lucide-react";

const monthOption = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Harus sama persis dengan STATUS_OPTIONS di order_affiliate_controller.js (BE)
const AFFILIATE_STATUS_OPTIONS = [
  "Menunggu Order Dikonfirmasi",
  "Order Dikonfirmasi",
  "Order Ditolak",
  "Order Diproses",
  "Menunggu Diverifikasi",
  "Selesai Diverifikasi",
  "Menunggu Pembayaran",
  "Menunggu Verifikasi Pembayaran",
  "Selesai",
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Selesai": return "bg-green-100 text-green-700";
    case "Menunggu Pembayaran":
    case "Menunggu Konfirmasi Pembayaran": return "bg-amber-100 text-amber-700";
    case "menunggu form dikonfirmasi":
    case "Form Dikonfirmasi": return "bg-blue-100 text-blue-700";
    case "Sample Dikerjakan Operator":
    case "Sample Diterima Admin": return "bg-purple-100 text-purple-700";
    case "Menunggu Verifikasi": return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

// Style khusus untuk status order affiliate (beda daftar status dari order utama)
const getStatusStyleAffiliate = (status) => {
  switch (status) {
    case "Selesai": return "bg-green-100 text-green-700";
    case "Order Ditolak": return "bg-red-100 text-red-700";
    case "Menunggu Pembayaran":
    case "Menunggu Verifikasi Pembayaran": return "bg-amber-100 text-amber-700";
    case "Menunggu Order Dikonfirmasi": return "bg-gray-100 text-gray-600";
    case "Order Dikonfirmasi":
    case "Order Diproses": return "bg-blue-100 text-blue-700";
    case "Menunggu Diverifikasi":
    case "Selesai Diverifikasi": return "bg-purple-100 text-purple-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

// Order affiliate bisa berisi kombinasi beberapa jenis layanan sekaligus
const getJenisAffiliate = (value) => {
  const jenis = [];
  if (value?.layanan_analisis?.length > 0) jenis.push("Analisis");
  if (value?.sewa_lab?.length > 0) jenis.push("Sewa Lab");
  if (value?.sewa_alat?.length > 0) jenis.push("Sewa Alat");
  if (value?.pembelian_bahan?.length > 0) jenis.push("Bahan");
  return jenis.length > 0 ? jenis : ["—"];
};

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

export default function My_order() {
  // Sumber order aktif: "utama" (lab sendiri) atau "affiliate" (lab mitra)
  const [activeSource, setActiveSource] = useState("utama");

  // ---- state untuk order lab utama (existing, tidak diubah) ----
  const [invoice, setInvoice] = useState([]);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [yearOption, setYearOption] = useState([]);

  // ---- state untuk order lab affiliate (baru) ----
  const [orderAffiliate, setOrderAffiliate] = useState([]);
  const [statusAffiliate, setStatusAffiliate] = useState("");
  const [lengthAffiliate, setLengthAffiliate] = useState(0);

  // ---- state bersama ----
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(false);

  const convertRupiah = (angka) => {
    let angkaString = angka.toString();
    let bagianAngka = angkaString.split("").reverse().join("").match(/\d{1,3}/g);
    return bagianAngka.join(".").split("").reverse().join("");
  };

  const formatTanggalAffiliate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  // Reset ke halaman 1 setiap kali pindah tab, biar tidak nyangkut di page kosong
  useEffect(() => {
    setPage(0);
  }, [activeSource]);

  useEffect(() => {
    let arr = [];
    const yearMax = new Date().getFullYear() - 2023;
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i);
      setYearOption(arr);
    }

    async function getUserId() {
      const token = localStorage.getItem("access_token");
      const dataUser = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
        { withCredentials: true }
      );
      return dataUser?.data?.success ? dataUser.data.data._id : null;
    }

    async function getInvoiceUtama(id_user) {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/invoice?status=Menunggu Verifikasi&status=menunggu form dikonfirmasi&status=Sample Diterima Admin&status=Form Dikonfirmasi&status=Sample Dikerjakan Operator&status=Menunggu Pembayaran&status=Menunggu Konfirmasi Pembayaran&id_user=${id_user}&skip=${page * 15}&limit=15${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""}`,
        { withCredentials: true }
      );
      if (data.data.success) {
        setInvoice(data.data.data);
        setLength(data.data.length_total);
      }
    }

    async function getOrderAffiliate(id_user) {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate?id_user=${id_user}&page=${page + 1}&limit=15${statusAffiliate ? `&status=${statusAffiliate}` : ""}`,
        { withCredentials: true }
      );
      if (data.data.success) {
        setOrderAffiliate(data.data.data);
        setLengthAffiliate(data.data.pagination?.total_data || 0);
      }
    }

    async function loadData() {
      setLoading(true);
      try {
        const id_user = await getUserId();
        if (!id_user) return;

        if (activeSource === "utama") {
          await getInvoiceUtama(id_user);
        } else {
          await getOrderAffiliate(id_user);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [year, month, page, activeSource, statusAffiliate]);

  const currentLength = activeSource === "utama" ? length : lengthAffiliate;

  return (
    <div>
      <div className="p-6">
        <div className="max-w-7xl mx-auto md:px-8 px-4">

          {/* ── Header ── */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Order</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau dan kelola order layanan analisis Anda</p>
          </div>

          {/* ── Tab Sumber Order ── */}
          <div className="flex items-center gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveSource("utama")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSource === "utama"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Lab Utama
            </button>
            <button
              onClick={() => setActiveSource("affiliate")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSource === "affiliate"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Lab Affiliate
            </button>
          </div>

          {/* ── Filter Panel ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Filter className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-700">Filter</p>
            </div>

            {activeSource === "utama" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <FilterSelect icon={Calendar} label="Tahun" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Semua Tahun</option>
                  {yearOption.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </FilterSelect>

                <FilterSelect icon={Calendar} label="Bulan" value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">Semua Bulan</option>
                  {monthOption.map((v, i) => (
                    <option key={i} value={i}>{v}</option>
                  ))}
                </FilterSelect>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <FilterSelect icon={Tag} label="Status" value={statusAffiliate} onChange={(e) => setStatusAffiliate(e.target.value)}>
                  <option value="">Semua Status</option>
                  {AFFILIATE_STATUS_OPTIONS.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </FilterSelect>
              </div>
            )}
          </div>

          {/* ── Table Lab Utama (existing, tidak diubah) ── */}
          {activeSource === "utama" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {[
                        { label: "No", w: "w-12" },
                        { label: "Tanggal", w: "w-28" },
                        { label: "No Invoice", w: "w-36" },
                        { label: "Jenis Pengujian", w: "w-36" },
                        { label: "Harga (Rp)", w: "w-32" },
                        { label: "Status", w: "w-52" },
                        { label: "Aksi", w: "w-24" },
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
                          <td className="px-4 py-3"><div className="h-5 w-28 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-32 bg-gray-200 rounded-full" /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : invoice.length > 0 ? (
                      invoice.map((value, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1 + page * 15}</span></td>
                          <td className="px-4 py-3"><span className="text-xs text-gray-600">{value.date_format}</span></td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                              {value.no_invoice}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                              {value.jenis_pengujian}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {value.total_harga !== 0 ? (
                              <span className="text-xs font-medium text-gray-800">Rp {convertRupiah(value.total_harga)}</span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusStyle(value.status)}`}>
                              {value.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <a href={`/my_order/detail/${value._id}?no_invoice=${value.no_invoice}`} title="Detail Order"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                                <FileText className="w-4 h-4" />
                              </a>
                              <a href={`/my_order/tracking/${value._id}?no_invoice=${value.no_invoice}`} title="Tracking Status"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
                                <MapPin className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
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
            </div>
          )}

          {/* ── Table Lab Affiliate (baru) ── */}
          {activeSource === "affiliate" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {[
                        { label: "No", w: "w-12" },
                        { label: "Tanggal", w: "w-28" },
                        { label: "No Invoice", w: "w-36" },
                        { label: "Lab Affiliate", w: "w-40" },
                        { label: "Total (Rp)", w: "w-32" },
                        { label: "Status", w: "w-52" },
                        { label: "Aksi", w: "w-24" },
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
                          <td className="px-4 py-3"><div className="h-5 w-28 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-32 bg-gray-200 rounded-full" /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : orderAffiliate.length > 0 ? (
                      orderAffiliate.map((value, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1 + page * 15}</span></td>
                          <td className="px-4 py-3"><span className="text-xs text-gray-600">{formatTanggalAffiliate(value.date || value.createdAt)}</span></td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                              {value.no_invoice || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-700">
                              {value.id_affiliate?.nama_laboratorium || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {value.total_keseluruhan ? (
                              <span className="text-xs font-medium text-gray-800">Rp {convertRupiah(value.total_keseluruhan)}</span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusStyleAffiliate(value.status_pengujian)}`}>
                              {value.status_pengujian}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <a href={`/my_order/detail_affiliate/${value._id}`} title="Detail Order"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                                <FileText className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center">
                          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">Tidak ada order ke lab affiliate</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Pagination (dipakai bersama kedua tab) ── */}
          {currentLength > 0 && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-gray-500">
                Menampilkan{" "}
                <span className="font-medium text-gray-700">
                  {page * 15 + 1}–{Math.min((page + 1) * 15, currentLength)}
                </span>
                {" "}dari{" "}
                <span className="font-medium text-gray-700">{currentLength}</span> data
              </p>
              <Pagination
                currentPage={page + 1}
                totalPages={Math.ceil(currentLength / 15)}
                onPageChange={(a) => setPage(a - 1)}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}