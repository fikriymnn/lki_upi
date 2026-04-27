"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { storage } from "../../../firebase/firebase";
import {
  FlaskConical, TestTube, Hash, Layers, Droplets,
  Settings, Target, SlidersHorizontal, RotateCcw,
  PackageCheck, Building2, UserRound, Timer,
  FileText, ImageIcon, ScrollText,
  ChevronDown, Upload, Loader2, Send,
} from "lucide-react";

// ── Dipindah ke luar agar tidak di-recreate setiap render ────────────────────
const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition bg-white";

const selectClass =
  "w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition bg-white cursor-pointer";

const FieldRow = ({ icon: Icon, label, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
    </div>
    {children}
  </div>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function Order_analisis() {
  const router = useRouter();
  const uid = uuidv4();
  const i = 0;

  const [loading, setLoading] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingJurnal, setUploadingJurnal] = useState(false);
  const [verifikasi, setVerifikasi] = useState(false);
  const [nonupi, setNonupi] = useState("");
  const [user, setUser] = useState({});
  const [uuid] = useState([uid]);

  const [fotoSampleUrl, setFotoSampleUrl] = useState("");
  const [jurnalUrl, setJurnalUrl] = useState("");

  const [jenis_pengujian] = useState([[]]);
  const [kode_pengujian] = useState([[]]);
  const [nama_sample] = useState([]);
  const [jumlah_sample] = useState([]);
  const [wujud_sample] = useState([]);
  const [pelarut] = useState([]);
  const [preparasi_khusus] = useState([]);
  const [target_senyawa] = useState([]);
  const [sample_dikembalikan] = useState([]);
  const [metode_parameter] = useState([]);
  const [deskripsi_sample] = useState([]);
  const [riwayat_pengujian] = useState([]);
  const [nama_pembimbing] = useState([]);
  const [lama_pengerjaan] = useState([]);
  const [dana_penelitian] = useState([]);
  const [arr] = useState([]);

  const kode = [
    { jenis_pengujian: "GCFID", kode_pengujian: "FID" },
    { jenis_pengujian: "GCMS", kode_pengujian: "MS" },
    { jenis_pengujian: "NMR", kode_pengujian: "NMR" },
    { jenis_pengujian: "AAS", kode_pengujian: "AS" },
    { jenis_pengujian: "FTIR", kode_pengujian: "IR" },
    { jenis_pengujian: "TG DTA", kode_pengujian: "TG" },
    { jenis_pengujian: "HPLC", kode_pengujian: "HP" },
    { jenis_pengujian: "UV VIS", kode_pengujian: "UV" },
    { jenis_pengujian: "Freezdry", kode_pengujian: "FD" },
    { jenis_pengujian: "LCMSMS", kode_pengujian: "LC" },
    { jenis_pengujian: "XRD", kode_pengujian: "XRD" },
  ];

  const handleFS = (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    const imageFilname = imageFile.name;
    let reader = new FileReader();

    reader.onload = async (e) => {
      setUploadingFoto(true);
      const img = new Image();
      img.onload = () => {
        var canvas = document.createElement("canvas");
        var MAX_WIDTH = 700;
        var MAX_HEIGHT = 700;
        var width = img.width;
        var height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(async (blob) => {
          const file = new File([blob], imageFilname, {
            type: imageFile.type, lastModified: Date.now(),
          });
          if (file) {
            try {
              const downloadURL = await axios.post(
                `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=fotosample`,
                { file },
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
              );
              if (downloadURL.data.filename) {
                setFotoSampleUrl(downloadURL.data.filename);
              }
            } catch (err) {
              console.log(err.message);
            } finally {
              setUploadingFoto(false);
            }
          }
        }, imageFile.type, 1);
      };
      img.onerror = () => { alert("invalid image content"); setUploadingFoto(false); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const onUploadJurnal = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    setUploadingJurnal(true);
    try {
      const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=jurnalpendukung`,
        { file },
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (downloadURL.data.filename) {
        setJurnalUrl(downloadURL.data.filename);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setUploadingJurnal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let obj = {};
      obj.jenis_pengujian = jenis_pengujian[0];
      obj.kode_pengujian = kode_pengujian[0];
      obj.nama_sample = nama_sample[0];
      obj.jumlah_sample = jumlah_sample[0];
      obj.wujud_sample = wujud_sample[0];
      obj.pelarut = pelarut[0];
      obj.preparasi_khusus = preparasi_khusus[0];
      obj.target_senyawa = target_senyawa[0];
      obj.metode_parameter = metode_parameter[0];
      obj.deskripsi_sample = deskripsi_sample[0];
      obj.riwayat_pengujian = riwayat_pengujian[0];
      obj.sample_dikembalikan = sample_dikembalikan[0];
      obj.nama_pembimbing = nama_pembimbing[0];
      obj.lama_pengerjaan = lama_pengerjaan[0];
      obj.dana_penelitian = dana_penelitian[0];
      obj.foto_sample = fotoSampleUrl;
      obj.jurnal_pendukung = jurnalUrl;
      obj.uuid = uuid[0];
      arr[0] = obj;

      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/order/${token}`,
        arr,
        { withCredentials: true }
      );

      if (data.data.success == true) {
        setTimeout(() => {
          setLoading(false);
          alert("Order berhasil dikirim!");
          router.replace("/my_order");
        }, 500);
      }
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const token = localStorage.getItem("access_token");
        const data = await axios(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );
        if (data.data.success == true) {
          setUser(data.data.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getData();
  }, []);

  const isUploading = uploadingFoto || uploadingJurnal;
  const isDisabled = loading || isUploading;

  return (
    <>
      {loading && <Loading />}

      <div className="p-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Form Order Analisis</h1>
            <p className="text-gray-500 text-sm mt-1">
              Layanan Analisis Laboratorium Kimia Instrumen (LKI) UPI
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Section 1: Data Sample ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
                <FlaskConical className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">Data Sample & Pengujian</p>
              </div>
              <div className="p-5 flex flex-col gap-4">

                {/* Jenis Pengujian */}
                <FieldRow icon={TestTube} label="Jenis Pengujian">
                  <div className="relative">
                    <select
                      required
                      name="jenis_pengujian"
                      className={selectClass}
                      defaultValue=""
                      onChange={(e) => {
                        jenis_pengujian[0][0] = kode[e.target.value].jenis_pengujian;
                        kode_pengujian[0][0] = kode[e.target.value].kode_pengujian;
                      }}
                    >
                      <option value="">Pilih jenis pengujian</option>
                      {kode.map((v, idx) => (
                        <option key={idx} value={idx}>{v.jenis_pengujian}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </FieldRow>

                {/* Nama Sample */}
                <FieldRow icon={Hash} label="Nama Sample">
                  <input
                    placeholder="Masukkan nama sample"
                    className={inputClass}
                    name="nama_sample"
                    required
                    type="text"
                    onChange={(e) => { nama_sample[i] = e.target.value; }}
                  />
                </FieldRow>

                {/* Jumlah Sample */}
                <FieldRow icon={Layers} label="Jumlah Sample">
                  <input
                    placeholder="Masukkan jumlah sample"
                    className={inputClass}
                    name="jumlah_sample"
                    required
                    type="number"
                    onChange={(e) => { jumlah_sample[i] = e.target.value; }}
                  />
                </FieldRow>

                {/* Wujud Sample */}
                <FieldRow icon={TestTube} label="Wujud Sample">
                  <div className="flex gap-6 mt-1">
                    {["padat", "cair", "gas"].map((w) => (
                      <label key={w} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`wujud_sample${i}`}
                          value={w}
                          onChange={(e) => { wujud_sample[i] = e.target.value; }}
                          className="accent-red-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{w}</span>
                      </label>
                    ))}
                  </div>
                </FieldRow>

                {/* Pelarut */}
                <FieldRow icon={Droplets} label="Pelarut">
                  <input
                    placeholder="Masukkan pelarut yang digunakan"
                    className={inputClass}
                    name="pelarut"
                    required
                    type="text"
                    onChange={(e) => { pelarut[i] = e.target.value; }}
                  />
                </FieldRow>

                {/* Preparasi Khusus */}
                <FieldRow icon={Settings} label="Preparasi Khusus">
                  <div className="flex flex-col gap-2 mt-1">
                    {[
                      { val: "true", label: "Ya (esterifikasi/destruksi)" },
                      { val: "false", label: "Tidak" },
                    ].map(({ val, label }) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`preparasi_khusus${i}`}
                          value={val}
                          onChange={(e) => { preparasi_khusus[i] = e.target.value; }}
                          className="accent-red-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </FieldRow>

                {/* Target Senyawa */}
                <FieldRow icon={Target} label="Target Senyawa/Logam yang Dicari">
                  <input
                    placeholder="Tuliskan tujuan pengamatan, misal analisis logam natrium (Na) untuk AAS"
                    className={inputClass}
                    name="target_senyawa"
                    required
                    type="text"
                    onChange={(e) => { target_senyawa[i] = e.target.value; }}
                  />
                </FieldRow>

                {/* Metode Parameter */}
                <FieldRow icon={SlidersHorizontal} label="Metode Parameter">
                  <input
                    placeholder="Tuliskan metode parameter (suhu/flow/panjang gelombang/fasa gerak, gas, dsb.)"
                    className={inputClass}
                    name="metode_parameter"
                    required
                    type="text"
                    onChange={(e) => { metode_parameter[i] = e.target.value; }}
                  />
                </FieldRow>

                {/* Sample Dikembalikan */}
                <FieldRow icon={PackageCheck} label="Apakah sampel akan diambil setelah pengujian?">
                  <div className="relative">
                    <select
                      required
                      name="sample_dikembalikan"
                      className={selectClass}
                      defaultValue=""
                      onChange={(e) => { sample_dikembalikan[i] = e.target.value; }}
                    >
                      <option value="">Pilih</option>
                      <option value="ya">Ya</option>
                      <option value="tidak">Tidak</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </FieldRow>

                {/* Non UPI */}
                <FieldRow icon={Building2} label="Apakah anda dari program studi KIMIA UPI?">
                  <div className="relative">
                    <select
                      required
                      name="nonupi"
                      className={selectClass}
                      defaultValue=""
                      onChange={(e) => { setNonupi(e.target.value); }}
                    >
                      <option value="">Pilih</option>
                      <option value="ya">Ya</option>
                      <option value="tidak">Tidak</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </FieldRow>

                {/* Nama Pembimbing — conditional, pakai uncontrolled defaultValue agar tidak reset */}
                {user.jenis_institusi !== "Perusahaan" && (
                  <FieldRow icon={UserRound} label="Nama Pembimbing">
                    <input
                      placeholder="Tuliskan nama pembimbing"
                      className={inputClass}
                      name="nama_pembimbing"
                      required
                      type="text"
                      defaultValue={nama_pembimbing[i] ?? ""}
                      onChange={(e) => { nama_pembimbing[i] = e.target.value; }}
                    />
                  </FieldRow>
                )}

                {/* Dana Penelitian — conditional */}
                {nonupi === "ya" && (
                  <FieldRow icon={FileText} label="Apakah anda memiliki dana penelitian?">
                    <div className="relative">
                      <select
                        required
                        name="dana_penelitian"
                        className={selectClass}
                        defaultValue=""
                        onChange={(e) => { dana_penelitian[i] = e.target.value; }}
                      >
                        <option value="">Pilih</option>
                        <option value={true}>Ya</option>
                        <option value={false}>Tidak</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </FieldRow>
                )}

                {/* Lama Pengerjaan */}
                <FieldRow icon={Timer} label="Pilih Lama Pengerjaan">
                  <div className="relative">
                    <select
                      required
                      name="lama_pengerjaan"
                      className={selectClass}
                      defaultValue=""
                      onChange={(e) => { lama_pengerjaan[i] = e.target.value; }}
                    >
                      <option value="">Pilih</option>
                      <option value="3 hari">3 hari</option>
                      <option value="7 hari">7 hari</option>
                      <option value="14 hari">14 hari</option>
                      <option value="normal">normal</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </FieldRow>

                {/* Deskripsi Sample */}
                <FieldRow icon={ScrollText} label="Deskripsi Sample">
                  <textarea
                    rows={4}
                    placeholder="Deskripsikan sifat fisik, jumlah sampel (gram atau volume), penyimpanan, dan bagaimana sampel diperoleh"
                    className={inputClass}
                    name="deskripsi_sample"
                    onChange={(e) => { deskripsi_sample[i] = e.target.value; }}
                  />
                </FieldRow>

                {/* Riwayat Pengujian */}
                <FieldRow icon={RotateCcw} label="Riwayat Pengujian Sample">
                  <textarea
                    rows={4}
                    placeholder="Deskripsikan riwayat pengujian: apakah pernah diuji di tempat lain dan bagaimana hasilnya"
                    className={inputClass}
                    name="riwayat_pengujian"
                    onChange={(e) => { riwayat_pengujian[i] = e.target.value; }}
                  />
                </FieldRow>

              </div>
            </div>

            {/* ── Section 2: Lampiran File ───────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
                <Upload className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">Lampiran File</p>
                <span className="ml-auto text-xs text-gray-400 italic">Opsional</span>
              </div>
              <div className="p-5 flex flex-col gap-4">

                {/* Foto Sample */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-700">Foto Sample</h2>
                    {uploadingFoto && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-amber-600">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengupload...
                      </span>
                    )}
                    {!uploadingFoto && fotoSampleUrl && (
                      <span className="ml-auto text-xs text-green-600 font-medium">✓ Berhasil diupload</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Format: png, jpg, atau jpeg</p>
                  <input
                    name="foto_sample"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFS}
                    className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition"
                  />
                </div>

                {/* Jurnal Pendukung */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-700">Jurnal Pendukung</h2>
                    {uploadingJurnal && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-amber-600">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengupload...
                      </span>
                    )}
                    {!uploadingJurnal && jurnalUrl && (
                      <span className="ml-auto text-xs text-green-600 font-medium">✓ Berhasil diupload</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Format: docx atau pdf, ukuran di bawah 10MB</p>
                  <input
                    name="jurnal_pendukung"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={onUploadJurnal}
                    className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition"
                  />
                </div>

              </div>
            </div>

            {/* ── Verifikasi & Submit ────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="verifikasi"
                  name="verifikasi"
                  required
                  onChange={() => setVerifikasi(true)}
                  className="mt-0.5 accent-red-500 w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  Saya telah memahami proses pengujian yang akan dilakukan dan memahami syarat
                  dan ketentuan yang telah dijelaskan oleh staff/pengelola laboratorium.
                </span>
              </label>
            </div>

            <div className="flex justify-center mb-20">
              <button
                type="submit"
                disabled={isDisabled}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-sm transition
                  ${isDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                  }`}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                ) : isUploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menunggu upload selesai...</>
                ) : (
                  <><Send className="w-4 h-4" /> Kirim Order</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}