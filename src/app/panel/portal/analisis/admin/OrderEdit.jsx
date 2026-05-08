"use client"
import axios from 'axios';
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  ChevronLeft, FileText, User, Calendar,
  Check, FlaskConical, Save
} from "lucide-react";

export default function OrderEdit({ setActivePage, noInvoice }) {
  const no_invoice = noInvoice
  const uid = uuidv4()
  const [iD, setID] = useState('')
  const [jenis_pengujian, setJenis_pengujian] = useState([[]])
  const [kode_pengujian, setKode_pengujian] = useState([[]])
  const [nama_sample, setNama_sample] = useState([])
  const [jumlah_sample, setJumlah_sample] = useState([])
  const [wujud_sample, setWujud_sample] = useState([])
  const [pelarut, setPelarut] = useState([])
  const [preparasi_khusus, setPreparasi_khusus] = useState([])
  const [target_senyawa, setTarget_senyawa] = useState([])
  const [sample_dikembalikan, setSample_dikembalikan] = useState([])
  const [metode_parameter, setMetode_parameter] = useState([])
  const [deskripsi_sample, setDeskripsi_sample] = useState([])
  const [riwayat_pengujian, setRiwayat_pengujian] = useState([])
  const [lama_pengerjaan, setLama_pengerjaan] = useState([])
  const [uuid, setUuid] = useState([uid])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let obj = {}
      obj.nama_sample = nama_sample[0]
      obj.jumlah_sample = jumlah_sample[0]
      obj.wujud_sample = wujud_sample[0]
      obj.pelarut = pelarut[0]
      obj.preparasi_khusus = preparasi_khusus[0]
      obj.target_senyawa = target_senyawa[0]
      obj.metode_parameter = metode_parameter[0]
      obj.deskripsi_sample = deskripsi_sample[0]
      obj.riwayat_pengujian = riwayat_pengujian[0]
      obj.sample_dikembalikan = sample_dikembalikan[0]
      obj.lama_pengerjaan = lama_pengerjaan[0]
      const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/order/${iD}`, obj, { withCredentials: true })
      if (data.data.success) {
        alert("update success")
        setActivePage('order')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    async function cek() {
        console.log(no_invoice)
      try {
        const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=10`, { withCredentials: true })
        if (data.data.success) {
          const datas = data.data.data[0]
          console.log(data)
          console.log(datas)
          setID(datas._id)
          jenis_pengujian[0][0] = datas.jenis_pengujian
          kode_pengujian[0] = datas.kode_pengujian
          nama_sample[0] = datas.nama_sample
          jumlah_sample[0] = datas.jumlah_sample
          wujud_sample[0] = datas.wujud_sample
          pelarut[0] = datas.pelarut
          preparasi_khusus[0] = datas.preparasi_khusus
          target_senyawa[0] = datas.target_senyawa
          sample_dikembalikan[0] = datas.sample_dikembalikan
          metode_parameter[0] = datas.metode_parameter
          deskripsi_sample[0] = datas.deskripsi_sample
          riwayat_pengujian[0] = datas.riwayat_pengujian
          lama_pengerjaan[0] = datas.lama_pengerjaan
        }
      } catch (err) {
        alert(err.message)
      }
    }
    cek()
  }, [])

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
  const labelClass = "text-sm font-medium text-gray-600 pt-1.5"
  const rowClass = "grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 items-start pt-4"

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setActivePage("order")}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Order</h1>
          <p className="text-sm text-gray-500">Perbarui informasi sampel pengujian</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> No. Invoice
          </p>
          <p className="text-sm font-semibold text-gray-900">{no_invoice || '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <FlaskConical className="w-3 h-3" /> Jenis Pengujian
          </p>
          <p className="text-sm font-semibold text-gray-900">{jenis_pengujian[0][0] || '—'}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Data Sampel
          </p>

          <div className="divide-y divide-gray-100">

            {/* Jenis Pengujian - readonly */}
            <div className={rowClass}>
              <p className={labelClass}>Jenis Pengujian</p>
              <input
                className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
                type="text"
                readOnly
                value={jenis_pengujian[0][0] || ''}
              />
            </div>

            {/* Nama Sample */}
            <div className={rowClass}>
              <p className={labelClass}>Nama Sample</p>
              <input
                className={inputClass}
                type="text"
                defaultValue={nama_sample[0]}
                placeholder="Masukkan nama sample"
                onChange={(e) => { nama_sample[0] = e.target.value }}
              />
            </div>

            {/* Jumlah Sample */}
            <div className={rowClass}>
              <p className={labelClass}>Jumlah Sample</p>
              <input
                className={inputClass}
                type="number"
                defaultValue={jumlah_sample[0]}
                placeholder="Masukkan jumlah sample"
                onChange={(e) => { jumlah_sample[0] = e.target.value }}
              />
            </div>

            {/* Wujud Sample */}
            <div className={rowClass}>
              <p className={labelClass}>Wujud Sample</p>
              <select
                className={inputClass}
                defaultValue={wujud_sample[0]}
                onChange={(e) => { wujud_sample[0] = e.target.value }}
              >
                <option value="padat">Padat</option>
                <option value="cair">Cair</option>
                <option value="gas">Gas</option>
              </select>
            </div>

            {/* Pelarut */}
            <div className={rowClass}>
              <p className={labelClass}>Pelarut</p>
              <input
                className={inputClass}
                type="text"
                defaultValue={pelarut[0]}
                placeholder="Masukkan pelarut yang digunakan"
                onChange={(e) => { pelarut[0] = e.target.value }}
              />
            </div>

            {/* Preparasi Khusus */}
            <div className={rowClass}>
              <p className={labelClass}>Preparasi Khusus</p>
              <select
                className={inputClass}
                defaultValue={preparasi_khusus[0]}
                onChange={(e) => { preparasi_khusus[0] = e.target.value }}
              >
                <option value={true}>Ya (esterifikasi/destruksi)</option>
                <option value={false}>Tidak</option>
              </select>
            </div>

            {/* Target Senyawa */}
            <div className={rowClass}>
              <p className={labelClass}>Target Senyawa / Logam</p>
              <input
                className={inputClass}
                type="text"
                defaultValue={target_senyawa[0]}
                placeholder="Contoh: analisis logam natrium (Na) untuk AAS"
                onChange={(e) => { target_senyawa[0] = e.target.value }}
              />
            </div>

            {/* Metode Parameter */}
            <div className={rowClass}>
              <p className={labelClass}>Metode Parameter</p>
              <input
                className={inputClass}
                type="text"
                defaultValue={metode_parameter[0]}
                placeholder="Suhu / flow / panjang gelombang / fasa gerak, gas, dsb."
                onChange={(e) => { metode_parameter[0] = e.target.value }}
              />
            </div>

            {/* Sample Dikembalikan */}
            <div className={rowClass}>
              <p className={labelClass}>Sample Diambil Setelah Pengujian?</p>
              <select
                className={inputClass}
                defaultValue={sample_dikembalikan[0]}
                onChange={(e) => { sample_dikembalikan[0] = e.target.value }}
              >
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>

            {/* Lama Pengerjaan */}
            <div className={rowClass}>
              <p className={labelClass}>Lama Pengerjaan</p>
              <select
                className={inputClass}
                defaultValue={lama_pengerjaan[0]}
                onChange={(e) => { lama_pengerjaan[0] = e.target.value }}
              >
                <option value="">Pilih</option>
                <option value="3 hari">3 hari</option>
                <option value="7 hari">7 hari</option>
                <option value="14 hari">14 hari</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            {/* Deskripsi Sample */}
            <div className={rowClass}>
              <p className={labelClass}>Deskripsi Sample</p>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                defaultValue={deskripsi_sample[0]}
                placeholder="Sifat fisik, jumlah (gram/volume), penyimpanan, dan bagaimana sampel diperoleh"
                onChange={(e) => { deskripsi_sample[0] = e.target.value }}
              />
            </div>

            {/* Riwayat Pengujian */}
            <div className={rowClass}>
              <p className={labelClass}>Riwayat Pengujian</p>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                defaultValue={riwayat_pengujian[0]}
                placeholder="Apakah pernah diuji di tempat lain dan bagaimana hasilnya"
                onChange={(e) => { riwayat_pengujian[0] = e.target.value }}
              />
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setActivePage('order')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  )
}