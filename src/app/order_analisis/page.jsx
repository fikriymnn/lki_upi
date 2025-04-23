"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";
import Loading from "@/components/Loading"
import {
  ref,
  deleteObject,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase/firebase";

export default function Order_analisis() {
  const router = useRouter();
  const uid = uuidv4();
  const i = 0;
  const [loading,setLoading] = useState('')
  const [countForm, setCountForm] = useState(1);
  // const [duplicate, setDuplicate] = useState([
  //   <CustomForm i={0} key={0} uuid={uid} />,
  // ]);
  const [arr, setArr] = useState([]);
  const [nonupi,setNonupi] = useState("");
  const [jenis_pengujian, setJenis_pengujian] = useState([[]]);
  const [kode_pengujian, setKode_pengujian] = useState([[]]);
  const [nama_sample, setNama_sample] = useState([]);
  const [jumlah_sample, setJumlah_sample] = useState([]);
  const [wujud_sample, setWujud_sample] = useState([]);
  const [pelarut, setPelarut] = useState([]);
  const [preparasi_khusus, setPreparasi_khusus] = useState([]);
  const [target_senyawa, setTarget_senyawa] = useState([]);
  const [sample_dikembalikan, setSample_dikembalikan] = useState([]);
  const [metode_parameter, setMetode_parameter] = useState([]);
  const [jurnal_pendukung, setJurnal_pendukung] = useState([]);
  const [deskripsi_sample, setDeskripsi_sample] = useState([]);
  const [riwayat_pengujian, setRiwayat_pengujian] = useState([]);
  const [nama_pembimbing, setNama_pembimbing] = useState([]);
  const [lama_pengerjaan, setLama_pengerjaan] = useState([]);
  const [foto_sample, setFoto_sample] = useState([]);
  const [dana_penelitian, setDana_penelitian] = useState([]);
  const [uuid, setUuid] = useState([uid]);
  const [user,setUser] = useState({})
  const [verifikasi, setVerifikasi] = useState(false);

  const kode = [
    {
      jenis_pengujian: "GCFID",
      kode_pengujian: "FID",
    },
    {
      jenis_pengujian: "GCMS",
      kode_pengujian: "MS",
    },
    {
      jenis_pengujian: "NMR",
      kode_pengujian: "NMR",
    },
    {
      jenis_pengujian: "AAS",
      kode_pengujian: "AS",
    },
    {
      jenis_pengujian: "FTIR",
      kode_pengujian: "IR",
    },
    {
      jenis_pengujian: "TG DTA",
      kode_pengujian: "TG",
    },
    {
      jenis_pengujian: "HPLC",
      kode_pengujian: "HP",
    },
    {
      jenis_pengujian: "UV VIS",
      kode_pengujian: "UV",
    },
    {
      jenis_pengujian: "Freezdry",
      kode_pengujian: "FD",
    },
    {
      jenis_pengujian: "LCMSMS",
      kode_pengujian: "LC",
    },
    {
      jenis_pengujian: "XRD",
      kode_pengujian: "XRD",
    },
  ];


  const handleFS = (event) => {
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

            foto_sample[0] = file;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      for (let i = 0; i < jenis_pengujian.length; i++) {
        let obj = {};
        obj.jenis_pengujian = jenis_pengujian[i];
        obj.kode_pengujian = kode_pengujian[i];
        obj.nama_sample = nama_sample[i];
        obj.jumlah_sample = jumlah_sample[i];
        obj.wujud_sample = wujud_sample[i];
        obj.pelarut = pelarut[i];
        obj.preparasi_khusus = preparasi_khusus[i];
        obj.target_senyawa = target_senyawa[i];
        obj.metode_parameter = metode_parameter[i];
        obj.deskripsi_sample = deskripsi_sample[i];
        obj.riwayat_pengujian = riwayat_pengujian[i];
        obj.sample_dikembalikan = sample_dikembalikan[i];
        obj.nama_pembimbing = nama_pembimbing[i];
        obj.lama_pengerjaan = lama_pengerjaan[i];
        obj.dana_penelitian = dana_penelitian[i];

        obj.uuid = uuid[i];

        arr[i] = obj;
      }

      if (arr.length == 1) {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/order/${token}`,
          arr,
          {
            withCredentials: true,
          }
        );
       
        if (data.data.success) {
          if (jurnal_pendukung) {
            async function cek() {
              try {
                const directory = "jurnalpendukung/";
                const fileName = `${jurnal_pendukung[0].name}`;

                const storageRef = ref(storage, directory + fileName);

                // Create file metadata including the content type
                const metadata = {
                  contentType: jurnal_pendukung[0].type,
                };

                // Upload the file in the bucket storage
                const snapshot = await uploadBytesResumable(
                  storageRef,
                  jurnal_pendukung[0],
                  metadata
                );
                //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

                // Grab the public url
                const downloadURL = await getDownloadURL(snapshot.ref);

                if (downloadURL) {
                  console.log(downloadURL)
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/jurnal_pendukung/${uuid[0]}`,
                    { jurnal_pendukung: downloadURL },
                    {
                      withCredentials: true,
                    }
                  );
                }
              } catch (err) {
                console.log(err.message);
              }
            }
            cek();
          }
          if (foto_sample) {
            async function cek2() {
              try {
                const directory = "fotosample/";
                const fileName = `${foto_sample[0].name}`;

                const storageRef = ref(storage, directory + fileName);

                // Create file metadata including the content type
                const metadata = {
                  contentType: foto_sample[0].type,
                };

                // Upload the file in the bucket storage
                const snapshot = await uploadBytesResumable(
                  storageRef,
                  foto_sample[0],
                  metadata
                );
                //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

                // Grab the public url
                const downloadURL = await getDownloadURL(snapshot.ref);
                if (downloadURL) {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/foto_sample/${uuid[0]}`,
                    { foto_sample: downloadURL },
                    {
                      withCredentials: true,
                    }
                  );
                }
              } catch (err) {
                console.log(err.message);
              }
            }
            cek2();
          }
          setTimeout(() => {
            alert("success");
            setLoading(false)
            router.replace("/success");
          }, 4000);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(()=>{
    async function getData(){
      try{
        const token = localStorage.getItem("access_token");
        const data = await axios(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );

        if (data.data.success == true) {
          setUser(data.data.data);
        }
      }catch(err){
        console.log(err.message)
      }
    }

    getData()
  })

  
  return (
    <>
     {loading?<Loading/>:""}
      <div>
        {/* <button onClick={() => { console.log(jenis_pengujian); console.log(nama_sample) }}>asd</button> */}
        <p className="md:mt-14 sm:mt-14 mt-10 text-center md:text-3xl sm:text-2xl text-sm font-bold text-gray-800">
          Layanan Analisis Laboratorium Kimia Instrumen &#40;LKI&#41; UPI
        </p>
        <div className="flex justify-center">
          <hr className="grad h-2 mb-8 mt-5 w-56 text-center" />
        </div>
        <form onSubmit={handleSubmit}>
        <div className=" border-2 rounded-lg md:mx-20 md:mx-20 mx-2">
          {/* <p className='text-xl font-semibold text-xl text-white bg-red-600 rounded-lg p-3'>{i + 1}</p> */}
          <div className="w-full h-10 grad rounded-[5px]"></div>
          <div className="md:px-10 md:px-10 px-5 py-5 flex flex-col gap-3">
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">Jenis Pengujian</h2>
              <select
                required
                name="jenis_pengujian"
                id="jenis_pengujian"
                className="input-style-lki"
                defaultValue={""}
                onChange={(e) => {
                  jenis_pengujian[0][0] = kode[e.target.value].jenis_pengujian;
                  kode_pengujian[0][0] = kode[e.target.value].kode_pengujian;
                }}
              >
                <option value="">
                  Pilih
                </option>
                {kode.map((v, i) => {
                  return (
                    <option key={i} value={i}>
                      {v.jenis_pengujian}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">Nama Sample</h2>
              <input
                placeholder="masukkan nama sample"
                className="input-style-lki"
                name="nama_sample"
                required
                type="text"
                onChange={(e) => {
                  nama_sample[i] = e.target.value;
                }}
              />
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">Jumlah Sample</h2>
              <input
                placeholder="masukkan jumlah sample"
                className="input-style-lki"
                name="jumlah_sample"
                required
                type="number"
                onChange={(e) => {
                  jumlah_sample[i] = e.target.value;
                }}
              />
            </div>
            <div>
              <p className="md:text-lg sm:text-lg text-sm font-semibold">Wujud Sample</p>

              <input
                type="radio"
                className="input-style-lki-radio "
                id={`wujud_sample1${i}`}
                name={`wujud_sample${i}`}
                onChange={(e) => {
                  wujud_sample[i] = e.target.value;
                }}
                value="padat"
              />
              <label className="ml-3" htmlFor={`wujud_sample1${i}`}>
                Padat
              </label>
              <br />

              <input
                type="radio"
                className="input-style-lki-radio "
                id={`wujud_sample2${i}`}
                name={`wujud_sample${i}`}
                onChange={(e) => {
                  e.preventDefault();
                  wujud_sample[i] = e.target.value;
                }}
                value="cair"
              />
              <label className="ml-3" htmlFor={`wujud_sample2${i}`}>
                Cair
              </label>
              <br />

              <input
                type="radio"
                className="input-style-lki-radio "
                id={`wujud_sample3${i}`}
                name={`wujud_sample${i}`}
                onChange={(e) => {
                  e.preventDefault();
                  wujud_sample[i] = e.target.value;
                }}
                value="gas"
              />
              <label className="ml-3" htmlFor={`wujud_sample3${i}`}>
                Gas
              </label>
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">Pelarut</h2>
              <input
                placeholder="masukkan pelarut yang digunakan"
                className="input-style-lki"
                name="pelarut"
                required
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  pelarut[i] = e.target.value;
                }}
              />
            </div>
            <div>
              <p className="md:text-lg sm:text-lg text-sm font-semibold">Preparasi Khusus</p>
              <div className="flex">
                <input
                  type="radio"
                  className="input-style-lki-radio "
                  name={`preparasi_khusus${i}`}
                  onChange={(e) => {
                    e.preventDefault();
                    preparasi_khusus[i] = e.target.value;
                  }}
                  value={true}
                />
                <h2 className="ml-3 md:text-lg sm:text-lg text-sm" htmlFor={`preparasi_khusus${i}`}>
                  Ya (esterifikasi/destruksi)
                </h2>
              </div>
              <br />
              <div className="flex">
                <input
                  type="radio"
                  className="input-style-lki-radio "
                  name={`preparasi_khusus${i}`}
                  onChange={(e) => {
                    e.preventDefault();
                    preparasi_khusus[i] = e.target.value;
                  }}
                  value={false}
                />
                <h2 className="ml-3 md:text-lg sm:text-lg text-sm" htmlFor="preparasi_khusus">
                  Tidak
                </h2>
              </div>
              <br />
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                Target senyawa/logam yang di cari
              </h2>
              <input
                placeholder="Tuliskan tujuan pengamatan yang ingin diperoleh, misal analisis logam natrium (Na) untuk AAS "
                className="input-style-lki"
                name="target_senyawa"
                required
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  target_senyawa[i] = e.target.value;
                }}
              />
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">Metode Parameter</h2>
              <input
                className="input-style-lki"
                placeholder="Tuliskan metode parameter yang ingin digunakan (suhu/flow/panjang gelombang/fasa gerak, gas, dsb.)"
                name="metode_parameter"
                required
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  metode_parameter[i] = e.target.value;
                }}
              />
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                Apakah sampel akan diambil setelah pengujian?
              </h2>
              <select
                required
                name="sample_dikembalikan"
                id="sample_dikembalikan"
                className="input-style-lki"
                defaultValue={""}
                onChange={(e) => {
                  e.preventDefault();
                  sample_dikembalikan[i] = e.target.value;
                }}
              >
                <option value="" >
                  Pilih
                </option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                Apakah anda dari program studi KIMIA UPI??
              </h2>
              <select
                required
                name="nonupi"
                id="nonupi"
                className="input-style-lki"
                onChange={(e) => {
                  e.preventDefault();
                  setNonupi(e.target.value)
                }}
                defaultValue={false}
              ><option value="" selected>
                  Pilih
                </option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>
            { user.jenis_institusi!=="Perusahaan"?<div><h2 className="md:text-lg sm:text-lg text-sm font-semibold">Nama Pembimbing</h2><input
              className="input-style-lki"
              placeholder="Tuliskan nama pembimbing"
              name="nama_pembimbing"
              required
              type="text"
              onChange={(e) => {
                e.preventDefault();
                nama_pembimbing[i] = e.target.value;
              }}
            /> </div>:""}
             { nonupi=="ya"?<div><h2 className="md:text-lg sm:text-lg text-sm font-semibold">Apakah anda memiliki dana penelitian</h2><select
                required
                name="dana_penelitian"
                id="dana_penelitian"
                className="input-style-lki"
                onChange={(e) => {
                  e.preventDefault();
                  dana_penelitian[i] = e.target.value;
                  console.log(dana_penelitian[i])
                }}
              >
                
                <option value="" selected>
                  Pilih
                </option>
                <option value={true}>Ya</option>
                <option value={false}>Tidak</option>
              </select></div>:""}
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                Pilih lama pengerjaan
              </h2>
              <select
                required
                name="lama_pengerjaan"
                id="lama_pengerjaan"
                className="input-style-lki"
                onChange={(e) => {
                  e.preventDefault();
                  lama_pengerjaan[i] = e.target.value;
                }}
              >
                <option value="" selected>
                  Pilih
                </option>
                <option value="3 hari">3 hari</option>
                <option value="7 hari">7 hari</option>
                <option value="14 hari">14 hari</option>
                <option value="normal">normal</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
              <div>
                <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                  Foto Sample (*format file yang diupload berupa png, jpg atau
                  jpeg)
                </h2>
                <input
                  className=""
                  name="foto_sample"
                  type="file"
                  onChange={handleFS}
                />
              </div>
              <div>
                <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                  Jurnal Pendukung (*format file yang diupload berupa docx atau
                  pdf, ukuran file dibawah 10mb)
                </h2>
                <input
                  className=""
                  name="jurnal_pendukung"
                  type="file"
                  onChange={(e) => {
                    e.preventDefault();
                    jurnal_pendukung[0]= e.target.files[0];
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">Deskripsi Sample</h2>
              <textarea
                placeholder="Deskripsikan mengenai sampel: sifat fisik, jumlah sampel (gram atau volume), penyimpanan (suhu tertentu atau tidak) dan bagaimana sampel diperoleh"
                className="input-style-lki-box"
                name="deskripsi_sample"
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  deskripsi_sample[i] = e.target.value;
                }}
              />
            </div>
            <div>
              <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                Riwayat Pengujian Sample
              </h2>

              <textarea
                placeholder="Deskripsikan mengenai riwayat pengujian sampel: apakah pernah diuji di tempat lain dan bagaimana hasilnya"
                className="input-style-lki-box"
                name="riwayat_pengujian"
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  riwayat_pengujian[i] = e.target.value;
                }}
              />
            </div>
          </div>
        </div>
          <br />
          <div className="flex md:mx-20 sm:mx-20 mx-4 gap-2">
            <input
              className="my-auto"
              type="checkbox"
              id="verifikasi"
              name="verifikasi"
              required
              onChange={(e) => setVerifikasi(true)}
            />
            <h2 htmlFor="verifikasi" className="md:text-xl sm:text-lg text-xs">
              Saya telah memahami proses pengujian yang akan dilakukan dan
              memahami syarat dan ketentuan yang telah dijelaskan oleh
              staff/pengelola laboratorium
            </h2>
            <br />
          </div>
          <br />
          <div className="w-full flex justify-center mb-20">
            <button
              type="submit"
              className="grad  text-white rounded-lg m-auto text-[24px] font-bold px-6 py-3"
            >
              Kirim
            </button>
          </div>
        </form>
        {/* <div className='grid grid-cols-1 justify-items-center'>
                    <button onClick={increment} className='bg-blue-800 p-3 text-white rounded-lg'>Tambah order</button>
                    <br />
                    <br />
                   
                </div> */}
      </div>
     
    </>
  );
}
