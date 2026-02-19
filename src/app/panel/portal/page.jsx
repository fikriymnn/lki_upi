"use client";
import { useState } from 'react';
import { FlaskConical, Beaker, Atom, ChevronRight, BarChart3, Package, Users, Microscope, Activity, ArrowUpRight } from 'lucide-react';

const portals = [
  {
    title: 'Inventory',
    description: 'Manajemen stok, reagen, peralatan, dan aset laboratorium secara terpadu.',
    link: '/panel/dashboard',
    icon: Package,
    badge: 'Aktif',
    stats: 'Kelola Stok & Aset',
    color: 'from-red-500 to-red-700',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-100',
  },
  {
    title: 'Layanan Analisis',
    description: 'Pengajuan, pemantauan, dan pelaporan layanan analisis kimia instrumen.',
    link: '/analisis',
    icon: Microscope,
    badge: 'Aktif',
    stats: 'Analisis & Reporting',
    color: 'from-red-600 to-rose-800',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-100',
  },
  {
    title: 'Affiliate',
    description: 'Kelola program kemitraan, affiliasi, dan jaringan kolaborasi laboratorium.',
    link: '/affiliate',
    icon: Users,
    badge: 'Aktif',
    stats: 'Partner & Kolaborasi',
    color: 'from-red-700 to-red-900',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-100',
  },
];

export default function PortalPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-80px] right-[-40px] w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full" />

        {/* Floating Icons */}
        <div className="absolute top-8 right-20 bg-white/10 backdrop-blur-sm rounded-2xl p-3 rotate-12 shadow-lg hidden md:block">
          <Beaker className="w-6 h-6 text-white/70" />
        </div>
        <div className="absolute bottom-10 left-16 bg-white/10 backdrop-blur-sm rounded-2xl p-3 -rotate-6 shadow-lg hidden md:block">
          <Atom className="w-6 h-6 text-white/70" />
        </div>
        <div className="absolute top-1/2 right-10 bg-white/10 backdrop-blur-sm rounded-2xl p-2 rotate-3 shadow-lg hidden md:block">
          <FlaskConical className="w-5 h-5 text-white/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl p-5 shadow-2xl">
              <img
                src="/icon/upi-white.png"
                alt="UPI Logo"
                className="w-24 object-contain mx-auto"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Portal Dashboard <br />
            <span className="text-red-200">Lab Kimia Instrumen</span>
          </h1>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal, i) => {
            const Icon = portal.icon;
            const isHovered = hovered === i;
            return (
              <a
                key={i}
                href={portal.link}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                style={{ transform: isHovered ? 'translateY(-4px)' : 'none' }}
              >
                {/* Top gradient accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${portal.color}`} />

                <div className="p-7 flex flex-col flex-1">
                  {/* Text */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{portal.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{portal.description}</p>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">{portal.stats}</span>
                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${portal.textColor} group-hover:gap-2.5 transition-all`}>
                      Buka
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}