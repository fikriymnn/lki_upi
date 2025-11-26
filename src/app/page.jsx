"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Microscope, FileText, FlaskConical } from "lucide-react";
import Heroo from "../components/Heroo";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Heroo />
      </motion.div>

      {/* INTRO TEXT */}
      <section className="mx-auto md:pt-16 pt-16 pb-14 bg-gray-50 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:text-4xl text-3xl font-bold text-slate-800 tracking-tight"
        >
          Layanan Kami
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-gray-600 mt-4 max-w-2xl mx-auto md:text-lg text-sm"
        >
          Mendukung pendidikan, penelitian, dan pengembangan kompetensi melalui layanan profesional.
        </motion.p>
      </section>

      {/* LAYANAN GRID */}
      <section className="mx-auto md:pb-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:px-16 px-4">
          {[
            {
              icon: <Microscope className="text-red-600 w-14 h-14" />,
              title: "Layanan Analisis",
              desc: "Pengujian sampel dengan instrumen laboratorium bersertifikasi.",
              link: "/analisis"
            },
            {
              icon: <FileText className="text-red-600 w-14 h-14" />,
              title: "Sertifikasi",
              desc: "Pelatihan dan sertifikasi resmi berbasis kompetensi.",
              link: "/sertifikasi"
            },
            {
              icon: <FlaskConical className="text-red-600 w-14 h-14" />,
              title: "Pelatihan",
              desc: "Workshop dan pelatihan penggunaan instrumen kimia.",
              link: "/pelatihan"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-lg transition bg-white flex flex-col items-center text-center px-6 py-8 shadow-sm border border-gray-100 hover:shadow-xl"
            >
              {item.icon}
              <h3 className="font-semibold text-xl mt-6 mb-3 text-slate-800">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-xs">{item.desc}</p>
              <a href={item.link} className="w-full">
                <button className="w-full text-red-600 font-semibold text-sm py-3 rounded-lg">
                  Selengkapnya
                </button>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section className="mx-auto md:py-24 py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4 md:px-20 grid md:grid-cols-2 md:gap-20 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative md:h-[420px] h-[360px] rounded-sm overflow-hidden shadow-xl"
          >
            <Image
              src="https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Laboratorium Kimia"
              fill
              style={{ objectFit: "cover" }}
              className="hover:scale-105 transition duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="md:text-4xl text-3xl md:text-left text-center font-bold text-slate-800 mb-6">Tentang Kami</h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-justify md:text-base text-sm">
              Laboratorium Kimia Instrumen (LKI) merupakan unit akademik di Prodi Kimia Universitas Pendidikan Indonesia yang
              menyediakan layanan pengujian, pelatihan, dan sertifikasi bagi civitas akademika dan masyarakat umum.
            </p>

            <ul className="space-y-4">
              {[
                "Analisis sampel profesional dan akurat",
                "Pelatihan instrumen laboratorium berbasis praktik",
                "Program sertifikasi kompetensi resmi"
              ].map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center"
                >
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-800 mr-3 text-xs">✓</span>
                  <span className="md:text-base text-xs">{point}</span>
                  
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA
      <div className="bg-red-700 py-8 md:p-16 text-center text-white shadow-2xl">
        <h3 className="text-3xl md:text-3xl font-bold mb-4">Coba Layanan Pengujian?</h3>
        <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
          Tim kami siap membantu Anda mendapatkan hasil analisis terbaik
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/analisis"
            className="bg-white text-red-600 px-8 py-4 rounded-sm font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Pesan Sekarang
          </a>
          <a
            href="/contact"
            className="bg-red-800 text-white px-8 py-4 rounded-sm font-bold text-lg shadow-lg transition-all duration-300"
          >
            Konsultasi Gratis
          </a>
        </div>
      </div> */}
    </>
  );
}
