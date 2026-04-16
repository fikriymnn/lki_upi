"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  FlaskConical,
  Award,
  BookOpen,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Microscope,
  FileText,
  CheckCircle2,
} from "lucide-react";

// --- Hooks ---

const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

// --- Reveal Component ---

function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  const initMap = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${isVisible
        ? "opacity-100 translate-y-0 translate-x-0"
        : `opacity-0 ${initMap[direction]}`
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// --- Parallax Component ---

function Parallax({
  children,
  speed = 0.1,
  clamp = false,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerY = window.innerHeight / 2;
        let offset = (rect.top + rect.height / 2 - centerY) * speed;
        if (clamp) offset = Math.max(Math.min(offset, 100), -100);
        ref.current.style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, clamp]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

// --- Data ---

const slides = [
  {
    title: "Laboratorium",
    highlight: "Kimia Instrumen.",
    desc: "Membuka layanan pengujian profesional untuk dosen, mahasiswa, dan masyarakat umum dengan akurasi terjamin.",
    icon: <FlaskConical size={40} className="text-red-700" />,
    tag: "Pengujian & Analisis",
  },
  {
    title: "Presisi Analisis",
    highlight: "Berstandar Tinggi.",
    desc: "Instrumen mutakhir yang terkalibrasi secara berkala untuk memastikan hasil valid dan dapat diandalkan.",
    icon: <Award size={40} className="text-red-700" />,
    tag: "Kualitas Terjamin",
  },
  {
    title: "Pelatihan &",
    highlight: "Sertifikasi Resmi.",
    desc: "Tingkatkan kompetensi melalui workshop intensif dan sertifikasi penggunaan instrumen kimia bersama ahli.",
    icon: <BookOpen size={40} className="text-red-700" />,
    tag: "Edukasi Kompetensi",
  },
];

const services = [
  {
    icon: <Microscope size={22} strokeWidth={1.5} />,
    title: "Layanan Analisis",
    desc: "Pengujian sampel dengan instrumen laboratorium bersertifikasi dan metode analisis yang tervalidasi.",
    link: "/analisis",
    cta: "Book Now",
    delay: 100,
    offset: "md:mt-0",
  },
  {
    icon: <FileText size={22} strokeWidth={1.5} />,
    title: "Sertifikasi",
    desc: "Pelatihan dan sertifikasi resmi berbasis kompetensi untuk kualifikasi profesional di bidang kimia.",
    link: "/sertifikasi",
    cta: "Explore",
    delay: 200,
    offset: "md:mt-16",
  },
  {
    icon: <FlaskConical size={22} strokeWidth={1.5} />,
    title: "Pelatihan",
    desc: "Workshop teknis penggunaan instrumen kimia modern oleh tenaga ahli berpengalaman.",
    link: "/pelatihan",
    cta: "Join Program",
    delay: 300,
    offset: "md:mt-32",
  },
];

const aboutPoints = [
  "Analisis sampel profesional dan akurat",
  "Pelatihan instrumen laboratorium berbasis praktik",
  "Program sertifikasi kompetensi resmi",
];

const qualities = [
  { title: "Akurasi", desc: "Hasil uji tervalidasi" },
  { title: "Modern", desc: "Instrumen terbaru" },
  { title: "Ahli", desc: "Tenaga profesional" },
  { title: "Cepat", desc: "Efisiensi waktu" },
];

// --- Main Page ---

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Navbar scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-red-700 selection:text-white">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white hero-gradient pt-12">
        {/* Decorative circles */}
        <Parallax
          speed={-0.05}
          className="absolute top-1/4 left-1/4 -z-10 pointer-events-none"
        >
          <div className="w-64 h-64 border border-red-100 rounded-full opacity-40" />
        </Parallax>
        <Parallax
          speed={0.08}
          className="absolute bottom-1/4 right-1/4 -z-10 pointer-events-none"
        >
          <div className="w-96 h-96 border border-gray-100 rounded-full opacity-60" />
        </Parallax>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02] -z-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-6 text-center z-10">
          {/* Slide area */}
          <div className="max-w-4xl mx-auto relative min-h-[400px] flex flex-col items-center justify-center">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${idx === currentSlide
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-95 z-0 pointer-events-none"}`}
              >
                {/* Tag badge */}
                <div className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 border border-red-100 bg-red-50/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
                  <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-red-700">
                    {slide.tag}
                  </span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.1] mb-8 text-zinc-900">
                  {slide.title} <br />
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500 to-zinc-400">
                    {slide.highlight}
                  </span>
                </h1>

                <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                  {slide.desc}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">

                  <a href="#layanan"
                    className="bg-zinc-900 text-white px-10 py-4 rounded-full font-semibold text-[11px] tracking-widest uppercase transition-all hover:bg-red-700 shadow-xl shadow-zinc-900/10"
                  >
                    Mulai Eksplorasi
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="mt-20 flex flex-col items-center gap-8">
            <div className="flex items-center gap-12">
              <button
                onClick={prevSlide}
                className="text-zinc-300 hover:text-red-700 transition-colors p-2"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>

              <div className="flex gap-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`group relative h-[2px] transition-all duration-500 ${idx === currentSlide
                      ? "w-12 bg-red-700"
                      : "w-4 bg-zinc-100 hover:bg-zinc-200"
                      }`}
                  >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="text-zinc-300 hover:text-red-700 transition-colors p-2"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-px h-12 bg-gradient-to-b from-red-700 to-transparent" />
              <span className="text-[8px] font-semibold tracking-[0.4em] uppercase text-zinc-300">
                Scroll
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section
        id="layanan"
        className="py-32 relative z-20 bg-white border-y border-gray-50"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-24 text-center">
            <Reveal className="max-w-xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-zinc-900">
                Layanan{" "}
                <span className="font-extrabold text-red-700">Presisi</span>
              </h2>
              <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-semibold">
                Standardisasi Kualitas Penelitian
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {services.map((svc, i) => (
              <Reveal key={i} delay={svc.delay} className={svc.offset}>
                <div className="group p-12 rounded-[2rem] bg-zinc-50 border border-transparent hover:border-red-100 hover:bg-white transition-all duration-700 hover:shadow-2xl hover:shadow-red-900/5 flex flex-col h-full">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm text-red-700">
                    {svc.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-zinc-900 tracking-tight">
                    {svc.title}
                  </h3>
                  <p className="text-zinc-500 mb-10 flex-grow leading-relaxed text-sm font-light">
                    {svc.desc}
                  </p>
                  <div className="h-[1px] w-full bg-zinc-100 group-hover:bg-red-100 transition-colors mb-6" />
                  <a href={svc.link}
                    className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-hover:text-red-700 uppercase tracking-[0.25em] transition-all"
                  >
                    {svc.cta}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section
        id="tentang"
        className="py-40 relative overflow-hidden bg-white text-zinc-900"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left — image / decorative */}
            <div className="relative">
              <Parallax speed={0.05}>
                <div className="aspect-[4/5] bg-zinc-50 rounded-[4rem] relative overflow-hidden border border-gray-100">
                  <Image
                    src="https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Laboratorium Kimia"
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-105 transition duration-700"
                  />
                </div>
              </Parallax>

              <Parallax
                speed={-0.1}
                className="absolute -bottom-10 -right-10 p-10 bg-white border border-gray-100 rounded-3xl shadow-2xl hidden md:block"
              >
                <div className="text-5xl font-extrabold text-red-700 mb-2">
                  400+
                </div>
                <div className="text-[9px] font-semibold tracking-[0.3em] text-zinc-400 uppercase">
                  Hasil Analisis
                </div>
              </Parallax>
            </div>

            {/* Right — text */}
            <div>
              <Reveal>
                <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-10 text-zinc-900 leading-tight">
                  Ekselensi Dalam <br />
                  <span className="font-extrabold text-red-700">
                    Analisis Kimia
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-zinc-500 text-lg leading-relaxed mb-12 font-light">
                  Laboratorium Kimia Instrumen (LKI) merupakan unit akademik di
                  Prodi Kimia Universitas Pendidikan Indonesia yang menyediakan
                  layanan pengujian, pelatihan, dan sertifikasi bagi civitas
                  akademika dan masyarakat umum.
                </p>
              </Reveal>

              {/* Checklist */}
              <ul className="space-y-4 mb-12">
                {aboutPoints.map((point, i) => (
                  <Reveal key={i} delay={200 + i * 100} direction="left">
                    <li className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-50 text-red-700 text-xs font-bold shrink-0">
                        ✓
                      </span>
                      <span className="text-zinc-700 text-sm">{point}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>

              {/* Quality grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                {qualities.map((item, idx) => (
                  <Reveal key={idx} delay={400 + idx * 100}>
                    <div className="group border-l-[3px] border-zinc-100 hover:border-red-700 pl-6 transition-all">
                      <div className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-red-700 transition-colors">
                        {item.title}
                      </div>
                      <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="pesan"
        className="py-32 relative bg-zinc-900 overflow-hidden rounded-[4rem] mx-6 mb-6"
      >
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />
        <><div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-700/10 rounded-full blur-3xl pointer-events-none" /><div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-light mb-8 text-white tracking-tighter">
              Hasil Uji yang{" "}
              <span className="font-extrabold text-red-600 italic">
                Dapat Dipercaya
              </span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-zinc-500 text-lg mb-14 max-w-2xl mx-auto font-light">
              Konsultasikan kebutuhan analisis laboratorium Anda dengan tim ahli
              kami sekarang.
            </p>
          </Reveal>
          <Reveal delay={200}>

            <a href="/analisis"
              className="inline-block bg-red-700 text-white hover:bg-white hover:text-zinc-900 px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.35em] transition-all duration-500 shadow-2xl"
            >
              Pesan Sekarang
            </a>
          </Reveal>
        </div></>
      </section>
    </div>
  );
}