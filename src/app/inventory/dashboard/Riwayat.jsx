import React, { useState } from 'react';
import { Search, Calendar, TrendingUp, Users, Filter, Download } from 'lucide-react';

const RiwayatPage = () => {
  const [activeTab, setActiveTab] = useState('additions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');

  // Data riwayat penambahan alat & bahan
  const additionHistory = [
    {
      id: 1,
      type: 'alat',
      itemName: 'Erlenmeyer 100ml',
      quantity: 5,
      addedBy: 'Admin Lab',
      date: '2024-01-05',
      time: '10:30',
      notes: 'Pembelian rutin bulanan'
    },
    {
      id: 2,
      type: 'bahan',
      itemName: 'Carbon disulfide (Cs2)',
      quantity: 2000,
      unit: 'mL',
      addedBy: 'Admin Lab',
      date: '2024-01-04',
      time: '14:15',
      notes: 'Restok bahan praktikum'
    },
    {
      id: 3,
      type: 'alat',
      itemName: 'Buret 50ml',
      quantity: 8,
      addedBy: 'Dr. Siti Aminah',
      date: '2024-01-03',
      time: '09:00',
      notes: 'Pengadaan baru dari hibah'
    },
    {
      id: 4,
      type: 'bahan',
      itemName: 'Petroleum benzene (C5C6)',
      quantity: 1500,
      unit: 'mL',
      addedBy: 'Admin Lab',
      date: '2024-01-02',
      time: '11:20',
      notes: 'Tambahan untuk penelitian'
    },
    {
      id: 5,
      type: 'alat',
      itemName: 'Labu jantung 50ml',
      quantity: 6,
      addedBy: 'Admin Lab',
      date: '2024-01-01',
      time: '08:45',
      notes: 'Penggantian alat rusak'
    },
  ];

  // Data riwayat peminjaman
  const borrowingHistory = [
    {
      id: 1,
      userName: 'Ahmad Fauzi',
      nim: '2001234',
      prodi: 'Kimia',
      itemType: 'alat',
      itemName: 'Erlenmeyer 25ml',
      quantity: 2,
      borrowDate: '2024-01-05',
      returnDate: '2024-01-10',
      actualReturnDate: null,
      status: 'Dipinjam',
      keperluan: 'Praktikum Kimia Analitik'
    },
    {
      id: 2,
      userName: 'Siti Nurhaliza',
      nim: '2001235',
      prodi: 'Pendidikan Kimia',
      itemType: 'bahan',
      itemName: 'Carbon disulfide',
      quantity: 100,
      unit: 'mL',
      borrowDate: '2024-01-04',
      returnDate: '2024-01-09',
      actualReturnDate: null,
      status: 'Terlambat',
      keperluan: 'Penelitian Skripsi'
    },
    {
      id: 3,
      userName: 'Budi Santoso',
      nim: '2001236',
      prodi: 'Kimia',
      itemType: 'alat',
      itemName: 'Buret 10ml',
      quantity: 3,
      borrowDate: '2024-01-03',
      returnDate: '2024-01-08',
      actualReturnDate: '2024-01-08',
      status: 'Dikembalikan',
      keperluan: 'Praktikum Titrasi'
    },
    {
      id: 4,
      userName: 'Dewi Lestari',
      nim: '2001237',
      prodi: 'Pendidikan Kimia',
      itemType: 'bahan',
      itemName: 'Petroleum benzene',
      quantity: 50,
      unit: 'mL',
      borrowDate: '2024-01-02',
      returnDate: '2024-01-07',
      actualReturnDate: '2024-01-09',
      status: 'Dikembalikan Terlambat',
      daysLate: 2,
      keperluan: 'Tugas Akhir'
    },
    {
      id: 5,
      userName: 'Ahmad Fauzi',
      nim: '2001234',
      prodi: 'Kimia',
      itemType: 'alat',
      itemName: 'Labu jantung 100ml',
      quantity: 1,
      borrowDate: '2023-12-28',
      returnDate: '2024-01-05',
      actualReturnDate: '2024-01-04',
      status: 'Dikembalikan',
      keperluan: 'Penelitian Lab'
    },
  ];

  const filteredAdditions = additionHistory.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.addedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBorrowing = borrowingHistory.filter(item =>
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nim.includes(searchTerm) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Dipinjam': return 'bg-blue-100 text-blue-700';
      case 'Terlambat': return 'bg-red-100 text-red-700';
      case 'Dikembalikan': return 'bg-green-100 text-green-700';
      case 'Dikembalikan Terlambat': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exportToCSV = () => {
    alert('Export to CSV functionality - coming soon!');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Aktivitas</h1>
          <p className="text-gray-600">Lihat riwayat penambahan dan peminjaman alat & bahan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Penambahan</p>
                <p className="text-2xl font-bold text-gray-900">{additionHistory.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Peminjaman</p>
                <p className="text-2xl font-bold text-gray-900">{borrowingHistory.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Dikembalikan</p>
                <p className="text-2xl font-bold text-green-600">
                  {borrowingHistory.filter(b => b.status === 'Dikembalikan').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Terlambat</p>
                <p className="text-2xl font-bold text-red-600">
                  {borrowingHistory.filter(b => b.status === 'Terlambat' || b.status === 'Dikembalikan Terlambat').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('additions')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'additions'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Riwayat Penambahan
              </button>
              <button
                onClick={() => setActiveTab('borrowing')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'borrowing'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Riwayat Peminjaman
              </button>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {activeTab === 'additions' ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ditambahkan Oleh</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdditions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(item.date).toLocaleDateString('id-ID')}</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          item.type === 'alat' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          +{item.quantity} {item.unit || 'unit'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.addedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pinjam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Kembali</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBorrowing.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                        <div className="text-xs text-gray-500">NIM: {item.nim}</div>
                        <div className="text-xs text-gray-500">{item.prodi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                          {item.itemType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.itemName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.quantity} {item.unit || 'unit'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.borrowDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(item.returnDate).toLocaleDateString('id-ID')}
                        </div>
                        {item.actualReturnDate && (
                          <div className="text-xs text-gray-500">
                            Aktual: {new Date(item.actualReturnDate).toLocaleDateString('id-ID')}
                          </div>
                        )}
                        {item.daysLate && (
                          <div className="text-xs text-red-600 font-medium">
                            Terlambat {item.daysLate} hari
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.keperluan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatPage;