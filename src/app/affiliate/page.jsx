"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Search, FlaskConical, MapPin, ArrowRight } from 'lucide-react';

// ── Label tampilan untuk enum tipe_layanan dari Catalog — harus match enum di Catalog model ──
const TIPE_LABEL = {
  sewa_alat: 'Sewa Alat',
  sewa_lab: 'Sewa Lab',
  layanan_analisis: 'Layanan Analisis',
  pembelian_bahan: 'Pembelian Bahan',
};

export default function LayananAffiliatePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/public`);
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const filtered = data.filter((v) => v.nama_laboratorium.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="pb-16">
      {/* Hero */}
      <div className="flex md:h-[50vh] h-[35vh] w-full">
        <Image alt="" src="/carousel.jpg" width={0} height={0} sizes="100vw"
          className="md:h-[50vh] h-[35vh] w-full object-cover object-center" />
        <div className="bg-neutral-900 bg-opacity-80 w-full md:h-[50vh] h-[35vh] absolute flex flex-col justify-center items-center px-4">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-3 text-white text-center">
            Layanan <span className="font-extrabold text-red-700">Lab Affiliate</span>
          </h2>
          <p className="text-white text-sm md:text-base text-center max-w-xl">
            Akses layanan analisis, sewa lab, dan pembelian bahan dari jaringan laboratorium mitra kami
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-8 px-4">

        {/* Search */}
        <div className="relative max-w-md mx-auto mt-10 mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Cari nama laboratorium..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
          />
        </div>

        {/* List Lab Affiliate */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((lab) => (
              <Link key={lab._id} href={`/affiliate/${lab._id}`}
                className="group p-5 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition bg-white flex flex-col"
              >
                <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                  <FlaskConical className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-1">{lab.nama_laboratorium}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {lab.alamat || '—'}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lab.jenis_layanan_aktif.length > 0 ? lab.jenis_layanan_aktif.map((j) => (
                    <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full">{TIPE_LABEL[j] || j}</span>
                  )) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[11px] rounded-full">Belum ada katalog</span>
                  )}
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-medium text-red-700 group-hover:gap-2 transition-all">
                  Lihat Katalog <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Tidak ada lab affiliate ditemukan</p>
          </div>
        )}

        {/* Copywriting */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-bold text-red-700 mb-4">Apa itu Layanan Lab Affiliate?</p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Layanan Lab Affiliate adalah jaringan laboratorium mitra yang membuka akses pengujian, sewa fasilitas,
            dan penyediaan bahan kimia untuk mahasiswa, peneliti, maupun industri. Setiap laboratorium memiliki
            katalog layanan, alat, dan tarif masing-masing — sehingga Anda dapat memilih laboratorium yang paling
            sesuai dengan kebutuhan dan lokasi Anda, lalu mengajukan permintaan order langsung melalui platform ini.
          </p>
        </div>
      </div>
    </main>
  );
}