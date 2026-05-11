"use client"
import React, { useState, useEffect } from 'react';
import {
  Search, Filter, X, Eye, FlaskConical, Wrench,
  ArrowDownCircle, ArrowUpCircle, SlidersHorizontal,
  ChevronLeft, ChevronRight, Package, Calendar,
  TrendingUp, TrendingDown
} from 'lucide-react';

// ============================================================
// MOCK DATA
// ============================================================
const mockMovements = [
  {
    _id: 'm1', type: 'IN', itemModel: 'AlatLab',
    item: { _id: 'a1', nama_alat: 'Erlenmeyer', spesifikasi: '100 ml', penyimpanan: 'Rak 2' },
    quantity: 5, previousStock: 5, newStock: 10, note: 'Pembelian rutin',
    createdBy: { name: 'Admin' }, createdAt: '2025-02-20T08:00:00Z'
  },
  {
    _id: 'm2', type: 'IN', itemModel: 'BahanKimia',
    item: { _id: 'b1', nama_bahan: 'HCl', spesifikasi: '37%', satuan: 'L', penyimpanan: 'Lemari Kuning' },
    quantity: 2, previousStock: 3, newStock: 5, note: 'Restok bulanan',
    createdBy: { name: 'Admin' }, createdAt: '2025-02-22T09:30:00Z'
  },
  {
    _id: 'm3', type: 'OUT', itemModel: 'AlatLab',
    item: { _id: 'a2', nama_alat: 'Labu Jantung', spesifikasi: '50 ml', penyimpanan: 'Rak 3' },
    quantity: 1, previousStock: 5, newStock: 4, note: 'Dipakai praktikum',
    createdBy: { name: 'Admin' }, createdAt: '2025-02-25T10:00:00Z'
  },
  {
    _id: 'm4', type: 'OUT', itemModel: 'BahanKimia',
    item: { _id: 'b2', nama_bahan: 'NaOH', spesifikasi: 'p.a', satuan: 'kg', penyimpanan: 'Rak 1' },
    quantity: 1, previousStock: 3, newStock: 2, note: 'Praktikum titrasi',
    createdBy: { name: 'Lab Staff' }, createdAt: '2025-02-28T14:00:00Z'
  },
  {
    _id: 'm5', type: 'ADJUSTMENT_OUT', itemModel: 'AlatLab',
    item: { _id: 'a3', nama_alat: 'Buret', spesifikasi: '10 ml', penyimpanan: 'Rak 1' },
    quantity: 3, previousStock: 15, newStock: 12, note: 'Penyesuaian hasil opname Maret 2025',
    createdBy: { name: 'Admin' }, createdAt: '2025-03-01T11:00:00Z'
  },
  {
    _id: 'm6', type: 'ADJUSTMENT_OUT', itemModel: 'BahanKimia',
    item: { _id: 'b3', nama_bahan: 'H2SO4', spesifikasi: '98%', satuan: 'L', penyimpanan: 'Lemari Kuning' },
    quantity: 1, previousStock: 3, newStock: 2, note: 'Penyesuaian hasil opname Maret 2025',
    createdBy: { name: 'Admin' }, createdAt: '2025-03-01T11:05:00Z'
  },
  {
    _id: 'm7', type: 'ADJUSTMENT_IN', itemModel: 'BahanKimia',
    item: { _id: 'b4', nama_bahan: 'Etanol', spesifikasi: '96%', satuan: 'L', penyimpanan: 'Lemari Kuning' },
    quantity: 2, previousStock: 4, newStock: 6, note: 'Koreksi opname April 2025',
    createdBy: { name: 'Admin' }, createdAt: '2025-04-05T09:00:00Z'
  },
  {
    _id: 'm8', type: 'ADJUSTMENT_IN', itemModel: 'AlatLab',
    item: { _id: 'a4', nama_alat: 'Gelas Ukur', spesifikasi: '250 ml', penyimpanan: 'Rak 2' },
    quantity: 1, previousStock: 8, newStock: 9, note: 'Koreksi opname April 2025',
    createdBy: { name: 'Admin' }, createdAt: '2025-04-05T09:10:00Z'
  },
];

// Format tanggal ke huruf
const formatTanggal = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const formatTanggalWaktu = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${tgl}, ${jam}`;
};

// ============================================================
// TYPE BADGE
// ============================================================
const TypeBadge = ({ type }) => {
  if (type === 'IN') return (
    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
      Stock In
    </span>
  );
  if (type === 'OUT') return (
    <span className="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
      Stock Out
    </span>
  );
  if (type === 'ADJUSTMENT_IN') return (
    <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
      Adjustment In
    </span>
  );
  if (type === 'ADJUSTMENT_OUT') return (
    <span className="inline-flex items-center px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
      Adjustment Out
    </span>
  );
  return (
    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
      {type}
    </span>
  );
};

// ============================================================
// DETAIL MODAL
// ============================================================
const DetailModal = ({ movement, onClose }) => {
  if (!movement) return null;
  const itemName = movement.itemModel === 'AlatLab'
    ? movement.item?.nama_alat
    : movement.item?.nama_bahan;
  const satuan = movement.itemModel === 'BahanKimia' ? movement.item?.satuan : 'unit';
  const isIN = movement.type === 'IN' || movement.type === 'ADJUSTMENT_IN';
  const isADJ = movement.type === 'ADJUSTMENT_IN' || movement.type === 'ADJUSTMENT_OUT';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Detail Pergerakan Stok</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Type banner */}
          <div className={`flex items-center justify-between p-3 rounded-xl ${movement.type === 'IN' ? 'bg-emerald-50' :
            movement.type === 'OUT' ? 'bg-red-50' :
              movement.type === 'ADJUSTMENT_IN' ? 'bg-blue-50' :
                'bg-orange-50'
            }`}>
            <span className="text-sm text-gray-500">Tipe</span>
            <TypeBadge type={movement.type} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Jenis Item</p>
              {movement.itemModel === 'AlatLab' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  <Wrench className="w-3 h-3" /> Alat Lab
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  <FlaskConical className="w-3 h-3" /> Bahan Kimia
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nama Item</p>
              <p className="text-sm font-semibold text-gray-900">{itemName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Spesifikasi</p>
              <p className="text-sm text-gray-700">{movement.item?.spesifikasi || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Lokasi</p>
              <p className="text-sm text-gray-700">{movement.item?.penyimpanan || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah</p>
              <p className={`text-sm font-bold ${isIN ? 'text-emerald-600' : 'text-red-600'
                }`}>
                {isIN ? '+' : '-'}{movement.quantity} {satuan}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Oleh</p>
              <p className="text-sm text-gray-700">{movement.createdBy?.name || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 mb-1">Tanggal</p>
              <p className="text-sm text-gray-700">{formatTanggalWaktu(movement.createdAt)}</p>
            </div>
          </div>

          {movement.note && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Catatan</p>
              <p className="text-sm text-gray-700">{movement.note}</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN PAGE: STOCK MOVEMENT
// ============================================================
const StockMovementPage = () => {
  const [activeTab, setActiveTab] = useState('BahanKimia');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = mockMovements.filter(mv => {
    const name = mv.itemModel === 'AlatLab' ? mv.item?.nama_alat : mv.item?.nama_bahan;
    const matchTab = mv.itemModel === activeTab;
    const matchSearch = name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mv.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === '' || mv.type === filterType;
    const mvDate = new Date(mv.createdAt);
    const matchFrom = !fromDate || mvDate >= new Date(fromDate);
    const matchTo = !toDate || mvDate <= new Date(new Date(toDate).setHours(23, 59, 59));
    return matchTab && matchSearch && matchType && matchFrom && matchTo;
  });

  const totalPage = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const hasActiveFilter = filterType || fromDate || toDate;

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab, filterType, fromDate, toDate]);

  const clearFilter = () => { setFilterType(''); setFromDate(''); setToDate(''); };

  // Summary per tab
  const tabData = mockMovements.filter(mv => mv.itemModel === activeTab);
  const totalIN = tabData.filter(m => m.type === 'IN').length;
  const totalOUT = tabData.filter(m => m.type === 'OUT').length;
  const totalADJ = tabData.filter(m => m.type === 'ADJUSTMENT_IN' || m.type === 'ADJUSTMENT_OUT').length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Stock Movement</h1>
          <p className="text-gray-500 text-sm">Riwayat seluruh pergerakan stok — masuk, keluar & penyesuaian</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card Total */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
            <p className="text-2xl font-bold text-gray-900">{tabData.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Semua transaksi</p>
          </div>

          {/* Card Stock In */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Stock In</p>
            <p className="text-2xl font-bold text-emerald-600">{totalIN}</p>
            <p className="text-xs text-emerald-500 mt-0.5">Unit ditambahkan</p>
          </div>

          {/* Card Stock Out */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Stock Out</p>
            <p className="text-2xl font-bold text-red-600">{totalOUT}</p>
            <p className="text-xs text-red-500 mt-0.5">Unit berkurang</p>
          </div>

          {/* Card Adjustment */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Adjustment</p>
            <p className="text-2xl font-bold text-orange-600">{totalADJ}</p>
            <p className="text-xs text-orange-500 mt-0.5">Unit disesuaikan</p>
          </div>
        </div>

        {/* Tab - konsisten dengan halaman lain */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('BahanKimia'); setCurrentPage(1); }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition ${activeTab === 'BahanKimia'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <FlaskConical className="w-4 h-4" />
              Bahan Kimia ({mockMovements.filter(m => m.itemModel === 'BahanKimia').length})
            </button>
            <button
              onClick={() => { setActiveTab('AlatLab'); setCurrentPage(1); }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition ${activeTab === 'AlatLab'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Wrench className="w-4 h-4" />
              Alat Lab ({mockMovements.filter(m => m.itemModel === 'AlatLab').length})
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Cari nama ${activeTab === 'BahanKimia' ? 'bahan' : 'alat'} atau catatan...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition whitespace-nowrap ${hasActiveFilter
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter</span>
              {hasActiveFilter && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                  {[filterType, fromDate, toDate].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {hasActiveFilter && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">Filter aktif:</span>
              {filterType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Tipe: {filterType === 'IN' ? 'Stock In' : filterType === 'OUT' ? 'Stock Out' : filterType === 'ADJUSTMENT_IN' ? 'Adjustment In' : 'Adjustment Out'}
                  <button onClick={() => setFilterType('')} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </span>
              )}
              {(fromDate || toDate) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {fromDate && toDate ? `${formatTanggal(fromDate)} – ${formatTanggal(toDate)}` : fromDate ? `Dari ${formatTanggal(fromDate)}` : `Sampai ${formatTanggal(toDate)}`}
                  <button onClick={() => { setFromDate(''); setToDate(''); }} className="hover:bg-purple-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearFilter} className="text-xs text-red-600 hover:text-red-700 font-medium ml-1">Reset semua</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.length > 0 ? paginated.map((mv, idx) => {
                  const itemName = mv.itemModel === 'AlatLab' ? mv.item?.nama_alat : mv.item?.nama_bahan;
                  const satuan = mv.itemModel === 'BahanKimia' ? mv.item?.satuan : 'unit';
                  const isIN = mv.type === 'IN' || mv.type === 'ADJUSTMENT_IN';

                  return (
                    <tr key={mv._id} className="hover:bg-gray-50 transition">
                      {/* No */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{(currentPage - 1) * perPage + idx + 1}</span>
                      </td>

                      {/* Nama Item */}
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-gray-900">{itemName}</p>
                      </td>

                      {/* Tipe */}
                      <td className="px-4 py-3">
                        <TypeBadge type={mv.type} />
                      </td>

                      {/* Jumlah */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${isIN ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isIN ? '+' : '-'}{mv.quantity} {satuan}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700 flex items-center ">                        <Calendar className="w-3 h-3 flex-shrink-0 text-gray-400 mr-1" /> {formatTanggal(mv.createdAt)}</p>
                      </td>

                      {/* Catatan */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-600 max-w-xs truncate">{mv.note || '-'}</p>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelectedMovement(mv); setShowDetailModal(true); }}
                          title="Lihat Detail"
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Package className="w-12 h-12 opacity-30" />
                        <p className="text-sm">
                          Belum ada riwayat pergerakan stok untuk {activeTab === 'BahanKimia' ? 'bahan kimia' : 'alat lab'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > perPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length} data
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPage }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPage || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === '...' ? (
                      <span key={idx} className="px-2 text-gray-400 text-xs">...</span>
                    ) : (
                      <button key={p} onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-lg text-xs font-medium transition ${currentPage === p ? 'bg-red-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}>
                        {p}
                      </button>
                    )
                  )}
                <button onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))} disabled={currentPage === totalPage}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal (Popup) */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Filter Data</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                >
                  <option value="">Semua Tipe</option>
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                  <option value="ADJUSTMENT_IN">Adjustment In</option>
                  <option value="ADJUSTMENT_OUT">Adjustment Out</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                {fromDate && <p className="mt-1 text-xs text-gray-500">{formatTanggal(fromDate)}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                {toDate && <p className="mt-1 text-xs text-gray-500">{formatTanggal(toDate)}</p>}
              </div>
              {fromDate && toDate && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-purple-800">
                    Menampilkan data dari <strong>{formatTanggal(fromDate)}</strong> sampai <strong>{formatTanggal(toDate)}</strong>
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={() => { clearFilter(); setShowFilterModal(false); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <DetailModal
          movement={selectedMovement}
          onClose={() => { setShowDetailModal(false); setSelectedMovement(null); }}
        />
      )}
    </div>
  );
};

export default StockMovementPage;