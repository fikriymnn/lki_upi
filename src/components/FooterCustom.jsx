"use client";
import React from "react";
import {  MapPin,
  Phone,
  Mail,
  Instagram,
  Menu} from "lucide-react"
import { usePathname } from "next/navigation";
function FooterCustom() {
  const pathname = usePathname();

  if(pathname.startsWith("/panel")) {
    return null;
  }

  return (
      <footer
        id="kontak"
        className="bg-white pt-32 pb-12 border-t border-gray-100"
      >
        <div className="container mx-auto px-6 md:px-12">
          {/* Top row */}
          <div className="flex flex-col items-center mb-16">
            <div className="w-36 flex items-center justify-center rounded-2xl font-black text-xl mb-8">
              <img src="UPI.png"/>
            </div>
            <p className="text-zinc-400 text-sm font-light text-center max-w-sm leading-relaxed">
              Laboratorium Kimia Instrumen UPI — Mendukung riset dan pendidikan
              kimia di Indonesia.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-10 mb-12 text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-400">
            <a href="#layanan" className="hover:text-red-700 transition-colors">
              Analisis
            </a>
            <a href="#layanan" className="hover:text-red-700 transition-colors">
              Sertifikasi
            </a>
            <a href="#layanan" className="hover:text-red-700 transition-colors">
              Pelatihan
            </a>
            <a href="#tentang" className="hover:text-red-700 transition-colors">
              Tentang
            </a>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin size={14} className="text-red-700" />
              Jl. Dr. Setiabudhi No.229, Bandung
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Phone size={14} className="text-red-700" />
              (022) 2013163
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Mail size={14} className="text-red-700" />
              lki@upi.edu
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Instagram size={14} className="text-red-700" />
              @lki.upi
            </div>
          </div>

          <div className="h-[1px] w-full max-w-4xl mx-auto bg-zinc-50 mb-8" />

          <p className="text-zinc-300 text-[9px] font-semibold tracking-widest uppercase text-center">
            &copy; {new Date().getFullYear()} Laboratorium Kimia Instrumen UPI
          </p>
        </div>
      </footer>
  );
}

export default FooterCustom;
