"use client";
import { useState, useEffect } from 'react';
import {
  Package,
  Users,
  Microscope,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import axios from 'axios';

const portals = [
    {
    title: 'Layanan Analisis',
    description: 'Pengajuan, pemantauan, dan pelaporan layanan analisis kimia instrumen.',
    link: '/panel/portal/analisis/admin',
    icon: Microscope,
    stats: '24 Antrian Aktif',
    color: 'from-rose-500 to-rose-600',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    ringColor: 'group-hover:ring-rose-500/20',
  },
  {
    title: 'Inventory',
    description: 'Manajemen stok, reagen, peralatan, dan aset laboratorium secara terpadu.',
    link: '#',
    icon: Package,
    stats: '1,240 Item Tersedia',
    color: 'from-red-500 to-red-600',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    ringColor: 'group-hover:ring-red-500/20',
  },
  {
    title: 'Affiliate',
    description: 'Kelola program kemitraan, affiliasi, dan jaringan kolaborasi laboratorium.',
    link: '#',
    icon: Users,
    stats: '12 Partner Institusi',
    color: 'from-gray-800 to-gray-900',
    lightColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    ringColor: 'group-hover:ring-gray-500/20',
  },
];

export default function PortalPage() {
  const [hovered, setHovered] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState(null);

  // ── Fetch user data on mount ──
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/panel';
          return;
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const user = res.data.data;

          // ── Validasi role: hanya admin yang boleh akses ──
          if (user.role !== 'admin') {
            window.location.href = '/panel';
            return;
          }

          setUserData(user);
        } else {
          window.location.href = '/panel';
        }
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
        window.location.href = '/panel';
      }
    };

    fetchUser();
  }, []);

  // ── Logout ──
  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar?')) return;

    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');

      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
        withCredentials: true,
      });

      window.dispatchEvent(new Event('authChange'));
      window.location.href = '/panel';
    } catch (err) {
      console.error('Logout error:', err);
      // Tetap redirect meski API gagal, karena token sudah dihapus
      window.location.href = '/panel';
    }
  };

  // ── Ambil inisial nama untuk avatar ──
  const getInitial = (nama) => {
    if (!nama) return 'A';
    return nama.charAt(0).toUpperCase();
  };

  // ── Format role untuk tampilan ──
  const formatRole = (role) => {
    if (!role) return 'Administrator';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // ── Jangan render apapun sebelum validasi selesai ──
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Hero Section */}
      <div className="relative bg-[#b91c1c] overflow-hidden pb-14 md:pb-16">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[60%] rounded-full bg-red-500/20 blur-[100px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-black/20 blur-[100px]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <div className="p-2">
            <img
              src="/icon/upi-white.png"
              alt="UPI Logo"
              className="w-32 md:w-40 object-contain"
            />
          </div>
          <div className="flex-1 max-w-lg" />
          <div className="flex items-center space-x-4 ml-6 p-4">

            {/* Dropdown Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold border border-red-400">
                  {getInitial(userData?.nama_lengkap)}
                </div>

                {/* Nama & Role */}
                <div>
                  <p className="text-sm font-bold text-gray-100">
                    {userData?.nama_lengkap ?userData?.nama_lengkap: '...'}
                  </p>
                  <p className="text-xs text-white">
                    {formatRole(userData?.role)}
                  </p>
                </div>

                {/* Chevron Toggle */}
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="focus:outline-none"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-red-200 transition-transform duration-200 ${
                      showUserDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Dropdown Menu Items */}
              {showUserDropdown && (
                <>
                  {/* Overlay click outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserDropdown(false)}
                  />

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Keluar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto pt-4 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Portal Dashboard <br />
            <span className="text-red-200">Lab Kimia Instrumen</span>
          </h1>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 -mt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, i) => {
            const Icon = portal.icon;
            return (
              
              <a  key={i}
                href={portal.link}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative bg-white rounded-3xl p-8 shadow-sm border border-gray-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col ring-8 ring-transparent ${portal.ringColor}`}
              >
                {/* Icon Header */}
                <div
                  className={`w-14 h-14 rounded-2xl ${portal.lightColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <Icon className={`w-7 h-7 ${portal.textColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm mb-6">
                    {portal.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col"></div>

                  {portal.link === '#' ? (
                    <p>Under Development</p>
                  ) : (
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 ${portal.textColor} group-hover:bg-gradient-to-r ${portal.color} group-hover:text-white transition-all duration-300 shadow-inner`}
                    >
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>

                {/* Subtle Glow Effect on Hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-[0.01] transition-opacity`}
                />
              </a>
            );
          })}
        </div>

        {/* Support Text */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-200"></span>
            Oleh Lab Kimia Instrumen UPI
            <span className="w-8 h-[1px] bg-gray-200"></span>
          </p>
        </div>
      </div>
    </div>
  );
}