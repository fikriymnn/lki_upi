"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { MapPin, ArrowRight, FlaskConical } from 'lucide-react';

const convertRupiah = (angka = 0) => {
  const parts = angka?.toString().split('').reverse().join('').match(/\d{1,3}/g);
  return parts?.join('.').split('').reverse().join('') ?? '0';
};

// ── Konfigurasi kolom per tipe_layanan — harus match enum tipe_layanan di Catalog model ──
const FIELD_CONFIG = {
  sewa_alat: {
    label: 'Sewa Alat',
    mainColumns: [
      { key: 'nama_item', label: 'Nama Alat' },
      { key: 'deskripsi', label: 'Spesifikasi' },
    ],
    tarifColumns: ['segmen', 'golongan', 'jenis_jasa', 'harga'],
  },
  sewa_lab: {
    label: 'Sewa Lab',
    mainColumns: [
      { key: 'nama_item', label: 'Waktu Sewa' },
    ],
    tarifColumns: ['segmen', 'golongan', 'harga'],
  },
  layanan_analisis: {
    label: 'Layanan Analisis',
    mainColumns: [
      { key: 'nama_item', label: 'Layanan Analisis' },
      { key: 'metode_analisis', label: 'Metode Analisis' },
      { key: 'satuan', label: 'Satuan' },
      { key: 'jumlah_minimal_sampel', label: 'Jml. Min. Sampel' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    tarifColumns: ['segmen', 'golongan', 'varian', 'harga'],
  },
  pembelian_bahan: {
    label: 'Pembelian Bahan',
    mainColumns: [
      { key: 'nama_item', label: 'Nama Bahan' },
      { key: 'deskripsi', label: 'Deskripsi' },
      { key: 'satuan', label: 'Satuan' },
    ],
    tarifColumns: ['segmen', 'golongan', 'harga'],
  },
};

const TARIF_COLUMN_LABELS = {
  segmen: 'Segmen',
  golongan: 'Golongan',
  varian: 'Varian',
  jenis_jasa: 'Jenis Jasa',
  harga: 'Harga',
};

export default function LabAffiliateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lab, setLab] = useState(null);
  const [katalog, setKatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function getData() {
      try {
        setLoading(true);
        setNotFound(false);

        const [labRes, catalogRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_URL}/api/catalog`, { params: { id_affiliate: id } }),
        ]);

        if (!labRes.data.success) {
          setNotFound(true);
          return;
        }

        setLab(labRes.data.data);
        setKatalog(catalogRes.data.success ? catalogRes.data.data : []);
      } catch (err) {
        console.log(err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [id]);

  const hargaRange = (tarif = []) => {
    const nums = tarif.map((t) => Number(t.harga)).filter((n) => !isNaN(n) && n > 0);
    if (nums.length === 0) return '—';
    const min = Math.min(...nums), max = Math.max(...nums);
    return min === max ? `Rp ${convertRupiah(min)}` : `Rp ${convertRupiah(min)} – ${convertRupiah(max)}`;
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto p-6"><div className="h-40 bg-gray-100 rounded-xl animate-pulse" /></div>;
  }

  if (notFound || !lab) {
    return (
      <main className="max-w-5xl mx-auto p-6 py-20 text-center">
        <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-400">Lab affiliate tidak ditemukan</p>
      </main>
    );
  }

  // Grouping utama: per tipe_layanan (diskriminator solid dari model),
  // label section diambil dari FIELD_CONFIG. Item dengan tipe_layanan yang
  // tidak dikenali FIELD_CONFIG diabaikan (data cacat, jangan ditampilkan asal-asalan).
  const groupedByTipe = katalog.reduce((acc, v) => {
    if (!FIELD_CONFIG[v.tipe_layanan]) return acc;
    (acc[v.tipe_layanan] = acc[v.tipe_layanan] || []).push(v);
    return acc;
  }, {});

  return (
    <main className="max-w-5xl mx-auto p-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lab.nama_laboratorium}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {lab.alamat || '—'}</p>
        </div>
        <button
          onClick={() => router.push(`/affiliate/${id}/order`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition"
        >
          Mulai Order <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Layanan / Katalog */}
      <section>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Katalog Layanan</h2>

        {Object.keys(groupedByTipe).length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Lab ini belum memiliki katalog layanan</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {Object.entries(groupedByTipe).map(([tipeLayanan, items]) => {
              const config = FIELD_CONFIG[tipeLayanan];

              // sub-grouping per sub_kategori (opsional, hanya kalau memang diisi)
              const bySub = items.reduce((acc, v) => {
                const key = v.sub_kategori || '';
                (acc[key] = acc[key] || []).push(v);
                return acc;
              }, {});

              return (
                <div key={tipeLayanan} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{config.label}</p>
                  </div>

                  {Object.entries(bySub).map(([subKategori, subItems]) => (
                    <div key={subKategori || tipeLayanan}>
                      {subKategori && (
                        <div className="px-5 pt-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{subKategori}</p>
                        </div>
                      )}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              {config.mainColumns.map((col) => (
                                <th key={col.key} className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase">{col.label}</th>
                              ))}
                              <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase">Tarif</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {subItems.map((v) => (
                              <RowWithDetail
                                key={v._id}
                                v={v}
                                config={config}
                                hargaRange={hargaRange}
                                convertRupiah={convertRupiah}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sticky Mulai Order (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => router.push(`/affiliate/${id}/order`)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl"
        >
          Mulai Order <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}

// ── Baris tabel + detail tarif — dipisah jadi komponen agar fragment (<>) punya key yang valid ──
function RowWithDetail({ v, config, hargaRange, convertRupiah }) {
  return (
    <>
      <tr className="align-top">
        {config.mainColumns.map((col, ci) => (
          <td
            key={col.key}
            className={`px-4 py-3 text-xs ${ci === 0 ? 'text-sm font-medium text-gray-900' : 'text-gray-600'}`}
          >
            {v[col.key] || '—'}
          </td>
        ))}
        <td className="px-4 py-3 text-xs font-medium text-gray-800">{hargaRange(v.tarif)}</td>
      </tr>
      {v.tarif?.length > 0 && (
        <tr className="bg-gray-50/60">
          <td colSpan={config.mainColumns.length + 1} className="px-4 pb-3">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {config.tarifColumns.map((tc) => (
                      <th key={tc} className="px-3 py-2 text-left text-[11px] text-gray-500">{TARIF_COLUMN_LABELS[tc]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {v.tarif.map((t, i) => (
                    <tr key={t._id || i}>
                      {config.tarifColumns.map((tc) => (
                        <td
                          key={tc}
                          className={`px-3 py-2 text-xs ${tc === 'harga' ? 'font-medium text-gray-800' : tc === 'golongan' ? 'text-gray-800 font-medium' : 'text-gray-600'}`}
                        >
                          {tc === 'harga' ? `Rp ${convertRupiah(t.harga)}` : (t[tc] || '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}