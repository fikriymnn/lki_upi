"use client";
import AdminOrderCard from "@/components/AdminOrderCard";
import { useState, useEffect } from "react";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";
import {
  ChevronLeft, User, Mail, Phone, MessageCircle,
  Building2, GraduationCap, FileText, Calendar,
  Banknote, StickyNote, Download, ClipboardList,
  Pencil, CheckCircle, X, AlertCircle, BookOpen,
  Hash,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    "Selesai": "bg-green-100 text-green-700",
    "Menunggu Pembayaran": "bg-amber-100 text-amber-700",
    "Menunggu Konfirmasi Pembayaran": "bg-amber-100 text-amber-700",
    "Order Dibatalkan": "bg-red-100 text-red-600",
    "Form Dikonfirmasi": "bg-blue-100 text-blue-700",
    "Sample Diterima Admin": "bg-blue-100 text-blue-700",
    "Sample Dikerjakan Operator": "bg-purple-100 text-purple-700",
    "Menunggu Verifikasi": "bg-orange-100 text-orange-700",
    "Menunggu Form Dikonfirmasi": "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

const convertRupiah = (angka) => {
  if (!angka) return "";
  let angkaString = angka.toString();
  let bagianAngka = angkaString.split("").reverse().join("").match(/\d{1,3}/g);
  return "Rp " + bagianAngka.join(".").split("").reverse().join("");
};

// ── Sub-components ─────────────────────────────────────────
const InfoCard = ({ icon: Icon, label, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" /> {label}
    </p>
    <div className="text-sm font-semibold text-gray-800">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0 gap-4">
    <span className="text-sm text-gray-500 shrink-0 w-40">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right">{value || "—"}</span>
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-gray-400" />
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
  </div>
);

// ── Status options ─────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "Order Dibatalkan", label: "Batalkan Order" },
  { value: "Form Dikonfirmasi", label: "Form Dikonfirmasi" },
  { value: "Sample Dikerjakan Operator", label: "Sample Diterima Admin dan Diproses" },
  { value: "Menunggu Verifikasi", label: "Menunggu Verifikasi" },
  { value: "Menunggu Pembayaran", label: "Menunggu Pembayaran" },
  { value: "Selesai", label: "Konfirmasi Pembayaran dan Selesai" },
];

const DOWNLOAD_ELIGIBLE = [
  "Form Dikonfirmasi", "Sample Diterima Admin", "Sample Dikerjakan Operator",
  "Menunggu Verifikasi", "Menunggu Pembayaran", "Menunggu Konfirmasi Pembayaran", "Selesai",
];

// ── Main Component ─────────────────────────────────────────
export default function OrderDetail({ setActivePage, idInvoice, noInvoice }) {
  const id = idInvoice;
  const no_invoice = noInvoice;

  const [edit, setEdit] = useState(false);
  const [order, setOrder] = useState([]);
  const [invoice, setInvoice] = useState({ id_user: {} });
  const [loading, setLoading] = useState(false);

  // ── Download handlers (logic tidak diubah) ───────────────
  const downloadInvoice = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`,
        { withCredentials: true, responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap?.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_invoice.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { alert(err.message); }
  };

  const downloadKuitansi = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/generate_kuitansi?no_invoice=${no_invoice}`,
        { withCredentials: true, responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap?.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_kuitansi.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { alert(err.message); }
  };

  const downloadBuktiTransfer = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/download_bukti_pembayaran/${id}`,
        { withCredentials: true, responseType: "arraybuffer" }
      );
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = invoice?.bukti_pembayaran;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { console.error(err); }
  };

  // ── Edit handlers (logic tidak diubah) ───────────────────
  const handleChange = (e) => {
    const { value, name } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setEdit(false);
    let obj = {
      status: invoice?.status,
      estimasi_date: invoice?.estimasi_date,
      total_harga: invoice?.total_harga,
      catatan: invoice?.catatan,
    };
    try {
      function timeNow() {
        const d = new Date();
        const h = (d.getHours() < 10 ? "0" : "") + d.getHours();
        const m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        return h + ":" + m;
      }
      const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`;
      function selection() {
        switch (invoice?.status) {
          case "Menunggu Form Dikonfirmasi": obj.s1_date = date_format; obj.success = false; return true;
          case "Form Dikonfirmasi":          obj.s2_date = date_format; obj.success = false; return true;
          case "Sample Diterima Admin":      obj.s3_date = date_format; obj.success = false; return true;
          case "Sample Dikerjakan Operator": obj.s3_date = date_format; obj.s4_date = date_format; obj.success = false; return true;
          case "Menunggu Verifikasi":        obj.s5_date = date_format; obj.success = false; return true;
          case "Menunggu Pembayaran":        obj.success = true; obj.s6_date = date_format; return true;
          case "Menunggu Konfirmasi Pembayaran": obj.success = true; obj.s7_date = date_format; return true;
          case "Selesai":                    obj.success = true; obj.s8_date = date_format; return true;
          case "Order Dibatalkan":           obj.s8_date = date_format; return true;
        }
      }
      if (selection() === true) {
        const data = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          obj,
          { withCredentials: true }
        );
        alert("Update successfully");
        if (data.data.success) window.location.reload();
      }
    } catch (err) { alert(err.message); }
  };

  // ── Fetch (logic tidak diubah) ────────────────────────────
  useEffect(() => {
    async function getInvoice() {
      setLoading(true);
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          { withCredentials: true }
        );
        const dataOrder = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`,
          { withCredentials: true }
        );
        if (data.data.success) setInvoice(data.data.data);
        if (dataOrder.data.success) setOrder(dataOrder.data.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    getInvoice();
  }, []);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setActivePage("order")}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Order</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Informasi lengkap dan manajemen order pengujian
            </p>
          </div>
        </div>

        {/* ── Info Cards Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InfoCard icon={Hash} label="No. Invoice">
            <span className="font-mono">{invoice?.no_invoice || "—"}</span>
          </InfoCard>
          <InfoCard icon={Calendar} label="Estimasi Selesai">
            {invoice?.estimasi_date || "—"}
          </InfoCard>
          <InfoCard icon={AlertCircle} label="Status">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(invoice?.status)}`}>
              {invoice?.status || "—"}
            </span>
          </InfoCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* ── Customer Info ── */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle icon={User} title="Data Customer" />
            <div className="flex flex-col">
              <InfoRow label="Nama Lengkap"   value={invoice?.nama_lengkap} />
              <InfoRow label="Email"          value={invoice?.id_user?.email} />
              <InfoRow label="No. WhatsApp"   value={invoice?.id_user?.no_whatsapp} />
              <InfoRow label="No. Telepon"    value={invoice?.id_user?.no_telp} />
              <InfoRow label="Institusi"      value={invoice?.id_user?.nama_institusi} />
              {invoice?.id_user?.jenis_institusi === "Perguruan Tinggi" && <>
                <InfoRow label="Fakultas"     value={invoice?.id_user?.fakultas} />
                <InfoRow label="Program Studi" value={invoice?.id_user?.program_studi} />
              </>}
            </div>
          </div>

          {/* ── Order Info + Edit ── */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={ClipboardList} title="Informasi Order" />
              {/* Edit / Confirm / Cancel buttons */}
              {edit ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirm}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Konfirmasi
                  </button>
                  <button
                    onClick={() => setEdit(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition"
                  >
                    <X className="w-3.5 h-3.5" /> Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>

            {edit ? (
              /* ── Edit Mode ── */
              <div className="flex flex-col gap-4">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Status</label>
                  <select
                    name="status"
                    value={invoice?.status}
                    onChange={(e) => setInvoice((a) => ({ ...a, [e.target.name]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                  >
                    <option value="">Pilih status</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Total Harga */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Total Harga</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                    <input
                      type="number"
                      name="total_harga"
                      value={invoice?.total_harga}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                    />
                  </div>
                </div>

                {/* Estimasi Selesai */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Estimasi Selesai</label>
                  <input
                    type="text"
                    name="estimasi_date"
                    value={invoice?.estimasi_date}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                  />
                </div>

                {/* Catatan */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Catatan</label>
                  <textarea
                    name="catatan"
                    value={invoice?.catatan}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tuliskan catatan..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 resize-none"
                  />
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <div className="flex flex-col">
                <InfoRow label="Status"          value={
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(invoice?.status)}`}>
                    {invoice?.status || "—"}
                  </span>
                } />
                <InfoRow label="Total Harga"     value={invoice?.total_harga ? convertRupiah(invoice.total_harga) : "—"} />
                <InfoRow label="Estimasi Selesai" value={invoice?.estimasi_date} />
                <InfoRow label="Catatan"         value={invoice?.catatan} />
              </div>
            )}
          </div>
        </div>

        {/* ── Download Panel ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <SectionTitle icon={Download} title="Dokumen" />
          <div className="flex flex-wrap gap-3">

            {/* Invoice */}
            {DOWNLOAD_ELIGIBLE.includes(invoice?.status) ? (
              <button
                onClick={downloadInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition"
              >
                <Download className="w-4 h-4" /> Invoice PDF
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 text-sm rounded-lg">
                <FileText className="w-4 h-4" /> Invoice (belum tersedia)
              </div>
            )}

            {/* Kuitansi */}
            {invoice?.status === "Selesai" ? (
              <button
                onClick={downloadKuitansi}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-lg transition"
              >
                <Download className="w-4 h-4" /> Kuitansi PDF
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 text-sm rounded-lg">
                <FileText className="w-4 h-4" /> Kuitansi (belum tersedia)
              </div>
            )}

            {/* Bukti Pembayaran */}
            {invoice?.bukti_pembayaran ? (
              <button
                onClick={downloadBuktiTransfer}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition"
              >
                <Download className="w-4 h-4" /> Bukti Transfer
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 text-sm rounded-lg">
                <FileText className="w-4 h-4" /> Bukti Transfer (belum ada)
              </div>
            )}
          </div>
        </div>

        {/* ── Daftar Sampel ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Daftar Sampel ({order.length} item)
            </p>
          </div>

          {order.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Tidak ada data sampel</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {order.map((e, i) => (
                <AdminOrderCard
                  key={i}
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
    </div>
  );
}