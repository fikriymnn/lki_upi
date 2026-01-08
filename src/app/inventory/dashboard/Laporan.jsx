import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Package, Box, Users, DollarSign, Eye, Printer } from 'lucide-react';

const LaporanPage = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Laporan Stok Inventory',
      description: 'Laporan lengkap stok alat dan bahan kimia',
      icon: Package,
      color: 'blue'
    },
    {
      id: 'peminjaman',
      title: 'Laporan Peminjaman',
      description: 'Riwayat dan statistik peminjaman',
      icon: Users,
      color: 'green'
    },
    {
      id: 'keterlambatan',
      title: 'Laporan Keterlambatan',
      description: 'Daftar peminjam yang terlambat dan sanksi',
      icon: DollarSign,
      color: 'red'
    },
    {
      id: 'penambahan',
      title: 'Laporan Penambahan Item',
      description: 'Riwayat penambahan alat dan bahan',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'alat',
      title: 'Laporan Alat Laboratorium',
      description: 'Daftar lengkap alat laboratorium',
      icon: Box,
      color: 'orange'
    },
    {
      id: 'bahan',
      title: 'Laporan Bahan Kimia',
      description: 'Daftar lengkap bahan kimia',
      icon: Package,
      color: 'indigo'
    },
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert('Pilih jenis laporan terlebih dahulu');
      return;
    }
    setShowPreview(true);
  };

  const handleExportPDF = () => {
    alert('Export ke PDF - Fitur akan segera tersedia');
  };

  const handleExportExcel = () => {
    alert('Export ke Excel - Fitur akan segera tersedia');
  };

  const handlePrint = () => {
    window.print();
  };

  // Sample preview data
  const previewData = {
    inventory: {
      totalAlat: 156,
      totalBahan: 234,
      stokMenipis: 18,
      items: [
        { name: 'Erlenmeyer 25ml', kategori: 'Alat', jumlah: 1, status: 'Tersedia' },
        { name: 'Carbon disulfide', kategori: 'Bahan', jumlah: 1000, status: 'Tersedia' },
      ]
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Laporan</h1>
          <p className="text-gray-600">Generate dan export laporan inventory laboratorium</p>
        </div>

        {/* Report Generator Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Generate Laporan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Laporan <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">-- Pilih Jenis Laporan --</option>
                {reportTypes.map(report => (
                  <option key={report.id} value={report.id}>
                    {report.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              <Eye className="w-5 h-5" />
              <span>Preview Laporan</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Download className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Download className="w-5 h-5" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Jenis Laporan Tersedia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map(report => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition hover:shadow-lg ${
                  selectedReport === report.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Preview Laporan</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Report Header */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                LABORATORIUM KIMIA
              </h1>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                UNIVERSITAS PENDIDIKAN INDONESIA
              </h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {reportTypes.find(r => r.id === selectedReport)?.title}
              </h3>
              <div className="flex justify-center gap-8 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Tanggal Generate:</span> {new Date().toLocaleDateString('id-ID')}
                </div>
                {dateFrom && dateTo && (
                  <div>
                    <span className="font-medium">Periode:</span> {new Date(dateFrom).toLocaleDateString('id-ID')} - {new Date(dateTo).toLocaleDateString('id-ID')}
                  </div>
                )}
              </div>
            </div>

            {/* Sample Report Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Total Alat</div>
                  <div className="text-2xl font-bold text-blue-900">156</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">Total Bahan</div>
                  <div className="text-2xl font-bold text-purple-900">234</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 mb-1">Stok Menipis</div>
                  <div className="text-2xl font-bold text-red-900">18</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Data Detail</h4>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.inventory.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.kategori}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.jumlah}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="pt-8 mt-8 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                <div>
                  <div className="mb-1">Dicetak oleh: Admin Lab</div>
                  <div>Tanggal: {new Date().toLocaleDateString('id-ID')}</div>
                </div>
                <div className="text-right">
                  <div className="mb-8">Mengetahui,</div>
                  <div className="font-bold border-t border-gray-400 pt-1">
                    Kepala Laboratorium
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanPage;