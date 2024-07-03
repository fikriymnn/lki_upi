"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Button } from "flowbite-react";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";

export default function HAdetail({ params, searchParams }) {
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

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Create a link element and click it to trigger the download
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
      console.log(response.data);

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Create a link element and click it to trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `kuitansi_${invoice?.id_user?.nama_lengkap.replace(
        " ",
        "_"
      )}_${new Date().getDate()}_${
        new Date().getMonth() + 1
      }_${new Date().getFullYear()}.pdf`;
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
      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Create a link element and click it to trigger the download
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

  return (
    <>
      <div>
        <p className="text-center text-4xl font-bold text-gray-800 mt-7">
          DETAIL
        </p>
        <div className="flex justify-center">
          <hr className="text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center" />
        </div>
        <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2 md:mx-20 mx-5">
          <p className="text-xs border-2 rounded-lg p-2 border-b-2 grid grid-cols-2 md:text-xl sm:text-xl  font-semibold">
            Status :{" "}
            <span className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs my-auto ">
              {invoice?.status}
            </span>{" "}
          </p>
          {invoice?.status == "Form Dikonfirmasi" ? (
            <p>
              *Kirim Sample ke Alamat yang Tertera \n (Laboratorium Kimia
              Instrumen Universitas Pendidikan Indonesia Gedung JICA ( FPMIPA-A
              ) Lt. 5 Jl. Dr. Setiabudhi No. 229 Bandung 40154)
            </p>
          ) : (
            ""
          )}
          <p className="text-xs border-2 rounded-lg p-2 border-b-2 grid grid-cols-2 md:text-xl sm:text-xl  font-semibold">
            Total harga :{" "}
            <span className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs my-auto ">
              {" "}
              Rp.{invoice?.total_harga}
            </span>
          </p>
          <p className="text-xs border-2 rounded-lg p-2 border-b-2 grid grid-cols-2 md:text-xl sm:text-xl  font-semibold">
            Catatan :{" "}
            <span className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs my-auto ">
              {invoice?.catatan}
            </span>{" "}
          </p>
          <div className="text-xs border-2 rounded-lg p-2 border-b-2 grid grid-cols-2">
            <p className="md:text-xl sm:text-xl  font-semibold">Invoice : </p>
            {invoice.status == "Selesai" ? (
              <Button
                className="ml-5 "
                color="blue"
                size={5}
                onClick={downloadInvoice}
              >
                Download{" "}
              </Button>
            ) : (
              <p className="ml-5">-</p>
            )}
          </div>
          <div className="text-xs border-2 rounded-lg p-2 border-b-2 grid grid-cols-2">
            <p className=" md:text-xl sm:text-xl  font-semibold">Kuitansi : </p>
            {invoice?.status == "Selesai"&&invoice?.dana_penelitian == true ? (
              <Button
                className="ml-5"
                color="blue"
                size={5}
                onClick={downloadKuitansi}
              >
                Download{" "}
              </Button>
            ) : (
              <p className="ml-5">-</p>
            )}
          </div>
          <div className="text-xs border-2 rounded-lg p-2 border-b-2 grid grid-cols-2">
            <p className="md:text-xl sm:text-xl  font-semibold">
              Bukti Pembayaran :{" "}
            </p>{" "}
            {invoice?.bukti_pembayaran ? (
              <Button
                className="ml-5"
                color="blue"
                size={5}
                href={invoice.bukti_pembayaran}
              >
                Download
              </Button>
            ) : (
              ""
            )}{" "}
          </div>
        </div>
        <div className="md:mx-20 mx-5">
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
