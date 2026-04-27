"use client";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";
import Navigasi from "@/components/Navigasi";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/firebase";
import {
  FileText,
  Download,
  CreditCard,
  FileCheck,
  CheckCircle,
  ChevronLeft,
  Upload,
  Edit2,
  Send,
} from "lucide-react";

export default function Detail({ params, searchParams }) {
  const { id } = params;
  const { no_invoice } = searchParams;
  const [order, setOrder] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [buktiPembayaran, setBuktiPembayaran] = useState([]);
  const [kirim, setKirim] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
  }

  const handleBukti = async (e) => {
    e.preventDefault();
    try {
      const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=hasilanalisis`,
        { file: buktiPembayaran[0] },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (downloadURL.data.filename) {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/bukti_pembayaran/${id}`,
          { bukti_pembayaran: downloadURL.data.filename },
          { withCredentials: true }
        );
        if (data.data == "success") {
          alert("sukses dikirim");
          window.location.reload();
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const downloadInvoice = async (e) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`,
        { withCredentials: true, responseType: "blob" }
      );
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(
        " ",
        "_"
      )}_${new Date().getDate()}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}_invoice.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message);
    }
  };

  const downloadKuitansi = async (e) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/generate_kuitansi?no_invoice=${no_invoice}`,
        { withCredentials: true, responseType: "blob" }
      );
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(
        " ",
        "_"
      )}_${new Date().getDate()}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}_kuitansi.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message);
    }
  };

  const downloadBuktiTransfer = async (link) => {
    const reff = ref(storage, link);
    getDownloadURL(reff)
      .then((url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = ref(storage, link).name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error getting download URL:", error);
      });
  };

  const handleBP = (event) => {
    let reader = new FileReader();
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var MAX_WIDTH = 700;
        var MAX_HEIGHT = 700;
        var width = img.width;
        var height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(
          (blob) => {
            const file = new File([blob], imageFilname, {
              type: imageFile.type,
              lastModified: Date.now(),
            });
            buktiPembayaran[0] = file;
          },
          imageFile.type,
          1
        );
      };
      img.onerror = () => {
        alert("invalid image content");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

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
          setInvoice(data.data.data);
        }
        if (dataOrder.data.success) {
          setOrder(dataOrder.data.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, []);

  const statusBadge = (status) => {
    const map = {
      Selesai: "bg-green-100 text-green-800",
      "Menunggu Pembayaran": "bg-amber-100 text-amber-800",
      "Menunggu Konfirmasi Pembayaran": "bg-amber-100 text-amber-800",
      "Order Dibatalkan": "bg-red-100 text-red-800",
      "Form Dikonfirmasi": "bg-blue-100 text-blue-800",
      "Sample Diterima Admin": "bg-blue-100 text-blue-800",
      "Sample Dikerjakan Operator": "bg-blue-100 text-blue-800",
      "Menunggu Verifikasi": "bg-purple-100 text-purple-800",
      "Menunggu Form Dikonfirmasi": "bg-gray-100 text-gray-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const invoiceAvailable = [
    "Form Dikonfirmasi",
    "Sample Diterima Admin",
    "Sample Dikerjakan Operator",
    "Menunggu Verifikasi",
    "Menunggu Pembayaran",
    "Menunggu Konfirmasi Pembayaran",
    "Selesai",
  ].includes(invoice?.status);

  const kuitansiAvailable =
    invoice?.status === "Selesai" &&
    (order?.dana_penelitian === true || !order?.nama_pembimbing);

  const buktiPembayaranEditable =
    invoice?.status === "Menunggu Pembayaran" ||
    invoice?.status === "menunggu konfirmasi pembayaran" ||
    invoice?.status === "Selesai";

  const tabs = [
    { key: "info", label: "Ringkasan Order", icon: <FileText className="w-4 h-4" /> },
    { key: "dokumen", label: "Dokumen & Pembayaran", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Order</h1>
            <p className="text-sm text-gray-500">
              Lihat status dan dokumen terkait pengujian Anda
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">No. Invoice</p>
            <p className="text-base font-semibold text-gray-900">
              {invoice?.no_invoice || "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">ID: {id}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total Harga</p>
            <p className="text-2xl font-bold text-blue-600">
              {invoice?.total_harga ? `Rp ${invoice.total_harga}` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">{order.length} item pengujian</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Status Order</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(
                invoice?.status
              )}`}
            >
              {invoice?.status || "—"}
            </span>
            <p className="text-xs text-gray-400 mt-2">
              Est. selesai: {invoice?.estimasi_date || "—"}
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
                Informasi Order
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(
                      invoice?.status
                    )}`}
                  >
                    {invoice?.status || "—"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estimasi Selesai</p>
                  <p className="text-sm font-medium mt-0.5">
                    {invoice?.estimasi_date || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Catatan</p>
                  <p className="text-sm font-medium mt-0.5 text-gray-600">
                    {invoice?.catatan || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Harga</p>
                  <p className="text-sm font-medium mt-0.5">
                    {invoice?.total_harga ? `Rp ${invoice.total_harga}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {invoice?.status === "form dikonfirmasi" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <span className="font-semibold">Kirim Sample ke:</span> Laboratorium
                Kimia Instrumen Universitas Pendidikan Indonesia Gedung JICA (FPMIPA-A)
                Lt. 5 Jl. Dr. Setiabudhi No. 229 Bandung 40154
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

              {/* Invoice */}
              <div
                className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
                  !invoiceAvailable ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice</p>
                    <p className="text-xs text-gray-400">
                      {invoiceAvailable
                        ? `${invoice?.no_invoice}.pdf`
                        : "Tersedia setelah form dikonfirmasi"}
                    </p>
                  </div>
                </div>
                {invoiceAvailable ? (
                  <button
                    onClick={downloadInvoice}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
                    Belum tersedia
                  </span>
                )}
              </div>

              {/* Kuitansi */}
              <div
                className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
                  !kuitansiAvailable ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kuitansi</p>
                    <p className="text-xs text-gray-400">
                      {kuitansiAvailable
                        ? `${invoice?.no_invoice}_kuitansi.pdf`
                        : "Tersedia setelah order selesai"}
                    </p>
                  </div>
                </div>
                {kuitansiAvailable ? (
                  <button
                    onClick={downloadKuitansi}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </button>
                ) : (
                  <span className="text-xs text-red-500 px-3 py-1.5 bg-red-50 rounded-lg">
                    Belum tersedia
                  </span>
                )}
              </div>

              {/* Bukti Pembayaran */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bukti Pembayaran</p>
                    <p className="text-xs text-gray-400">
                      {invoice?.bukti_pembayaran
                        ? invoice.bukti_pembayaran
                        : "Belum ada bukti pembayaran"}
                    </p>
                  </div>
                </div>

                {buktiPembayaranEditable ? (
                  invoice.bukti_pembayaran && kirim === true ? (
                    <div className="flex items-center gap-2">
                      
                       <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${invoice?.bukti_pembayaran}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Unduh
                      </a>
                      <button
                        onClick={() => setKirim(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        name="bukti_pembayaran"
                        onChange={handleBP}
                        className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                      {buktiPembayaran[0] && (
                        <button
                          onClick={handleBukti}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                        >
                          <Send className="w-3.5 h-3.5" /> Kirim
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
                    Belum tersedia
                  </span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Daftar Order */}
        <div className="mt-8">
          <div className="flex flex-col gap-3">
            {order.map((e, i) => (
              <OrderCard
                key={i}
                riwayat_pengujian={e.riwayat_pengujian}
                sample_dikembalikan={e.sample_dikembalikan}
                uuid={e.uuid}
                id={e._id}
                status={invoice?.status}
                jenis_pengujian={e.jenis_pengujian}
                nama_sample={e.nama_sample}
                kode_pengujian={e.kode_pengujian}
                jumlah_sample={e.jumlah_sample}
                index={i + 1}
                wujud_sample={e.wujud_sample}
                pelarut={e.pelarut}
                preparasi_khusus={e.preparasi_khusus}
                target_senyawa={e.target_senyawa}
                metode_parameter={e.metode_parameter}
                jurnal_pendukung={e.jurnal_pendukung}
                deskripsi={e.deskripsi_sample}
                hasil_analisis={e.hasil_analisis}
                foto_sample={e.foto_sample}
                lama_pengerjaan={e.lama_pengerjaan}
                nama_pembimbing={e.nama_pembimbing}
              />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}