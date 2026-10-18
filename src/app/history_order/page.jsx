"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "flowbite-react";
import Navigasi from "@/components/Navigasi";
import {
  Calendar, ChevronDown, Filter, FileText, CheckCircle2, Building2, FlaskConical,
} from "lucide-react";

const monthOption = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Status order affiliate yang dianggap riwayat
const AFFILIATE_HISTORY_STATUS = ["Selesai", "Pencairan Dana Diterima"];

// Di riwayat, "Selesai" dan "Pencairan Dana Diterima" tampil sama (hijau, label "Selesai")
const getStatusStyleAffiliate = () => "bg-green-100 text-green-700";

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

export default function History_order() {
  const [invoice, setInvoice] = useState([]);
  const [year, setYear] = useState("");   // DIUBAH: sebelumnya 0
  const [month, setMonth] = useState(""); // DIUBAH: sebelumnya 0
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);
  const [yearOption, setYearOption] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⬅️ BARU: sumber order aktif + data order affiliate
  const [activeSource, setActiveSource] = useState("utama");
  const [orderAffiliate, setOrderAffiliate] = useState([]);
  const [lengthAffiliate, setLengthAffiliate] = useState(0);

  useEffect(() => {
    let ignore = false;

    let arr = [];
    const yearMax = new Date().getFullYear() - 2023;
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i);
      setYearOption(arr);
    }

    async function getData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const dataUser = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );
        if (!dataUser.data.success) return;
        const id_user = dataUser.data.data._id;

        if (activeSource === "utama") {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/invoice?status=Selesai&id_user=${id_user}&skip=${page * 15}&limit=15${year ? `&year=${year}` : ""}${
              month ? `&month=${month}` : ""
            }`,
            { withCredentials: true }
          );
          if (!ignore && data.data.success) {
            setInvoice(data.data.data);
            setLength(data.data.length_total);
          }
        } else {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate`,
            {
              params: {
                id_user,
                page: page + 1,
                limit: 15,
                status: AFFILIATE_HISTORY_STATUS.join(","),
                ...(year && { year }),
                ...(month !== "" && { month: Number(month) + 1 }), // BE expect bulan 1-12
              },
              withCredentials: true,
            }
          );
          if (!ignore && data.data.success) {
            setOrderAffiliate(data.data.data);
            setLengthAffiliate(data.data.pagination?.total_data || 0);
          }
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    getData();

    return () => { ignore = true; };
  }, [year, month, page, activeSource]);

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

  return (
    <div>
      <div className="p-6">
        <div className="max-w-7xl mx-auto md:px-8 px-4">

          {/* ── Header ── */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Order</h1>
            <p className="text-gray-500 text-sm mt-1">
              Daftar order yang telah selesai dikerjakan
            </p>
          </div>

          {/* ── Tab Sumber Order ── */}
          <div className="flex items-center gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => { setActiveSource("utama"); setPage(0); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSource === "utama" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Lab Utama
            </button>
            <button
              onClick={() => { setActiveSource("affiliate"); setPage(0); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSource === "affiliate" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <FilterSelect
                icon={Calendar}
                label="Tahun"
                value={year}
                onChange={(e) => { setYear(e.target.value); setPage(0); }}
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
                onChange={(e) => { setMonth(e.target.value); setPage(0); }}
              >
                <option value="">Semua Bulan</option>
                {monthOption.map((v, i) => (
                  <option key={i} value={i}>{v}</option>
                ))}
              </FilterSelect>
            </div>
          </div>

          {/* ── Table Lab Utama ── */}
          {activeSource === "utama" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {[
                        { label: "No", w: "w-12" },
                        { label: "Tanggal", w: "w-28" },
                        { label: "No Invoice", w: "w-40" },
                        { label: "Jenis Pengujian", w: "w-36" },
                        { label: "Harga (Rp)", w: "w-32" },
                        { label: "Status", w: "w-28" },
                        { label: "Aksi", w: "w-20" },
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
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-3"><div className="h-3 w-6 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-28 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                          <td className="px-4 py-3"><div className="w-8 h-8 bg-gray-200 rounded-lg" /></td>
                        </tr>
                      ))
                    ) : invoice.length > 0 ? (
                      invoice.map((value, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">

                          {/* No */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-400">{i + 1 + page * 15}</span>
                          </td>

                          {/* Tanggal */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-600">{value.date_format}</span>
                          </td>

                          {/* No Invoice */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                              {value.no_invoice}
                            </span>
                          </td>

                          {/* Jenis Pengujian */}
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                              {value.jenis_pengujian}
                            </span>
                          </td>

                          {/* Harga */}
                          <td className="px-4 py-3">
                            {value.total_harga !== 0 ? (
                              <span className="text-xs font-medium text-gray-800">
                                Rp {convertRupiah(value.total_harga)}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                              Selesai
                            </span>
                          </td>

                          {/* Aksi */}
                          <td className="px-4 py-3">
                            <a
                              href={`/history_order/detail/${value._id}?no_invoice=${value.no_invoice}`}
                              title="Detail Order"
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">Tidak ada riwayat order</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
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
                    totalPages={parseInt(Math.ceil(length / 15).toFixed())}
                    onPageChange={(a) => {
                      console.log(a);
                      setPage(a - 1);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Table Lab Affiliate ── */}
          {activeSource === "affiliate" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["No", "Tanggal", "No Invoice", "Lab Affiliate", "Total (Rp)", "Status", "Aksi"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          {Array.from({ length: 7 }).map((__, j) => (
                            <td key={j} className="px-4 py-3"><div className="h-3 w-full bg-gray-200 rounded" /></td>
                          ))}
                        </tr>
                      ))
                    ) : orderAffiliate.length > 0 ? (
                      orderAffiliate.map((value, i) => (
                        <tr key={value._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1 + page * 15}</span></td>
                          <td className="px-4 py-3"><span className="text-xs text-gray-600">{formatTanggalAffiliate(value.date || value.createdAt)}</span></td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                              {value.no_invoice || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs text-gray-700">{value.id_affiliate?.nama_laboratorium || "—"}</span></td>
                          <td className="px-4 py-3">
                            {value.total_keseluruhan ? (
                              <span className="text-xs font-medium text-gray-800">Rp {convertRupiah(value.total_keseluruhan)}</span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusStyleAffiliate()}`}>
                              Selesai
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`/history_order/detail_affiliate/${value._id}`}
                              title="Detail Order"
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">Tidak ada riwayat order lab affiliate</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {lengthAffiliate > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-xs text-gray-500">
                    Menampilkan{" "}
                    <span className="font-medium text-gray-700">
                      {page * 15 + 1}–{Math.min((page + 1) * 15, lengthAffiliate)}
                    </span>
                    {" "}dari{" "}
                    <span className="font-medium text-gray-700">{lengthAffiliate}</span> data
                  </p>
                  <Pagination
                    currentPage={page + 1}
                    totalPages={Math.ceil(lengthAffiliate / 15)}
                    onPageChange={(a) => setPage(a - 1)}
                  />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}