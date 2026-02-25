"use client";
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Package, AlertCircle, TrendingUp, BarChart3, Settings, Box, Wrench, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import Sidebar from '@/components/inventory/Sidebar';
import AlatPage from './Alat';
import BahanPage from './Bahan';
import PeminjamanBahanPage from './PeminjamanBahan';
import PeminjamanAlatPage from './PeminjamanAlat';
import RiwayatPage from './Riwayat';
import SupplierPage from './Supplier';
import LaporanPage from './Laporan';
import PenggunaPage from './Pengguna';
import Penyimpanan from './Penyimpanan';
import MasterPeminjamPage from './Peminjam';
import AlatRusakPage from './AlatRusak';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showUserDropdown, setShowUserDropdown] = useState(false); // NEW: state untuk dropdown

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={() => { }}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-red-600 border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg" />
            <div className="flex items-center space-x-4 ml-6">
              <p className="text-white font-bold text-xl">INVENTORY SYSTEM</p>

              {/* Dropdown Menu */}
              <div className="relative">
                <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold border border-red-400">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-100">Admin Lab</p>
                    <p className="text-xs text-white">Administrator</p>
                  </div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="focus:outline-none"
                  >
                    <ChevronDown className={`w-4 h-4 text-red-200 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
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
                      {/* Profile Option */}
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActivePage('pengguna'); // Arahkan ke halaman profil/profile
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-red-600">A</span>
                        </div>
                        <span>Profil Saya</span>
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      {/* Logout Option */}
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          // Handle logout logic here
                          if (confirm('Apakah Anda yakin ingin keluar?')) {
                            // Redirect to login page or clear session
                            window.location.href = '/login';
                          }
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
        </header>
        <main className="flex-1 overflow-y-auto">
          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'alat' && <AlatPage />}
          {activePage === 'bahan' && <BahanPage />}
          {activePage === 'peminjaman-bahan' && <PeminjamanBahanPage />}
          {activePage === 'peminjaman-alat' && <PeminjamanAlatPage />}
          {activePage === 'riwayat' && <RiwayatPage />}
          {activePage === 'alat-rusak' && <AlatRusakPage />}
          {activePage === 'master-supplier' && <SupplierPage />}
          {activePage === 'laporan' && <LaporanPage />}
          {activePage === 'master-lokasi' && <Penyimpanan />}
          {activePage === 'pengguna' && <PenggunaPage />}
          {activePage === 'master-peminjam' && <MasterPeminjamPage />}
        </main>
      </div>
    </div>
  );
};

// ── Mini bar chart (pure CSS/SVG, no external lib) ──────────────────────────
const MiniBarChart = ({ data, colorClass }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-t-sm ${colorClass} opacity-80 hover:opacity-100 transition-all`}
            style={{ height: `${(d.value / max) * 52}px`, minHeight: d.value > 0 ? '4px' : '0' }}
            title={`${d.label}: ${d.value}`}
          />
        </div>
      ))}
    </div>
  );
};

// ── Sparkline SVG ─────────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#ef4444', width = 120, height = 36 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="3" fill={color} />
    </svg>
  );
};

