"use client"
import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, X, Eye, ChevronDown,
  FlaskConical, Wrench, ArrowDownCircle, Calendar,
  ChevronLeft, ChevronRight, Package
} from 'lucide-react';

// ============================================================
// MOCK DATA (hapus & ganti API call)
// ============================================================
const mockAlatLab = [
  { _id: 'a1', nama_alat: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 10, merk_brand: 'Pyrex', penyimpanan: 'Rak 2' },
  { _id: 'a2', nama_alat: 'Labu Jantung', spesifikasi: '50 ml', jumlah: 4, merk_brand: 'Duran', penyimpanan: 'Rak 3' },
  { _id: 'a3', nama_alat: 'Buret', spesifikasi: '10 ml', jumlah: 15, merk_brand: '', penyimpanan: 'Rak 1' },
];

const mockBahanKimia = [
  { _id: 'b1', nama_bahan: 'HCl', rumus_kimia: 'HCl', spesifikasi: '37%', jumlah: 5, satuan: 'L', penyimpanan: 'Lemari Kuning' },
  { _id: 'b2', nama_bahan: 'NaOH', rumus_kimia: 'NaOH', spesifikasi: 'p.a', jumlah: 2, satuan: 'kg', penyimpanan: 'Rak 1' },
  { _id: 'b3', nama_bahan: 'H2SO4', rumus_kimia: 'H₂SO₄', spesifikasi: '98%', jumlah: 3, satuan: 'L', penyimpanan: 'Lemari Kuning' },
];

const mockTransactionsIN = [
  {
    _id: 't1', type: 'IN', itemModel: 'AlatLab',
    item: { _id: 'a1', nama_alat: 'Erlenmeyer', spesifikasi: '100 ml' },
    quantity: 5, previousStock: 5, newStock: 10, note: 'Pembelian rutin',
    createdBy: { name: 'Admin' }, createdAt: '2025-02-20T08:00:00Z'
  },
  {
    _id: 't2', type: 'IN', itemModel: 'BahanKimia',
    item: { _id: 'b1', nama_bahan: 'HCl', spesifikasi: '37%' },
    quantity: 2, previousStock: 3, newStock: 5, note: 'Restok bulanan',
    createdBy: { name: 'Admin' }, createdAt: '2025-02-22T09:30:00Z'
  },
];

// ============================================================
// FORMAT TANGGAL
// ============================================================
const formatTanggal = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

// ============================================================
// BADGE ITEM MODEL
// ============================================================
const ItemModelBadge = ({ itemModel }) => {
  if (itemModel === 'AlatLab') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
        <Wrench className="w-3 h-3" /> Alat Lab
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
      <FlaskConical className="w-3 h-3" /> Bahan Kimia
    </span>
  );
};

// ============================================================
// DETAIL MODAL
// ============================================================
const DetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;
  const itemName = transaction.itemModel === 'AlatLab'
    ? transaction.item?.nama_alat
    : transaction.item?.nama_bahan;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Detail Transaksi Stock In</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
            <span className="text-sm text-gray-500">Tipe Transaksi</span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
              ▲ Stock In
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Jenis Item</p>
              <ItemModelBadge itemModel={transaction.itemModel} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nama Item</p>
              <p className="text-sm font-semibold text-gray-900">{itemName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Spesifikasi</p>
              <p className="text-sm text-gray-700">{transaction.item?.spesifikasi || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah Masuk</p>
              <p className="text-sm font-bold text-emerald-600">+{transaction.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Oleh</p>
              <p className="text-sm text-gray-700">{transaction.createdBy?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tanggal</p>
              <p className="text-sm text-gray-700">{formatTanggal(transaction.createdAt)}</p>
            </div>
          </div>
          {transaction.note && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Catatan</p>
              <p className="text-sm text-gray-700">{transaction.note}</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD STOCK IN MODAL
// ============================================================
const AddStockInModal = ({ itemModel, onClose, onSubmit }) => {
  const [searchItem, setSearchItem] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const itemList = itemModel === 'AlatLab' ? mockAlatLab : mockBahanKimia;
  const filteredItems = itemList.filter(item => {
    const name = itemModel === 'AlatLab' ? item.nama_alat : item.nama_bahan;
    return name.toLowerCase().includes(searchItem.toLowerCase());
  });

  const getItemName = (item) => itemModel === 'AlatLab' ? item.nama_alat : item.nama_bahan;

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchItem(getItemName(item));
    setShowItemDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedItem || !quantity || parseInt(quantity) <= 0) {
      alert('Mohon lengkapi data transaksi!');
      return;
    }
    onSubmit({
      itemId: selectedItem._id,
      itemModel,
      quantity: parseInt(quantity),
      note,
      type: 'IN',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-emerald-50 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <ArrowDownCircle className="w-5 h-5 text-emerald-600 rotate-180" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tambah Stock In</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {itemModel === 'AlatLab' ? (
                    <>
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">Alat Lab</span>
                    </>
                  ) : (
                    <>
                      <FlaskConical className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Bahan Kimia</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-60 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {itemModel === 'AlatLab' ? 'Nama Alat' : 'Nama Bahan'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Cari ${itemModel === 'AlatLab' ? 'alat lab' : 'bahan kimia'}...`}
                value={searchItem}
                onChange={(e) => { setSearchItem(e.target.value); setSelectedItem(null); setShowItemDropdown(true); }}
                onFocus={() => setShowItemDropdown(true)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              {showItemDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                  {filteredItems.length > 0 ? filteredItems.map(item => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getItemName(item)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.spesifikasi}{item.merk_brand ? ` • ${item.merk_brand}` : ''} • {item.penyimpanan}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                          item.jumlah > 5 ? 'bg-green-100 text-green-700' :
                          item.jumlah > 0 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Stok: {item.jumlah}{itemModel === 'BahanKimia' ? ` ${item.satuan}` : ' unit'}
                        </span>
                      </div>
                    </button>
                  )) : (
                    <p className="px-4 py-3 text-sm text-gray-500 text-center">Item tidak ditemukan</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedItem && (
            <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-gray-600">Item Terpilih</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{getItemName(selectedItem)}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-gray-500">{selectedItem.spesifikasi}</span>
                <span className="text-xs text-gray-500">📍 {selectedItem.penyimpanan}</span>
                <span className={`text-xs font-semibold ${
                  selectedItem.jumlah > 5 ? 'text-green-600' :
                  selectedItem.jumlah > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  Stok saat ini: {selectedItem.jumlah}{itemModel === 'BahanKimia' ? ` ${selectedItem.satuan}` : ' unit'}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Masuk <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Masukkan jumlah..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {selectedItem && quantity && parseInt(quantity) > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Stok sesudah:{' '}
                <span className="font-semibold text-emerald-600">
                  {selectedItem.jumlah + parseInt(quantity)} {itemModel === 'BahanKimia' ? selectedItem.satuan : 'unit'}
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan <span className="text-gray-400 text-xs">(Opsional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Pembelian rutin, restok dari supplier..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
            Batal
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 text-white rounded-lg transition font-medium bg-emerald-600 hover:bg-emerald-700">
            Simpan Stock In
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// FILTER MODAL
// ============================================================
const FilterModal = ({ fromDate, toDate, setFromDate, setToDate, onClose, onReset }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filter Tanggal</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Dari Tanggal</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sampai Tanggal</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => { onReset(); onClose(); }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN PAGE: STOCK IN
// ============================================================
const StockInPage = () => {
  const [transactions, setTransactions] = useState(mockTransactionsIN);
  const [activeTab, setActiveTab] = useState('BahanKimia');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = transactions.filter(trx => {
    const name = trx.itemModel === 'AlatLab' ? trx.item?.nama_alat : trx.item?.nama_bahan;
    const matchTab    = trx.itemModel === activeTab;
    const matchSearch = name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const trxDate  = new Date(trx.createdAt);
    const matchFrom = !fromDate || trxDate >= new Date(fromDate);
    const matchTo   = !toDate   || trxDate <= new Date(new Date(toDate).setHours(23, 59, 59));
    return matchTab && matchSearch && matchFrom && matchTo;
  });

  const totalPage = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const hasActiveFilter = fromDate || toDate;

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab, fromDate, toDate]);

  const clearFilter = () => { setFromDate(''); setToDate(''); };

  const handleSubmit = (formData) => {
    const item = formData.itemModel === 'AlatLab'
      ? mockAlatLab.find(a => a._id === formData.itemId)
      : mockBahanKimia.find(b => b._id === formData.itemId);
    const prev = item?.jumlah || 0;
    const newTrx = {
      _id: 't' + Date.now(),
      type: 'IN',
      itemModel: formData.itemModel,
      item,
      quantity: formData.quantity,
      previousStock: prev,
      newStock: prev + formData.quantity,
      note: formData.note,
      createdBy: { name: 'Admin' },
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTrx, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Stock In</h1>
          <p className="text-gray-500 text-sm">Riwayat penambahan stok alat lab & bahan kimia</p>
        </div>

        {/* Stat Cards — konsisten dengan AlatRusak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
            <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeTab === 'BahanKimia' ? 'Bahan kimia' : 'Alat lab'}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">
              Total Qty {activeTab === 'BahanKimia' ? 'Bahan' : 'Alat'} Masuk
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {filtered.reduce((sum, t) => sum + t.quantity, 0)}
            </p>
            <p className="text-xs text-emerald-500 mt-0.5">Unit ditambahkan</p>
          </div>
        </div>

        {/* Tab */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'BahanKimia', label: 'Bahan Kimia', icon: <FlaskConical className="w-4 h-4" /> },
              { key: 'AlatLab',    label: 'Alat Lab',    icon: <Wrench className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`flex-1 px-6 py-3 text-sm font-medium transition flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === tab.key
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filter + Tambah */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Cari nama ${activeTab === 'BahanKimia' ? 'bahan' : 'alat'} atau catatan...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filter Tanggal
              {hasActiveFilter && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full">1</span>
              )}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition whitespace-nowrap font-medium"
            >
              <Plus className="w-4 h-4" />
              Tambah Stock In
            </button>
          </div>

          {hasActiveFilter && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter aktif:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                {fromDate && formatTanggal(fromDate)}{fromDate && toDate && ' – '}{toDate && formatTanggal(toDate)}
                <button onClick={clearFilter} className="hover:bg-emerald-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Masuk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.length > 0 ? paginated.map((trx, idx) => {
                  const itemName = trx.itemModel === 'AlatLab' ? trx.item?.nama_alat : trx.item?.nama_bahan;
                  return (
                    <tr key={trx._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500">{(currentPage - 1) * perPage + idx + 1}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-900">{itemName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600">{trx.item?.spesifikasi || '-'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold text-emerald-600">+{trx.quantity}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="w-3 h-3 flex-shrink-0 text-gray-400" />
                          <span>{formatTanggal(trx.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600 line-clamp-1">{trx.note || '-'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => { setSelectedTrx(trx); setShowDetailModal(true); }}
                            title="Lihat Detail"
                            className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Package className="w-12 h-12 opacity-30" />
                        <p className="text-sm">
                          Belum ada transaksi stock in untuk {activeTab === 'BahanKimia' ? 'bahan kimia' : 'alat lab'}
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
                Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length} transaksi
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
                          currentPage === p ? 'bg-emerald-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
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

      {showFilterModal && (
        <FilterModal
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          onClose={() => setShowFilterModal(false)}
          onReset={clearFilter}
        />
      )}

      {showAddModal && (
        <AddStockInModal
          itemModel={activeTab}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {showDetailModal && (
        <DetailModal
          transaction={selectedTrx}
          onClose={() => { setShowDetailModal(false); setSelectedTrx(null); }}
        />
      )}
    </div>
  );
};

export default StockInPage;