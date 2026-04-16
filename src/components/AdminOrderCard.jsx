"use client"
import { useEffect, useState } from "react";
import axios from "axios"
import {
  FlaskConical, Layers, Droplets, Clock,
  User, Wrench, Target, BookOpen,
  FileText, Image, Upload, Download, X, Check, TestTube
} from "lucide-react";

export default function AdminOrderCard({
  riwayat_pengujian, sample_dikembalikan, uuid, jenis_pengujian,
  nama_sample, jumlah_sample, index, wujud_sample, pelarut,
  preparasi_khusus, target_senyawa, metode_parameter, jurnal_pendukung,
  deskripsi, hasil_analisis, foto_sample, id, kode_pengujian,
  nama_pembimbing, lama_pengerjaan, no_invoice, status, invoice_id
}) {
  const [add, setAdd] = useState(false)
  const [file, setFile] = useState('')

  useEffect(() => {
    console.log(status)
  }, [])

  const handleConfirm = async (e) => {
    e.preventDefault()
    try {
      const downloadURL = await axios.post(
        `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=hasilanalisis`,
        { file: file },
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (!file) {
        alert('no file uploaded')
        setAdd(a => !a)
      } else {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/hasil_analisis/${id}?invoice_id=${invoice_id}${status == "Sample Dikerjakan Operator" ? "&task=operator" : ""}`,
          { hasil_analisis: downloadURL.data.filename },
          { withCredentials: true }
        )
        if (data.data == 'success') {
          setAdd(a => !a)
          alert("upload successfully!")
          window.location.reload()
        }
      }
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }

  const Field = ({ label, value, icon }) => (
    <div>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
        {icon}
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <Field value={nama_sample || 'Sampel tanpa nama'}/>
          <p className="text-sm text-gray-400 mt-0.5">{kode_pengujian || '—'} · {jenis_pengujian || '—'}</p>
        </div>
        <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sample_dikembalikan ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {sample_dikembalikan ? 'Dikembalikan' : 'Tidak Dikembalikan'}
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
          <Field label="Preparasi Khusus" value={preparasi_khusus ? 'Ya' : 'Tidak'} icon={<Wrench className="w-3 h-3" />} />
          <Field label="Target Senyawa" value={target_senyawa} icon={<Target className="w-3 h-3" />} />
          <Field label="Metode / Parameter" value={metode_parameter} icon={<TestTube className="w-3 h-3" />} />
        </div>

        {/* Deskripsi & Riwayat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">
              {deskripsi || '—'}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Riwayat Pengujian</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 min-h-[60px]">
              {riwayat_pengujian || '—'}
            </div>
          </div>
        </div>

        {/* Dokumen */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Dokumen</p>
          <div className="flex flex-col gap-3">

            {/* Foto Sample */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Foto Sample</p>
                  <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>
                </div>
              </div>
              {foto_sample
                ?
                <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/fotosample/${foto_sample}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </a>
                : <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Tidak ada</span>
              }
            </div>

            {/* Jurnal Pendukung */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Jurnal Pendukung</p>
                  <p className="text-xs text-gray-400">DOCX, PDF</p>
                </div>
              </div>
              {jurnal_pendukung
                ?
                <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/jurnalpendukung/${jurnal_pendukung}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </a>
                : <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Tidak ada</span>
              }
            </div>

            {/* Hasil Analisis */}
            <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hasil Analisis</p>
                    <p className="text-xs text-gray-400">PDF, ZIP, RAR — maks. 20MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasil_analisis && !add && (

                    <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${hasil_analisis}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh
                    </a>
                  )}
                  {!add
                    ? <button
                      onClick={() => setAdd(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {hasil_analisis ? 'Ganti File' : 'Upload File'}
                    </button>
                    : <div className="flex items-center gap-2">
                      <button
                        onClick={handleConfirm}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Kirim
                      </button>
                      <button
                        onClick={() => { setAdd(false); setFile('') }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition"
                      >
                        <X className="w-3.5 h-3.5" /> Batal
                      </button>
                    </div>
                  }
                </div>
              </div>
              {add && (
                <div className="mt-1 pt-3 border-t border-gray-100">
                  <input
                    type="file"
                    name="hasil_analisis"
                    onChange={(e) => { e.preventDefault(); setFile(e.target.files[0]) }}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}