// ── Stock level bar ───────────────────────────────────────────────────────
const StockBar = ({ current, max, color }) => {
  const pct = Math.min((current / max) * 100, 100);
  const barColor = pct <= 20 ? 'bg-red-500' : pct <= 40 ? 'bg-orange-400' : color;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`${barColor} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
};

// ── Dashboard Content ─────────────────────────────────────────────────────
const DashboardContent = () => {

  // ── Trend data (6 bulan terakhir) ──
  const months = ['Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb'];

  const trendAlatData = [
    { label: 'Sep', value: 8 },
    { label: 'Okt', value: 12 },
    { label: 'Nov', value: 9 },
    { label: 'Des', value: 15 },
    { label: 'Jan', value: 11 },
    { label: 'Feb', value: 14 },
  ];

  const trendBahanData = [
    { label: 'Sep', value: 5 },
    { label: 'Okt', value: 9 },
    { label: 'Nov', value: 13 },
    { label: 'Des', value: 10 },
    { label: 'Jan', value: 16 },
    { label: 'Feb', value: 12 },
  ];

  const terlambatData = [
    { label: 'Sep', value: 1 },
    { label: 'Okt', value: 3 },
    { label: 'Nov', value: 2 },
    { label: 'Des', value: 4 },
    { label: 'Jan', value: 2 },
    { label: 'Feb', value: 1 },
  ];

  // sparkline raw values
  const alatSpark = trendAlatData.map(d => d.value);
  const bahanSpark = trendBahanData.map(d => d.value);

  // ── Stok kritis ──
  const stokAlatKritis = [
    { name: 'Erlenmeyer', spesifikasi: '25 ml', jumlah: 1, maks: 10, penyimpanan: 'Lemari Kanan' },
    { name: 'Buret Kolom', spesifikasi: 'sedang', jumlah: 2, maks: 8, penyimpanan: 'Rak 1' },
    { name: 'Labu Ukur', spesifikasi: '100 ml', jumlah: 3, maks: 12, penyimpanan: 'Rak 2' },
  ];

  const stokBahanKritis = [
    { name: 'Terte-butylamine', rumus: 'C4H11N', jumlah: 900, maks: 5000, satuan: 'mL', penyimpanan: 'Rak 3' },
    { name: 'Natrium Hidroksida', rumus: 'NaOH', jumlah: 800, maks: 5000, satuan: 'g', penyimpanan: 'Lemari Penyimpanan' },
    { name: 'HCl', rumus: 'HCl', jumlah: 400, maks: 3000, satuan: 'mL', penyimpanan: 'Lemari Kuning' },
  ];

  // ── Peminjaman aktif terbaru ──
  const peminjamanAktif = [
    { nama: 'Ahmad Fauzi', jenis: 'Alat', item: 'Buret 10 ml', tgl: '2024-03-05', deadline: '2024-03-15', status: 'Dipinjam' },
    { nama: 'Rizki Ramadhan', jenis: 'Bahan', item: 'Carbon disulfide', tgl: '2024-03-08', deadline: '2024-03-18', status: 'Dipinjam' },
    { nama: 'Dr. Siti N.', jenis: 'Alat', item: 'Labu Jantung 50ml', tgl: '2024-03-10', deadline: '2024-03-20', status: 'Dipinjam' },
    { nama: 'Budi Santoso', jenis: 'Bahan', item: 'Petroleum benzene', tgl: '2024-02-20', deadline: '2024-03-01', status: 'Terlambat' },
  ];


  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang di Sistem Manajemen Inventory Lab Kimia UPI</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total Alat Lab', value: '156', sub: '5 jenis berbeda', icon: Wrench, bg: 'bg-red-50', iconColor: 'text-red-600', iconBg: 'bg-red-100', spark: alatSpark, sparkColor: '#ef4444' },
            { label: 'Total Bahan Kimia', value: '234', sub: 'item tercatat', icon: Package, bg: 'bg-purple-50', iconColor: 'text-purple-600', iconBg: 'bg-purple-100', spark: bahanSpark, sparkColor: '#9333ea' },
            { label: 'Stok Menipis', value: '6', sub: '3 alat · 3 bahan', icon: AlertCircle, bg: 'bg-orange-50', iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
            { label: 'Sedang Dipinjam', value: '4', sub: 'transaksi aktif', icon: Clock, bg: 'bg-blue-50', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
          ].map((card, i) => (
            <div key={i} className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                </div>
              </div>
              {card.spark && (
                <div className="mt-3">
                  <Sparkline data={card.spark} color={card.sparkColor} width={120} height={28} />
                </div>
              )}
            </div>
          ))}
        </div>


        {/* ── Stok Kritis + Peminjaman Aktif ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Stok Kritis Alat */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Stok Alat Menipis</p>
                  <p className="text-xs text-gray-400">Perlu segera diisi ulang</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{stokAlatKritis.length} item</span>
            </div>
            <div className="p-4 space-y-3">
              {stokAlatKritis.map((item, i) => {
                const pct = Math.round((item.jumlah / item.maks) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.spesifikasi} · {item.penyimpanan}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${pct <= 20 ? 'text-red-600' : 'text-orange-500'}`}>
                          {item.jumlah}
                        </span>
                        <span className="text-xs text-gray-400">/{item.maks} unit</span>
                      </div>
                    </div>
                    <StockBar current={item.jumlah} max={item.maks} color="bg-red-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stok Kritis Bahan */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Stok Bahan Menipis</p>
                  <p className="text-xs text-gray-400">Perlu segera diisi ulang</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{stokBahanKritis.length} item</span>
            </div>
            <div className="p-4 space-y-3">
              {stokBahanKritis.map((item, i) => {
                const pctVal = Math.round((item.jumlah / item.maks) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{item.rumus} · {item.penyimpanan}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${pctVal <= 20 ? 'text-red-600' : 'text-orange-500'}`}>
                          {item.jumlah}
                        </span>
                        <span className="text-xs text-gray-400"> {item.satuan}</span>
                      </div>
                    </div>
                    <StockBar current={item.jumlah} max={item.maks} color="bg-purple-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Peminjaman Aktif */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Peminjaman Aktif</p>
                  <p className="text-xs text-gray-400">Belum dikembalikan</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{peminjamanAktif.length} aktif</span>
            </div>
            <div className="divide-y divide-gray-100">
              {peminjamanAktif.map((p, i) => (
                <div key={i} className="px-5 py-3 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.nama}</p>
                        <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${p.jenis === 'Alat' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'}`}>
                          {p.jenis}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{p.item}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Batas: {new Date(p.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${p.status === 'Terlambat' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;