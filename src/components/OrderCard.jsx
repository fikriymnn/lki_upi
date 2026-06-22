"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import {
  FlaskConical, Layers, Droplets, Clock, User, Wrench,
  Target, BookOpen, FileText, Image as ImageIcon,
  Download, TestTube, Pencil, Upload, Check, X,
} from "lucide-react";

export default function OrderCard({
  uuid, jenis_pengujian, nama_sample, jumlah_sample,
  wujud_sample, pelarut, preparasi_khusus, target_senyawa,
  metode_parameter, jurnal_pendukung, hasil_analisis,
  id, deskripsi, foto_sample, kode_pengujian, status,
  riwayat_pengujian, sample_dikembalikan, lama_pengerjaan, nama_pembimbing,
}) {
  // Foto Sample state
  const [addFoto, setAddFoto] = useState(false)
  const [fileFoto, setFileFoto] = useState(null)
  const [loadingFoto, setLoadingFoto] = useState(false)
  const [currentFoto, setCurrentFoto] = useState(foto_sample)

  // Jurnal Pendukung state
  const [addJurnal, setAddJurnal] = useState(false)
  const [fileJurnal, setFileJurnal] = useState(null)
  const [loadingJurnal, setLoadingJurnal] = useState(false)
  const [currentJurnal, setCurrentJurnal] = useState(jurnal_pendukung)

  const isSelesai = status === "Selesai"

  const Field = ({ label, value, icon }) => (
    <div>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
        {icon}{label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  )

  // ── Upload Foto Sample ──
  const handleConfirmFoto = async () => {
    if (!fileFoto) { alert("Tidak ada file yang dipilih"); return }
    setLoadingFoto(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const img = new Image()
        img.onload = async () => {
          const MAX = 700
          let { width, height } = img
          if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX } }
          else { if (height > MAX) { width *= MAX / height; height = MAX } }

          const canvas = document.createElement("canvas")
          canvas.width = width; canvas.height = height
          canvas.getContext("2d").drawImage(img, 0, 0, width, height)

          canvas.toBlob(async (blob) => {
            const file = new File([blob], fileFoto.name, { type: fileFoto.type, lastModified: Date.now() })
            try {
              const upload = await axios.post(
                `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=fotosample`,
                { file },
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
              )
              if (upload.data.filename) {
                await axios.post(
                  `${process.env.NEXT_PUBLIC_URL}/api/foto_sample/${uuid}`,
                  { foto_sample: upload.data.filename },
                  { withCredentials: true }
                )
                setCurrentFoto(upload.data.filename)
                setAddFoto(false)
                setFileFoto(null)
                alert("Foto Sample berhasil diubah")
              }
            } catch (err) { alert(err.message) }
            finally { setLoadingFoto(false) }
          }, fileFoto.type, 1)
        }
        img.onerror = () => { alert("File gambar tidak valid"); setLoadingFoto(false) }
        img.src = e.target.result
      }
      reader.readAsDataURL(fileFoto)
    } catch (err) { alert(err.message); setLoadingFoto(false) }
  }

  // ── Upload Jurnal Pendukung ──
  const handleConfirmJurnal = async () => {
    if (!fileJurnal) { alert("Tidak ada file yang dipilih"); return }
    setLoadingJurnal(true)
    try {
      const upload = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=jurnalpendukung`,
        { file: fileJurnal },
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      if (upload.data.filename) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/jurnal_pendukung/${uuid}`,
          { jurnal_pendukung: upload.data.filename },
          { withCredentials: true }
        )
        setCurrentJurnal(upload.data.filename)
        setAddJurnal(false)
        setFileJurnal(null)
        alert("Jurnal Pendukung berhasil diubah")
      }
    } catch (err) { alert(err.message) }
    finally { setLoadingJurnal(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">{nama_sample || "Sampel tanpa nama"}</p>
          <p className="text-sm text-gray-400 mt-0.5">{kode_pengujian || "—"} · {jenis_pengujian || "—"}</p>
        </div>
        <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sample_dikembalikan ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
          {sample_dikembalikan == "ya" ? "Sample diambil ke laboratorium" : "Sample tidak diambil kembali"}
        </span>
      </div>

      <div className="px-5 py-5 flex flex-col gap-6">

        {/* Info Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Jumlah Sample" value={jumlah_sample} icon={<Layers className="w-3 h-3" />} />
          <Field label="Wujud Sample" value={wujud_sample} icon={<FlaskConical className="w-3 h-3" />} />
          <Field label="Pelarut" value={pelarut} icon={<Droplets className="w-3 h-3" />} />
          <Field label="Lama Pengerjaan" value={lama_pengerjaan} icon={<Clock className="w-3 h-3" />} />
        </div>

        {/* Info Tambahan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <Field label="Nama Pembimbing" value={nama_pembimbing} icon={<User className="w-3 h-3" />} />
          <Field label="Preparasi Khusus" value={preparasi_khusus ? "Ya" : "Tidak"} icon={<Wrench className="w-3 h-3" />} />
          <Field label="Target Senyawa" value={target_senyawa} icon={<Target className="w-3 h-3" />} />
          <Field label="Metode / Parameter" value={metode_parameter} icon={<TestTube className="w-3 h-3" />} />
        </div>

        {/* Deskripsi & Riwayat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">{deskripsi || "—"}</div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Riwayat Pengujian</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">{riwayat_pengujian || "—"}</div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Sample Dikembalikan</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">{sample_dikembalikan || "—"}</div>
          </div>
        </div>

        {/* Dokumen */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Dokumen</p>
          <div className="flex flex-col gap-2">

            {/* ── Foto Sample ── */}
            <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Foto Sample</p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {currentFoto && !addFoto && (
                    <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/fotosample/${currentFoto}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh</span>
                    </a>
                  )}
                  {!isSelesai && (
                    loadingFoto ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <div className="w-4 h-4 border-2 border-t-transparent border-amber-500 rounded-full animate-spin" />
                        <span className="text-xs text-gray-500 hidden sm:inline">Mengupload...</span>
                      </div>
                    ) : !addFoto ? (
                      <button
                        onClick={() => setAddFoto(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{currentFoto ? "Update" : "Upload"}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConfirmFoto}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Kirim</span>
                        </button>
                        <button
                          onClick={() => { setAddFoto(false); setFileFoto(null) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Batal</span>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              {!isSelesai && addFoto && !loadingFoto && (
                <div className="pt-3 border-t border-gray-100">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => setFileFoto(e.target.files[0])}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {fileFoto && (
                    <p className="text-xs text-gray-400 mt-1">{fileFoto.name} — {(fileFoto.size / 1024 / 1024).toFixed(2)} MB</p>
                  )}
                </div>
              )}
            </div>

            {/* ── Jurnal Pendukung ── */}
            <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Jurnal Pendukung</p>
                    <p className="text-xs text-gray-400">DOCX, PDF</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {currentJurnal && !addJurnal && (
                    <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/jurnalpendukung/${currentJurnal}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh</span>
                    </a>
                  )}
                  {!isSelesai && (
                    loadingJurnal ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        <span className="text-xs text-gray-500 hidden sm:inline">Mengupload...</span>
                      </div>
                    ) : !addJurnal ? (
                      <button
                        onClick={() => setAddJurnal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{currentJurnal ? "Update" : "Upload"}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConfirmJurnal}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Kirim</span>
                        </button>
                        <button
                          onClick={() => { setAddJurnal(false); setFileJurnal(null) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Batal</span>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              {!isSelesai && addJurnal && !loadingJurnal && (
                <div className="pt-3 border-t border-gray-100">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFileJurnal(e.target.files[0])}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {fileJurnal && (
                    <p className="text-xs text-gray-400 mt-1">{fileJurnal.name} — {(fileJurnal.size / 1024 / 1024).toFixed(2)} MB</p>
                  )}
                </div>
              )}
            </div>

            {/* ── Hasil Analisis (read-only) ── */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-3 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Hasil Analisis</p>
                    <p className="text-xs text-gray-400">PDF, ZIP, RAR</p>
                  </div>
                </div>
                {status === "Selesai" && hasil_analisis ? (
                  <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${hasil_analisis}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unduh</span>
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg flex-shrink-0">Belum tersedia</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}