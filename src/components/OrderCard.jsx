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
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);


  const handleFS = async (event) => {
    let reader = new FileReader();
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
    reader.onload = async (e) => {
      setLoading2(true)
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
          async (blob) => {
            const file = new File([blob], imageFilname, {
              type: imageFile.type,
              lastModified: Date.now(),
            });
            if (file) {
              try {
                const directory = "fotosample/";
                const fileName = `${file.name}`;

                const storageRef = ref(storage, directory + fileName);

                // Create file metadata including the content type
                const metadata = {
                  contentType: file.type,
                };

                // Upload the file in the bucket storage
                const snapshot = await uploadBytesResumable(
                  storageRef,
                  file,
                  metadata
                );
                //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

                // Grab the public url
                const downloadURL = await getDownloadURL(snapshot.ref);
                if (downloadURL) {
                  const cek = await axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/foto_sample/${uuid}`,
                    { foto_sample: downloadURL },
                    {
                      withCredentials: true,
                    }
                  );
                  if(cek){
                    setLoading2(false)
                    alert("Foto Sample Berhasil Diubah");
                    window.location.reload();
                  }
                 

                }
              } catch (err) {
                setLoading2(false)
                alert(err.message);
              }
            }
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

  const handleJurnal = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const directory = "jurnalpendukung/";
      const fileName = `${e.target.files[0].name}`;

      const storageRef = ref(storage, directory + fileName);

      // Create file metadata including the content type
      const metadata = {
        contentType: e.target.files[0].type,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        e.target.files[0],
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      if (downloadURL) {
        const cek = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/jurnal_pendukung/${uuid}`,
          { jurnal_pendukung: downloadURL },
          {
            withCredentials: true,
          }
        );
        if (cek) {
          setLoading(false)
          alert("Jurnal Pendukung Berhasil Diubah");
          window.location.reload();
        }
      }
    } catch (err) {
      setLoading(false)
      alert(err.message);
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
                    {loading2 ? <center className="pt-2">
                      <div className="inset-0 flex items-center justify-center backdrop-blur-sm bg-white">
      <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
    </div>
                    </center> : foto_sample ? (
                      <div>
                        <Button
                          className="grad"
                          color="failure"
                          size={5}
                          href={foto_sample}
                        >
                          download
                        </Button>
                        <p className="my-3 md:text-lg text-xs sm:text-sm font-semibold text-grey-600">edit foto sample :</p>
                        <input
                          className="ml-5 w-11/12 h-10/12"
                          type="file"
                          placeholder="Edit Foto Sample"
                          name="foto_sample"
                          onChange={handleFS}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <input
                          className="ml-5 w-11/12 h-10/12"
                          type="file"
                          placeholder="Edit Foto Sample"
                          name="foto_sample"
                          onChange={handleFS}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-10 mt-5">
                  <div>
                    <h1 className="md:text-lg text-xs sm:text-sm font-semibold text-grey-600">
                      jurnal pendukung :{" "}
                    </h1>
                    <div className="">
                      {loading ?
                        <div className="inset-0 flex items-center justify-center backdrop-blur-sm bg-white">
                        <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
                      </div> : jurnal_pendukung ? (
                          <div className="">
                            <Button
                              className="grad"
                              color="failure"
                              size={5}
                              href={jurnal_pendukung}
                            >
                              download
                            </Button>
                            <p className="my-3 md:text-lg text-xs sm:text-sm font-semibold text-grey-600">edit jurnal pendukung :</p>
                            <input
                              className="ml-5 w-11/12 h-10/12"
                              type="file"
                              placeholder="Edit Jurnal Pendukung"
                              name="bukti_pembayaran"
                              onChange={handleJurnal}
                            />
                          </div>

                        ) : (
                          <div className="flex justify-center">
                            <input
                              className=" w-11/12 h-10/12"
                              type="file"
                              placeholder="Edit Jurnal Pendukung"
                              name="bukti_pembayaran"
                              onChange={handleJurnal}
                            />
                          </div>
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
