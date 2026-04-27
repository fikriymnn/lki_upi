"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Button } from "flowbite-react";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";
import Navigasi from "@/components/Navigasi";
import {
  FileText,
  Download,
  CreditCard,
  FileCheck,
  ChevronLeft,
} from "lucide-react";

export default function Hdetail({ params, searchParams }) {
  const { id } = params;
  const { no_invoice } = searchParams;
  const [order, setOrder] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [buktiPembayaran, setBuktiPembayaran] = useState("");

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
  }

  const downloadInvoice = async (e) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`,
        { withCredentials: true, responseType: "blob" }
      );
      console.log(response.data);

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(
        " ",
        "_"
      )}_${new Date().getDate()}-${new Date().getMonth() + 1
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
      console.log(response.data);

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(
        " ",
        "_"
      )}_${new Date().getDate()}-${new Date().getMonth() + 1
        }-${new Date().getFullYear()}_kuitansi.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message);
    }
  };

  const downloadBuktiTransfer = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/download_bukti_pembayaran/${id}`,
        {
          withCredentials: true,
          responseType: "arraybuffer",
          withCredentials: true,
        }
      );
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = invoice?.bukti_pembayaran;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    async function getInvoice() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          { withCredentials: true }
        );
        const dataOrder = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/order?success=true&no_invoice=${no_invoice}&skip=0&limit=100`,
          { withCredentials: true }
        );
        console.log(data);
        if (data.data.success) {
          setInvoice(data.data.data);
          setOrder(dataOrder.data.data);
          console.log(dataOrder.data.data);
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
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
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
              <p className="text-xs text-gray-400">Total Harga</p>
              <p className="text-sm font-medium mt-0.5">
                {invoice?.total_harga ? `Rp ${invoice.total_harga}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Catatan</p>
              <p className="text-sm font-medium mt-0.5 text-gray-600">
                {invoice?.catatan || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Notif Form Dikonfirmasi */}
        {invoice?.status == "Form Dikonfirmasi" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
            <span className="font-semibold">Kirim Sample ke:</span> Laboratorium
            Kimia Instrumen Universitas Pendidikan Indonesia Gedung JICA (FPMIPA-A)
            Lt. 5 Jl. Dr. Setiabudhi No. 229 Bandung 40154
          </div>
        )}

        {/* Dokumen */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Dokumen Terkait
          </p>
          <div className="flex flex-col gap-3">

            {/* Invoice */}
            <div
              className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
                invoice.status != "Selesai" ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Invoice</p>
                  <p className="text-xs text-gray-400">
                    {invoice.status == "Selesai"
                      ? `${invoice?.no_invoice}.pdf`
                      : "Tersedia setelah order selesai"}
                  </p>
                </div>
              </div>
              {invoice.status == "Selesai" ? (
                <Button
                  color="blue"
                  size="xs"
                  onClick={downloadInvoice}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              ) : (
                <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
                  Belum tersedia
                </span>
              )}
            </div>

            {/* Kuitansi */}
            <div
              className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
                !(invoice?.status == "Selesai" && (order?.dana_penelitian == true || !order?.nama_pembimbing))
                  ? "opacity-50"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Kuitansi</p>
                  <p className="text-xs text-gray-400">
                    {invoice?.status == "Selesai" && (order?.dana_penelitian == true || !order?.nama_pembimbing)
                      ? `${invoice?.no_invoice}_kuitansi.pdf`
                      : "Tersedia setelah order selesai"}
                  </p>
                </div>
              </div>
              {invoice?.status == "Selesai" && (order?.dana_penelitian == true || !order?.nama_pembimbing) ? (
                <Button
                  color="success"
                  size="xs"
                  onClick={downloadKuitansi}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
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
              {invoice?.bukti_pembayaran ? (
                <Button
                  color="warning"
                  size="xs"
                  href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${invoice?.bukti_pembayaran}`}
                  target="_blank"
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              ) : (
                <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
                  Belum ada
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Daftar Order */}
        <div className="flex flex-col gap-3">
          {order.map((e, i) => {
            return (
              <OrderCard
                key={i}
                riwayat_pengujian={e.riwayat_pengujian}
                sample_dikembalikan={e.sample_dikembalikan}
                uuid={e.uuid}
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
            );
          })}
        </div>

      </div>
    </>
  );
}