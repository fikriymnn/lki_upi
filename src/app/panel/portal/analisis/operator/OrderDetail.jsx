"use client";
import AdminOrderCard from "@/components/AdminOrderCard";
import { useState, useEffect } from "react";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";
import { usePathname } from "next/navigation";
import {
  User, Calendar, FileText, ChevronLeft,
  Edit2, Check, X, CheckCircle,
  CreditCard, AlertCircle,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    "Selesai":                        "bg-green-100 text-green-800",
    "Menunggu Pembayaran":            "bg-amber-100 text-amber-800",
    "Menunggu Konfirmasi Pembayaran": "bg-amber-100 text-amber-800",
    "Order Dibatalkan":               "bg-red-100 text-red-800",
    "Form Dikonfirmasi":              "bg-blue-100 text-blue-800",
    "Sample Diterima Admin":          "bg-blue-100 text-blue-800",
    "Sample Dikerjakan Operator":     "bg-blue-100 text-blue-800",
    "Menunggu Verifikasi":            "bg-purple-100 text-purple-800",
    "Menunggu Form Dikonfirmasi":     "bg-gray-100 text-gray-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const convertRupiah = (angka) => {
  if (!angka) return "—";
  const bagian = angka.toString().split("").reverse().join("").match(/\d{1,3}/g);
  return "Rp " + bagian.join(".").split("").reverse().join("");
};

// ── Komponen Popup Sukses ──────────────────────────────────
function SuccessPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900 text-center">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
// ──────────────────────────────────────────────────────────

