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

const mockTransactionsOUT = [
  {
    _id: 't3', type: 'OUT', itemModel: 'AlatLab',
    item: { _id: 'a2', nama_alat: 'Labu Jantung', spesifikasi: '50 ml' },
    quantity: 1, previousStock: 5, newStock: 4, note: 'Dipakai praktikum',
    createdBy: { name: 'Admin' }, createdAt: '2025-02-25T10:00:00Z'
  },
  {
    _id: 't4', type: 'OUT', itemModel: 'BahanKimia',
    item: { _id: 'b2', nama_bahan: 'NaOH', spesifikasi: 'p.a' },
    quantity: 1, previousStock: 3, newStock: 2, note: 'Praktikum titrasi',
    createdBy: { name: 'Lab Staff' }, createdAt: '2025-02-28T14:00:00Z'
  },
];

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
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detail Transaksi Stock Out</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
            <span className="text-sm text-gray-500">Tipe Transaksi</span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
              ▼ Stock Out
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
              <p className="text-xs text-gray-500 mb-1">Jumlah Keluar</p>
              <p className="text-sm font-bold text-red-600">-{transaction.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Stok Sebelum</p>
              <p className="text-sm text-gray-700">{transaction.previousStock}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Stok Sesudah</p>
              <p className="text-sm font-semibold text-gray-900">{transaction.newStock}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Oleh</p>
              <p className="text-sm text-gray-700">{transaction.createdBy?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tanggal</p>
              <p className="text-sm text-gray-700">
                {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          {transaction.note && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Catatan</p>
              <p className="text-sm text-gray-700">{transaction.note}</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200">
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD STOCK OUT MODAL — tidak ada tab, terima itemModel dari props
// ============================================================
const AddStockOutModal = ({ itemModel, onClose, onSubmit }) => {
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
    if (parseInt(quantity) > selectedItem.jumlah) {
      alert(`Stok tidak mencukupi! Stok saat ini: ${selectedItem.jumlah}`);
      return;
    }
    onSubmit({
      itemId: selectedItem._id,
      itemModel,
      quantity: parseInt(quantity),
      note,
      type: 'OUT',
    });
  };

  const isOverStock = selectedItem && quantity && parseInt(quantity) > selectedItem.jumlah;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-red-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tambah Stock Out</h2>
                {/* Konteks jenis item pengganti tab */}
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

        <div className="p-6 space-y-5">

          {/* Item Search Dropdown */}
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              {showItemDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                  {filteredItems.length > 0 ? filteredItems.map(item => (
                    <button key={item._id} type="button" onClick={() => handleSelectItem(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0">
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

          {/* Selected Item Preview */}
          {selectedItem && (
            <div className="p-3 rounded-xl border bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-red-600" />
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

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Keluar <span className="text-red-500">*</span>
            </label>
            <input
              type="number" min="1" value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Masukkan jumlah..."
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent ${
                isOverStock
                  ? 'border-red-400 focus:ring-red-300 bg-red-50'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
            />
            {isOverStock && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Jumlah melebihi stok tersedia ({selectedItem.jumlah})
              </p>
            )}
            {selectedItem && quantity && parseInt(quantity) > 0 && !isOverStock && (
              <p className="text-xs text-gray-500 mt-1">
                Stok sesudah:{' '}
                <span className="font-semibold text-red-600">
                  {selectedItem.jumlah - parseInt(quantity)} {itemModel === 'BahanKimia' ? selectedItem.satuan : 'unit'}
                </span>
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan <span className="text-gray-400 text-xs">(Opsional)</span>
            </label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Praktikum titrasi kelas X, pemakaian rutin..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
            Batal
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 text-white rounded-lg transition font-medium bg-red-600 hover:bg-red-700">
            Simpan Stock Out
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN PAGE: STOCK OUT
// ============================================================
const StockOutPage = () => {
  const [transactions, setTransactions] = useState(mockTransactionsOUT);
  const [activeTab, setActiveTab] = useState('BahanKimia'); // tab di level page
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

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
    const trxDate   = new Date(trx.createdAt);
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
      type: 'OUT',
      itemModel: formData.itemModel,
      item,
      quantity: formData.quantity,
      previousStock: prev,
      newStock: prev - formData.quantity,
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
        <div className="mb-6 flex items-center gap-4">
          {/* <div className="p-3 rounded-xl bg-red-100">
            <ArrowDownCircle className="w-6 h-6 text-red-600" />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Out</h1>
            <p className="text-gray-500 text-sm">Riwayat penggunaan & pengeluaran stok alat lab & bahan kimia</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100">
              <ArrowDownCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Total Qty {activeTab === 'BahanKimia' ? 'Bahan' : 'Alat'} Keluar
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filtered.reduce((sum, t) => sum + t.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Bahan Kimia | Alat Lab */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'BahanKimia', label: 'bahan kimia', icon: <FlaskConical className="w-4 h-4" /> },
              { key: 'AlatLab',    label: 'alat lab',    icon: <Wrench className="w-4 h-4" /> },
            ].map((tab, idx) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`flex-1 px-6 py-3 text-sm font-medium transition border-b-2 border-red-600 ${
                  idx === 0 ? 'rounded-tl-xl' : ''
                } ${
                  activeTab === tab.key
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filter Tanggal + Tambah */}
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Filter Tanggal toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition whitespace-nowrap ${
                hasActiveFilter
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter Tanggal</span>
              {hasActiveFilter && (
                <span className="w-4 h-4 flex items-center justify-center bg-red-600 text-white text-xs rounded-full">!</span>
              )}
            </button>

            {/* Tambah button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition whitespace-nowrap font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Stock Out</span>
            </button>
          </div>

          {/* Filter Panel: hanya date range */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />Dari Tanggal
                  </label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />Sampai Tanggal
                  </label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
              </div>
              {hasActiveFilter && (
                <div className="mt-3 flex justify-end">
                  <button onClick={clearFilter} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Keluar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Sebelum → Sesudah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.length > 0 ? paginated.map((trx, idx) => {
                  const itemName = trx.itemModel === 'AlatLab' ? trx.item?.nama_alat : trx.item?.nama_bahan;
                  return (
                    <tr key={trx._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * perPage + idx + 1}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{itemName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{trx.item?.spesifikasi || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-700">
                          -{trx.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">{trx.previousStock}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold text-red-600">{trx.newStock}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[160px]">
                        <p className="truncate">{trx.note || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => { setSelectedTrx(trx); setShowDetailModal(true); }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Package className="w-12 h-12 opacity-30" />
                        <p className="text-sm">
                          Belum ada transaksi stock out untuk {activeTab === 'BahanKimia' ? 'bahan kimia' : 'alat lab'}
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
                          currentPage === p ? 'bg-red-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
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

      {/* Modal — pass activeTab sebagai itemModel */}
      {showAddModal && (
        <AddStockOutModal
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

export default StockOutPage;