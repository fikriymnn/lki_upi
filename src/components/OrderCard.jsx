"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ref,
  deleteObject,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase/firebase";
import axios from "axios";
import {
  FlaskConical,
  Layers,
  Droplets,
  Clock,
  User,
  Wrench,
  Target,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Upload,
  Download,
  TestTube,
  RotateCcw,
  Pencil,
} from "lucide-react";

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

  const Field = ({ label, value, icon }) => (
    <div>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
        {icon}
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  );

  const handleFS = async (event) => {
    let reader = new FileReader();
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
    reader.onload = async (e) => {
      setLoading2(true);
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
          async (blob) => {
            const file = new File([blob], imageFilname, {
              type: imageFile.type,
              lastModified: Date.now(),
            });
            if (file) {
              try {
                const downloadURL = await axios.post(
                  `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=fotosample`,
                  { file: file },
                  {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                  }
                );
                if (downloadURL.data.filename) {
                  const cek = await axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/foto_sample/${uuid}`,
                    { foto_sample: downloadURL.data.filename },
                    { withCredentials: true }
                  );
                  if (cek) {
                    setLoading2(false);
                    alert("Foto Sample Berhasil Diubah");
                    window.location.reload();
                  }
                }
              } catch (err) {
                setLoading2(false);
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
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleJurnal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=jurnalpendukung`,
        { file: e.target.files[0] },
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (downloadURL.data.filename) {
        const cek = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/jurnal_pendukung/${uuid}`,
          { jurnal_pendukung: downloadURL.data.filename },
          { withCredentials: true }
        );
        if (cek) {
          setLoading(false);
          alert("Jurnal Pendukung Berhasil Diubah");
          window.location.reload();
        }
      }
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {nama_sample || "Sampel tanpa nama"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {kode_pengujian || "—"} · {jenis_pengujian || "—"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              sample_dikembalikan
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {sample_dikembalikan ? "Dikembalikan" : "Tidak Dikembalikan"}
          </span>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-6">

        {/* Info Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field
            label="Jumlah Sample"
            value={jumlah_sample}
            icon={<Layers className="w-3 h-3" />}
          />
          <Field
            label="Wujud Sample"
            value={wujud_sample}
            icon={<FlaskConical className="w-3 h-3" />}
          />
          <Field
            label="Pelarut"
            value={pelarut}
            icon={<Droplets className="w-3 h-3" />}
          />
          <Field
            label="Lama Pengerjaan"
            value={lama_pengerjaan}
            icon={<Clock className="w-3 h-3" />}
          />
        </div>

        {/* Info Tambahan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <Field
            label="Nama Pembimbing"
            value={nama_pembimbing}
            icon={<User className="w-3 h-3" />}
          />
          <Field
            label="Preparasi Khusus"
            value={preparasi_khusus ? "Ya" : "Tidak"}
            icon={<Wrench className="w-3 h-3" />}
          />
          <Field
            label="Target Senyawa"
            value={target_senyawa}
            icon={<Target className="w-3 h-3" />}
          />
          <Field
            label="Metode / Parameter"
            value={metode_parameter}
            icon={<TestTube className="w-3 h-3" />}
          />
        </div>

        {/* Deskripsi & Riwayat & Sample Dikembalikan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">
              {deskripsi || "—"}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Riwayat Pengujian</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">
              {riwayat_pengujian || "—"}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Sample Dikembalikan</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">
              {sample_dikembalikan || "—"}
            </div>
          </div>
        </div>

        {/* Dokumen */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Dokumen
          </p>
          <div className="flex flex-col gap-2">

            {/* ── Foto Sample ── */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Row info + aksi unduh */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Foto Sample</p>
                  <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>
                </div>
                {loading2 ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <div className="w-4 h-4 border-2 border-t-transparent border-amber-500 rounded-full animate-spin" />
                    <span className="text-xs text-gray-500">Mengupload...</span>
                  </div>
                ) : foto_sample ? (
                  
                   <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/fotosample/${foto_sample}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg flex-shrink-0">
                    Tidak ada
                  </span>
                )}
              </div>
              {/* Row upload — hanya tampil saat tidak sedang loading */}
              {!loading2 && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition flex-shrink-0">
                      <Pencil className="w-3.5 h-3.5" />
                      {foto_sample ? "Ganti File" : "Pilih File"}
                    </span>
                    <input
                      type="file"
                      name="foto_sample"
                      onChange={handleFS}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-400 truncate">
                      {foto_sample ? foto_sample : "Belum ada file dipilih"}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* ── Jurnal Pendukung ── */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Row info + aksi unduh */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Jurnal Pendukung</p>
                  <p className="text-xs text-gray-400">DOCX, PDF</p>
                </div>
                {loading ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    <span className="text-xs text-gray-500">Mengupload...</span>
                  </div>
                ) : jurnal_pendukung ? (
                  
                  <a  href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/jurnalpendukung/${jurnal_pendukung}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg flex-shrink-0">
                    Tidak ada
                  </span>
                )}
              </div>
              {/* Row upload — hanya tampil saat tidak sedang loading */}
              {!loading && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition flex-shrink-0">
                      <Pencil className="w-3.5 h-3.5" />
                      {jurnal_pendukung ? "Ganti File" : "Pilih File"}
                    </span>
                    <input
                      type="file"
                      name="bukti_pembayaran"
                      onChange={handleJurnal}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-400 truncate">
                      {jurnal_pendukung ? jurnal_pendukung : "Belum ada file dipilih"}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* ── Hasil Analisis ── */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">Hasil Analisis</p>
                  <p className="text-xs text-gray-400">PDF, ZIP, RAR</p>
                </div>
                {status === "Selesai" && hasil_analisis ? (
                  
                   <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${hasil_analisis}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg flex-shrink-0">
                    Belum tersedia
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}