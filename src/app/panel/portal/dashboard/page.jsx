"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Package, AlertCircle, TrendingUp, BarChart3, Settings, Box, Wrench, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, Calendar, Filter, RefreshCw, Activity, XCircle, FlaskConical } from 'lucide-react';
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
import StockInPage from './StockIn';
import StockOutPage from './StockOut';
import StockOpnamePage from './StockOpname';
import StockMovementPage from './StockMovement';
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);

// ── Helpers ───────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// ── Hook: client-only time ago ────────────────────────────────────────────
const useTimeAgo = (dateStr) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const d = new Date(dateStr);
      const diff = Math.floor((now - d) / 1000);
      if (diff < 60) return `${diff} detik lalu`;
      if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
      return `${Math.floor(diff / 86400)} hari lalu`;
    };

    setLabel(compute());
    const interval = setInterval(() => setLabel(compute()), 30000);
    return () => clearInterval(interval);
  }, [dateStr]);

  return label;
};

// ── TimeAgo Component ─────────────────────────────────────────────────────
const TimeAgo = ({ dateStr }) => {
  const label = useTimeAgo(dateStr);
  return <span>{label}</span>;
};

// ── StockBar ──────────────────────────────────────────────────────────────
const StockBar = ({ current, max, color }) => {
  const pct = Math.min((current / max) * 100, 100);
  const barColor = pct === 0 ? 'bg-gray-300' : pct <= 20 ? 'bg-red-500' : pct <= 40 ? 'bg-orange-400' : color;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`${barColor} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
        <header className="bg-[#b91c1c] border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-bold text-2xl">INVENTORY SYSTEM</p>
            <div className="flex-1 max-w-lg" />
            <div className="flex items-center space-x-4 ml-6">
              <div className="relative">
                <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold border border-red-400">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-100">Admin Lab</p>
                    <p className="text-xs text-white">Administrator</p>
                  </div>
                  <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="focus:outline-none">
                    <ChevronDown className={`w-4 h-4 text-red-200 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {showUserDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => { setShowUserDropdown(false); setActivePage('pengguna'); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-red-600">A</span>
                        </div>
                        <span>Profil Saya</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          if (confirm('Apakah Anda yakin ingin keluar?')) window.location.href = '/login';
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
          {activePage === 'stock-in' && <StockInPage />}
          {activePage === 'stock-out' && <StockOutPage />}
          {activePage === 'stock-opname' && <StockOpnamePage />}
          {activePage === 'stock-movement' && <StockMovementPage />}
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

// ── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_LAST_ACTIVITY = [
  { id: 1, type: 'alat', aksi: 'Peminjaman', nama: 'Erlenmeyer 250 ml', peminjam: 'Rizky Aditya', waktu: new Date(Date.now() - 5 * 60 * 1000).toISOString(), status: 'aktif' },
  { id: 2, type: 'bahan', aksi: 'Penggunaan', nama: 'Natrium Hidroksida', peminjam: 'Siti Rahma', waktu: new Date(Date.now() - 28 * 60 * 1000).toISOString(), status: 'selesai', jumlah: '50 g' },
  { id: 3, type: 'alat', aksi: 'Pengembalian', nama: 'Buret 50 ml', peminjam: 'Dian Pratama', waktu: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(), status: 'selesai' },
  { id: 4, type: 'bahan', aksi: 'Penggunaan', nama: 'HCl 37%', peminjam: 'Ahmad Fauzi', waktu: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), status: 'aktif', jumlah: '100 mL' },
  { id: 5, type: 'alat', aksi: 'Peminjaman', nama: 'Labu Ukur 100 ml', peminjam: 'Nurul Hidayah', waktu: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), status: 'aktif' },
  { id: 6, type: 'bahan', aksi: 'Penggunaan', nama: 'Tert-butylamine', peminjam: 'Budi Santoso', waktu: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), status: 'selesai', jumlah: '200 mL' },
  { id: 7, type: 'alat', aksi: 'Peminjaman', nama: 'Pipet Ukur 10 ml', peminjam: 'Indah Lestari', waktu: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), status: 'terlambat' },
  { id: 8, type: 'bahan', aksi: 'Penggunaan', nama: 'Asam Sulfat', peminjam: 'Fajar Ramadhan', waktu: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), status: 'selesai', jumlah: '75 mL' },
];

