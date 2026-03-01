import React, { useState } from 'react';
import {
  Plus, Search, Eye, X, Wrench, FlaskConical,
  ClipboardList, CheckCircle, Clock, ChevronLeft,
  ChevronRight, Save, AlertTriangle, Package,
  Calendar, Edit2
} from 'lucide-react';

// ============================================================
// MOCK DATA
// ============================================================
const mockAlatLab = [
  { _id: 'a1', nama_alat: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 10, merk_brand: 'Pyrex', penyimpanan: 'Rak 2' },
  { _id: 'a2', nama_alat: 'Labu Jantung', spesifikasi: '50 ml', jumlah: 4, merk_brand: 'Duran', penyimpanan: 'Rak 3' },
  { _id: 'a3', nama_alat: 'Buret', spesifikasi: '10 ml', jumlah: 15, merk_brand: '', penyimpanan: 'Rak 1' },
];

const mockBahanKimia = [
  { _id: 'b1', nama_bahan: 'HCl', spesifikasi: '37%', jumlah: 5, satuan: 'L', penyimpanan: 'Lemari Kuning' },
  { _id: 'b2', nama_bahan: 'NaOH', spesifikasi: 'p.a', jumlah: 2, satuan: 'kg', penyimpanan: 'Rak 1' },
  { _id: 'b3', nama_bahan: 'H2SO4', spesifikasi: '98%', jumlah: 3, satuan: 'L', penyimpanan: 'Lemari Kuning' },
];

const mockOpnameList = [
  {
    _id: 'op1',
    tanggal: '2025-02-01T00:00:00Z',
    status: 'FINAL',
    dibuatOleh: { name: 'Admin' },
    disesuaikanOleh: { name: 'Admin' },
    disesuaikanPada: '2025-02-01T10:00:00Z',
    totalItem: 6,
    totalSelisih: 2,
  },
  {
    _id: 'op2',
    tanggal: '2025-03-01T00:00:00Z',
    status: 'DRAFT',
    dibuatOleh: { name: 'Admin' },
    disesuaikanOleh: null,
    disesuaikanPada: null,
    totalItem: 6,
    totalSelisih: 0,
  },
];

// Generate opname items dari mock master data
const generateOpnameItems = (opnameId) => [
  ...mockAlatLab.map(a => ({
    _id: `oi_${opnameId}_${a._id}`,
    opname: opnameId,
    item: a,
    itemModel: 'AlatLab',
    systemStock: a.jumlah,
    physicalStock: 0,
    selisih: 0,
    note: '',
  })),
  ...mockBahanKimia.map(b => ({
    _id: `oi_${opnameId}_${b._id}`,
    opname: opnameId,
    item: b,
    itemModel: 'BahanKimia',
    systemStock: b.jumlah,
    physicalStock: 0,
    selisih: 0,
    note: '',
  })),
];

// ============================================================
// STATUS BADGE
// ============================================================
const StatusBadge = ({ status }) => {
  if (status === 'FINAL') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
        <CheckCircle className="w-3 h-3" /> Final
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
      <Clock className="w-3 h-3" /> Draft
    </span>
  );
};

