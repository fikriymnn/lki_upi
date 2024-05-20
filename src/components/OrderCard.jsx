"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import {
  ref,
  deleteObject,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase/firebase";
import axios from "axios";

export default function OrderCard({
  uuid,
  jenis_pengujian,
  nama_sample,
  jumlah_sample,
  index,
  wujud_sample,
  pelarut,
  preparasi_khusus,
  target_senyawa,
  metode_parameter,
  jurnal_pendukung,
  hasil_analisis,
  id,
  deskripsi,
  foto_sample,
  kode_pengujian,
  status,
  riwayat_pengujian,
  sample_dikembalikan,
  lama_pengerjaan,
  nama_pembimbing,
}) {
  const [foto, setFoto] = useState("");

  // const download = ()=>{
  //     try{
  //         const storageRef = storage()

  //         // Mendapatkan metadata file
  //         const metadata = await storageRef.getMetadata();

  //         // Mengambil nama file dari metadata
  //         const fileName = metadata.name;

  //         return fileName;
  //     }catch(err){
  //         console.log(err.message)
  //     }
  // }

  const handleDownloadHA = async () => {
    try {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/download_hasil_analisis/${id}`,
          {
            responseType: "arraybuffer",
            withCredentials: true, // Important for receiving binary data
          }
        );

        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });

        // Create a link element and click it to trigger the download

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = hasil_analisis;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadJP = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/download_jurnal_pendukung/${uuid}`,
        {
          responseType: "arraybuffer",
          withCredentials: true, // Important for receiving binary data
        }
      );

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Create a link element and click it to trigger the download

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = jurnal_pendukung;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadFS = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/download_foto_sample/${uuid}`,
        {
          responseType: "arraybuffer",
          withCredentials: true, // Important for receiving binary data
        }
      );

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Create a link element and click it to trigger the download

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = foto_sample;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      <div className="border my-10">
        <div>
          <h1 className="grad rounded p-2 text-white">{index}</h1>
          <br />
        </div>
        <div className="px-5 pb-5 ">
          <div className="border-1 rounded grid md:grid-cols-2 md:gap-10 gap-5">
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                nama sample :{" "}
              </h1>
              <h1 className="input-style-lki">
                {nama_sample ? nama_sample : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                jumlah sample :{" "}
              </h1>
              <h1 className="input-style-lki">
                {jumlah_sample ? jumlah_sample : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                wujud sample :{" "}
              </h1>
              <h1 className="input-style-lki">
                {wujud_sample ? wujud_sample : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                pelarut :{" "}
              </h1>

              <h1 className="input-style-lki">{pelarut ? pelarut : "-"}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                jenis pengujian sample :{" "}
              </h1>
              <h1 className="input-style-lki">
                {jenis_pengujian ? jenis_pengujian : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                kode pengujian sample :{" "}
              </h1>
              <h1 className="input-style-lki">
                {kode_pengujian ? kode_pengujian : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                lama pengerjaan :{" "}
              </h1>
              <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">
                {lama_pengerjaan ? lama_pengerjaan : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                nama pembimbing :{" "}
              </h1>
              <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">
                {nama_pembimbing ? nama_pembimbing : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                sample_dikembalikan :{" "}
              </h1>
              <h1 className="input-style-lki-box ">
                {sample_dikembalikan ? sample_dikembalikan : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                preparasi khusus :{" "}
              </h1>
              <h1 className="input-style-lki">
                {preparasi_khusus ? "ya" : "tidak"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                target senyawa :{" "}
              </h1>
              <h1 className="input-style-lki">
                {target_senyawa ? target_senyawa : "-"}
              </h1>
            </div>

            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                metode parameter :{" "}
              </h1>
              <h1 className="input-style-lki">
                {metode_parameter ? metode_parameter : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                deskripsi :{" "}
              </h1>
              <h1 className="input-style-lki-box ">
                {deskripsi ? deskripsi : "-"}
              </h1>
            </div>
            <div>
              <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                riwayat pengujian :{" "}
              </h1>
              <h1 className="input-style-lki-box ">
                {riwayat_pengujian ? riwayat_pengujian : "-"}
              </h1>
            </div>

            <div className="mt-2">
              <div className="w-full">
                <div className="">
                  <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                    foto sample :{" "}
                  </h1>
                  <div className="">
                    {foto_sample ? (
                      <Button
                        className="grad"
                        color="failure"
                        size={5}
                        href={foto_sample}
                      >
                        download
                      </Button>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-10 mt-5">
                  <div>
                    <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                      jurnal pendukung :{" "}
                    </h1>
                    <div className="">
                      {jurnal_pendukung ? (
                        <Button
                          className="grad"
                          color="failure"
                          size={5}
                          href={jurnal_pendukung}
                        >
                          download
                        </Button>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                      Hasil analisis :{" "}
                    </h1>
                    <div className="">
                      {status == "Selesai" ? (
                        hasil_analisis ? (
                          <h1 className="">
                            <Button
                              className="grad"
                              color="failure"
                              size={5}
                              href={hasil_analisis}
                            >
                              download
                            </Button>
                          </h1>
                        ) : (
                          <p>-</p>
                        )
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