// ── Stat data per periode ─────────────────────────────────────────────────
const STAT_BY_PERIOD = {
  hari:   { peminjamanAlat: 8,   penggunaanBahan: 12,  bahanMinimum: 18, bahanHabis: 3, alatRusak: 14 },
  minggu: { peminjamanAlat: 47,  penggunaanBahan: 63,  bahanMinimum: 18, bahanHabis: 3, alatRusak: 14 },
  bulan:  { peminjamanAlat: 156, penggunaanBahan: 214, bahanMinimum: 18, bahanHabis: 3, alatRusak: 14 },
  tahun:  { peminjamanAlat: 1842, penggunaanBahan: 2371, bahanMinimum: 18, bahanHabis: 3, alatRusak: 14 },
  range:  { peminjamanAlat: 0,   penggunaanBahan: 0,   bahanMinimum: 18, bahanHabis: 3, alatRusak: 14 },
};

// Chart data per periode
const CHART_DATA = {
  hari: {
    labels: ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'],
    alat:   [1, 2, 3, 1, 0, 2, 1, 3, 2],
    bahan:  [2, 1, 3, 2, 1, 3, 2, 1, 3],
  },
  minggu: {
    labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
    alat:   [8, 11, 9, 14, 10, 3, 1],
    bahan:  [5, 7, 13, 10, 8, 2, 0],
  },
  bulan: {
    labels: ['Mg 1','Mg 2','Mg 3','Mg 4'],
    alat:   [34, 42, 48, 32],
    bahan:  [45, 58, 62, 49],
  },
  tahun: {
    labels: ['Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des','Jan','Feb'],
    alat:   [120, 145, 132, 178, 143, 167, 189, 155, 221, 198, 172, 222],
    bahan:  [98, 121, 109, 152, 128, 145, 167, 134, 187, 163, 149, 318],
  },
};

// ── Stok kritis (static) ──────────────────────────────────────────────────
const STOK_ALAT_KRITIS = [
  { name: 'Erlenmeyer 25 ml', sub: 'Lemari Kanan', jumlah: 1, maks: 10 },
  { name: 'Buret Kolom', sub: 'Rak 1 · sedang', jumlah: 2, maks: 8 },
  { name: 'Labu Ukur 100 ml', sub: 'Rak 2', jumlah: 3, maks: 12 },
];
const STOK_BAHAN_KRITIS = [
  { name: 'Tert-butylamine', sub: 'C₄H₁₁N · Rak 3', jumlah: 900, maks: 5000, satuan: 'mL' },
  { name: 'Natrium Hidroksida', sub: 'NaOH · Lemari Penyimpanan', jumlah: 800, maks: 5000, satuan: 'g' },
  { name: 'HCl', sub: 'HCl · Lemari Kuning', jumlah: 400, maks: 3000, satuan: 'mL' },
];
const BAHAN_HABIS = [
  { name: 'Kalium Permanganat', sub: 'KMnO₄ · Rak 4', satuan: 'g' },
  { name: 'Indikator PP', sub: 'Phenolphthalein · Lemari Reagent', satuan: 'mL' },
  { name: 'Buffer pH 7', sub: 'Larutan Buffer · Rak Bawah', satuan: 'mL' },
];

// ── Filter Periode Bar ────────────────────────────────────────────────────
const PERIODE_OPTIONS = [
  { key: 'hari', label: 'Hari Ini' },
  { key: 'minggu', label: 'Minggu Ini' },
  { key: 'bulan', label: 'Bulan Ini' },
  { key: 'tahun', label: 'Tahun Ini' },
  { key: 'range', label: 'Rentang' },
];