// ── Main Component ─────────────────────────────────────────
export default function OrderDetail({ setActivePage, idInvoice, noInvoice }) {
  const id         = idInvoice;
  const no_invoice = noInvoice;
  const path       = usePathname();

  const [activeTab, setActiveTab] = useState("info");
  const [editVerif, setEditVerif] = useState(false);
  const [order,   setOrder]   = useState([]);
  const [invoice, setInvoice] = useState({ id_user: {} });
  const [form,    setForm]    = useState({ status: "", catatan: "" });

  // ── State popup ──
  const [popup, setPopup] = useState({ show: false, message: "" });

  const showPopup = (message) => setPopup({ show: true, message });
  const closePopup = () => setPopup({ show: false, message: "" });

  // ── Tabs config ───────────────────────────────────────────
  const tabs = [
    { key: "info",   label: "Informasi Pelanggan", icon: <User  className="w-4 h-4" /> },
    { key: "status", label: "Update Progress",     icon: <Edit2 className="w-4 h-4" /> },
  ];

  // ── Fungsi refetch data ───────────────────────────────────
  const refetch = async () => {
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
        { withCredentials: true }
      );
      const dataOrder = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`,
        { withCredentials: true }
      );
      if (data.data.success) {
        const obj = data.data.data;
        setInvoice(obj);
        setForm({ status: obj.status || "", catatan: obj.catatan || "" });
      }
      if (dataOrder.data.success) setOrder(dataOrder.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ── Fetch awal ────────────────────────────────────────────
  useEffect(() => {
    async function getInvoice() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          { withCredentials: true }
        );
        const dataOrder = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`,
          { withCredentials: true }
        );
        if (data.data.success) {
          const obj = data.data.data;
          setInvoice(obj);
          setForm({ status: obj.status || "", catatan: obj.catatan || "" });
        }
        if (dataOrder.data.success) setOrder(dataOrder.data.data);
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, []);

  // ── Handler konfirmasi ────────────────────────────────────
  const handleConfirm = async (e) => {
    e.preventDefault();
    setEditVerif(false);
    let obj = { status: form.status, catatan: form.catatan };
    try {
      function timeNow() {
        const d = new Date();
        const h = (d.getHours()   < 10 ? "0" : "") + d.getHours();
        const m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        return h + ":" + m;
      }
      const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`;

      function selection() {
        switch (form.status) {
          case "Menunggu Form Dikonfirmasi":     obj.s1_date = date_format; return true;
          case "Form Dikonfirmasi":              obj.s2_date = date_format; return true;
          case "Sample Diterima Admin":          obj.s3_date = date_format; return true;
          case "Sample Dikerjakan Operator":     obj.s4_date = date_format; return true;
          case "Menunggu Verifikasi":            obj.s5_date = date_format; return true;
          case "Menunggu Pembayaran":            obj.s6_date = date_format; obj.success = true; return true;
          case "Menunggu Konfirmasi Pembayaran": obj.s7_date = date_format; obj.success = true; return true;
          case "Selesai":                        obj.s8_date = date_format; obj.success = true; return true;
        }
      }
      if (selection() === true) {
        const data = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          obj,
          { withCredentials: true }
        );
        // ── Ganti alert + redirect dengan popup + refetch ──
        if (data.data.success) {
          await refetch();
          showPopup("Update berhasil!");
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* ── Popup sukses ── */}
      {popup.show && (
        <SuccessPopup message={popup.message} onClose={closePopup} />
      )}

      {/* ── Page Header ── */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setActivePage("order")}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Order</h1>
          <p className="text-sm text-gray-500">Informasi dan update progress order pengujian</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">No. Invoice</p>
          <p className="text-base font-semibold text-gray-900 font-mono">
            {invoice?.no_invoice || "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Order ID: {id}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Total Harga</p>
          <p className="text-2xl font-bold text-blue-600">
            {invoice?.total_harga ? convertRupiah(invoice.total_harga) : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">{order.length} item pengujian</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Status Order</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(invoice?.status)}`}>
            {invoice?.status || "—"}
          </span>
          <p className="text-xs text-gray-400 mt-2">
            Est. selesai: {invoice?.estimasi_date || "—"}
          </p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                if (t.key !== "status") setEditVerif(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                activeTab === t.key
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          Tab: Informasi Pelanggan
      ══════════════════════════════════════ */}
      {activeTab === "info" && (
        <div className="space-y-4">

          {/* Data Pelanggan */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Data Pelanggan
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400">Nama Lengkap</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.nama_lengkap || invoice?.id_user?.nama_lengkap || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">No. WhatsApp</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.no_whatsapp || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">No. Telepon</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.no_telp || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Nama Institusi</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.nama_institusi || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Jenis Institusi</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.jenis_institusi || "—"}</p>
              </div>
              {invoice?.id_user?.jenis_institusi === "Perguruan Tinggi" && <>
                <div>
                  <p className="text-xs text-gray-400">Fakultas</p>
                  <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.fakultas || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Program Studi</p>
                  <p className="text-sm font-medium mt-0.5">{invoice?.id_user?.program_studi || "—"}</p>
                </div>
              </>}
            </div>
          </div>

          {/* Ringkasan Order */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Ringkasan Order
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400">Estimasi Selesai</p>
                <p className="text-sm font-medium mt-0.5">{invoice?.estimasi_date || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Catatan</p>
                <p className="text-sm font-medium mt-0.5 text-gray-600">{invoice?.catatan || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(invoice?.status)}`}>
                  {invoice?.status || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          Tab: Update Progress
      ══════════════════════════════════════ */}
      {activeTab === "status" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-5 flex items-center gap-2">
            <Edit2 className="w-3.5 h-3.5" /> Update Progress Order
          </p>

          {/* Warning */}
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 font-medium">
              * Upload hasil analisis terlebih dahulu sebelum verifikasi
            </p>
          </div>

          <div className="space-y-4 divide-y divide-gray-100">

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 items-center pt-4 first:pt-0">
              <p className="text-sm font-semibold text-gray-700">Status</p>
              {editVerif && invoice?.opTask ? (
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm((a) => ({ ...a, [e.target.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Sample Dikerjakan Operator">Sample Dikerjakan Operator</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                </select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${statusBadge(form.status)}`}>
                  {form.status || "—"}
                </span>
              )}
            </div>

            {/* Catatan */}
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 items-start pt-4">
              <p className="text-sm font-semibold text-gray-700 pt-1.5">Catatan</p>
              {editVerif ? (
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={(e) => setForm((a) => ({ ...a, [e.target.name]: e.target.value }))}
                  rows={4}
                  placeholder="Tuliskan catatan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-sm text-gray-700 pt-1.5">{form.catatan || "—"}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
            {editVerif && invoice?.opTask ? (
              <>
                <button
                  onClick={() => setEditVerif(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  <Check className="w-4 h-4" /> Konfirmasi
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditVerif(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Daftar Sampel (selalu tampil di semua tab) ── */}
      <div className="mt-8">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5" /> Daftar Sampel ({order.length} item)
        </p>
        {order.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Tidak ada data sampel</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {order.map((e, i) => (
              <AdminOrderCard
                key={i}
                status={invoice.status}
                invoice_id={invoice._id}
                no_invoice={invoice.no_invoice}
                riwayat_pengujian={e.riwayat_pengujian}
                sample_dikembalikan={e.sample_dikembalikan}
                uuid={e.uuid}
                id={e._id}
                jenis_pengujian={e.jenis_pengujian}
                kode_pengujian={e.kode_pengujian}
                nama_sample={e.nama_sample}
                jumlah_sample={e.jumlah_sample}
                index={i + 1}
                wujud_sample={e.wujud_sample}
                pelarut={e.pelarut}
                preparasi_khusus={e.preparasi_khusus}
                target_senyawa={e.target_senyawa}
                metode_parameter={e.metode_parameter}
                jurnal_pendukung={e.jurnal_pendukung}
                foto_sample={e.foto_sample}
                deskripsi={e.deskripsi_sample}
                hasil_analisis={e.hasil_analisis}
                lama_pengerjaan={e.lama_pengerjaan}
                nama_pembimbing={e.nama_pembimbing}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}