// ============================================================
// CREATE OPNAME MODAL
// ============================================================
const CreateOpnameModal = ({ onClose, onSubmit }) => {
  const today = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(today);

  const handleSubmit = () => {
    if (!tanggal) { alert('Mohon isi tanggal opname!'); return; }
    onSubmit({ tanggal });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <ClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Buat Stock Opname</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Tanggal Opname <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700">
              ℹ️ Sistem akan otomatis mengambil semua data <strong>Alat Lab</strong> &{' '}
              <strong>Bahan Kimia</strong> beserta stok sistem saat ini.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
            Batal
          </button>
          <button onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
            Buat Opname
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT OPNAME MODAL (input physical stock)
// ============================================================
const EditOpnameModal = ({ opname, onClose, onSaveDraft, onSesuaikan }) => {
  const [activeTab, setActiveTab] = useState('AlatLab');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(() => generateOpnameItems(opname._id));
  const [confirmSesuaikan, setConfirmSesuaikan] = useState(false);

  const isFinal = opname.status === 'FINAL';

  const handlePhysicalChange = (itemId, value) => {
    setItems(prev => prev.map(it => {
      if (it._id !== itemId) return it;
      const physical = value === '' ? 0 : parseInt(value) || 0;
      return { ...it, physicalStock: physical, selisih: physical - it.systemStock };
    }));
  };

  const handleNoteChange = (itemId, value) => {
    setItems(prev => prev.map(it =>
      it._id === itemId ? { ...it, note: value } : it
    ));
  };

  const filteredItems = items.filter(it => {
    const name = it.itemModel === 'AlatLab' ? it.item.nama_alat : it.item.nama_bahan;
    const matchTab = it.itemModel === activeTab;
    const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const itemsWithSelisih = items.filter(it => it.selisih !== 0);
  const alatCount  = items.filter(it => it.itemModel === 'AlatLab').length;
  const bahanCount = items.filter(it => it.itemModel === 'BahanKimia').length;
  const selisihCount = itemsWithSelisih.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <ClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isFinal ? 'Detail' : 'Edit'} Stock Opname
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(opname.tanggal).toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
                {' • '}
                <StatusBadge status={opname.status} />
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-6 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span className="text-gray-500">Alat Lab:</span>
            <span className="font-semibold text-gray-900">{alatCount} item</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FlaskConical className="w-4 h-4 text-green-600" />
            <span className="text-gray-500">Bahan Kimia:</span>
            <span className="font-semibold text-gray-900">{bahanCount} item</span>
          </div>
          {selisihCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">{selisihCount} item tidak sesuai</span>
            </div>
          )}
        </div>

        {/* Tab + Search */}
        <div className="shrink-0">
          {/* Tab */}
          <div className="flex border-b border-gray-200 px-6">
            {[
              { key: 'AlatLab',    label: 'Alat Lab',    icon: <Wrench className="w-4 h-4" />,     count: alatCount },
              { key: 'BahanKimia', label: 'Bahan Kimia', icon: <FlaskConical className="w-4 h-4" />, count: bahanCount },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Cari ${activeTab === 'AlatLab' ? 'alat lab' : 'bahan kimia'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Sistem</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Aktual</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length > 0 ? filteredItems.map((it, idx) => {
                const name = it.itemModel === 'AlatLab' ? it.item.nama_alat : it.item.nama_bahan;
                const satuan = it.itemModel === 'BahanKimia' ? it.item.satuan : 'unit';
                const hasSelisih = it.selisih !== 0;
                const isPhysicalFilled = it.physicalStock > 0;

                return (
                  <tr key={it._id} className={`transition ${hasSelisih ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-3 text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-3">
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      {it.item.merk_brand && (
                        <p className="text-xs text-gray-400">{it.item.merk_brand}</p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{it.item.spesifikasi || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{it.item.penyimpanan || '-'}</td>

                    {/* Stok Sistem */}
                    <td className="px-6 py-3 text-center">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        {it.systemStock} {satuan}
                      </span>
                    </td>

                    {/* Stok Aktual — input */}
                    <td className="px-6 py-3 text-center">
                      {isFinal ? (
                        <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${
                          hasSelisih ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {it.physicalStock} {satuan}
                        </span>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          value={it.physicalStock === 0 && !isPhysicalFilled ? '' : it.physicalStock}
                          onChange={(e) => handlePhysicalChange(it._id, e.target.value)}
                          placeholder="0"
                          className={`w-24 px-3 py-1.5 border rounded-lg text-sm text-center focus:ring-2 focus:border-transparent ${
                            hasSelisih
                              ? 'border-orange-300 focus:ring-orange-400 bg-orange-50'
                              : 'border-gray-300 focus:ring-purple-500'
                          }`}
                        />
                      )}
                    </td>

                    {/* Selisih */}
                    <td className="px-6 py-3 text-center">
                      {it.selisih === 0 ? (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">0</span>
                      ) : it.selisih > 0 ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                          +{it.selisih}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                          {it.selisih}
                        </span>
                      )}
                    </td>

                    {/* Catatan */}
                    <td className="px-6 py-3">
                      {isFinal ? (
                        <p className="text-sm text-gray-600">{it.note || '-'}</p>
                      ) : (
                        <input
                          type="text"
                          value={it.note}
                          onChange={(e) => handleNoteChange(it._id, e.target.value)}
                          placeholder="Tambah catatan..."
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Package className="w-10 h-10 opacity-30" />
                      <p className="text-sm">Item tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!isFinal && (
          <div className="p-6 border-t border-gray-200 shrink-0">
            {/* Konfirmasi sesuaikan */}
            {confirmSesuaikan ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-800">Konfirmasi Penyesuaian Stok</p>
                    <p className="text-sm text-orange-700 mt-1">
                      {selisihCount > 0
                        ? `${selisihCount} item akan disesuaikan stoknya ke stok aktual dan akan menghasilkan ${selisihCount} data Stock Movement (ADJUSTMENT).`
                        : 'Tidak ada item yang perlu disesuaikan. Status opname akan diubah ke FINAL.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setConfirmSesuaikan(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => onSesuaikan(items)}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                  >
                    Ya, Sesuaikan Sekarang
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                  Tutup
                </button>
                <button
                  onClick={() => onSaveDraft(items)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-purple-300 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium text-sm"
                >
                  <Save className="w-4 h-4" />
                  Simpan Draft
                </button>
                <button
                  onClick={() => setConfirmSesuaikan(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Sesuaikan Stok
                  {selisihCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-white bg-opacity-30 text-xs rounded-full">
                      {selisihCount} item
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer jika FINAL */}
        {isFinal && (
          <div className="p-6 border-t border-gray-200 shrink-0">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Disesuaikan oleh: <strong>{opname.disesuaikanOleh?.name || '-'}</strong></span>
              <span>
                {opname.disesuaikanPada
                  ? new Date(opname.disesuaikanPada).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : '-'}
              </span>
            </div>
            <button onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium">
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// MAIN PAGE: STOCK OPNAME
// ============================================================
const StockOpnamePage = () => {
  const [opnameList, setOpnameList] = useState(mockOpnameList);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editOpname, setEditOpname] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = opnameList.filter(op => {
    const tanggalStr = new Date(op.tanggal).toLocaleDateString('id-ID');
    const matchSearch = tanggalStr.includes(searchTerm) ||
      op.dibuatOleh?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === '' || op.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPage = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleCreate = ({ tanggal }) => {
    const newOpname = {
      _id: 'op' + Date.now(),
      tanggal,
      status: 'DRAFT',
      dibuatOleh: { name: 'Admin' },
      disesuaikanOleh: null,
      disesuaikanPada: null,
      totalItem: mockAlatLab.length + mockBahanKimia.length,
      totalSelisih: 0,
    };
    setOpnameList(prev => [newOpname, ...prev]);
    setShowCreateModal(false);
  };

  const handleSaveDraft = (items) => {
    // Ganti dengan API call: PUT /api/opname/:id/items (status tetap DRAFT)
    alert('Draft berhasil disimpan!');
    setEditOpname(null);
  };

  const handleSesuaikan = (items) => {
    // Ganti dengan API call:
    // 1. PUT /api/opname/:id/sesuaikan → update stock item + generate StockMovement ADJUSTMENT
    // 2. Update status opname ke FINAL
    const adjustedItems = items.filter(it => it.selisih !== 0);
    console.log('Items to adjust:', adjustedItems);
    // Simulasi: update status ke FINAL
    setOpnameList(prev => prev.map(op =>
      op._id === editOpname._id
        ? { ...op, status: 'FINAL', disesuaikanOleh: { name: 'Admin' }, disesuaikanPada: new Date().toISOString(), totalSelisih: adjustedItems.length }
        : op
    ));
    setEditOpname(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          {/* <div className="p-3 rounded-xl bg-purple-100">
            <ClipboardList className="w-6 h-6 text-purple-600" />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Opname</h1>
            <p className="text-gray-500 text-sm">Pengecekan & penyesuaian stok fisik alat lab & bahan kimia</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <ClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Opname</p>
              <p className="text-2xl font-bold text-gray-900">{opnameList.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Final</p>
              <p className="text-2xl font-bold text-gray-900">
                {opnameList.filter(o => o.status === 'FINAL').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-gray-900">
                {opnameList.filter(o => o.status === 'DRAFT').length}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari tanggal atau nama pembuat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="FINAL">Final</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Buat Opname
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Opname</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Tidak Sesuai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disesuaikan Oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.length > 0 ? paginated.map((op, idx) => (
                  <tr key={op._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * perPage + idx + 1}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(op.tanggal).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Dibuat: {new Date(op.createdAt || op.tanggal).toLocaleDateString('id-ID')}
                      </p>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={op.status} /></td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{op.totalItem} item</span>
                    </td>
                    <td className="px-6 py-4">
                      {op.totalSelisih > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                          <AlertTriangle className="w-3 h-3" /> {op.totalSelisih} item
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{op.dibuatOleh?.name || '-'}</td>
                    <td className="px-6 py-4">
                      {op.disesuaikanOleh ? (
                        <div>
                          <p className="text-sm text-gray-600">{op.disesuaikanOleh.name}</p>
                          <p className="text-xs text-gray-400">
                            {op.disesuaikanPada
                              ? new Date(op.disesuaikanPada).toLocaleDateString('id-ID')
                              : '-'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {op.status === 'DRAFT' ? (
                          <button
                            onClick={() => setEditOpname(op)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-sm font-medium"
                            title="Edit Opname"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditOpname(op)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition text-sm font-medium"
                            title="Lihat Detail"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <ClipboardList className="w-12 h-12 opacity-30" />
                        <p className="text-sm">Belum ada data stock opname</p>
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
                Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length} opname
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
                          currentPage === p ? 'bg-purple-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
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

      {/* Modals */}
      {showCreateModal && (
        <CreateOpnameModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}
      {editOpname && (
        <EditOpnameModal
          opname={editOpname}
          onClose={() => setEditOpname(null)}
          onSaveDraft={handleSaveDraft}
          onSesuaikan={handleSesuaikan}
        />
      )}
    </div>
  );
};

export default StockOpnamePage;