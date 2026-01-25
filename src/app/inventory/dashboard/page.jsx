"use client";
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Package, AlertCircle, TrendingUp, BarChart3, Settings, Box } from 'lucide-react';
import Sidebar from '@/components/inventory/Sidebar';
import AlatPage from './Alat';
import BahanPage from './Bahan';
import PeminjamanPage from './Peminjaman';
import RiwayatPage from './Riwayat';
import SupplierPage from './Supplier';
import LaporanPage from './Laporan';
import PenggunaPage from './Pengguna';
import Penyimpanan from './Penyimpanan';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={() => {}} // Placeholder for logout function
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
            </div>

            <div className="flex items-center space-x-4 ml-6">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin Lab</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'alat' && <AlatPage />}
          {activePage === 'bahan' && <BahanPage />}
          {activePage === 'peminjaman' && <PeminjamanPage />}
          {activePage === 'riwayat' && <RiwayatPage />}
          {activePage === 'master-supplier' && <SupplierPage />}
          {activePage === 'laporan' && <LaporanPage />}
          {activePage === 'master-lokasi' && <Penyimpanan />}
          {activePage === 'pengguna' && <PenggunaPage />}
          {/* {activePage === 'pengaturan' && <ComingSoonPage title="Pengaturan" />} */}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  const statsCards = [
    { title: 'Total Alat Lab', value: '156', change: '+8%', icon: Box, color: 'red' },
    { title: 'Total Bahan Kimia', value: '234', change: '+12%', icon: Package, color: 'purple' },
    { title: 'Stok Menipis', value: '18', change: '-5%', icon: AlertCircle, color: 'orange' },
    { title: 'Sedang Dipinjam', value: '24', change: '+15%', icon: TrendingUp, color: 'blue' },
  ];

  const recentAlat = [
    { name: 'Erlenmeyer', spesifikasi: '25 ml', jumlah: 1, status: 'Tersedia', penyimpanan: 'Lemari kanan' },
    { name: 'Buret', spesifikasi: '10 ml', jumlah: 15, status: 'Tersedia', penyimpanan: 'Rak 2' },
    { name: 'Labu jantung', spesifikasi: '50 ml', jumlah: 4, status: 'Tersedia', penyimpanan: 'Rak 3' },
    { name: 'Buret Kolom', spesifikasi: 'sedang', jumlah: 2, status: 'Menipis', penyimpanan: 'Rak 1' },
    { name: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 4, status: 'Tersedia', penyimpanan: 'Lemari kanan' },
  ];

  const recentBahan = [
    { name: 'Carbon disulfide', rumus: 'Cs2', stock: '1000 mL', status: 'Tersedia', spesifikasi: 'for analisis', penyimpanan: 'Rak 3' },
    { name: 'Petroleum benzene', rumus: 'C5C6', stock: '4000 mL', status: 'Tersedia', spesifikasi: 'for analisis', penyimpanan: 'Rak 3' },
    { name: 'Terte-butylamine', rumus: 'C4H11N', stock: '900 mL', status: 'Menipis', spesifikasi: 'for sintetis', penyimpanan: 'Rak 3' },
    { name: 'Asam Sulfat', rumus: 'H2SO4', stock: '1500 mL', status: 'Tersedia', spesifikasi: 'for analisis', penyimpanan: 'Rak 3' },
    { name: 'Natrium Hidroksida', rumus: 'NaOH', stock: '800 g', status: 'Menipis', spesifikasi: 'for analisis' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang di Sistem Manajemen Inventory Lab Kimia UPI</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alat Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Alat Laboratorium</h2>
                <p className="text-sm text-gray-500 mt-1">Data alat terbaru</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Alat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spesifikasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAlat.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.penyimpanan}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.spesifikasi}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {item.jumlah} unit
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Tersedia' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 text-center">
              <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Lihat Semua Alat →
              </a>
            </div>
          </div>

          {/* Bahan Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Bahan Kimia</h2>
                <p className="text-sm text-gray-500 mt-1">Data bahan terbaru</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Bahan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rumus</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBahan.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.penyimpanan}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 font-mono">{item.rumus}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Tersedia' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 text-center">
              <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Lihat Semua Bahan →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Coming Soon Page Component
const ComingSoonPage = ({ title }) => {
  return (
    <div className="p-6 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">Halaman ini sedang dalam pengembangan</p>
      </div>
    </div>
  );
};

export default DashboardPage;