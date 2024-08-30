"use client";
import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Button } from "flowbite-react";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";
import Navigasi from "@/components/Navigasi";
import firebase from "firebase/compat/app";
import {
  ref,
  deleteObject,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata,
} from "firebase/storage";
import { storage } from "../../../../firebase/firebase";

export default function Detail({ params, searchParams }) {
  const { id } = params;
  const { no_invoice } = searchParams;
  const [order, setOrder] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [buktiPembayaran, setBuktiPembayaran] = useState([]);
  const [kirim, setKirim] = useState(true)

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
  }

  /* const convertRupiah = (angka)=>{
    // Konversi angka menjadi string
    let angkaString = angka.toString();
  
    // Bagi angka menjadi array per 3 digit dari belakang
    let bagianAngka = angkaString.split('').reverse().join('').match(/\d{1,3}/g);
  
    // Gabungkan kembali dengan titik sebagai pemisah
    return bagianAngka.join('.').split('').reverse().join('');
  } */

  const handleBukti = async (e) => {
    e.preventDefault();
    try {
      const directory = "hasilanalisis/";
      const fileName = `${buktiPembayaran[0].name}`;

      const storageRef = ref(storage, directory + fileName);

      // Create file metadata including the content type
      const metadata = {
        contentType: buktiPembayaran[0].type,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        buktiPembayaran[0],
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);
      // const filepath = await getMetadata(snapshot.ref)

      if (downloadURL) {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/bukti_pembayaran/${id}`,
          { bukti_pembayaran: downloadURL },
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
      )}_${new Date().getDate()}-${new Date().getMonth() + 1
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
        // Buat sebuah tautan untuk file dan klik otomatis untuk mengunduhnya
        const a = document.createElement("a");
        a.href = url;
        console.log(ref(storage, link).name);
        a.download = ref(storage, link).name; // Ganti dengan nama file yang sesuai
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
        //------------- Resize img code ----------------------------------
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
      //debugger
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

        console.log(data);
        if (data.data.success) {
          setInvoice(data.data.data);
        }
        if (dataOrder.data.success) {
          setOrder(dataOrder.data.data);
        }
        console.log(order)
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, []);

  return (
    <>
      <div>
        <Navigasi text1={"user"} text2={"detail order"} />

        <div className="md:mx-20 mx-5">
          <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2">
            <div className="">
              <div className="border-2 rounded-lg p-2 border-b-2 grid grid-cols-2  ">
                <p className="md:text-lg sm:text-lg text-sm font-semibold">
                  Status {" "}
                </p>
                <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs my-auto">
                  : {invoice?.status}
                </p>
              </div>
              {invoice?.status == "form dikonfirmasi" ? (
                <p>
                  *Kirim Sample ke (Laboratorium Kimia Instrumen Universitas
                  Pendidikan Indonesia Gedung JICA &#40; FPMIPA-A &#41; Lt. 5
                  Jl. Dr. Setiabudhi No. 229 Bandung 40154)
                </p>
              ) : (
                ""
              )}
            </div>

            <div>
              <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2">
                <p className="md:text-lg sm:text-lg text-xs font-semibold">
                  Total Harga {" "}
                </p>
                <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">
                  : Rp {invoice?.total_harga}
                </p>
              </div>
              {invoice?.status == "Form Dikonfirmasi" ? <p></p> : ""}
            </div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2">
              <p className="md:text-lg sm:text-lg text-xs font-semibold ">
                Estimasi Selesai :{" "}
              </p>{" "}
              <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">
                : {invoice.estimasi_date ? invoice.estimasi_date : ""}
              </p>
            </div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2">
              <p className="md:text-lg sm:text-lg text-xs font-semibold ">
                Catatan {" "}
              </p>{" "}
              <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">
                : {invoice.catatan ? invoice.catatan : ""}
              </p>
            </div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2">
              <p className="md:text-lg sm:text-lg text-xs font-semibold">
                Invoice {" "}
              </p>
              {invoice.status == "Form Dikonfirmasi" ||
                invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                <Button
                  className="ml-5 "
                  color="blue"
                  size={5}
                  onClick={downloadInvoice}
                >
                  Download{" "}
                </Button>
              ) : (
                <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">
                  -
                </p>
              )}
            </div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2">
              <p className="md:text-lg sm:text-lg text-xs font-semibold ">
                Kuitansi {" "}
              </p>
              {invoice?.status == "Selesai" && (order?.dana_penelitian == true || !order?.nama_pembimbing) ? (
                <Button
                  className="ml-5"
                  color="blue"
                  size={5}
                  onClick={downloadKuitansi}
                >
                  download{" "}
                </Button>
              ) : (
                <p className="ml-5">-</p>
              )}
            </div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2">
              <p className="md:text-lg sm:text-lg text-xs font-semibold ">
                Bukti Pembayaran {" "}
              </p>{" "}
              {invoice?.status == "Menunggu Pembayaran" ||
                invoice?.status == "menunggu konfirmasi pembayaran" ||
                invoice?.status == "Selesai" ? (
                invoice.bukti_pembayaran && kirim == true ? (
                  <div className="grid grid-cols-2 items-stretch">
                    <Button
                      className="ml-5 text-xs"
                      color="blue"
                      size={5}
                      href={invoice.bukti_pembayaran}
                    >
                      download{" "}
                    </Button>
                    <Button
                      className="ml-2"
                      color="blue"
                      size={5}
                      onClick={(a) => setKirim(false)}
                    >
                      edit{" "}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <input
                      className="ml-5 w-11/12 h-10/12"
                      type="file"
                      name="bukti_pembayaran"
                      onChange={handleBP}
                    />
                    {buktiPembayaran ? (
                      <Button
                        className="ml-5"
                        color="blue"
                        size={5}
                        onClick={handleBukti}
                      >
                        Kirim
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                )
              ) : (
                <p className="ml-5">-</p>
              )}
            </div>
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
            );
          })}
        </div>
      </div>
    </>
  );
}
