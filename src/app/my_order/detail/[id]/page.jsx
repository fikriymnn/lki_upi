"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  CreditCard,
  FileCheck,
  ChevronLeft,
  Upload,
  Check,
  X,
  User,
  Building2,
  Beaker,
  Wrench,
  ShoppingBag,
  Printer,
} from "lucide-react";

// Harus sama persis dengan STATUS_OPTIONS di order_affiliate_controller.js (BE)
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

const convertRupiah = (angka) => {
  if (!angka && angka !== 0) return "—";
  return Number(angka).toLocaleString("id-ID");
};

const formatTanggal = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium mt-0.5">{value || "—"}</p>
  </div>
);

// ── Card generik untuk tiap jenis layanan (layanan_analisis/sewa_lab/sewa_alat/pembelian_bahan) ──
const LayananCard = ({ icon: Icon, color, title, fields }) => (
  <div className="border border-gray-200 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-50`}>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {fields.map((f, i) => (
        <InfoField key={i} label={f.label} value={f.value} />
      ))}
    </div>
  </div>
);

export default function DetailAffiliate({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [addBukti, setAddBukti] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function getOrder() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${id}`,
          { withCredentials: true }
        );
        if (res.data.success) setOrder(res.data.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    getOrder();
  }, [id]);

  // ── Upload bukti pembayaran (sama pola dengan order utama: upload file dulu ke file service, lalu simpan filename) ──
  const handleBP = (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    const imageFilname = imageFile.name;
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 700;
        const MAX_HEIGHT = 700;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imageFilname, {
              type: imageFile.type,
              lastModified: Date.now(),
            });
            setBuktiPembayaran(file);
          },
          imageFile.type,
          1
        );
      };
      img.onerror = () => alert("invalid image content");
      img.src = e.target.result;
    };

    reader.readAsDataURL(imageFile);
  };

  const handleUploadBukti = async (e) => {
    e.preventDefault();
    if (!buktiPembayaran) {
      alert("Pilih file terlebih dahulu");
      return;
    }
    setIsUploading(true);
    try {
      // TODO: konfirmasi ke BE apakah category upload untuk affiliate sama ("hasilanalisis")
      // atau perlu category khusus, mis. "affiliate_bukti_pembayaran"
      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=hasilanalisis`,
        { file: buktiPembayaran },
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (uploadRes.data.filename) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${id}/bukti_pembayaran`,
          { bukti_pembayaran: uploadRes.data.filename },
          { withCredentials: true }
        );
        if (res.data.success) {
          alert("Bukti pembayaran berhasil dikirim");
          window.location.reload();
        } else {
          alert(res.data.message);
        }
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ── Cetak invoice dari rincian_harga_invoice (PDF digenerate FE, sesuai komentar di BE) ──
  const printInvoice = () => {
    const rows = order?.rincian_harga_invoice || [];
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${order?.no_invoice || ""}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
            th { background: #f5f5f5; }
            .total { text-align: right; font-weight: bold; margin-top: 12px; }
          </style>
        </head>
        <body>
          <h2>Invoice ${order?.no_invoice || ""}</h2>
          <p>Lab Affiliate: ${order?.id_affiliate?.nama_laboratorium || "—"}</p>
          <p>Pemesan: ${order?.nama_lengkap || "—"}</p>
          <table>
            <thead>
              <tr><th>Keterangan</th><th>Harga Satuan</th><th>Jumlah</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  <td>${r.keterangan || "—"}</td>
                  <td>Rp ${convertRupiah(r.harga_satuan)}</td>
                  <td>${r.jumlah || "—"}</td>
                  <td>Rp ${convertRupiah(r.total)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
          <p class="total">Total Keseluruhan: Rp ${convertRupiah(order?.total_keseluruhan)}</p>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (loading) {
    return <div className="p-6 max-w-5xl mx-auto text-sm text-gray-400">Memuat data...</div>;
  }
  if (!order) {
    return <div className="p-6 max-w-5xl mx-auto text-sm text-gray-400">Data order tidak ditemukan</div>;
  }

  const status = order.status_pengujian;

  const invoiceAvailable =
    ["Menunggu Pembayaran", "Menunggu Verifikasi Pembayaran", "Selesai"].includes(status) &&
    order.rincian_harga_invoice?.length > 0;

  const laporanAvailable =
    ["Menunggu Diverifikasi", "Selesai Diverifikasi", "Menunggu Pembayaran", "Menunggu Verifikasi Pembayaran", "Selesai"].includes(status);

  const buktiPembayaranEditable = status === "Menunggu Pembayaran";

  const hasilAnalisisAvailable = status === "Selesai" && !!order.hasil_analisis;

  const tabs = [
    { key: "info", label: "Ringkasan Order", icon: <FileText className="w-4 h-4" /> },
    { key: "layanan", label: "Layanan Dipesan", icon: <ShoppingBag className="w-4 h-4" /> },
    { key: "dokumen", label: "Dokumen & Pembayaran", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Order Affiliate</h1>
          <p className="text-sm text-gray-500">Lihat status dan dokumen order ke lab affiliate</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">No. Invoice</p>
          <p className="text-base font-semibold text-gray-900">{order.no_invoice || "—"}</p>
          <p className="text-xs text-gray-400 mt-1">{formatTanggal(order.date || order.createdAt)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Lab Affiliate</p>
          <p className="text-base font-semibold text-gray-900">{order.id_affiliate?.nama_laboratorium || "—"}</p>
          <p className="text-xs text-gray-400 mt-1">{order.id_affiliate?.kode_laboratorium || "—"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Status Order</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${getStatusStyleAffiliate(status)}`}>
            {status}
          </span>
          <p className="text-xs text-gray-400 mt-2">
            Total: {order.total_keseluruhan ? `Rp ${convertRupiah(order.total_keseluruhan)}` : "—"}
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
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

      {/* Tab: Ringkasan Order */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Data Pemesan
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField label="Nama Lengkap" value={order.nama_lengkap} />
              <InfoField label="Email" value={order.email} />
              <InfoField label="No. WhatsApp" value={order.no_whatsapp} />
              <InfoField label="No. Telepon" value={order.no_telp} />
              <InfoField label="Jenis Institusi" value={order.jenis_institusi} />
              <InfoField label="Nama Institusi" value={order.nama_institusi} />
              {order.program_studi && <InfoField label="Program Studi" value={order.program_studi} />}
              {order.fakultas && <InfoField label="Fakultas" value={order.fakultas} />}
              {order.nama_pembimbing && <InfoField label="Nama Pembimbing" value={order.nama_pembimbing} />}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Lab Affiliate
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField label="Nama Laboratorium" value={order.id_affiliate?.nama_laboratorium} />
              <InfoField label="Kode Lab" value={order.id_affiliate?.kode_laboratorium} />
              <InfoField label="Email" value={order.id_affiliate?.email} />
              <InfoField label="No. WhatsApp" value={order.id_affiliate?.no_whatsapp} />
              <InfoField label="Alamat" value={order.id_affiliate?.alamat} />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Layanan Dipesan */}
      {activeTab === "layanan" && (
        <div className="space-y-4">
          {order.layanan_analisis?.map((v, i) => (
            <LayananCard
              key={`la-${i}`}
              icon={Beaker}
              color="blue"
              title={`Layanan Analisis${order.layanan_analisis.length > 1 ? ` #${i + 1}` : ""}`}
              fields={[
                { label: "Jenis Layanan", value: v.jenis_layanan?.join(", ") },
                { label: "Nama Sample", value: v.nama_sample },
                { label: "Pelarut", value: v.pelarut },
                { label: "Jumlah Sample", value: v.jumlah_sample },
                { label: "Metode/Parameter", value: v.metode_parameter },
                { label: "Keterangan", value: v.keterangan },
                { label: "Harga Satuan", value: v.harga_satuan ? `Rp ${convertRupiah(v.harga_satuan)}` : null },
                { label: "Total", value: v.total ? `Rp ${convertRupiah(v.total)}` : null },
              ]}
            />
          ))}

          {order.sewa_lab?.map((v, i) => (
            <LayananCard
              key={`sl-${i}`}
              icon={Building2}
              color="purple"
              title={`Sewa Lab${order.sewa_lab.length > 1 ? ` #${i + 1}` : ""}`}
              fields={[
                { label: "Jenis Sewa", value: v.jenis_sewa },
                { label: "Tanggal Mulai", value: formatTanggal(v.tanggal_mulai) },
                { label: "Tanggal Selesai", value: formatTanggal(v.tanggal_selesai) },
                { label: "Jumlah", value: v.jumlah },
                { label: "Keterangan", value: v.keterangan },
                { label: "Harga Satuan", value: v.harga_satuan ? `Rp ${convertRupiah(v.harga_satuan)}` : null },
                { label: "Total", value: v.total ? `Rp ${convertRupiah(v.total)}` : null },
              ]}
            />
          ))}

          {order.sewa_alat?.map((v, i) => (
            <LayananCard
              key={`sa-${i}`}
              icon={Wrench}
              color="amber"
              title={`Sewa Alat${order.sewa_alat.length > 1 ? ` #${i + 1}` : ""}`}
              fields={[
                { label: "Nama Alat", value: v.nama_alat },
                { label: "Jenis Sewa", value: v.jenis_sewa },
                { label: "Tanggal Mulai", value: formatTanggal(v.tanggal_mulai) },
                { label: "Tanggal Selesai", value: formatTanggal(v.tanggal_selesai) },
                { label: "Jumlah", value: v.jumlah },
                { label: "Keterangan", value: v.keterangan },
                { label: "Harga Satuan", value: v.harga_satuan ? `Rp ${convertRupiah(v.harga_satuan)}` : null },
                { label: "Total", value: v.total ? `Rp ${convertRupiah(v.total)}` : null },
              ]}
            />
          ))}

          {order.pembelian_bahan?.map((v, i) => (
            <LayananCard
              key={`pb-${i}`}
              icon={ShoppingBag}
              color="emerald"
              title={`Pembelian Bahan${order.pembelian_bahan.length > 1 ? ` #${i + 1}` : ""}`}
              fields={[
                { label: "Jenis Bahan", value: v.jenis_bahan },
                { label: "Satuan", value: v.satuan },
                { label: "Keterangan", value: v.keterangan },
                { label: "Harga Satuan", value: v.harga_satuan ? `Rp ${convertRupiah(v.harga_satuan)}` : null },
                { label: "Total", value: v.total ? `Rp ${convertRupiah(v.total)}` : null },
              ]}
            />
          ))}

          {order.total_keseluruhan > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Total Keseluruhan</p>
              <p className="text-lg font-bold text-blue-600">Rp {convertRupiah(order.total_keseluruhan)}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Dokumen & Pembayaran */}
      {activeTab === "dokumen" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Dokumen Terkait
          </p>
          <div className="flex flex-col gap-3">

            {/* Invoice — dicetak client-side dari rincian_harga_invoice */}
            <div className={`border border-gray-200 rounded-xl overflow-hidden ${!invoiceAvailable ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Invoice</p>
                  <p className="text-xs text-gray-400">
                    {invoiceAvailable ? `${order.no_invoice}` : "Tersedia setelah invoice diinput admin"}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-auto">
                  {invoiceAvailable ? (
                    <button
                      onClick={printInvoice}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Belum tersedia</span>
                  )}
                </div>
              </div>
            </div>

            {/* Laporan & Rincian Biaya dari laboran */}
            <div className={`border border-gray-200 rounded-xl overflow-hidden ${!laporanAvailable ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Laporan & Rincian Biaya</p>
                  <p className="text-xs text-gray-400">
                    {laporanAvailable ? "Diupload oleh laboran" : "Tersedia setelah order diproses laboran"}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-auto flex gap-2">
                  {laporanAvailable && order.laporan && (
                    
                    <a  href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/laporan/${order.laporan}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Laporan
                    </a>
                  )}
                  {laporanAvailable && order.rincian_biaya && (
                    
                    <a  href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/rincian_biaya/${order.rincian_biaya}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Rincian
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bukti Pembayaran */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap px-4 py-3">
                <div className={`flex items-center gap-3 flex-1 min-w-0 ${!buktiPembayaranEditable && !order.bukti_pembayaran ? "opacity-50" : ""}`}>
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Bukti Pembayaran</p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px] sm:max-w-none">
                      {order.bukti_pembayaran || "Belum ada bukti pembayaran"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {order.bukti_pembayaran && !addBukti && (
                    
                    <a  href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${order.bukti_pembayaran}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh</span>
                    </a>
                  )}

                  {isUploading ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5">
                      <div className="w-4 h-4 border-2 border-t-transparent border-amber-500 rounded-full animate-spin" />
                      <span className="text-xs text-gray-500 hidden sm:inline">Mengirim...</span>
                    </div>
                  ) : addBukti ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleUploadBukti}
                        disabled={!buktiPembayaran}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Kirim</span>
                      </button>
                      <button
                        onClick={() => { setAddBukti(false); setBuktiPembayaran(null); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Batal</span>
                      </button>
                    </div>
                  ) : buktiPembayaranEditable ? (
                    <button
                      onClick={() => setAddBukti(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{order.bukti_pembayaran ? "Update" : "Upload"}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Belum tersedia</span>
                  )}
                </div>
              </div>

              {addBukti && !isUploading && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    name="bukti_pembayaran"
                    onChange={handleBP}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {buktiPembayaran && (
                    <p className="text-xs text-gray-400 mt-1">
                      {buktiPembayaran.name} — {(buktiPembayaran.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Hasil Analisis */}
            <div className={`border border-gray-200 rounded-xl overflow-hidden ${!hasilAnalisisAvailable ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Hasil Analisis</p>
                  <p className="text-xs text-gray-400">
                    {hasilAnalisisAvailable ? "Tersedia" : "Tersedia setelah order selesai"}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-auto">
                  {hasilAnalisisAvailable ? (
                    
                    <a  href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasil_analisis/${order.hasil_analisis}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Belum tersedia</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}