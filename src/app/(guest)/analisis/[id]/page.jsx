'use client'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import parse from 'html-react-parser'
import { FlaskConical, Microscope, ChevronRight, ArrowRight } from 'lucide-react'

// ── Intersection Observer Hook ──
function useIntersectionObserver(options) {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const ref = useRef(null)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true)
                if (ref.current) observer.unobserve(ref.current)
            }
        }, options)
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])
    return [ref, isIntersecting]
}

// ── Reveal Component ──
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    })
    const initMap = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
    }
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible
                ? 'opacity-100 translate-y-0 translate-x-0'
                : `opacity-0 ${initMap[direction]}`
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

export default function Page({ params }) {
    const [data, setData] = useState({ title: '', sub_title: '', deskripsi: '' })
    const { id } = params

    useEffect(() => {
        async function getData() {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/content/${id}`,
                    { withCredentials: true }
                )
                if (res.data.success) setData(res.data.data)
            } catch (err) {
                alert(err.message)
            }
        }
        getData()
    }, [])

    return (
        <main className="min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-red-700 selection:text-white">

            {/* ── DOT GRID BACKGROUND (subtle, full page) ── */}
            <div
                className="fixed inset-0 opacity-[0.018] -z-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="container mx-auto px-6 md:px-12 py-10 max-w-6xl">

                {/* ── PAGE TITLE ── */}
                <Reveal>
                    <div className="mb-12 pb-10 border-b border-gray-100">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-100 bg-red-50/40 rounded-full mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
                            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-red-700">
                                Detail Instrumen
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-3">
                            {data?.title || '—'}
                        </h1>
                        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400">
                            Laboratorium Kimia Instrumen · UPI
                        </p>
                    </div>
                </Reveal>

                {/* ── DESKRIPSI ALAT ── */}
                <section className="mb-20">
                    <Reveal>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-700">
                                <Microscope size={16} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                                Deskripsi Alat
                            </h2>
                            <div className="flex-1 h-px bg-zinc-100" />
                        </div>
                    </Reveal>

                    <div className="grid lg:grid-cols-5 gap-10 items-start">

                        {/* Foto — 2 kolom */}
                        <Reveal direction="right" className="lg:col-span-2">
                            <div className="sticky top-28">
                                {/* Foto utama */}
                                <div className="rounded-3xl overflow-hidden bg-zinc-50 border border-gray-100 shadow-lg shadow-zinc-900/5 mb-5">
                                    {data?.foto ? (
                                        <div className="relative aspect-square">
                                            <Image
                                                alt={data.title || 'Instrumen'}
                                                src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${data.foto}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                                style={{ objectFit: 'cover' }}
                                                className="hover:scale-105 transition duration-700"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square flex items-center justify-center bg-zinc-100">
                                            <FlaskConical size={48} className="text-zinc-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Info card di bawah foto */}
                                <div className="bg-zinc-50 border border-gray-100 rounded-2xl p-5">
                                    <p className="text-sm font-bold text-zinc-900 mb-1">{data?.title || '—'}</p>
                                    <div className="text-[11px] text-zinc-500 leading-relaxed prose prose-sm max-w-none
                    prose-p:my-1 prose-p:text-zinc-500">
                                        {data?.sub_title ? parse(data.sub_title) : null}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Deskripsi — 3 kolom */}
                        <Reveal delay={100} direction="left" className="lg:col-span-3">
                            <div className="prose prose-zinc max-w-none
                prose-headings:font-bold prose-headings:text-zinc-900 prose-headings:tracking-tight
                prose-h2:text-2xl prose-h3:text-lg
                prose-p:text-zinc-500 prose-p:leading-relaxed prose-p:font-light prose-p:text-[15px]
                prose-li:text-zinc-500 prose-li:text-sm prose-li:leading-relaxed
                prose-strong:text-zinc-700 prose-strong:font-semibold
                prose-ul:space-y-1
                prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
              ">
                                {data?.deskripsi ? parse(data.deskripsi) : (
                                    <p className="text-zinc-300 italic text-sm">Deskripsi belum tersedia.</p>
                                )}
                            </div>

                            {/* CTA inline */}
                            <div className="mt-10 pt-8 border-t border-zinc-100 flex flex-wrap items-center gap-4">

                                <a href="/order_analisis"
                                    className="bg-zinc-900 text-white px-7 py-3 rounded-full font-semibold text-[11px] tracking-widest uppercase transition-all hover:bg-red-700 shadow-lg shadow-zinc-900/10"
                                >
                                    Pesan Analisis
                                </a>

                                <a href="/analisis"
                                    className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 hover:text-red-700 uppercase tracking-[0.25em] transition-all"
                                >
                                    Lihat Semua Layanan
                                    <ArrowRight size={12} />
                                </a>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ── CONTOH HASIL PENGUJIAN ── */}
                <section className="mb-20">
                    <Reveal>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-700">
                                <FlaskConical size={16} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                                Contoh Hasil Pengujian
                            </h2>
                            <div className="flex-1 h-px bg-zinc-100" />
                        </div>
                    </Reveal>

                    <Reveal delay={100}>
                        <div className="bg-zinc-50 border border-gray-100 rounded-3xl overflow-hidden shadow-lg shadow-zinc-900/5 p-6 md:p-10">
                            {data?.contoh_hasil ? (
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white">
                                    <Image
                                        alt="Contoh hasil pengujian"
                                        src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${data.contoh_hasil}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 80vw"
                                        style={{ objectFit: 'contain' }}
                                        className="hover:scale-[1.02] transition duration-700"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video rounded-2xl bg-zinc-100 flex items-center justify-center">
                                    <span className="text-zinc-300 text-sm italic">Contoh hasil belum tersedia.</span>
                                </div>
                            )}

                            {/* Caption */}
                            <div className="mt-5 flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
                                <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-zinc-400">
                                    Output Representatif · {data?.title || 'Instrumen'}
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </section>

            </div >
        </main >
    )
}