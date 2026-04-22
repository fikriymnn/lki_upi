import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Eye, Building2, ChevronDown, FlaskConical, Package, Layers } from 'lucide-react';

const AlatPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditAddSupplierModal, setShowEditAddSupplierModal] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showEditSupplierDropdown, setShowEditSupplierDropdown] = useState(false);
  const [selectedAlat, setSelectedAlat] = useState(null);
  const [editingAlat, setEditingAlat] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [editSupplierSearchTerm, setEditSupplierSearchTerm] = useState('');
  const [lokasiSearch, setLokasiSearch] = useState('');
  const [editLokasiSearch, setEditLokasiSearch] = useState('');
  const [showLokasiDropdown, setShowLokasiDropdown] = useState(false);
  const [showEditLokasiDropdown, setShowEditLokasiDropdown] = useState(false);
  const [selectedLokasi, setSelectedLokasi] = useState('');
  const [selectedEditLokasi, setSelectedEditLokasi] = useState('');

  const [formData, setFormData] = useState({
    namaAlat: '',
    spesifikasi: '',
    jumlah: '',
    merkBrand: '',
    suppliers: [],
    penyimpanan: ''
  });

  const [editFormData, setEditFormData] = useState({
    namaAlat: '',
    spesifikasi: '',
    jumlah: '',
    merkBrand: '',
    suppliers: [],
    penyimpanan: ''
  });

  const [newSupplierData, setNewSupplierData] = useState({
    namaSupplier: '',
    alamat: '',
    noWa: ''
  });

  const [newEditSupplierData, setNewEditSupplierData] = useState({
    namaSupplier: '',
    alamat: '',
    noWa: ''
  });

  // Master Data Supplier
  const [masterSuppliers, setMasterSuppliers] = useState([
    { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' },
    { id: 2, namaSupplier: 'CV Labora Indonesia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' },
    { id: 3, namaSupplier: 'PT Sains Nusantara', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' },
    { id: 4, namaSupplier: 'Toko Kimia Sejahtera', alamat: 'Jl. Gatot Subroto No. 45, Surabaya', noWa: '081334455667' }
  ]);

  // Master Data Lokasi
  const MASTER_LOKASI = [
    { id: 1, penyimpanan: 'Lemari Kuning' },
    { id: 2, penyimpanan: 'Lemari Kanan' },
    { id: 3, penyimpanan: 'Rak 1' },
    { id: 4, penyimpanan: 'Rak 2' },
    { id: 5, penyimpanan: 'Rak 3' },
    { id: 6, penyimpanan: 'Freezer A' },
  ];

  const [alatList, setAlatList] = useState([
    {
      id: 1, no: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', jumlah: 1, merkBrand: 'Pyrex',
      suppliers: [{ id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' }],
      penyimpanan: 'Lemari Kanan'
    },
    {
      id: 2, no: 2, namaAlat: 'Erlenmeyer', spesifikasi: '50 ml', jumlah: 3, merkBrand: 'Pyrex',
      suppliers: [], penyimpanan: 'Rak 2'
    },
    {
      id: 3, no: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 4, merkBrand: '',
      suppliers: [{ id: 2, namaSupplier: 'CV Labora Indonesia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' }],
      penyimpanan: 'Rak 2'
    },
    {
      id: 4, no: 4, namaAlat: 'Labu jantung', spesifikasi: '50 ml', jumlah: 4, merkBrand: 'Duran',
      suppliers: [
        { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' },
        { id: 3, namaSupplier: 'PT Sains Nusantara', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' }
      ],
      penyimpanan: 'Rak 3'
    },
    {
      id: 5, no: 5, namaAlat: 'Buret', spesifikasi: '10 ml', jumlah: 15, merkBrand: '',
      suppliers: [], penyimpanan: 'Rak 1'
    },
  ]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const formatJumlah = (angka) => Number(angka).toLocaleString('id-ID');

  // ─── Stats ────────────────────────────────────────────────────────────────────

  const totalAlat = alatList.length;
  const totalUnit = alatList.reduce((sum, a) => sum + a.jumlah, 0);
  const totalLokasi = [...new Set(alatList.map(a => a.penyimpanan).filter(Boolean))].length;
  const totalDenganSupplier = alatList.filter(a => a.suppliers && a.suppliers.length > 0).length;

  // ─── Add Form Handlers ────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewSupplierInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplierData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewSupplier = () => {
    if (!newSupplierData.namaSupplier || !newSupplierData.alamat || !newSupplierData.noWa) {
      alert('Mohon lengkapi semua field supplier!');
      return;
    }
    const newId = masterSuppliers.length > 0 ? Math.max(...masterSuppliers.map(s => s.id)) + 1 : 1;
    const newSupplier = { id: newId, ...newSupplierData };
    setMasterSuppliers(prev => [...prev, newSupplier]);
    setFormData(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
    setNewSupplierData({ namaSupplier: '', alamat: '', noWa: '' });
    setShowAddSupplierModal(false);
  };

  const handleSelectSupplierFromMaster = (supplier) => {
    if (formData.suppliers.some(s => s.id === supplier.id)) {
      alert('Supplier sudah ditambahkan!');
      return;
    }
    setFormData(prev => ({ ...prev, suppliers: [...prev.suppliers, supplier] }));
    setShowSupplierDropdown(false);
    setSupplierSearchTerm('');
  };

  const handleRemoveSupplier = (supplierId) => {
    setFormData(prev => ({ ...prev, suppliers: prev.suppliers.filter(s => s.id !== supplierId) }));
  };

  const selectLokasi = (lokasi) => {
    setSelectedLokasi(lokasi);
    setFormData(prev => ({ ...prev, penyimpanan: lokasi }));
    setShowLokasiDropdown(false);
    setLokasiSearch('');
  };

  const handleSubmit = () => {
    if (formData.namaAlat && formData.spesifikasi && formData.jumlah) {
      const newAlat = {
        id: alatList.length > 0 ? Math.max(...alatList.map(a => a.id)) + 1 : 1,
        no: alatList.length + 1,
        ...formData,
        jumlah: parseInt(formData.jumlah)
      };
      setAlatList([...alatList, newAlat]);
      resetForm();
    }
  };

  const resetForm = () => {
    setShowAddModal(false);
    setFormData({ namaAlat: '', spesifikasi: '', jumlah: '', merkBrand: '', suppliers: [], penyimpanan: '' });
    setSelectedLokasi('');
    setSupplierSearchTerm('');
    setLokasiSearch('');
  };

  // ─── Edit Form Handlers ───────────────────────────────────────────────────────

  const handleShowEdit = (alat) => {
    setEditingAlat(alat);
    setEditFormData({
      namaAlat: alat.namaAlat,
      spesifikasi: alat.spesifikasi,
      jumlah: String(alat.jumlah),
      merkBrand: alat.merkBrand || '',
      suppliers: [...alat.suppliers],
      penyimpanan: alat.penyimpanan || ''
    });
    setSelectedEditLokasi(alat.penyimpanan || '');
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewEditSupplierInputChange = (e) => {
    const { name, value } = e.target;
    setNewEditSupplierData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewEditSupplier = () => {
    if (!newEditSupplierData.namaSupplier || !newEditSupplierData.alamat || !newEditSupplierData.noWa) {
      alert('Mohon lengkapi semua field supplier!');
      return;
    }
    const newId = masterSuppliers.length > 0 ? Math.max(...masterSuppliers.map(s => s.id)) + 1 : 1;
    const newSupplier = { id: newId, ...newEditSupplierData };
    setMasterSuppliers(prev => [...prev, newSupplier]);
    setEditFormData(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
    setNewEditSupplierData({ namaSupplier: '', alamat: '', noWa: '' });
    setShowEditAddSupplierModal(false);
  };

  const handleEditSelectSupplierFromMaster = (supplier) => {
    if (editFormData.suppliers.some(s => s.id === supplier.id)) {
      alert('Supplier sudah ditambahkan!');
      return;
    }
    setEditFormData(prev => ({ ...prev, suppliers: [...prev.suppliers, supplier] }));
    setShowEditSupplierDropdown(false);
    setEditSupplierSearchTerm('');
  };

  const handleEditRemoveSupplier = (supplierId) => {
    setEditFormData(prev => ({ ...prev, suppliers: prev.suppliers.filter(s => s.id !== supplierId) }));
  };

  const selectEditLokasi = (lokasi) => {
    setSelectedEditLokasi(lokasi);
    setEditFormData(prev => ({ ...prev, penyimpanan: lokasi }));
    setShowEditLokasiDropdown(false);
    setEditLokasiSearch('');
  };

  const handleEditSubmit = () => {
    if (editFormData.namaAlat && editFormData.spesifikasi && editFormData.jumlah) {
      setAlatList(prev => prev.map(a =>
        a.id === editingAlat.id
          ? { ...a, ...editFormData, jumlah: parseInt(editFormData.jumlah) }
          : a
      ));
      setShowEditModal(false);
      setEditingAlat(null);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alat ini?')) {
      setAlatList(alatList.filter(item => item.id !== id));
    }
  };

  const handleShowDetail = (alat) => {
    setSelectedAlat(alat);
    setShowDetailModal(true);
  };

  // ─── Filtered Data ────────────────────────────────────────────────────────────

  const filteredAlat = alatList.filter(item =>
    (item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterLokasi === '' || item.penyimpanan === filterLokasi)
  );

  const filteredSuppliers = masterSuppliers.filter(s =>
    s.namaSupplier.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
    s.alamat.toLowerCase().includes(supplierSearchTerm.toLowerCase())
  );

  const filteredEditSuppliers = masterSuppliers.filter(s =>
    s.namaSupplier.toLowerCase().includes(editSupplierSearchTerm.toLowerCase()) ||
    s.alamat.toLowerCase().includes(editSupplierSearchTerm.toLowerCase())
  );

  const filteredLokasiList = MASTER_LOKASI.filter(l =>
    l.penyimpanan.toLowerCase().includes(lokasiSearch.toLowerCase())
  );

  const filteredEditLokasiList = MASTER_LOKASI.filter(l =>
    l.penyimpanan.toLowerCase().includes(editLokasiSearch.toLowerCase())
  );

  // ─── Reusable Supplier Section ────────────────────────────────────────────────

  const SupplierSection = ({
    suppliers, showDropdown, setShowDropdown,
    searchTerm, setSearchTerm, filteredList,
    onSelect, onRemove, onOpenAddModal
  }) => (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Supplier <span className="text-gray-400 text-xs">(Opsional)</span>
      </label>
      {suppliers.length > 0 && (
        <div className="mb-3 space-y-2">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="flex items-start justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2 flex-1">
                <Building2 className="w-4 h-4 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{supplier.namaSupplier}</p>
                  <p className="text-xs text-gray-600">{supplier.alamat}</p>
                  <p className="text-xs text-gray-600">WA: {supplier.noWa}</p>
                </div>
              </div>
              <button type="button" onClick={() => onRemove(supplier.id)} className="p-1 text-red-600 hover:bg-red-100 rounded transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-xs text-gray-700">Pilih dari Master Supplier</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Cari supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredList.length > 0 ? (
                  filteredList.map((supplier) => (
                    <button
                      key={supplier.id}
                      type="button"
                      onClick={() => onSelect(supplier)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-xs font-medium text-gray-900">{supplier.namaSupplier}</p>
                      <p className="text-xs text-gray-600 mt-1">{supplier.alamat}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-xs text-gray-500 text-center">Supplier tidak ditemukan</p>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs">Tambah Baru</span>
        </button>
      </div>
    </div>
  );

  // ─── Reusable Add Supplier Modal ──────────────────────────────────────────────

  const AddSupplierModal = ({ show, supplierData, onChange, onSave, onClose, zIndex = "z-[60]" }) => {
    if (!show) return null;
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${zIndex} p-4`}>
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Tambah Supplier Baru</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Nama Supplier <span className="text-red-600">*</span></label>
                <input type="text" name="namaSupplier" value={supplierData.namaSupplier} onChange={onChange} placeholder="Contoh: PT Kimia Jaya" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Alamat <span className="text-red-600">*</span></label>
                <textarea name="alamat" value={supplierData.alamat} onChange={onChange} placeholder="Masukkan alamat lengkap" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Nomor WhatsApp <span className="text-red-600">*</span></label>
                <input type="text" name="noWa" value={supplierData.noWa} onChange={onChange} placeholder="Contoh: 081234567890" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
              </div>
            </div>
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs">Batal</button>
              <button type="button" onClick={onSave} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">Tambah Supplier</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Reusable Lokasi Dropdown ─────────────────────────────────────────────────

  const LokasiDropdown = ({ selectedLokasi, lokasiSearch, setLokasiSearch, showDropdown, setShowDropdown, filteredList, onSelect, label = "Lokasi Penyimpanan" }) => (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Cari lokasi penyimpanan..."
          value={selectedLokasi || lokasiSearch}
          onChange={(e) => {
            setLokasiSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs"
        />
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredList.length > 0 ? (
              filteredList.map(lokasi => (
                <button
                  key={lokasi.id}
                  type="button"
                  onClick={() => onSelect(lokasi.penyimpanan)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition text-xs"
                >
                  {lokasi.penyimpanan}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-xs text-gray-500">Lokasi tidak ditemukan</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ─── Reusable Form Fields ─────────────────────────────────────────────────────

  const FormFields = ({ data, onChange }) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Nama Alat <span className="text-red-600">*</span></label>
        <input type="text" name="namaAlat" value={data.namaAlat} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Spesifikasi <span className="text-red-600">*</span></label>
        <input type="text" name="spesifikasi" value={data.spesifikasi} onChange={onChange} placeholder="Contoh: 100 ml, besar, sedang" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Jumlah <span className="text-red-600">*</span></label>
        <input type="number" name="jumlah" value={data.jumlah} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Merk/Brand <span className="text-gray-400 text-xs">(Opsional)</span></label>
        <input type="text" name="merkBrand" value={data.merkBrand} onChange={onChange} placeholder="Contoh: Pyrex, Duran, dll" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Alat Laboratorium</h1>
          <p className="text-gray-600">Kelola data alat laboratorium kimia</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Total Jenis Alat</p>
            <p className="text-3xl font-bold text-gray-900">{totalAlat}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Total Unit</p>
            <p className="text-3xl font-bold text-blue-600">{formatJumlah(totalUnit)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Lokasi Digunakan</p>
            <p className="text-3xl font-bold text-purple-600">{totalLokasi}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Ada Supplier</p>
            <p className="text-3xl font-bold text-green-600">{totalDenganSupplier}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama alat atau spesifikasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">
                <Plus className="w-4 h-4" />
                <span>Tambah Alat</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
                  <select
                    value={filterLokasi}
                    onChange={(e) => setFilterLokasi(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs"
                  >
                    <option value="">Semua Lokasi</option>
                    {MASTER_LOKASI.map(l => (
                      <option key={l.id} value={l.penyimpanan}>{l.penyimpanan}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAlat.length > 0 ? (
                  filteredAlat.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 text-start">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900">{item.namaAlat}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{item.spesifikasi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">{formatJumlah(item.jumlah)} unit</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="flex gap-2">
                          <button onClick={() => handleShowDetail(item)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Lihat Detail"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleShowEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-gray-300" />
                        <p className="text-xs">Tidak ada data alat yang ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
        {showDetailModal && selectedAlat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detail Alat Laboratorium</h2>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Alat</label>
                    <p className="text-xs font-semibold text-gray-900">{selectedAlat.namaAlat}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Spesifikasi</label>
                    <p className="text-xs text-gray-900">{selectedAlat.spesifikasi}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah</label>
                    <p className="text-xs font-semibold text-gray-900">{formatJumlah(selectedAlat.jumlah)} unit</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Merk/Brand</label>
                    <p className="text-xs text-gray-900">{selectedAlat.merkBrand || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lokasi Penyimpanan</label>
                    <p className="text-xs text-gray-900">{selectedAlat.penyimpanan || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Supplier</label>
                    {selectedAlat.suppliers && selectedAlat.suppliers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedAlat.suppliers.map((supplier, idx) => (
                          <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start gap-3">
                              <Building2 className="w-4 h-4 text-purple-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-900">{supplier.namaSupplier}</p>
                                <p className="text-xs text-gray-600 mt-1">{supplier.alamat}</p>
                                <p className="text-xs text-gray-600 mt-1">WhatsApp: {supplier.noWa}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">-</p>
                    )}
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button onClick={() => setShowDetailModal(false)} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-xs">Tutup</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Modal ─────────────────────────────────────────────────────────── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Alat Baru</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFields data={formData} onChange={handleInputChange} />
                  <LokasiDropdown
                    selectedLokasi={selectedLokasi}
                    lokasiSearch={lokasiSearch}
                    setLokasiSearch={setLokasiSearch}
                    showDropdown={showLokasiDropdown}
                    setShowDropdown={setShowLokasiDropdown}
                    filteredList={filteredLokasiList}
                    onSelect={selectLokasi}
                  />
                  <SupplierSection
                    suppliers={formData.suppliers}
                    showDropdown={showSupplierDropdown}
                    setShowDropdown={setShowSupplierDropdown}
                    searchTerm={supplierSearchTerm}
                    setSearchTerm={setSupplierSearchTerm}
                    filteredList={filteredSuppliers}
                    onSelect={handleSelectSupplierFromMaster}
                    onRemove={handleRemoveSupplier}
                    onOpenAddModal={() => setShowAddSupplierModal(true)}
                  />
                </div>
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs">Batal</button>
                  <button type="button" onClick={handleSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">Simpan</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
        {showEditModal && editingAlat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Alat Laboratorium</h2>
                <button onClick={() => { setShowEditModal(false); setEditingAlat(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFields data={editFormData} onChange={handleEditInputChange} />
                  <LokasiDropdown
                    selectedLokasi={selectedEditLokasi}
                    lokasiSearch={editLokasiSearch}
                    setLokasiSearch={setEditLokasiSearch}
                    showDropdown={showEditLokasiDropdown}
                    setShowDropdown={setShowEditLokasiDropdown}
                    filteredList={filteredEditLokasiList}
                    onSelect={selectEditLokasi}
                  />
                  <SupplierSection
                    suppliers={editFormData.suppliers}
                    showDropdown={showEditSupplierDropdown}
                    setShowDropdown={setShowEditSupplierDropdown}
                    searchTerm={editSupplierSearchTerm}
                    setSearchTerm={setEditSupplierSearchTerm}
                    filteredList={filteredEditSuppliers}
                    onSelect={handleEditSelectSupplierFromMaster}
                    onRemove={handleEditRemoveSupplier}
                    onOpenAddModal={() => setShowEditAddSupplierModal(true)}
                  />
                </div>
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingAlat(null); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs">Batal</button>
                  <button type="button" onClick={handleEditSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">Simpan Perubahan</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Supplier Modal (Add form) ─────────────────────────────────────── */}
        <AddSupplierModal
          show={showAddSupplierModal}
          supplierData={newSupplierData}
          onChange={handleNewSupplierInputChange}
          onSave={handleAddNewSupplier}
          onClose={() => { setShowAddSupplierModal(false); setNewSupplierData({ namaSupplier: '', alamat: '', noWa: '' }); }}
          zIndex="z-[60]"
        />

        {/* ── Add Supplier Modal (Edit form) ────────────────────────────────────── */}
        <AddSupplierModal
          show={showEditAddSupplierModal}
          supplierData={newEditSupplierData}
          onChange={handleNewEditSupplierInputChange}
          onSave={handleAddNewEditSupplier}
          onClose={() => { setShowEditAddSupplierModal(false); setNewEditSupplierData({ namaSupplier: '', alamat: '', noWa: '' }); }}
          zIndex="z-[60]"
        />

      </div>
    </div>
  );
};

export default AlatPage;