"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, FlaskConical } from "lucide-react";
import Image from "next/image";

// --- Card Component ---

function CardAlat({ id, nama, foto }) {
  return (
    <Link href={`/analisis/${id}`}>
      <div className="group flex flex-col rounded-[2rem] bg-zinc-50 border border-transparent hover:border-red-100 hover:bg-white transition-all duration-700 hover:shadow-2xl hover:shadow-red-900/5 overflow-hidden h-full">

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          {foto ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${foto}`} 
                    width={0} 
                    height={0} 
                    sizes='100vw' 
                    alt={nama}
                    className='w-full h-full object-cover'
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FlaskConical size={40} strokeWidth={1} className="text-zinc-200" />
            </div>
          )}

          {/* Badge overlay */}
          <div className="absolute top-4 left-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
              <span className="text-[8px] font-semibold tracking-[0.2em] uppercase text-red-700">
                Instrumen
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-3 leading-snug">
            {nama}
          </h3>
          <p className="text-zinc-400 text-sm font-light leading-relaxed flex-1 mb-6">
            Tersedia untuk pemesanan analisis profesional dan tervalidasi.
          </p>

          <div className="h-[1px] w-full bg-zinc-100 group-hover:bg-red-100 transition-colors mb-5" />

          <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-hover:text-red-700 uppercase tracking-[0.25em] transition-all">
            Pesan Sekarang
            <ArrowRight
              size={13}
              className="group-hover:translate-x-2 transition-transform"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

// --- Main Component ---

export default function AnalisisComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/content?resize=true`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-red-700 selection:text-white">

      {/* ── HEADER SECTION ── */}
      <section className="relative pt-24 pb-16 px-6 md:px-12 border-b border-gray-50">
        <div
          className="absolute inset-0 opacity-[0.02] -z-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 border border-red-100 rounded-full opacity-30 -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-light tracking-tight leading-[1.1] text-zinc-900">
            Daftar Alat <br />
            <span className="font-extrabold text-red-700">Laboratorium.</span>
          </h1>
        </div>
      </section>

      {/* ── GRID SECTION ── */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="w-px h-16 bg-gradient-to-b from-red-700 to-transparent" />
              <div className="w-8 h-8 rounded-full border border-zinc-100 border-t-red-700 animate-spin" />
              <span className="text-[8px] font-semibold tracking-[0.4em] uppercase text-zinc-300">
                Memuat Data...
              </span>
            </div>
          )}

          {/* Empty State */}
          {!loading && data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center border border-zinc-100">
                <FlaskConical size={28} strokeWidth={1} className="text-zinc-300" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-900 mb-2">
                  Belum Ada Instrumen
                </p>
                <p className="text-sm text-zinc-400 font-light">
                  Silakan cek kembali nanti
                </p>
              </div>
              <div className="h-[1px] w-16 bg-zinc-100" />
            </div>
          )}

          {/* Cards Grid */}
          {!loading && data.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {data.map((v) => (
                <CardAlat key={v._id} id={v._id} nama={v.title} foto={v.foto} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}