// ── Dashboard Content ─────────────────────────────────────────────────────
const DashboardContent = () => {
  const [periode, setPeriode] = useState('bulan');
  const [filterJenis, setFilterJenis] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [activityFilter, setActivityFilter] = useState('semua');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const stats = STAT_BY_PERIOD[periode] || STAT_BY_PERIOD['bulan'];
  const chartData = CHART_DATA[periode] || CHART_DATA['bulan'];

  // Filter last activity
  const filteredActivity = MOCK_LAST_ACTIVITY.filter(a => {
    if (activityFilter === 'alat') return a.type === 'alat';
    if (activityFilter === 'bahan') return a.type === 'bahan';
    return true;
  });

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const datasets = [];
    if (filterJenis !== 'bahan') datasets.push({
      label: 'Peminjaman Alat',
      data: chartData.alat,
      borderColor: '#E24B4A',
      backgroundColor: 'rgba(226,75,74,0.10)',
      tension: 0.4,
      pointBackgroundColor: '#E24B4A',
      pointRadius: 4,
      fill: true,
    });
    if (filterJenis !== 'alat') datasets.push({
      label: 'Penggunaan Bahan',
      data: chartData.bahan,
      borderColor: '#7F77DD',
      backgroundColor: 'rgba(127,119,221,0.09)',
      tension: 0.4,
      pointBackgroundColor: '#7F77DD',
      pointRadius: 4,
      fill: true,
    });

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: { labels: chartData.labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888780' } },
          y: { grid: { color: 'rgba(136,135,128,0.12)' }, ticks: { font: { size: 11 }, color: '#888780', stepSize: 3 }, min: 0 },
        },
      },
    });

    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
  }, [filterJenis, periode, chartData]);

  const statCards = [
    {
      label: 'Transaksi Peminjaman Alat',
      value: stats.peminjamanAlat.toLocaleString('id-ID'),
      sub: periodeSubLabel(periode),
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      icon: Wrench,
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Transaksi Penggunaan Bahan',
      value: stats.penggunaanBahan.toLocaleString('id-ID'),
      sub: periodeSubLabel(periode),
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      icon: FlaskConical,
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Bahan Stok Minimum',
      value: stats.bahanMinimum,
      sub: 'Perlu restock segera',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      icon: TrendingUp,
      badge: 'Waspada',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Bahan Stok Habis',
      value: stats.bahanHabis,
      sub: 'Stok = 0',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      icon: XCircle,
      badge: 'Kritis',
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      label: 'Alat Rusak',
      value: stats.alatRusak,
      sub: '6 belum diganti',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      icon: AlertCircle,
      badge: '9% dari total',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
  ];

  const legendItems = [];
  if (filterJenis !== 'bahan') legendItems.push({ label: 'Peminjaman Alat', color: '#E24B4A' });
  if (filterJenis !== 'alat') legendItems.push({ label: 'Penggunaan Bahan', color: '#7F77DD' });

  return (
    <div className="p-6 space-y-5">
      <div className="max-w-7xl mx-auto">

        {/* Header + Filter Periode */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Sistem Manajemen Inventory Lab Kimia UPI</p>
          </div>

          {/* Periode Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              {PERIODE_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setPeriode(opt.key)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    periode === opt.key
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range (visible only when periode === 'range') */}
        {periode === 'range' && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Dari Tanggal</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Sampai Tanggal</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <button className="flex items-center gap-1.5 text-xs bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition">
              <Filter className="w-3.5 h-3.5" />
              Terapkan
            </button>
          </div>
        )}

        {/* Stat Cards — 5 kolom, 2 baris terakhir jika perlu */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-snug">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400">{card.sub}</p>
                {card.badge && (
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 w-fit ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Chart Tren Peminjaman */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Tren Peminjaman & Penggunaan</p>
              <p className="text-xs text-gray-400 mt-0.5">Periode: {PERIODE_OPTIONS.find(p => p.key === periode)?.label}</p>
            </div>
            <select
              value={filterJenis}
              onChange={e => setFilterJenis(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none"
            >
              <option value="all">Alat & Bahan</option>
              <option value="alat">Alat Lab Saja</option>
              <option value="bahan">Bahan Kimia Saja</option>
            </select>
          </div>
          <div className="flex gap-4 mb-3">
            {legendItems.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }}></span>
                {d.label}
              </span>
            ))}
          </div>
          <div className="relative w-full" style={{ height: '220px' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Last Activity + Stok Kritis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

          {/* Last Activity — 2/3 lebar */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Aktivitas Terakhir</p>
                  <p className="text-xs text-gray-400">Peminjaman & penggunaan terkini</p>
                </div>
              </div>
              {/* Filter Aktivitas */}
              <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                {[
                  { key: 'semua', label: 'Semua' },
                  { key: 'alat', label: 'Alat' },
                  { key: 'bahan', label: 'Bahan' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setActivityFilter(opt.key)}
                    className={`px-3 py-1 text-xs font-medium transition-all ${
                      activityFilter === opt.key ? 'bg-white shadow text-gray-800 rounded-lg' : 'text-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredActivity.map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  {/* Icon type */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    act.type === 'alat' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {act.type === 'alat'
                      ? <Wrench className="w-4 h-4 text-red-600" />
                      : <FlaskConical className="w-4 h-4 text-purple-600" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                        act.type === 'alat' ? 'bg-red-50 text-red-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {act.aksi}
                      </span>
                      <p className="text-sm font-medium text-gray-900 truncate">{act.nama}</p>
                      {act.jumlah && <span className="text-xs text-gray-400">· {act.jumlah}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">oleh <span className="font-medium text-gray-700">{act.peminjam}</span></p>
                  </div>

                  {/* Status + waktu */}
                  <div className="text-right flex-shrink-0">
                    <StatusBadge status={act.status} />
                    <p className="text-xs text-gray-400 mt-1"><TimeAgo dateStr={act.waktu} /></p>
                  </div>
                </div>
              ))}

              {filteredActivity.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Tidak ada aktivitas ditemukan.
                </div>
              )}
            </div>
          </div>

          {/* Stok Kritis ringkas — 1/3 lebar */}
          <div className="flex flex-col gap-4">

            {/* Alat Kritis */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Stok Alat Kritis</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{STOK_ALAT_KRITIS.length}</span>
              </div>
              <div className="space-y-2.5">
                {STOK_ALAT_KRITIS.map((item, i) => {
                  const pct = Math.round((item.jumlah / item.maks) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">{item.name}</p>
                        <span className={`text-xs font-bold ${pct <= 20 ? 'text-red-600' : 'text-orange-500'}`}>
                          {item.jumlah}<span className="text-gray-400 font-normal">/{item.maks}</span>
                        </span>
                      </div>
                      <StockBar current={item.jumlah} max={item.maks} color="bg-red-400" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bahan Habis */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Bahan Habis</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{BAHAN_HABIS.length}</span>
              </div>
              <div className="space-y-2">
                {BAHAN_HABIS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{item.sub}</p>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">0 {item.satuan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bahan Kimia Minimum */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Bahan Kimia Di Bawah Stok Minimum</p>
                <p className="text-xs text-gray-400">Perlu segera diisi ulang</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{STOK_BAHAN_KRITIS.length} item</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STOK_BAHAN_KRITIS.map((item, i) => {
              const pct = Math.round((item.jumlah / item.maks) * 100);
              return (
                <div key={i} className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <span className={`text-xs font-bold ${pct <= 20 ? 'text-red-600' : 'text-orange-500'}`}>{pct}%</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-1">{item.sub}</p>
                  <StockBar current={item.jumlah} max={item.maks} color="bg-purple-400" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{item.jumlah} {item.satuan}</span>
                    <span className="text-xs text-gray-400">maks {item.maks} {item.satuan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Status Badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    aktif:    { label: 'Aktif',     cls: 'bg-blue-100 text-blue-700' },
    selesai:  { label: 'Selesai',   cls: 'bg-emerald-100 text-emerald-700' },
    terlambat:{ label: 'Terlambat', cls: 'bg-red-100 text-red-700' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
  );
};

// ── Helper periodeSubLabel ─────────────────────────────────────────────────
function periodeSubLabel(periode) {
  const now = new Date();
  if (periode === 'hari') return `Hari ini, ${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  if (periode === 'minggu') return 'Minggu ini';
  if (periode === 'bulan') return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  if (periode === 'tahun') return `Tahun ${now.getFullYear()}`;
  return 'Rentang terpilih';
}

export default DashboardPage;