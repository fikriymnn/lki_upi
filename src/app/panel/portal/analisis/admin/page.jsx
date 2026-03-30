"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart2,
  FileText,
  ChevronRight,
  BarChart3,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Sidebar from '../../../../../components/analisis/Sidebar';
import OrderPage from './Order';
import ReportPage from './Report';
import ContentPage from './Content';
import OrderDetail from './OrderDetail';
import OrderTracking from './OrderTracking';
import OrderEdit from './OrderEdit';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'order', label: 'Order', icon: ShoppingCart },
  { key: 'report', label: 'Report', icon: BarChart2 },
  { key: 'content', label: 'Content', icon: FileText },
];

const StockBar = ({ pct, color }) => (
  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
    <div
      className={`${color} h-1.5 rounded-full transition-all duration-500`}
      style={{ width: `${pct}%` }}
    />
  </div>
);

// ── Dashboard Content ─────────────────────────────────────────────────────
const DashboardContent = () => {
  const [filterPeriode, setFilterPeriode] = useState('bulan');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const RAW_DATA = {
    minggu: {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      selesai: [2, 4, 3, 5, 3, 6, 2],
      aktif: [1, 2, 1, 3, 2, 1, 0],
    },
    bulan: {
      labels: Array.from({ length: 30 }, (_, i) => String(i + 1)),
      selesai: [1, 0, 2, 1, 3, 2, 0, 1, 4, 2, 1, 3, 2, 5, 3, 1, 2, 4, 2, 1, 3, 2, 4, 1, 2, 3, 2, 1, 4, 3],
      aktif: [0, 1, 1, 0, 1, 1, 1, 2, 1, 0, 1, 2, 1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 1, 2, 1, 0, 1, 1],
    },
    '6bulan': {
      labels: ['Agt', 'Sep', 'Okt', 'Nov', 'Des', 'Jan'],
      selesai: [18, 24, 21, 30, 27, 35],
      aktif: [5, 7, 6, 9, 8, 10],
    },
    tahun: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
      selesai: [12, 18, 15, 22, 19, 25, 21, 28, 24, 30, 27, 35],
      aktif: [3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 9, 11],
    },
    all: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      selesai: [95, 140, 178, 230, 265],
      aktif: [12, 18, 22, 28, 32],
    },
  };

  const current = RAW_DATA[filterPeriode];
  const totalSelesai = current.selesai.reduce((a, b) => a + b, 0);
  const totalAktif = current.aktif.reduce((a, b) => a + b, 0);
  const totalOrder = totalSelesai + totalAktif;
  const pctSelesai = totalOrder > 0 ? Math.round((totalSelesai / totalOrder) * 100) : 0;

  const PERIODE_OPTIONS = [
    { value: 'minggu', label: 'Minggu Ini' },
    { value: 'bulan', label: 'Bulan Ini' },
    { value: '6bulan', label: '6 Bulan' },
    { value: 'tahun', label: 'Tahun Ini' },
    { value: 'all', label: 'Semua' },
  ];

  const periodeLabel = PERIODE_OPTIONS.find(p => p.value === filterPeriode)?.label;

  useEffect(() => {
    const renderChart = () => {
      if (!chartRef.current) return;
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
      chartInstanceRef.current = new window.Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: current.labels,
          datasets: [{
            label: 'Order Selesai',
            data: current.selesai,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22,163,74,0.08)',
            tension: 0.4,
            pointBackgroundColor: '#16a34a',
            pointRadius: 3,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 10 },
                color: '#888780',
                maxTicksLimit: filterPeriode === 'bulan' ? 10 : 20,
                autoSkip: true,
              },
            },
            y: {
              grid: { color: 'rgba(136,135,128,0.12)' },
              ticks: { font: { size: 11 }, color: '#888780', stepSize: 1 },
              min: 0,
            },
          },
        },
      });
    };

    if (window.Chart) {
      renderChart();
    } else {
      const existing = document.querySelector('script[src*="chart.umd"]');
      if (existing) {
        existing.addEventListener('load', renderChart);
      } else {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
        s.onload = renderChart;
        document.head.appendChild(s);
      }
    }

    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
  }, [filterPeriode]);

  return (
    <div className="px-6 pb-6 space-y-5">
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Sistem Layanan Analisis Lab Kimia Instrumen UPI</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Order */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Total Order</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrder}</p>
          <p className="text-xs text-gray-400 mt-0.5">{periodeLabel}</p>
        </div>

        {/* Order Selesai */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Order Selesai</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalSelesai}</p>
          <div className="flex items-center gap-2 mt-2">
            <StockBar pct={pctSelesai} color="bg-green-500" />
            <span className="text-xs text-green-600 font-medium flex-shrink-0">{pctSelesai}%</span>
          </div>
        </div>

        {/* Order Belum Selesai */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Order Belum Selesai</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalAktif}</p>
          <div className="flex items-center gap-2 mt-2">
            <StockBar pct={100 - pctSelesai} color="bg-red-400" />
            <span className="text-xs text-red-500 font-medium flex-shrink-0">{100 - pctSelesai}%</span>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-600" />
            <p className="text-sm font-semibold text-gray-900">Tren Order Selesai</p>
          </div>
          <select
            value={filterPeriode}
            onChange={e => setFilterPeriode(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none"
          >
            {PERIODE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full" style={{ height: '260px' }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────
const MainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [noInvoice, setNoInvoice] = useState('');
  const [idInvoice, setIdInvoice] = useState('');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#b91c1c] border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-bold text-2xl">LAYANAN ANALISIS</p>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                  <div className="w-9 h-9 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold border border-red-600">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-100">Admin Lab</p>
                    <p className="text-xs text-red-200">Administrator</p>
                  </div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="focus:outline-none"
                  >
                    <ChevronRight
                      className={`w-4 h-4 text-red-200 transition-transform duration-200 ${showUserDropdown ? 'rotate-90' : 'rotate-0'
                        }`}
                    />
                  </button>
                </div>

                {showUserDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-red-600">A</span>
                        </div>
                        <span>Profil Saya</span>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          if (confirm('Yakin ingin keluar?')) window.location.href = '/login';
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
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
          {activePage === 'order' && <OrderPage setActivePage={setActivePage} setNoInvoice={setNoInvoice} setIdInvoice={setIdInvoice} />}
          {activePage === 'order-detail' && <OrderDetail setActivePage={setActivePage} noInvoice={noInvoice} idInvoice={idInvoice} />}
          {activePage === 'order-tracking' && <OrderTracking setActivePage={setActivePage} noInvoice={noInvoice} idInvoice={idInvoice} />}
          {activePage === 'order-edit' && <OrderEdit setActivePage={setActivePage} noInvoice={noInvoice} idInvoice={idInvoice} />}
          {activePage === 'report' && <ReportPage />}
          {activePage === 'content' && <ContentPage />}
        </main>
      </div>
    </div>
  );
};

export default MainPage;