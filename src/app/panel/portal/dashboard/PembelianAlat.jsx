"use client"
import React, { useState } from 'react';
import { Plus, Search, X, Trash2, Eye, Filter, ChevronDown, Building2, Phone, Mail, Package, CheckCircle, XCircle, Clock, AlertCircle, FileText, Edit2, ShoppingCart, DollarSign, User, Wrench, AlertTriangle, History, ClipboardList, Calendar } from 'lucide-react';

// ─────────────────────────────────────────────
//  KONSTANTA DI LUAR KOMPONEN
// ─────────────────────────────────────────────
const MASTER_SUPPLIER = [
    { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890', email: 'info@kimiajaya.co.id', kontak: 'Budi Hartono' },
    { id: 2, namaSupplier: 'CV Labora Indonesia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432', email: 'labora@labora.co.id', kontak: 'Sari Dewi' },
    { id: 3, namaSupplier: 'PT Sains Nusantara', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556', email: 'sales@sainsnusantara.id', kontak: 'Rudi Santoso' },
];

const MASTER_ALAT = [
    { id: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', merkBrand: 'Pyrex', penyimpanan: 'Lemari Kanan' },
    { id: 2, namaAlat: 'Erlenmeyer', spesifikasi: '50 ml', merkBrand: 'Pyrex', penyimpanan: 'Rak 2' },
    { id: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', merkBrand: '', penyimpanan: 'Rak 2' },
    { id: 4, namaAlat: 'Labu jantung', spesifikasi: '50 ml', merkBrand: 'Duran', penyimpanan: 'Rak 3' },
    { id: 5, namaAlat: 'Buret', spesifikasi: '10 ml', merkBrand: '', penyimpanan: 'Rak 1' },
    { id: 6, namaAlat: 'Gelas Beker', spesifikasi: '250 ml', merkBrand: 'Pyrex', penyimpanan: 'Rak 2' },
    { id: 7, namaAlat: 'Pipet Ukur', spesifikasi: '10 ml', merkBrand: '', penyimpanan: 'Laci 1' },
];

const EMPTY_ITEM = {
    alatId: '',
    namaAlat: '',
    spesifikasi: '',
    merkBrand: '',
    jumlah: '',
    hargaSatuan: '',
    supplierId: '',
    namaSupplier: '',
    alamatSupplier: '',
    noWaSupplier: '',
    emailSupplier: '',
    kontakSupplier: '',
};

const EMPTY_FORM = {
    items: [],
    tanggalPengajuan: new Date().toISOString().split('T')[0],
    catatan: '',
};

// ─────────────────────────────────────────────
//  HELPER FUNCTIONS DI LUAR KOMPONEN
// ─────────────────────────────────────────────
const formatTanggal = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatRupiah = (n) => {
    if (!n && n !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
};

const getTotalHarga = (items) =>
    items.reduce((s, i) => s + (parseInt(i.jumlah) || 0) * (parseInt(i.hargaSatuan) || 0), 0);

const getUniqueSuppliers = (items) => {
    const map = {};
    items.forEach(i => { if (i.supplierId) map[i.supplierId] = i.namaSupplier; });
    return Object.values(map);
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Menunggu': return 'bg-yellow-100 text-yellow-700';
        case 'Disetujui': return 'bg-green-100 text-green-700';
        case 'Ditolak': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Menunggu': return <Clock className="w-3 h-3" />;
        case 'Disetujui': return <CheckCircle className="w-3 h-3" />;
        case 'Ditolak': return <XCircle className="w-3 h-3" />;
        default: return null;
    }
};

// ─────────────────────────────────────────────
//  ITEM INPUT ROW — DI LUAR KOMPONEN UTAMA
// ─────────────────────────────────────────────
const ItemInputRow = ({
    currentIt, setCurrentIt,
    alatSearch, setAlatSearch, showAlatDrop, setShowAlatDrop, onSelectAlat,
    supplierSearch, setSupplierSearch, showSupplierDrop, setShowSupplierDrop, onSelectSupplier,
    onAdd
}) => {
    const filtAlat = MASTER_ALAT.filter(a =>
        a.namaAlat.toLowerCase().includes(alatSearch.toLowerCase()) ||
        a.spesifikasi.toLowerCase().includes(alatSearch.toLowerCase()) ||
        (a.merkBrand && a.merkBrand.toLowerCase().includes(alatSearch.toLowerCase()))
    );
    const filtSupplier = MASTER_SUPPLIER.filter(s =>
        s.namaSupplier.toLowerCase().includes(supplierSearch.toLowerCase()) ||
        s.kontak.toLowerCase().includes(supplierSearch.toLowerCase())
    );
    const selectedAlat = MASTER_ALAT.find(a => a.id === currentIt.alatId);
    const selectedSupplier = MASTER_SUPPLIER.find(s => s.id === currentIt.supplierId);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tambah Item</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Pilih Alat */}
                <div className="relative">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Alat <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama alat..."
                            value={currentIt.alatId ? (selectedAlat ? `${selectedAlat.namaAlat} ${selectedAlat.spesifikasi}` : alatSearch) : alatSearch}
                            onChange={(e) => {
                                setAlatSearch(e.target.value);
                                setCurrentIt(prev => ({ ...prev, alatId: '', namaAlat: '', spesifikasi: '', merkBrand: '' }));
                                setShowAlatDrop(true);
                            }}
                            onFocus={() => { if (!currentIt.alatId) setShowAlatDrop(true); }}
                            className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        {(alatSearch || currentIt.alatId) && (
                            <button type="button"
                                onClick={() => { setAlatSearch(''); setCurrentIt(prev => ({ ...prev, alatId: '', namaAlat: '', spesifikasi: '', merkBrand: '' })); setShowAlatDrop(false); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    {showAlatDrop && !currentIt.alatId && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filtAlat.length > 0 ? filtAlat.map(a => (
                                <button key={a.id} type="button" onClick={() => onSelectAlat(a)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0">
                                    <div className="text-sm font-medium text-gray-900">{a.namaAlat}</div>
                                    <div className="text-xs text-gray-500">{a.spesifikasi}{a.merkBrand && ` · ${a.merkBrand}`}</div>
                                </button>
                            )) : (
                                <div className="px-4 py-4 text-center text-sm text-gray-500">Alat tidak ditemukan</div>
                            )}
                        </div>
                    )}
                    {currentIt.alatId && selectedAlat && (
                        <p className="mt-1 text-xs text-green-600 font-medium">✓ {selectedAlat.namaAlat} {selectedAlat.spesifikasi}{selectedAlat.merkBrand && ` · ${selectedAlat.merkBrand}`}</p>
                    )}
                </div>

                {/* Pilih Supplier */}
                <div className="relative">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Supplier <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari supplier..."
                            value={currentIt.supplierId ? (selectedSupplier ? selectedSupplier.namaSupplier : supplierSearch) : supplierSearch}
                            onChange={(e) => {
                                setSupplierSearch(e.target.value);
                                setCurrentIt(prev => ({ ...prev, supplierId: '', namaSupplier: '', alamatSupplier: '', noWaSupplier: '', emailSupplier: '', kontakSupplier: '' }));
                                setShowSupplierDrop(true);
                            }}
                            onFocus={() => { if (!currentIt.supplierId) setShowSupplierDrop(true); }}
                            className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        {(supplierSearch || currentIt.supplierId) && (
                            <button type="button"
                                onClick={() => { setSupplierSearch(''); setCurrentIt(prev => ({ ...prev, supplierId: '', namaSupplier: '', alamatSupplier: '', noWaSupplier: '', emailSupplier: '', kontakSupplier: '' })); setShowSupplierDrop(false); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    {showSupplierDrop && !currentIt.supplierId && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filtSupplier.length > 0 ? filtSupplier.map(s => (
                                <button key={s.id} type="button" onClick={() => onSelectSupplier(s)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0">
                                    <div className="text-sm font-medium text-gray-900">{s.namaSupplier}</div>
                                    <div className="text-xs text-gray-500">{s.alamat}</div>
                                </button>
                            )) : (
                                <div className="px-4 py-4 text-center text-sm text-gray-500">Supplier tidak ditemukan</div>
                            )}
                        </div>
                    )}
                    {currentIt.supplierId && selectedSupplier && (
                        <p className="mt-1 text-xs text-green-600 font-medium">✓ {selectedSupplier.namaSupplier}</p>
                    )}
                </div>

                {/* Jumlah */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        placeholder="Jumlah unit"
                        min="1"
                        value={currentIt.jumlah}
                        onChange={(e) => setCurrentIt(prev => ({ ...prev, jumlah: e.target.value }))}
                        disabled={!currentIt.alatId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Harga Satuan */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Harga Satuan <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Rp</span>
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={currentIt.hargaSatuan}
                            onChange={(e) => setCurrentIt(prev => ({ ...prev, hargaSatuan: e.target.value }))}
                            disabled={!currentIt.alatId}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {currentIt.jumlah && currentIt.hargaSatuan && (
                <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
                    Subtotal: <span className="font-bold">{formatRupiah(parseInt(currentIt.jumlah) * parseInt(currentIt.hargaSatuan))}</span>
                </div>
            )}

            <button
                type="button"
                onClick={onAdd}
                disabled={!currentIt.alatId || !currentIt.jumlah || !currentIt.hargaSatuan || !currentIt.supplierId}
                className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" /> Tambah ke Daftar
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────
//  ITEMS TABLE — DI LUAR KOMPONEN UTAMA
// ─────────────────────────────────────────────
const ItemsTable = ({ items, onRemove }) => (
    items.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Alat</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Supplier</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Jml</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Harga Satuan</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Subtotal</th>
                        {onRemove && <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Aksi</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-3 py-2">
                                <p className="text-xs font-medium text-gray-900">{item.namaAlat}</p>
                                <p className="text-xs text-gray-400">{item.spesifikasi}{item.merkBrand && ` · ${item.merkBrand}`}</p>
                            </td>
                            <td className="px-3 py-2">
                                <p className="text-xs text-gray-700">{item.namaSupplier}</p>
                            </td>
                            <td className="px-3 py-2 text-center text-xs text-gray-700">{item.jumlah}</td>
                            <td className="px-3 py-2 text-right text-xs text-gray-700">{formatRupiah(item.hargaSatuan)}</td>
                            <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900">{formatRupiah(item.jumlah * item.hargaSatuan)}</td>
                            {onRemove && (
                                <td className="px-3 py-2 text-center">
                                    <button type="button" onClick={() => onRemove(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    <tr className="bg-gray-50">
                        <td colSpan={onRemove ? 4 : 4} className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Total</td>
                        <td className="px-3 py-2 text-right text-sm font-bold text-red-600">{formatRupiah(getTotalHarga(items))}</td>
                        {onRemove && <td></td>}
                    </tr>
                </tbody>
            </table>
        </div>
    ) : (
        <div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
            <Package className="w-8 h-8 mx-auto mb-1 text-gray-300" />
            Belum ada item ditambahkan
        </div>
    )
);

// ─────────────────────────────────────────────
//  KOMPONEN UTAMA
// ─────────────────────────────────────────────
const PembelianAlatPage = () => {
    const [activeTab, setActiveTab] = useState('pengajuan');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedPembelian, setSelectedPembelian] = useState(null);
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [approveNote, setApproveNote] = useState('');

    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [currentItem, setCurrentItem] = useState({ ...EMPTY_ITEM });
    const [currentItemAlatSearch, setCurrentItemAlatSearch] = useState('');
    const [showCurrentItemAlatDropdown, setShowCurrentItemAlatDropdown] = useState(false);
    const [currentItemSupplierSearch, setCurrentItemSupplierSearch] = useState('');
    const [showCurrentItemSupplierDropdown, setShowCurrentItemSupplierDropdown] = useState(false);

    const [editFormData, setEditFormData] = useState({ ...EMPTY_FORM });
    const [editCurrentItem, setEditCurrentItem] = useState({ ...EMPTY_ITEM });
    const [editCurrentItemAlatSearch, setEditCurrentItemAlatSearch] = useState('');
    const [showEditCurrentItemAlatDropdown, setShowEditCurrentItemAlatDropdown] = useState(false);
    const [editCurrentItemSupplierSearch, setEditCurrentItemSupplierSearch] = useState('');
    const [showEditCurrentItemSupplierDropdown, setShowEditCurrentItemSupplierDropdown] = useState(false);

    const [pembelianList, setPembelianList] = useState([
        {
            id: 1,
            items: [
                { alatId: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', merkBrand: 'Pyrex', jumlah: 10, hargaSatuan: 35000, supplierId: 1, namaSupplier: 'PT Kimia Jaya', alamatSupplier: 'Jl. Industri No. 123, Jakarta', noWaSupplier: '081234567890', emailSupplier: 'info@kimiajaya.co.id', kontakSupplier: 'Budi Hartono' },
                { alatId: 6, namaAlat: 'Gelas Beker', spesifikasi: '250 ml', merkBrand: 'Pyrex', jumlah: 5, hargaSatuan: 45000, supplierId: 2, namaSupplier: 'CV Labora Indonesia', alamatSupplier: 'Jl. Raya Bogor KM 45, Bogor', noWaSupplier: '081298765432', emailSupplier: 'labora@labora.co.id', kontakSupplier: 'Sari Dewi' },
            ],
            tanggalPengajuan: '2024-02-01',
            catatan: 'Kebutuhan praktikum semester genap',
            status: 'Menunggu',
        },
        {
            id: 2,
            items: [
                { alatId: 5, namaAlat: 'Buret', spesifikasi: '10 ml', merkBrand: '', jumlah: 4, hargaSatuan: 120000, supplierId: 2, namaSupplier: 'CV Labora Indonesia', alamatSupplier: 'Jl. Raya Bogor KM 45, Bogor', noWaSupplier: '081298765432', emailSupplier: 'labora@labora.co.id', kontakSupplier: 'Sari Dewi' },
            ],
            tanggalPengajuan: '2024-01-20',
            catatan: '',
            status: 'Disetujui',
            tanggalDisetujui: '2024-01-22',
            catatanApprove: 'Disetujui untuk kebutuhan lab kimia analitik.',
        },
        {
            id: 3,
            items: [
                { alatId: 4, namaAlat: 'Labu jantung', spesifikasi: '50 ml', merkBrand: 'Duran', jumlah: 3, hargaSatuan: 85000, supplierId: 3, namaSupplier: 'PT Sains Nusantara', alamatSupplier: 'Jl. Sudirman No. 88, Bandung', noWaSupplier: '081223344556', emailSupplier: 'sales@sainsnusantara.id', kontakSupplier: 'Rudi Santoso' },
            ],
            tanggalPengajuan: '2024-01-10',
            catatan: 'Pengganti alat yang rusak',
            status: 'Ditolak',
            tanggalDisetujui: '2024-01-12',
            catatanApprove: 'Anggaran tidak tersedia saat ini.',
        },
    ]);

    const filteredPembelian = pembelianList.filter(item => {
        const tabFilter = activeTab === 'pengajuan'
            ? item.status === 'Menunggu'
            : item.status !== 'Menunggu';
        const searchFilter =
            item.items.some(i =>
                i.namaSupplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                i.namaAlat.toLowerCase().includes(searchTerm.toLowerCase())
            );
        let dateFilter = true;
        if (filterDateFrom && filterDateTo) {
            const d = new Date(item.tanggalPengajuan);
            dateFilter = d >= new Date(filterDateFrom) && d <= new Date(filterDateTo);
        }
        return tabFilter && searchFilter && dateFilter;
    });

    const selectCurrentItemAlat = (a) => {
        setCurrentItem(prev => ({ ...prev, alatId: a.id, namaAlat: a.namaAlat, spesifikasi: a.spesifikasi, merkBrand: a.merkBrand }));
        setShowCurrentItemAlatDropdown(false);
        setCurrentItemAlatSearch('');
    };
    const selectCurrentItemSupplier = (s) => {
        setCurrentItem(prev => ({ ...prev, supplierId: s.id, namaSupplier: s.namaSupplier, alamatSupplier: s.alamat, noWaSupplier: s.noWa, emailSupplier: s.email, kontakSupplier: s.kontak }));
        setShowCurrentItemSupplierDropdown(false);
        setCurrentItemSupplierSearch('');
    };
    const addItem = () => {
        if (!currentItem.alatId || !currentItem.jumlah || !currentItem.hargaSatuan || !currentItem.supplierId) return;
        const exists = formData.items.findIndex(i => i.alatId === currentItem.alatId);
        const newItem = { ...currentItem, jumlah: parseInt(currentItem.jumlah), hargaSatuan: parseInt(currentItem.hargaSatuan) };
        if (exists >= 0) {
            const updated = [...formData.items]; updated[exists] = newItem;
            setFormData(prev => ({ ...prev, items: updated }));
        } else {
            setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
        }
        setCurrentItem({ ...EMPTY_ITEM });
        setCurrentItemAlatSearch('');
        setCurrentItemSupplierSearch('');
    };
    const removeItem = (idx) => setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.items.length === 0) { alert('Tambahkan minimal satu alat'); return; }
        const newId = pembelianList.length > 0 ? Math.max(...pembelianList.map(p => p.id)) + 1 : 1;
        setPembelianList(prev => [...prev, { ...formData, id: newId, status: 'Menunggu' }]);
        setFormData({ ...EMPTY_FORM });
        setCurrentItem({ ...EMPTY_ITEM });
        setCurrentItemAlatSearch('');
        setCurrentItemSupplierSearch('');
        setShowFormModal(false);
    };

    const openEditModal = (item) => {
        setEditFormData({ ...item, items: item.items.map(i => ({ ...i })) });
        setSelectedPembelian(item);
        setShowEditModal(true);
    };
    const selectEditCurrentItemAlat = (a) => {
        setEditCurrentItem(prev => ({ ...prev, alatId: a.id, namaAlat: a.namaAlat, spesifikasi: a.spesifikasi, merkBrand: a.merkBrand }));
        setShowEditCurrentItemAlatDropdown(false);
        setEditCurrentItemAlatSearch('');
    };
    const selectEditCurrentItemSupplier = (s) => {
        setEditCurrentItem(prev => ({ ...prev, supplierId: s.id, namaSupplier: s.namaSupplier, alamatSupplier: s.alamat, noWaSupplier: s.noWa, emailSupplier: s.email, kontakSupplier: s.kontak }));
        setShowEditCurrentItemSupplierDropdown(false);
        setEditCurrentItemSupplierSearch('');
    };
    const addEditItem = () => {
        if (!editCurrentItem.alatId || !editCurrentItem.jumlah || !editCurrentItem.hargaSatuan || !editCurrentItem.supplierId) return;
        const exists = editFormData.items.findIndex(i => i.alatId === editCurrentItem.alatId);
        const newItem = { ...editCurrentItem, jumlah: parseInt(editCurrentItem.jumlah), hargaSatuan: parseInt(editCurrentItem.hargaSatuan) };
        if (exists >= 0) {
            const updated = [...editFormData.items]; updated[exists] = newItem;
            setEditFormData(prev => ({ ...prev, items: updated }));
        } else {
            setEditFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
        }
        setEditCurrentItem({ ...EMPTY_ITEM });
        setEditCurrentItemAlatSearch('');
        setEditCurrentItemSupplierSearch('');
    };
    const removeEditItem = (idx) => setEditFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editFormData.items.length === 0) { alert('Tambahkan minimal satu alat'); return; }
        setPembelianList(prev => prev.map(p => p.id === editFormData.id ? { ...editFormData } : p));
        setEditCurrentItem({ ...EMPTY_ITEM });
        setEditCurrentItemAlatSearch('');
        setEditCurrentItemSupplierSearch('');
        setShowEditModal(false);
    };

    const openDeleteConfirm = (item) => { setSelectedPembelian(item); setShowDeleteConfirm(true); };
    const handleDelete = () => {
        setPembelianList(prev => prev.filter(p => p.id !== selectedPembelian.id));
        setShowDeleteConfirm(false);
        setSelectedPembelian(null);
    };

    const openApproveModal = (item) => { setSelectedPembelian(item); setApproveNote(''); setShowApproveModal(true); };
    const handleApprove = (approved) => {
        const today = new Date().toISOString().split('T')[0];
        setPembelianList(prev => prev.map(p =>
            p.id === selectedPembelian.id
                ? { ...p, status: approved ? 'Disetujui' : 'Ditolak', tanggalDisetujui: today, catatanApprove: approveNote }
                : p
        ));
        setShowApproveModal(false);
        setSelectedPembelian(null);
    };

    const handleResetFilter = () => { setFilterDateFrom(''); setFilterDateTo(''); };

    const pengajuanCount = pembelianList.filter(p => p.status === 'Menunggu').length;
    const riwayatCount = pembelianList.filter(p => p.status !== 'Menunggu').length;
    const disetujuiCount = pembelianList.filter(p => p.status === 'Disetujui').length;
    const totalNilai = pembelianList.filter(p => p.status === 'Disetujui').reduce((s, p) => s + getTotalHarga(p.items), 0);

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Pembelian Alat Laboratorium</h1>
                    <p className="text-gray-500 text-sm">Kelola pengajuan dan riwayat pembelian alat lab</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <p className="text-gray-500 text-xs mb-1">Total Pengajuan</p>
                        <p className="text-2xl font-bold text-gray-900">{pembelianList.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <p className="text-gray-500 text-xs mb-1">Menunggu</p>
                        <p className="text-2xl font-bold text-yellow-500">{pengajuanCount}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <p className="text-gray-500 text-xs mb-1">Disetujui</p>
                        <p className="text-2xl font-bold text-green-600">{disetujuiCount}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <p className="text-gray-500 text-xs mb-1">Total Nilai Disetujui</p>
                        <p className="text-lg font-bold text-red-600">{formatRupiah(totalNilai)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 mb-4">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => setActiveTab('pengajuan')}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition ${activeTab === 'pengajuan' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <ClipboardList className="w-4 h-4" /> Pengajuan ({pengajuanCount})
                        </button>
                        <button onClick={() => setActiveTab('riwayat')}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition ${activeTab === 'riwayat' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <History className="w-4 h-4" /> Riwayat ({riwayatCount})
                        </button>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Cari supplier atau nama alat..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowFilterModal(true)}
                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition">
                                <Filter className="w-4 h-4" /> Filter Tanggal
                                {(filterDateFrom || filterDateTo) && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">1</span>}
                            </button>
                            {activeTab === 'pengajuan' && (
                                <button onClick={() => setShowFormModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition">
                                    <Plus className="w-4 h-4" /> Tambah Pengajuan
                                </button>
                            )}
                        </div>
                    </div>
                    {(filterDateFrom || filterDateTo) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500">Filter aktif:</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {formatTanggal(filterDateFrom)} — {formatTanggal(filterDateTo)}
                                <button onClick={handleResetFilter}><X className="w-3 h-3" /></button>
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. Pengajuan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Harga</th>
                                    {activeTab === 'riwayat' && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    )}
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPembelian.length > 0 ? filteredPembelian.map((item, i) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-xs text-gray-500">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-xs text-gray-700">
                                                <Calendar className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                                Diajukan: {formatTanggal(item.tanggalPengajuan)}
                                            </div>
                                            {item.tanggalDisetujui && (
                                                <div className={`flex items-center gap-1 text-xs mt-0.5 ${item.status === 'Disetujui' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {item.status === 'Disetujui'
                                                        ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                        : <XCircle className="w-3 h-3 flex-shrink-0" />}
                                                    {item.status === 'Disetujui' ? 'Disetujui' : 'Ditolak'}: {formatTanggal(item.tanggalDisetujui)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-gray-900">{item.items.reduce((s, it) => s + it.jumlah, 0)} unit</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-semibold text-gray-900">{formatRupiah(getTotalHarga(item.items))}</p>
                                        </td>
                                        {activeTab === 'riwayat' && (
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                    {getStatusIcon(item.status)} {item.status}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 justify-center">
                                                <button onClick={() => { setSelectedPembelian(item); setShowDetailModal(true); }}
                                                    title="Detail" className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {activeTab === 'pengajuan' && (
                                                    <>
                                                        <button onClick={() => openEditModal(item)} title="Edit" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => openDeleteConfirm(item)} title="Hapus" className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
                                                        <button onClick={() => openApproveModal(item)} title="Approve" className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition"><CheckCircle className="w-4 h-4" /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={activeTab === 'riwayat' ? 6 : 5} className="px-6 py-12 text-center text-gray-400">
                                            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-200" />
                                            <p className="text-sm">{activeTab === 'pengajuan' ? 'Belum ada pengajuan pembelian' : 'Belum ada riwayat pembelian'}</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ========== FORM MODAL ========== */}
                {showFormModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="text-lg font-bold text-gray-900">Form Pengajuan Pembelian Alat</h2>
                                <button onClick={() => { setShowFormModal(false); setFormData({ ...EMPTY_FORM }); setCurrentItem({ ...EMPTY_ITEM }); setCurrentItemAlatSearch(''); setCurrentItemSupplierSearch(''); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Tambah Item Pembelian</h3>
                                    <ItemInputRow
                                        currentIt={currentItem} setCurrentIt={setCurrentItem}
                                        alatSearch={currentItemAlatSearch} setAlatSearch={setCurrentItemAlatSearch}
                                        showAlatDrop={showCurrentItemAlatDropdown} setShowAlatDrop={setShowCurrentItemAlatDropdown}
                                        onSelectAlat={selectCurrentItemAlat}
                                        supplierSearch={currentItemSupplierSearch} setSupplierSearch={setCurrentItemSupplierSearch}
                                        showSupplierDrop={showCurrentItemSupplierDropdown} setShowSupplierDrop={setShowCurrentItemSupplierDropdown}
                                        onSelectSupplier={selectCurrentItemSupplier}
                                        onAdd={addItem}
                                    />
                                </div>
                                {formData.items.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Daftar Item ({formData.items.length})</h3>
                                        <ItemsTable items={formData.items} onRemove={removeItem} />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Pengajuan <span className="text-red-600">*</span></label>
                                        <input type="date" value={formData.tanggalPengajuan}
                                            onChange={(e) => setFormData(prev => ({ ...prev, tanggalPengajuan: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                        {formData.tanggalPengajuan && <p className="mt-1 text-xs text-gray-400">{formatTanggal(formData.tanggalPengajuan)}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan <span className="text-gray-400 text-xs">(Opsional)</span></label>
                                        <textarea value={formData.catatan} onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                                            rows="2" placeholder="Catatan pengajuan..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button type="button" onClick={() => { setShowFormModal(false); setFormData({ ...EMPTY_FORM }); setCurrentItem({ ...EMPTY_ITEM }); setCurrentItemAlatSearch(''); setCurrentItemSupplierSearch(''); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-medium">Simpan Pengajuan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ========== EDIT MODAL ========== */}
                {showEditModal && editFormData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="text-lg font-bold text-gray-900">Edit Pengajuan Pembelian</h2>
                                <button onClick={() => { setShowEditModal(false); setEditCurrentItem({ ...EMPTY_ITEM }); setEditCurrentItemAlatSearch(''); setEditCurrentItemSupplierSearch(''); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Tambah Item Pembelian</h3>
                                    <ItemInputRow
                                        currentIt={editCurrentItem} setCurrentIt={setEditCurrentItem}
                                        alatSearch={editCurrentItemAlatSearch} setAlatSearch={setEditCurrentItemAlatSearch}
                                        showAlatDrop={showEditCurrentItemAlatDropdown} setShowAlatDrop={setShowEditCurrentItemAlatDropdown}
                                        onSelectAlat={selectEditCurrentItemAlat}
                                        supplierSearch={editCurrentItemSupplierSearch} setSupplierSearch={setEditCurrentItemSupplierSearch}
                                        showSupplierDrop={showEditCurrentItemSupplierDropdown} setShowSupplierDrop={setShowEditCurrentItemSupplierDropdown}
                                        onSelectSupplier={selectEditCurrentItemSupplier}
                                        onAdd={addEditItem}
                                    />
                                </div>
                                {editFormData.items.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Daftar Item ({editFormData.items.length})</h3>
                                        <ItemsTable items={editFormData.items} onRemove={removeEditItem} />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Pengajuan <span className="text-red-600">*</span></label>
                                        <input type="date" value={editFormData.tanggalPengajuan}
                                            onChange={(e) => setEditFormData(prev => ({ ...prev, tanggalPengajuan: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                        {editFormData.tanggalPengajuan && <p className="mt-1 text-xs text-gray-400">{formatTanggal(editFormData.tanggalPengajuan)}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan <span className="text-gray-400 text-xs">(Opsional)</span></label>
                                        <textarea value={editFormData.catatan} onChange={(e) => setEditFormData(prev => ({ ...prev, catatan: e.target.value }))}
                                            rows="2" placeholder="Catatan pengajuan..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button type="button" onClick={() => { setShowEditModal(false); setEditCurrentItem({ ...EMPTY_ITEM }); setEditCurrentItemAlatSearch(''); setEditCurrentItemSupplierSearch(''); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition font-medium">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ========== DETAIL MODAL ========== */}
                {showDetailModal && selectedPembelian && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Detail Pengajuan Pembelian</h2>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(selectedPembelian.status)}`}>
                                        {getStatusIcon(selectedPembelian.status)} {selectedPembelian.status}
                                    </span>
                                    <span className="text-xs text-gray-400">Diajukan: {formatTanggal(selectedPembelian.tanggalPengajuan)}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Daftar Item</h3>
                                    <ItemsTable items={selectedPembelian.items} onRemove={null} />
                                </div>
                                {selectedPembelian.catatan && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1 font-medium">Catatan Pengajuan</p>
                                        <p className="text-sm text-gray-800">{selectedPembelian.catatan}</p>
                                    </div>
                                )}
                                {selectedPembelian.catatanApprove && (
                                    <div className={`rounded-lg p-3 border ${selectedPembelian.status === 'Disetujui' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                        <p className="text-xs font-medium text-gray-500 mb-1">
                                            {selectedPembelian.status === 'Disetujui' ? 'Catatan Persetujuan' : 'Alasan Penolakan'}
                                            {selectedPembelian.tanggalDisetujui && ` · ${formatTanggal(selectedPembelian.tanggalDisetujui)}`}
                                        </p>
                                        <p className="text-sm text-gray-800">{selectedPembelian.catatanApprove}</p>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-200">
                                    <button onClick={() => setShowDetailModal(false)}
                                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm">Tutup</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== APPROVE MODAL ========== */}
                {showApproveModal && selectedPembelian && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Konfirmasi Pengajuan</h2>
                                <button onClick={() => setShowApproveModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <div className="space-y-1">
                                        {selectedPembelian.items.map((it, idx) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span className="text-gray-700">{it.namaAlat} {it.spesifikasi} ×{it.jumlah} <span className="text-gray-400">— {it.namaSupplier}</span></span>
                                                <span className="font-medium text-gray-900">{formatRupiah(it.jumlah * it.hargaSatuan)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold">
                                        <span className="text-gray-700">Total</span>
                                        <span className="text-red-600">{formatRupiah(getTotalHarga(selectedPembelian.items))}</span>
                                    </div>
                                </div>
                                {selectedPembelian.catatan && (
                                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-700">
                                        <span className="font-medium text-gray-500">Catatan: </span>{selectedPembelian.catatan}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan <span className="text-gray-400 text-xs">(Opsional)</span></label>
                                    <textarea value={approveNote} onChange={(e) => setApproveNote(e.target.value)}
                                        rows="3" placeholder="Tambahkan catatan persetujuan atau penolakan..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />
                                </div>
                                <div className="flex gap-3 pt-2 border-t border-gray-200">
                                    <button type="button" onClick={() => setShowApproveModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                    <button type="button" onClick={() => handleApprove(false)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-medium flex items-center justify-center gap-1.5">
                                        <XCircle className="w-4 h-4" /> Tolak
                                    </button>
                                    <button type="button" onClick={() => handleApprove(true)}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition font-medium flex items-center justify-center gap-1.5">
                                        <CheckCircle className="w-4 h-4" /> Setujui
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== DELETE CONFIRM ========== */}
                {showDeleteConfirm && selectedPembelian && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Hapus Pengajuan</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-5">Yakin ingin menghapus pengajuan ini?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                <button onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-medium">Hapus</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== FILTER MODAL ========== */}
                {showFilterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Filter Tanggal</h2>
                                <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dari Tanggal</label>
                                    <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                    {filterDateFrom && <p className="mt-1 text-xs text-gray-400">{formatTanggal(filterDateFrom)}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sampai Tanggal</label>
                                    <input type="date" value={filterDateTo} min={filterDateFrom} onChange={(e) => setFilterDateTo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                    {filterDateTo && <p className="mt-1 text-xs text-gray-400">{formatTanggal(filterDateTo)}</p>}
                                </div>
                                {filterDateFrom && filterDateTo && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                        <p className="text-xs text-blue-800">
                                            Menampilkan dari <strong>{formatTanggal(filterDateFrom)}</strong> sampai <strong>{formatTanggal(filterDateTo)}</strong>
                                        </p>
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2 border-t border-gray-200">
                                    <button onClick={() => { handleResetFilter(); setShowFilterModal(false); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Reset</button>
                                    <button onClick={() => setShowFilterModal(false)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">Terapkan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PembelianAlatPage;