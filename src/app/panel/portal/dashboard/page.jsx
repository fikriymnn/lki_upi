"use client";
import React, { useState,useEffect,useRef } from 'react';
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

// Register komponen yang dipakai
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
        <header className="bg-[#b91c1c] border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-bold text-2xl">INVENTORY SYSTEM</p>
            <div className="flex-1 max-w-lg" />
            <div className="flex items-center space-x-4 ml-6">
            
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
          {activePage === 'stock-in' && <StockInPage />}
          {activePage === 'stock-out' && <StockOutPage/>}
           {activePage === 'stock-opname' && <StockOpnamePage/>}
           {activePage === 'stock-movement' && <StockMovementPage/>}
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




// ── Dashboard Content ─────────────────────────────────────────────────────
// ── Sparkline SVG ─────────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#ef4444', width = 100, height = 28 }) => {
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
  const [filterJenis, setFilterJenis] = useState('all');
  const [filterPeriode, setFilterPeriode] = useState(6);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const ALL_MONTHS = ['Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des','Jan','Feb'];
  const DATA_ALAT =  [8,11,9,14,10,13,15,12,18,16,14,17];
  const DATA_BAHAN = [5,7,6,10,8,11,9,13,15,12,10,14];

  const alatSpark = DATA_ALAT.slice(-6);
  const bahanSpark = DATA_BAHAN.slice(-6);

  const stokAlatKritis = [
    { name: 'Erlenmeyer 25 ml', sub: 'Lemari Kanan', jumlah: 1, maks: 10 },
    { name: 'Buret Kolom', sub: 'Rak 1 · sedang', jumlah: 2, maks: 8 },
    { name: 'Labu Ukur 100 ml', sub: 'Rak 2', jumlah: 3, maks: 12 },
  ];

  const stokBahanKritis = [
    { name: 'Terte-butylamine', sub: 'C₄H₁₁N · Rak 3', jumlah: 900, maks: 5000, satuan: 'mL' },
    { name: 'Natrium Hidroksida', sub: 'NaOH · Lemari Penyimpanan', jumlah: 800, maks: 5000, satuan: 'g' },
    { name: 'HCl', sub: 'HCl · Lemari Kuning', jumlah: 400, maks: 3000, satuan: 'mL' },
  ];

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const labels = ALL_MONTHS.slice(-filterPeriode);
    const a = DATA_ALAT.slice(-filterPeriode);
    const b = DATA_BAHAN.slice(-filterPeriode);
    const datasets = [];

    if (filterJenis !== 'bahan') datasets.push({
      label: 'Alat Lab', data: a,
      borderColor: '#E24B4A', backgroundColor: 'rgba(226,75,74,0.10)',
      tension: 0.4, pointBackgroundColor: '#E24B4A', pointRadius: 4, fill: true,
    });
    if (filterJenis !== 'alat') datasets.push({
      label: 'Bahan Kimia', data: b,
      borderColor: '#7F77DD', backgroundColor: 'rgba(127,119,221,0.09)',
      tension: 0.4, pointBackgroundColor: '#7F77DD', pointRadius: 4, fill: true,
    });

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888780' } },
          y: { grid: { color: 'rgba(136,135,128,0.12)' }, ticks: { font: { size: 11 }, color: '#888780', stepSize: 3 }, min: 0 },
        },
      },
    });

    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
  }, [filterJenis, filterPeriode]);

  const statCards = [
    { label: 'Total Alat Lab', value: '156', sub: '12 kategori', iconBg: 'bg-red-50', iconColor: 'text-red-600', icon: Wrench },
    { label: 'Alat Lab Rusak', value: '14', sub: '6 belum diganti', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', icon: AlertCircle, badge: '9%', badgeColor: 'bg-amber-100 text-amber-700' },
    { label: 'Total Bahan Kimia', value: '234', sub: '48 jenis senyawa', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', icon: Package },
    { label: 'Bahan Stok Minimal', value: '18', sub: 'perlu restock', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', icon: TrendingUp, badge: '7.7%', badgeColor: 'bg-red-100 text-red-700' },
  ];

  const datasets_legend = [];
  if (filterJenis !== 'bahan') datasets_legend.push({ label: 'Alat Lab', color: '#E24B4A' });
  if (filterJenis !== 'alat') datasets_legend.push({ label: 'Bahan Kimia', color: '#7F77DD' });

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Sistem Manajemen Inventory Lab Kimia UPI</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                {card.badge && (
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${card.badgeColor}`}>
                    {card.badge} dari total
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Chart Tren Peminjaman */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <p className="text-sm font-semibold text-gray-900">Tren Peminjaman</p>
            <div className="flex items-center gap-2">
              <select
                value={filterJenis}
                onChange={e => setFilterJenis(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none"
              >
                <option value="all">Semua</option>
                <option value="alat">Alat Lab</option>
                <option value="bahan">Bahan Kimia</option>
              </select>
              <select
                value={filterPeriode}
                onChange={e => setFilterPeriode(parseInt(e.target.value))}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none"
              >
                <option value={3}>3 Bulan</option>
                <option value={6}>6 Bulan</option>
                <option value={12}>12 Bulan</option>
              </select>
            </div>
          </div>
          {/* Legend */}
          <div className="flex gap-4 mb-3">
            {datasets_legend.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }}></span>
                {d.label}
              </span>
            ))}
          </div>
          <div className="relative w-full" style={{ height: '240px' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Stok Kritis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Alat Kritis */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Stok Alat Kritis</p>
                  <p className="text-xs text-gray-400">Perlu segera diisi ulang</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{stokAlatKritis.length} item</span>
            </div>
            <div className="space-y-3">
              {stokAlatKritis.map((item, i) => {
                const pct = Math.round((item.jumlah / item.maks) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.sub}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${pct <= 20 ? 'text-red-600' : 'text-orange-500'}`}>{item.jumlah}</span>
                        <span className="text-xs text-gray-400">/{item.maks} unit</span>
                      </div>
                    </div>
                    <StockBar current={item.jumlah} max={item.maks} color="bg-red-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bahan Kritis */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Bahan Kimia Di Bawah Minimal</p>
                  <p className="text-xs text-gray-400">Perlu segera diisi ulang</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{stokBahanKritis.length} item</span>
            </div>
            <div className="space-y-3">
              {stokBahanKritis.map((item, i) => {
                const pct = Math.round((item.jumlah / item.maks) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{item.sub}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${pct <= 20 ? 'text-red-600' : 'text-orange-500'}`}>{item.jumlah}</span>
                        <span className="text-xs text-gray-400"> {item.satuan}</span>
                      </div>
                    </div>
                    <StockBar current={item.jumlah} max={item.maks} color="bg-purple-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage