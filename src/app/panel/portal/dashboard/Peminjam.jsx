"use client"
import React, { useState } from 'react';
import { Plus, Search, User, Eye, Phone, Mail, Building2, ChevronDown, X, Package, Wrench, Calendar, Clock, AlertCircle, FileText, Filter } from 'lucide-react';

const MasterPeminjamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeminjam, setSelectedPeminjam] = useState(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState('alat');
  const [filterStatus, setFilterStatus] = useState('semua');

  const STATUS_OPTIONS = ['Mahasiswa', 'Dosen', 'Staff', 'Peneliti', 'Umum'];

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    status: 'Mahasiswa',
    institusi: '',
    fakultas: '',
    jurusan: '',
    phone: '',
    alamat: '',
    email: '',
  });

  const [masterPeminjam, setMasterPeminjam] = useState([
    {
      id: 1,
      name: 'Ahmad Fauzi',
      nik: '2001234',
      status: 'Mahasiswa',
      institusi: 'Universitas Pendidikan Indonesia',
      fakultas: 'FPMIPA',
      jurusan: 'Pendidikan Kimia',
      phone: '081234567890',
      alamat: 'Jl. Setiabudhi No. 229, Bandung',
      email: 'ahmad.fauzi@upi.edu'
    },
    {
      id: 2,
      name: 'Dr. Siti Nurhaliza, M.Si',
      nik: '198503152010122001',
      status: 'Dosen',
      institusi: 'Universitas Pendidikan Indonesia',
      fakultas: 'FPMIPA',
      jurusan: 'Pendidikan Kimia',
      phone: '081234567891',
      alamat: 'Jl. Dr. Setiabudhi No. 100, Bandung',
      email: 'siti.nurhaliza@upi.edu'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      nik: '3201012345678901',
      status: 'Umum',
      institusi: 'PT Kimia Indonesia',
      fakultas: '',
      jurusan: '',
      phone: '081234567892',
      alamat: 'Jl. Industri No. 45, Bandung',
      email: 'budi.santoso@kimia.co.id'
    },
    {
      id: 4,
      name: 'Rizki Ramadhan',
      nik: '2101567',
      status: 'Mahasiswa',
      institusi: 'Universitas Pendidikan Indonesia',
      fakultas: 'FPMIPA',
      jurusan: 'Kimia',
      phone: '081298765432',
      alamat: 'Jl. Cimahi No. 12, Bandung',
      email: 'rizki.ramadhan@upi.edu'
    },
  ]);

  // Riwayat peminjaman alat per peminjam
  const riwayatAlatData = {
    1: [
      {
        id: 1,
        items: [{ namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', jumlahPinjam: 3, jumlahKembali: 3 }],
        tanggalPinjam: '2024-02-01',
        tanggalKembali: '2024-02-10',
        tanggalDikembalikan: '2024-02-10',
        status: 'Dikembalikan',
        keperluan: 'Praktikum Kimia Analitik',
        catatanPengembalian: 'Semua alat dikembalikan dalam kondisi baik'
      },
      {
        id: 2,
        items: [{ namaAlat: 'Buret', spesifikasi: '10 ml', jumlahPinjam: 2, jumlahKembali: 0 }],
        tanggalPinjam: '2024-03-05',
        tanggalKembali: '2024-03-15',
        tanggalDikembalikan: null,
        status: 'Dipinjam',
        keperluan: 'Penelitian Skripsi',
        catatanPengembalian: ''
      },
    ],
    2: [
      {
        id: 3,
        items: [{ namaAlat: 'Labu jantung', spesifikasi: '50 ml', jumlahPinjam: 2, jumlahKembali: 2 }],
        tanggalPinjam: '2024-01-28',
        tanggalKembali: '2024-02-05',
        tanggalDikembalikan: '2024-02-04',
        status: 'Dikembalikan',
        keperluan: 'Penelitian',
        catatanPengembalian: 'Semua alat dikembalikan dalam kondisi baik'
      },
    ],
    3: [
      {
        id: 4,
        items: [{ namaAlat: 'Buret', spesifikasi: '10 ml', jumlahPinjam: 5, jumlahKembali: 5 }],
        tanggalPinjam: '2024-01-15',
        tanggalKembali: '2024-01-25',
        tanggalDikembalikan: '2024-02-20',
        status: 'Dikembalikan',
        keperluan: 'Quality Control',
        catatanPengembalian: 'Pengembalian terlambat 26 hari.'
      },
    ],
    4: [],
  };

  // Riwayat peminjaman bahan per peminjam
  const riwayatBahanData = {
    1: [
      {
        id: 1,
        items: [{ namaBahan: 'Carbon disulfide', rumusKimia: 'Cs2', jumlahPinjam: 100, jumlahKembali: 100, satuan: 'mL' }],
        tanggalPinjam: '2024-02-01',
        tanggalKembali: '2024-02-10',
        tanggalDikembalikan: '2024-02-09',
        status: 'Dikembalikan',
        keperluan: 'Praktikum Kimia Analitik',
        catatanPengembalian: 'Semua bahan dikembalikan'
      },
    ],
    2: [
      {
        id: 2,
        items: [{ namaBahan: 'Natrium Klorida', rumusKimia: 'NaCl', jumlahPinjam: 500, jumlahKembali: 500, satuan: 'g' }],
        tanggalPinjam: '2024-01-28',
        tanggalKembali: '2024-02-05',
        tanggalDikembalikan: '2024-02-04',
        status: 'Dikembalikan',
        keperluan: 'Penelitian',
        catatanPengembalian: 'Semua bahan dikembalikan dalam kondisi baik'
      },
    ],
    3: [
      {
        id: 3,
        items: [{ namaBahan: 'Carbon disulfide', rumusKimia: 'Cs2', jumlahPinjam: 150, jumlahKembali: 150, satuan: 'mL' }],
        tanggalPinjam: '2024-01-15',
        tanggalKembali: '2024-01-25',
        tanggalDikembalikan: '2024-02-20',
        status: 'Dikembalikan',
        keperluan: 'Quality Control',
        catatanPengembalian: 'Pengembalian terlambat.'
      },
    ],
    4: [],
  };

  const isLate = (tanggalKembali, tanggalDikembalikan) => {
    if (!tanggalDikembalikan) return false;
    return new Date(tanggalDikembalikan) > new Date(tanggalKembali);
  };

  const calculateLateDays = (tanggalKembali, tanggalDikembalikan) => {
    if (!tanggalDikembalikan) return 0;
    const diff = new Date(tanggalDikembalikan) - new Date(tanggalKembali);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Mahasiswa': return 'bg-blue-100 text-blue-700';
      case 'Dosen': return 'bg-purple-100 text-purple-700';
      case 'Staff': return 'bg-green-100 text-green-700';
      case 'Peneliti': return 'bg-orange-100 text-orange-700';
      case 'Umum': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPeminjamanStatusColor = (status) => {
    switch (status) {
      case 'Dipinjam': return 'bg-blue-100 text-blue-700';
      case 'Dikembalikan': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.nik || !formData.institusi || !formData.phone || !formData.email) {
      alert('Harap isi semua field wajib');
      return;
    }
    const newId = Math.max(...masterPeminjam.map(p => p.id)) + 1;
    setMasterPeminjam(prev => [...prev, { id: newId, ...formData }]);
    riwayatAlatData[newId] = [];
    riwayatBahanData[newId] = [];
    setShowAddModal(false);
    setFormData({ name: '', nik: '', status: 'Mahasiswa', institusi: '', fakultas: '', jurusan: '', phone: '', alamat: '', email: '' });
  };

  const handleShowDetail = (peminjam) => {
    setSelectedPeminjam(peminjam);
    setActiveHistoryTab('alat');
    setFilterStatus('semua');
    setShowDetailModal(true);
  };

  const filteredPeminjam = masterPeminjam.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nik.includes(searchTerm) ||
    p.institusi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilteredHistory = (peminjamId, type) => {
    const data = type === 'alat' ? (riwayatAlatData[peminjamId] || []) : (riwayatBahanData[peminjamId] || []);
    if (filterStatus === 'semua') return data;
    return data.filter(item => item.status === filterStatus);
  };

  const getTotalPeminjaman = (peminjamId) => {
    return (riwayatAlatData[peminjamId]?.length || 0) + (riwayatBahanData[peminjamId]?.length || 0);
  };

  const getAktifCount = (peminjamId) => {
    const alat = (riwayatAlatData[peminjamId] || []).filter(i => i.status === 'Dipinjam').length;
    const bahan = (riwayatBahanData[peminjamId] || []).filter(i => i.status === 'Dipinjam').length;
    return alat + bahan;
  };

  const getTerlambatCount = (peminjamId) => {
    const alat = (riwayatAlatData[peminjamId] || []).filter(i => i.tanggalDikembalikan && isLate(i.tanggalKembali, i.tanggalDikembalikan)).length;
    const bahan = (riwayatBahanData[peminjamId] || []).filter(i => i.tanggalDikembalikan && isLate(i.tanggalKembali, i.tanggalDikembalikan)).length;
    return alat + bahan;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Peminjam</h1>
          <p className="text-gray-600">Kelola data peminjam alat dan bahan kimia laboratorium</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NIK/NIM, institusi, atau status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Peminjam</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riwayat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPeminjam.length > 0 ? (
                  filteredPeminjam.map((peminjam, index) => {
                    const aktif = getAktifCount(peminjam.id);
                    const terlambat = getTerlambatCount(peminjam.id);
                    const total = getTotalPeminjaman(peminjam.id);
                    return (
                      <tr key={peminjam.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{peminjam.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">NIK/NIM: {peminjam.nik}</div>
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(peminjam.status)}`}>
                            {peminjam.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <Phone className="w-3 h-3" />
                            {peminjam.phone}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            {peminjam.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{peminjam.institusi}</div>
                          {peminjam.fakultas && <div className="text-xs text-gray-500 mt-0.5">{peminjam.fakultas}</div>}
                          {peminjam.jurusan && <div className="text-xs text-gray-500">{peminjam.jurusan}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600">Total: <span className="font-semibold text-gray-900">{total}</span> transaksi</span>
                            {aktif > 0 && (
                              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 w-fit">
                                {aktif} aktif
                              </span>
                            )}
                            {terlambat > 0 && (
                              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 w-fit">
                                {terlambat}x terlambat
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleShowDetail(peminjam)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-12 h-12 text-gray-300" />
                        <p className="text-sm">Peminjam tidak ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedPeminjam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Detail Peminjam</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Informasi lengkap dan riwayat transaksi</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Peminjam */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informasi Peminjam
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nama Lengkap</label>
                      <p className="text-sm font-semibold text-gray-900">{selectedPeminjam.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">NIK/NIM</label>
                      <p className="text-sm text-gray-900">{selectedPeminjam.nik}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(selectedPeminjam.status)}`}>
                        {selectedPeminjam.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Institusi</label>
                      <p className="text-sm text-gray-900">{selectedPeminjam.institusi}</p>
                    </div>
                    {selectedPeminjam.fakultas && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fakultas</label>
                        <p className="text-sm text-gray-900">{selectedPeminjam.fakultas}</p>
                      </div>
                    )}
                    {selectedPeminjam.jurusan && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Jurusan/Prodi</label>
                        <p className="text-sm text-gray-900">{selectedPeminjam.jurusan}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">No. HP</label>
                      <p className="text-sm text-gray-900 flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedPeminjam.phone}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-sm text-gray-900 flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedPeminjam.email}</p>
                    </div>
                    {selectedPeminjam.alamat && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Alamat</label>
                        <p className="text-sm text-gray-900">{selectedPeminjam.alamat}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{getTotalPeminjaman(selectedPeminjam.id)}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Transaksi</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{getAktifCount(selectedPeminjam.id)}</p>
                    <p className="text-xs text-blue-600 mt-1">Sedang Dipinjam</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{getTerlambatCount(selectedPeminjam.id)}</p>
                    <p className="text-xs text-red-600 mt-1">Riwayat Terlambat</p>
                  </div>
                </div>

                {/* Riwayat Transaksi */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Riwayat Transaksi Peminjaman
                  </h3>

                  {/* Tab Alat / Bahan */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActiveHistoryTab('alat')}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition ${activeHistoryTab === 'alat' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Wrench className="w-4 h-4" />
                      Alat Lab ({riwayatAlatData[selectedPeminjam.id]?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveHistoryTab('bahan')}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition ${activeHistoryTab === 'bahan' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Package className="w-4 h-4" />
                      Bahan Kimia ({riwayatBahanData[selectedPeminjam.id]?.length || 0})
                    </button>
                  </div>

                  {/* Filter Status */}
                  <div className="flex gap-2 mb-4">
                    {['semua', 'Dipinjam', 'Dikembalikan'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1 text-xs rounded-full border transition ${filterStatus === s ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {s === 'semua' ? 'Semua' : s}
                      </button>
                    ))}
                  </div>

                  {/* History List */}
                  {(() => {
                    const historyData = getFilteredHistory(selectedPeminjam.id, activeHistoryTab);
                    if (historyData.length === 0) {
                      return (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                          {activeHistoryTab === 'alat' ? <Wrench className="w-10 h-10 mx-auto mb-2 text-gray-300" /> : <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />}
                          <p className="text-sm">Belum ada riwayat peminjaman {activeHistoryTab === 'alat' ? 'alat' : 'bahan'}</p>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        {historyData.map((transaksi) => {
                          const late = transaksi.tanggalDikembalikan && isLate(transaksi.tanggalKembali, transaksi.tanggalDikembalikan);
                          const lateDays = late ? calculateLateDays(transaksi.tanggalKembali, transaksi.tanggalDikembalikan) : 0;
                          return (
                            <div key={transaksi.id} className={`border rounded-xl p-4 ${late ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex gap-2 flex-wrap">
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPeminjamanStatusColor(transaksi.status)}`}>
                                    {transaksi.status}
                                  </span>
                                  {late && (
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                      Terlambat {lateDays} hari
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 text-right">
                                  <div className="flex items-center gap-1 justify-end">
                                    <Calendar className="w-3 h-3" />
                                    Pinjam: {new Date(transaksi.tanggalPinjam).toLocaleDateString('id-ID')}
                                  </div>
                                  <div className="flex items-center gap-1 justify-end mt-0.5">
                                    <Clock className="w-3 h-3" />
                                    Target: {new Date(transaksi.tanggalKembali).toLocaleDateString('id-ID')}
                                  </div>
                                  {transaksi.tanggalDikembalikan && (
                                    <div className={`flex items-center gap-1 justify-end mt-0.5 ${late ? 'text-red-600' : 'text-green-600'}`}>
                                      <Clock className="w-3 h-3" />
                                      Kembali: {new Date(transaksi.tanggalDikembalikan).toLocaleDateString('id-ID')}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Items */}
                              <div className="space-y-1 mb-3">
                                {transaksi.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                                    <div>
                                      <span className="font-medium text-gray-900">
                                        {activeHistoryTab === 'alat' ? item.namaAlat : item.namaBahan}
                                      </span>
                                      <span className="text-gray-500 ml-2 text-xs">
                                        {activeHistoryTab === 'alat' ? item.spesifikasi : item.rumusKimia}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {item.jumlahKembali}/{item.jumlahPinjam} {activeHistoryTab === 'bahan' ? item.satuan : 'unit'} dikembalikan
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-start justify-between text-xs text-gray-500">
                                <span>Keperluan: <span className="text-gray-700">{transaksi.keperluan}</span></span>
                              </div>

                              {transaksi.catatanPengembalian && (
                                <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${late ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                                  <FileText className="w-3 h-3 inline mr-1" />
                                  {transaksi.catatanPengembalian}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Tambah Peminjam Baru</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-600">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama lengkap" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIK/NIM <span className="text-red-600">*</span></label>
                    <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} placeholder="NIK/NIM" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-600">*</span></label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institusi <span className="text-red-600">*</span></label>
                    <input type="text" name="institusi" value={formData.institusi} onChange={handleInputChange} placeholder="Nama institusi/kampus" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fakultas <span className="text-gray-400 text-xs">(Opsional)</span></label>
                    <input type="text" name="fakultas" value={formData.fakultas} onChange={handleInputChange} placeholder="Nama fakultas" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan/Prodi <span className="text-gray-400 text-xs">(Opsional)</span></label>
                    <input type="text" name="jurusan" value={formData.jurusan} onChange={handleInputChange} placeholder="Nama jurusan/prodi" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP <span className="text-red-600">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-600">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Alamat lengkap" rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Batal
                  </button>
                  <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterPeminjamPage;