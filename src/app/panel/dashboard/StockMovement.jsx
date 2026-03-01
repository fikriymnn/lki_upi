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
    _id: 'm5', type: 'ADJUSTMENT', itemModel: 'AlatLab',
    item: { _id: 'a3', nama_alat: 'Buret', spesifikasi: '10 ml', penyimpanan: 'Rak 1' },
    quantity: 3, previousStock: 15, newStock: 12, note: 'Penyesuaian hasil opname Maret 2025',
    createdBy: { name: 'Admin' }, createdAt: '2025-03-01T11:00:00Z'
  },
  {
    _id: 'm6', type: 'ADJUSTMENT', itemModel: 'BahanKimia',
    item: { _id: 'b3', nama_bahan: 'H2SO4', spesifikasi: '98%', satuan: 'L', penyimpanan: 'Lemari Kuning' },
    quantity: 1, previousStock: 3, newStock: 2, note: 'Penyesuaian hasil opname Maret 2025',
    createdBy: { name: 'Admin' }, createdAt: '2025-03-01T11:05:00Z'
  },
];

// ============================================================
// TYPE BADGE
// ============================================================
const TypeBadge = ({ type }) => {
  if (type === 'IN') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
      <ArrowDownCircle className="w-3 h-3 rotate-180" /> Stock In
    </span>
  );
  if (type === 'OUT') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
      <ArrowDownCircle className="w-3 h-3" /> Stock Out
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
      <SlidersHorizontal className="w-3 h-3" /> Adjustment
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
  const isIN  = movement.type === 'IN';
  const isADJ = movement.type === 'ADJUSTMENT';
  const diff  = movement.newStock - movement.previousStock;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detail Pergerakan Stok</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Type banner */}
          <div className={`flex items-center justify-between p-3 rounded-xl ${
            isIN ? 'bg-emerald-50' : isADJ ? 'bg-orange-50' : 'bg-red-50'
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
              <p className={`text-sm font-bold ${
                isIN ? 'text-emerald-600' : isADJ ? (diff >= 0 ? 'text-emerald-600' : 'text-orange-600') : 'text-red-600'
              }`}>
                {isIN ? '+' : isADJ ? (diff >= 0 ? '+' : '') : '-'}{movement.quantity} {satuan}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Perubahan Stok</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{movement.previousStock}</span>
                <span className="text-gray-400">→</span>
                <span className={`font-semibold ${
                  isIN ? 'text-emerald-600' : isADJ ? 'text-orange-600' : 'text-red-600'
                }`}>{movement.newStock}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Oleh</p>
              <p className="text-sm text-gray-700">{movement.createdBy?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tanggal</p>
              <p className="text-sm text-gray-700">
                {new Date(movement.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {movement.note && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Catatan</p>
              <p className="text-sm text-gray-700">{movement.note}</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200">
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
  const [showFilter, setShowFilter] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = mockMovements.filter(mv => {
    const name = mv.itemModel === 'AlatLab' ? mv.item?.nama_alat : mv.item?.nama_bahan;
    const matchTab    = mv.itemModel === activeTab;
    const matchSearch = name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mv.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType   = filterType === '' || mv.type === filterType;
    const mvDate      = new Date(mv.createdAt);
    const matchFrom   = !fromDate || mvDate >= new Date(fromDate);
    const matchTo     = !toDate   || mvDate <= new Date(new Date(toDate).setHours(23, 59, 59));
    return matchTab && matchSearch && matchType && matchFrom && matchTo;
  });

  const totalPage = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const hasActiveFilter = filterType || fromDate || toDate;

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab, filterType, fromDate, toDate]);

  const clearFilter = () => { setFilterType(''); setFromDate(''); setToDate(''); };

  // Summary per tab
  const tabData = mockMovements.filter(mv => mv.itemModel === activeTab);
  const totalIN  = tabData.filter(m => m.type === 'IN').length;
  const totalOUT = tabData.filter(m => m.type === 'OUT').length;
  const totalADJ = tabData.filter(m => m.type === 'ADJUSTMENT').length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Movement</h1>
            <p className="text-gray-500 text-sm">Riwayat seluruh pergerakan stok — masuk, keluar & penyesuaian</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-100">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">{tabData.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock In</p>
              <p className="text-xl font-bold text-gray-900">{totalIN}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-100">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock Out</p>
              <p className="text-xl font-bold text-gray-900">{totalOUT}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-100">
              <SlidersHorizontal className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Adjustment</p>
              <p className="text-xl font-bold text-gray-900">{totalADJ}</p>
            </div>
          </div>
        </div>

        {/* Tab */}
        <div className="bg-white rounded-t-xl border border-b-0 border-gray-200">
          <div className="flex">
            {[
              { key: 'BahanKimia', label: 'bahan kimia', icon: <FlaskConical className="w-4 h-4" /> },
              { key: 'AlatLab',    label: 'alat lab',    icon: <Wrench className="w-4 h-4" /> },
            ].map((tab, idx) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`flex items-center gap-2 px-8 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  idx === 0 ? 'rounded-tl-xl' : ''
                } ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Cari nama ${activeTab === 'BahanKimia' ? 'bahan' : 'alat'} atau catatan...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition whitespace-nowrap ${
                hasActiveFilter
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter</span>
              {hasActiveFilter && (
                <span className="w-4 h-4 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">!</span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="">Semua Tipe</option>
                    <option value="IN">Stock In</option>
                    <option value="OUT">Stock Out</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />Dari Tanggal
                  </label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />Sampai Tanggal
                  </label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              {hasActiveFilter && (
                <div className="mt-3 flex justify-end">
                  <button onClick={clearFilter} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
                    <X className="w-4 h-4" /> Reset Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Sebelum → Sesudah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.length > 0 ? paginated.map((mv, idx) => {
                  const itemName = mv.itemModel === 'AlatLab' ? mv.item?.nama_alat : mv.item?.nama_bahan;
                  const satuan   = mv.itemModel === 'BahanKimia' ? mv.item?.satuan : 'unit';
                  const isIN     = mv.type === 'IN';
                  const isADJ    = mv.type === 'ADJUSTMENT';
                  const diff     = mv.newStock - mv.previousStock;

                  return (
                    <tr key={mv._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * perPage + idx + 1}</td>
                      <td className="px-6 py-4"><TypeBadge type={mv.type} /></td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{itemName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{mv.item?.spesifikasi || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${
                          isIN  ? 'bg-emerald-100 text-emerald-700' :
                          isADJ ? 'bg-orange-100 text-orange-700'   :
                                  'bg-red-100 text-red-700'
                        }`}>
                          {isIN ? '+' : isADJ ? (diff >= 0 ? '+' : '') : '-'}{mv.quantity} {satuan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">{mv.previousStock}</span>
                          <span className="text-gray-400">→</span>
                          <span className={`font-semibold ${
                            isIN  ? 'text-emerald-600' :
                            isADJ ? 'text-orange-600'  :
                                    'text-red-600'
                          }`}>
                            {mv.newStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(mv.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(mv.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {mv.createdBy?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[140px]">
                        <p className="truncate">{mv.note || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => { setSelectedMovement(mv); setShowDetailModal(true); }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-16 text-center">
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
              <p className="text-sm text-gray-500">
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
                      <span key={idx} className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <button key={p} onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          currentPage === p ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
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