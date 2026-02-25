"use client"
import React, { useState } from 'react';
import { Search, Eye, X, Filter, AlertTriangle, CheckCircle, Clock, Wrench, User, Calendar, FileText, Phone, Mail, RotateCcw } from 'lucide-react';

const AlatRusakPage = () => {
  const [activeTab, setActiveTab] = useState('belum');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const [updateFormData, setUpdateFormData] = useState({
    catatanPerbaikan: '',
    tanggalDiperbaiki: '',
    diperbaikiOleh: '',
  });

  const [alatRusakList, setAlatRusakList] = useState([
    {
      id: 1,
      namaAlat: 'Erlenmeyer',
      spesifikasi: '25 ml',
      merkBrand: 'Pyrex',
      jumlahRusak: 2,
      keterangan: 'Retak pada bagian leher, tidak dapat digunakan untuk titrasi',
      tanggalRusak: '2024-02-10',
      penyimpanan: 'Lemari Kanan',
      status: 'Belum Diperbaiki',
      peminjamNama: 'Ahmad Fauzi',
      peminjamNIK: '2001234',
      peminjamStatus: 'Mahasiswa',
      peminjamInstitusi: 'Universitas Pendidikan Indonesia',
      peminjamFakultas: 'FPMIPA',
      peminjamJurusan: 'Pendidikan Kimia',
      peminjamPhone: '081234567890',
      peminjamEmail: 'ahmad.fauzi@upi.edu',
      peminjamanId: 1,
      keperluan: 'Praktikum Kimia Analitik',
      catatanPerbaikan: '',
      tanggalDiperbaiki: '',
      diperbaikiOleh: '',
    },
    {
      id: 2,
      namaAlat: 'Buret',
      spesifikasi: '10 ml',
      merkBrand: '',
      jumlahRusak: 1,
      keterangan: 'Stopcock macet dan bocor, kaca retak di bagian bawah',
      tanggalRusak: '2024-01-20',
      penyimpanan: 'Rak 1',
      status: 'Sudah Diperbaiki',
      peminjamNama: 'Budi Santoso',
      peminjamNIK: '3201012345678901',
      peminjamStatus: 'Umum',
      peminjamInstitusi: 'PT Kimia Indonesia',
      peminjamFakultas: '',
      peminjamJurusan: '',
      peminjamPhone: '081234567892',
      peminjamEmail: 'budi.santoso@kimia.co.id',
      peminjamanId: 3,
      keperluan: 'Quality Control',
      catatanPerbaikan: 'Stopcock diganti baru, bagian kaca yang retak telah diperbaiki. Alat sudah diuji dan berfungsi normal.',
      tanggalDiperbaiki: '2024-02-01',
      diperbaikiOleh: 'Teknisi Lab - Pak Surya',
    },
    {
      id: 3,
      namaAlat: 'Labu Ukur',
      spesifikasi: '100 ml',
      merkBrand: 'Pyrex',
      jumlahRusak: 1,
      keterangan: 'Tutup kaca hilang, tidak dapat digunakan untuk pengukuran presisi',
      tanggalRusak: '2024-03-01',
      penyimpanan: 'Rak 2',
      status: 'Belum Diperbaiki',
      peminjamNama: 'Dr. Siti Nurhaliza, M.Si',
      peminjamNIK: '198503152010122001',
      peminjamStatus: 'Dosen',
      peminjamInstitusi: 'Universitas Pendidikan Indonesia',
      peminjamFakultas: 'FPMIPA',
      peminjamJurusan: 'Pendidikan Kimia',
      peminjamPhone: '081234567891',
      peminjamEmail: 'siti.nurhaliza@upi.edu',
      peminjamanId: 2,
      keperluan: 'Penelitian',
      catatanPerbaikan: '',
      tanggalDiperbaiki: '',
      diperbaikiOleh: '',
    },
    {
      id: 4,
      namaAlat: 'Erlenmeyer',
      spesifikasi: '100 ml',
      merkBrand: '',
      jumlahRusak: 3,
      keterangan: 'Pecah saat jatuh dari meja, tidak bisa diperbaiki',
      tanggalRusak: '2024-02-25',
      penyimpanan: 'Rak 2',
      status: 'Sudah Diperbaiki',
      peminjamNama: 'Rizki Ramadhan',
      peminjamNIK: '2101567',
      peminjamStatus: 'Mahasiswa',
      peminjamInstitusi: 'Universitas Pendidikan Indonesia',
      peminjamFakultas: 'FPMIPA',
      peminjamJurusan: 'Kimia',
      peminjamPhone: '081298765432',
      peminjamEmail: 'rizki.ramadhan@upi.edu',
      peminjamanId: 4,
      keperluan: 'Praktikum Kimia Organik',
      catatanPerbaikan: 'Alat yang pecah tidak dapat diperbaiki, telah dihapus dari inventaris. Peminjam dikenakan biaya penggantian Rp 150.000.',
      tanggalDiperbaiki: '2024-03-05',
      diperbaikiOleh: 'Admin Lab - Bu Dewi',
    },
  ]);

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

  const handleShowDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleOpenUpdate = (item) => {
    setSelectedItem(item);
    setUpdateFormData({
      catatanPerbaikan: '',
      tanggalDiperbaiki: new Date().toISOString().split('T')[0],
      diperbaikiOleh: '',
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setAlatRusakList(prev => prev.map(item =>
      item.id === selectedItem.id
        ? { ...item, status: 'Sudah Diperbaiki', ...updateFormData }
        : item
    ));
    setShowUpdateModal(false);
    setSelectedItem(null);
  };

  const handleResetFilter = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const filteredList = alatRusakList.filter(item => {
    const tabFilter = activeTab === 'belum'
      ? item.status === 'Belum Diperbaiki'
      : item.status === 'Sudah Diperbaiki';

    const searchFilter =
      item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peminjamNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peminjamNIK.includes(searchTerm) ||
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());

    let dateFilter = true;
    if (filterDateFrom && filterDateTo) {
      const rusakDate = new Date(item.tanggalRusak);
      dateFilter = rusakDate >= new Date(filterDateFrom) && rusakDate <= new Date(filterDateTo);
    }

    return tabFilter && searchFilter && dateFilter;
  });

  const belumCount = alatRusakList.filter(i => i.status === 'Belum Diperbaiki').length;
  const sudahCount = alatRusakList.filter(i => i.status === 'Sudah Diperbaiki').length;
  const totalRusakUnit = alatRusakList.reduce((sum, i) => sum + i.jumlahRusak, 0);

  // ── Reusable Modal Wrapper ──────────────────────────────────────────────
  const ModalWrapper = ({ children, maxWidth = 'max-w-3xl' }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl w-full ${maxWidth} shadow-2xl my-4`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Alat Rusak</h1>
          <p className="text-gray-500 text-sm">Pencatatan dan penanganan alat laboratorium yang rusak</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Laporan Rusak</p>
              <p className="text-2xl font-bold text-gray-900">{alatRusakList.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">{totalRusakUnit} unit keseluruhan</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Belum Diperbaiki</p>
              <p className="text-2xl font-bold text-red-600">{belumCount}</p>
              <p className="text-xs text-red-400 mt-0.5">Perlu penanganan segera</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Sudah Ditangani</p>
              <p className="text-2xl font-bold text-green-600">{sudahCount}</p>
              <p className="text-xs text-green-500 mt-0.5">Selesai diperbaiki</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('belum')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'belum' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Clock className="w-4 h-4" />
              Belum Diperbaiki
              {belumCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold">{belumCount}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sudah')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'sudah' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CheckCircle className="w-4 h-4" />
              Riwayat Perbaikan
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">{sudahCount}</span>
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama alat, peminjam, atau keterangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filter Tanggal
              {(filterDateFrom && filterDateTo) && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">1</span>
              )}
            </button>
          </div>
          {(filterDateFrom && filterDateTo) && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter aktif:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {new Date(filterDateFrom).toLocaleDateString('id-ID')} – {new Date(filterDateTo).toLocaleDateString('id-ID')}
                <button onClick={handleResetFilter} className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">Peminjam</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Alat</th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan Kerusakan</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Tanggal</th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredList.length > 0 ? (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition align-center">
                      {/* ── Kolom Peminjam ── */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900 leading-tight">{item.peminjamNama}</p>
                        <p className="text-xs text-gray-500 mt-0.5">NIK/NIM: {item.peminjamNIK}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(item.peminjamStatus)}`}>
                          {item.peminjamStatus}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">{item.peminjamInstitusi}</p>
                      </td>

                      {/* ── Kolom Alat ── */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{item.namaAlat}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.spesifikasi}{item.merkBrand ? ` · ${item.merkBrand}` : ''}
                            </p>
                            <p className="text-xs text-gray-400">{item.penyimpanan}</p>
                            {/* Badge jumlah unit — di bawah nama, tidak menumpuk */}
                            <span className="inline-block mt-1.5 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              {item.jumlahRusak} unit rusak
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ── Kolom Keterangan ── */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 line-clamp-2 leading-snug">{item.keterangan}</p>
                        <p className="text-xs text-gray-400 mt-1 italic">Keperluan: {item.keperluan}</p>
                        {/* Jika sudah ditangani, tampilkan cuplikan catatan */}
                        {item.status === 'Sudah Diperbaiki' && item.catatanPerbaikan && (
                          <p className="text-xs text-green-600 mt-1.5 line-clamp-1 italic">✓ {item.catatanPerbaikan}</p>
                        )}
                      </td>

                      {/* ── Kolom Tanggal ── */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>Rusak: {new Date(item.tanggalRusak).toLocaleDateString('id-ID')}</span>
                        </div>
                        {item.tanggalDiperbaiki && (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <CheckCircle className="w-3 h-3 flex-shrink-0" />
                            <span>Ditangani: {new Date(item.tanggalDiperbaiki).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                      </td>

                      {/* ── Kolom Aksi ── */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShowDetail(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {item.status === 'Belum Diperbaiki' && (
                            <button
                              onClick={() => handleOpenUpdate(item)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium whitespace-nowrap"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Tangani
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        {activeTab === 'belum' ? 'Tidak ada alat rusak yang belum ditangani' : 'Belum ada riwayat perbaikan alat'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          MODAL DETAIL
      ══════════════════════════════════════════════ */}
      {showDetailModal && selectedItem && (
        <ModalWrapper maxWidth="max-w-3xl">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Detail Alat Rusak</h2>
              <p className="text-xs text-gray-400 mt-0.5">ID Laporan #{selectedItem.id}</p>
            </div>
            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Status Banner */}
            {selectedItem.status === 'Belum Diperbaiki' ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Belum Ditangani</p>
                  <p className="text-xs text-red-600 mt-0.5">Alat ini belum diperbaiki. Segera lakukan penanganan.</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Sudah Ditangani</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {new Date(selectedItem.tanggalDiperbaiki).toLocaleDateString('id-ID')} oleh {selectedItem.diperbaikiOleh}
                  </p>
                </div>
              </div>
            )}

            {/* Info Alat */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Informasi Alat
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Nama Alat</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{selectedItem.namaAlat}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Spesifikasi</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedItem.spesifikasi}</p>
                </div>
                {selectedItem.merkBrand && (
                  <div>
                    <p className="text-xs text-gray-500">Merk/Brand</p>
                    <p className="text-sm text-gray-900 mt-0.5">{selectedItem.merkBrand}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Jumlah Rusak</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-100 text-red-700 text-sm font-bold rounded">
                    {selectedItem.jumlahRusak} unit
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lokasi Penyimpanan</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedItem.penyimpanan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Rusak</p>
                  <p className="text-sm text-gray-900 mt-0.5">{new Date(selectedItem.tanggalRusak).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Keterangan Kerusakan</p>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800">{selectedItem.keterangan}</p>
                </div>
              </div>
            </div>

            {/* Info Peminjam */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Data Peminjam
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Nama Lengkap</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{selectedItem.peminjamNama}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIK/NIM</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedItem.peminjamNIK}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(selectedItem.peminjamStatus)}`}>
                    {selectedItem.peminjamStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Institusi</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedItem.peminjamInstitusi}</p>
                </div>
                {selectedItem.peminjamFakultas && (
                  <div>
                    <p className="text-xs text-gray-500">Fakultas</p>
                    <p className="text-sm text-gray-900 mt-0.5">{selectedItem.peminjamFakultas}</p>
                  </div>
                )}
                {selectedItem.peminjamJurusan && (
                  <div>
                    <p className="text-xs text-gray-500">Jurusan</p>
                    <p className="text-sm text-gray-900 mt-0.5">{selectedItem.peminjamJurusan}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">No. HP</p>
                  <p className="text-sm text-gray-900 mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" />{selectedItem.peminjamPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900 mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" />{selectedItem.peminjamEmail}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Keperluan Peminjaman</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedItem.keperluan}</p>
                </div>
              </div>
            </div>

            {/* Catatan Perbaikan */}
            {selectedItem.status === 'Sudah Diperbaiki' && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-green-600" /> Catatan Penanganan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Tanggal Ditangani</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {new Date(selectedItem.tanggalDiperbaiki).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ditangani Oleh</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedItem.diperbaikiOleh}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Catatan Perbaikan</p>
                    <div className="bg-white border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-gray-800">{selectedItem.catatanPerbaikan}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200 flex gap-3">
            {selectedItem.status === 'Belum Diperbaiki' && (
              <button
                onClick={() => { setShowDetailModal(false); handleOpenUpdate(selectedItem); }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Tandai Ditangani
              </button>
            )}
            <button
              onClick={() => setShowDetailModal(false)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
            >
              Tutup
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ══════════════════════════════════════════════
          MODAL TANGANI / UPDATE
      ══════════════════════════════════════════════ */}
      {showUpdateModal && selectedItem && (
        <ModalWrapper maxWidth="max-w-lg">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tandai Sudah Ditangani</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedItem.namaAlat} {selectedItem.spesifikasi} · {selectedItem.jumlahRusak} unit rusak
              </p>
            </div>
            <button onClick={() => setShowUpdateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleUpdateSubmit}>
            <div className="p-5 space-y-4">
              {/* Ringkasan Kerusakan */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Keterangan Kerusakan:</p>
                <p className="text-sm text-gray-800">{selectedItem.keterangan}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Dilaporkan oleh: <span className="font-medium text-gray-700">{selectedItem.peminjamNama}</span>
                </p>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tanggal Ditangani <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={updateFormData.tanggalDiperbaiki}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, tanggalDiperbaiki: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Ditangani Oleh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ditangani Oleh <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Teknisi Lab - Pak Surya, Admin Lab - Bu Dewi"
                  value={updateFormData.diperbaikiOleh}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, diperbaikiOleh: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Catatan Penanganan <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Jelaskan tindakan yang dilakukan: perbaikan, penggantian komponen, hapus dari inventaris, biaya yang dikenakan ke peminjam, dll."
                  value={updateFormData.catatanPerbaikan}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, catatanPerbaikan: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                  required
                />
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  Setelah disimpan, laporan ini akan dipindahkan ke tab{' '}
                  <strong>Riwayat Perbaikan</strong> dan tidak dapat diubah kembali.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Simpan Penanganan
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ══════════════════════════════════════════════
          MODAL FILTER
      ══════════════════════════════════════════════ */}
      {showFilterModal && (
        <ModalWrapper maxWidth="max-w-md">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Filter Tanggal Rusak</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Dari Tanggal</label>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sampai Tanggal</label>
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { handleResetFilter(); setShowFilterModal(false); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                Terapkan
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

    </div>
  );
};

export default AlatRusakPage;