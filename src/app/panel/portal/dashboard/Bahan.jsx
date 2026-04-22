"use client";
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Eye, X, Calendar, Building2, ChevronDown, FlaskConical, Package, AlertTriangle, CheckCircle } from 'lucide-react';

const BahanPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditAddSupplierModal, setShowEditAddSupplierModal] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showEditSupplierDropdown, setShowEditSupplierDropdown] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBahan, setSelectedBahan] = useState(null);
  const [editingBahan, setEditingBahan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [editSupplierSearchTerm, setEditSupplierSearchTerm] = useState('');

  // Filter states
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterJenisBahan, setFilterJenisBahan] = useState('');

  const [formData, setFormData] = useState({
    namaBahan: '',
    rumusKimia: '',
    spesifikasi: '',
    jenisBahan: 'larutan',
    jumlahInput: '',
    satuanInput: 'mL',
    jumlah: '',
    satuan: 'mL',
    merkBrand: '',
    suppliers: [],
    penyimpanan: '',
    tanggalKadaluarsa: ''
  });

  const [editFormData, setEditFormData] = useState({
    namaBahan: '',
    rumusKimia: '',
    spesifikasi: '',
    jenisBahan: 'larutan',
    jumlahInput: '',
    satuanInput: 'mL',
    jumlah: '',
    satuan: 'mL',
    merkBrand: '',
    suppliers: [],
    penyimpanan: '',
    tanggalKadaluarsa: ''
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

  // Konversi satuan untuk padatan (ke gram)
  const konversiPadatan = {
    'mg': 0.001,
    'g': 1,
    'kg': 1000,
  };

  // Konversi satuan untuk larutan (ke mililiter)
  const konversiLarutan = {
    'μL': 0.001,
    'mL': 1,
    'L': 1000,
  };

  // Master Data Supplier
  const [masterSuppliers, setMasterSuppliers] = useState([
    { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' },
    { id: 2, namaSupplier: 'CV Sumber Kimia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' },
    { id: 3, namaSupplier: 'PT Mitra Laboratorium', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' },
    { id: 4, namaSupplier: 'UD Cahaya Kimia', alamat: 'Jl. Gatot Subroto No. 45, Surabaya', noWa: '081334455667' }
  ]);

  // Master Data Lokasi Penyimpanan
  const MASTER_LOKASI = [
    'Lemari Kuning', 'Lemari Kanan', 'Lemari Asam', 'Lemari Penyimpanan',
    'Rak 1', 'Rak 2', 'Rak 3', 'Freezer A', 'Freezer B'
  ];

  // Data dummy bahan kimia
  const [bahanList, setBahanList] = useState([
    {
      id: 1,
      namaBahan: 'Carbon disulfide',
      rumusKimia: 'Cs2',
      spesifikasi: 'for analisis',
      jenisBahan: 'larutan',
      jumlah: 1000,
      satuan: 'mL',
      merkBrand: 'Merck',
      suppliers: [{ id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' }],
      penyimpanan: 'Lemari Kuning',
      tanggalKadaluarsa: '2025-12-31',
      status: 'Tersedia'
    },
    {
      id: 2,
      namaBahan: 'Petroleum benzene',
      rumusKimia: 'C5C6',
      spesifikasi: 'for analisis',
      jenisBahan: 'larutan',
      jumlah: 4000,
      satuan: 'mL',
      merkBrand: 'Sigma-Aldrich',
      suppliers: [{ id: 2, namaSupplier: 'CV Sumber Kimia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' }],
      penyimpanan: 'Rak 2',
      tanggalKadaluarsa: '2026-06-15',
      status: 'Tersedia'
    },
    {
      id: 3,
      namaBahan: 'Natrium Klorida',
      rumusKimia: 'NaCl',
      spesifikasi: 'Pro Analisis',
      jenisBahan: 'padatan',
      jumlah: 5000,
      satuan: 'g',
      merkBrand: 'Merck',
      suppliers: [
        { id: 3, namaSupplier: 'PT Mitra Laboratorium', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' },
        { id: 4, namaSupplier: 'UD Cahaya Kimia', alamat: 'Jl. Gatot Subroto No. 45, Surabaya', noWa: '081334455667' }
      ],
      penyimpanan: 'Lemari Penyimpanan',
      tanggalKadaluarsa: '',
      status: 'Tersedia'
    },
  ]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const getStatusColor = (jumlah) => {
    if (jumlah < 500) return 'bg-red-100 text-red-700';
    if (jumlah < 1000) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isExpiringSoon = (tanggal) => {
    if (!tanggal) return false;
    const diffDays = Math.ceil((new Date(tanggal) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (tanggal) => {
    if (!tanggal) return false;
    return new Date(tanggal) < new Date();
  };

  const applyKonversi = (jumlahInput, satuanInput, jenisBahan) => {
    if (!jumlahInput || isNaN(jumlahInput)) return '';
    const num = parseFloat(jumlahInput);
    const result = jenisBahan === 'padatan'
      ? num * konversiPadatan[satuanInput]
      : num * konversiLarutan[satuanInput];
    return result.toFixed(3);
  };

  // ─── Stats ───────────────────────────────────────────────────────────────────

  const totalBahan = bahanList.length;
  const totalLarutan = bahanList.filter(b => b.jenisBahan === 'larutan').length;
  const totalPadatan = bahanList.filter(b => b.jenisBahan === 'padatan').length;
  const stokMenipis = bahanList.filter(b => b.jumlah < 500).length;
  const kadaluarsa = bahanList.filter(b => isExpired(b.tanggalKadaluarsa) || isExpiringSoon(b.tanggalKadaluarsa)).length;

  // ─── Add Form Handlers ───────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jenisBahan') {
      const newSatuan = value === 'padatan' ? 'g' : 'mL';
      setFormData(prev => ({ ...prev, [name]: value, satuan: newSatuan, satuanInput: newSatuan, jumlahInput: '', jumlah: '' }));
    } else if (name === 'satuanInput' || name === 'jumlahInput') {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        newData.jumlah = applyKonversi(
          name === 'jumlahInput' ? value : prev.jumlahInput,
          name === 'satuanInput' ? value : prev.satuanInput,
          prev.jenisBahan
        );
        return newData;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.suppliers.length === 0) {
      alert('Mohon tambahkan minimal satu supplier!');
      return;
    }
    const newBahan = {
      id: bahanList.length > 0 ? Math.max(...bahanList.map(b => b.id)) + 1 : 1,
      namaBahan: formData.namaBahan,
      rumusKimia: formData.rumusKimia,
      spesifikasi: formData.spesifikasi,
      jenisBahan: formData.jenisBahan,
      jumlah: parseFloat(formData.jumlah),
      satuan: formData.satuan,
      merkBrand: formData.merkBrand,
      suppliers: formData.suppliers,
      penyimpanan: formData.penyimpanan,
      tanggalKadaluarsa: formData.tanggalKadaluarsa,
      status: 'Tersedia'
    };
    setBahanList([...bahanList, newBahan]);
    setShowAddModal(false);
    setFormData({ namaBahan: '', rumusKimia: '', spesifikasi: '', jenisBahan: 'larutan', jumlahInput: '', satuanInput: 'mL', jumlah: '', satuan: 'mL', merkBrand: '', suppliers: [], penyimpanan: '', tanggalKadaluarsa: '' });
  };

  // ─── Edit Form Handlers ──────────────────────────────────────────────────────

  const handleShowEdit = (bahan) => {
    setEditingBahan(bahan);
    // Reverse-calculate jumlahInput (use stored jumlah as-is, satuan base)
    setEditFormData({
      namaBahan: bahan.namaBahan,
      rumusKimia: bahan.rumusKimia,
      spesifikasi: bahan.spesifikasi,
      jenisBahan: bahan.jenisBahan,
      jumlahInput: String(bahan.jumlah),
      satuanInput: bahan.satuan,
      jumlah: String(bahan.jumlah),
      satuan: bahan.satuan,
      merkBrand: bahan.merkBrand || '',
      suppliers: [...bahan.suppliers],
      penyimpanan: bahan.penyimpanan || '',
      tanggalKadaluarsa: bahan.tanggalKadaluarsa || ''
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jenisBahan') {
      const newSatuan = value === 'padatan' ? 'g' : 'mL';
      setEditFormData(prev => ({ ...prev, [name]: value, satuan: newSatuan, satuanInput: newSatuan, jumlahInput: '', jumlah: '' }));
    } else if (name === 'satuanInput' || name === 'jumlahInput') {
      setEditFormData(prev => {
        const newData = { ...prev, [name]: value };
        newData.jumlah = applyKonversi(
          name === 'jumlahInput' ? value : prev.jumlahInput,
          name === 'satuanInput' ? value : prev.satuanInput,
          prev.jenisBahan
        );
        return newData;
      });
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editFormData.suppliers.length === 0) {
      alert('Mohon tambahkan minimal satu supplier!');
      return;
    }
    setBahanList(prev => prev.map(b =>
      b.id === editingBahan.id
        ? {
          ...b,
          namaBahan: editFormData.namaBahan,
          rumusKimia: editFormData.rumusKimia,
          spesifikasi: editFormData.spesifikasi,
          jenisBahan: editFormData.jenisBahan,
          jumlah: parseFloat(editFormData.jumlah),
          satuan: editFormData.satuan,
          merkBrand: editFormData.merkBrand,
          suppliers: editFormData.suppliers,
          penyimpanan: editFormData.penyimpanan,
          tanggalKadaluarsa: editFormData.tanggalKadaluarsa,
        }
        : b
    ));
    setShowEditModal(false);
    setEditingBahan(null);
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
      setBahanList(bahanList.filter(item => item.id !== id));
    }
  };

  const handleShowDetail = (bahan) => {
    setSelectedBahan(bahan);
    setShowDetailModal(true);
  };

  const handleResetFilter = () => {
    setFilterLokasi('');
    setFilterJenisBahan('');
  };

  const formatJumlah = (angka) => angka.toLocaleString('id-ID');

  // ─── Filtered Data ───────────────────────────────────────────────────────────

  const filteredBahan = bahanList.filter(item => {
    const matchSearch =
      item.namaBahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rumusKimia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLokasi = filterLokasi === '' || item.penyimpanan === filterLokasi;
    const matchJenisBahan = filterJenisBahan === '' || item.jenisBahan === filterJenisBahan;
    return matchSearch && matchLokasi && matchJenisBahan;
  });

  const filteredSuppliers = masterSuppliers.filter(s =>
    s.namaSupplier.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
    s.alamat.toLowerCase().includes(supplierSearchTerm.toLowerCase())
  );

  const filteredEditSuppliers = masterSuppliers.filter(s =>
    s.namaSupplier.toLowerCase().includes(editSupplierSearchTerm.toLowerCase()) ||
    s.alamat.toLowerCase().includes(editSupplierSearchTerm.toLowerCase())
  );

  // ─── Reusable Supplier Section ───────────────────────────────────────────────

  const SupplierSection = ({
    suppliers, showDropdown, setShowDropdown,
    searchTerm, setSearchTerm, filteredList,
    onSelect, onRemove, onOpenAddModal
  }) => (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Supplier <span className="text-red-600">*</span>
      </label>
      {suppliers.length > 0 && (
        <div className="mb-3 space-y-2">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="flex items-start justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2 flex-1">
                <Building2 className="w-4 h-4 text-green-600 mt-0.5" />
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

  // ─── Reusable Add Supplier Modal ─────────────────────────────────────────────

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

  // ─── Reusable Form Fields ─────────────────────────────────────────────────────

  const FormFields = ({ data, onChange }) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Nama Bahan <span className="text-red-600">*</span></label>
        <input type="text" name="namaBahan" value={data.namaBahan} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Rumus Kimia <span className="text-red-600">*</span></label>
        <input type="text" name="rumusKimia" value={data.rumusKimia} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" required />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-2">Spesifikasi <span className="text-red-600">*</span></label>
        <input type="text" name="spesifikasi" value={data.spesifikasi} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Jenis Bahan <span className="text-red-600">*</span></label>
        <select name="jenisBahan" value={data.jenisBahan} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" required>
          <option value="larutan">Larutan</option>
          <option value="padatan">Padatan</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Satuan Input <span className="text-red-600">*</span></label>
        <select name="satuanInput" value={data.satuanInput} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" required>
          {data.jenisBahan === 'padatan' ? (
            <><option value="mg">Miligram (mg)</option><option value="g">Gram (g)</option><option value="kg">Kilogram (kg)</option></>
          ) : (
            <><option value="μL">Mikroliter (μL)</option><option value="mL">Mililiter (mL)</option><option value="L">Liter (L)</option></>
          )}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Jumlah Input <span className="text-red-600">*</span></label>
        <input type="number" step="0.001" name="jumlahInput" value={data.jumlahInput} onChange={onChange} placeholder="Masukkan jumlah" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Hasil Konversi <span className="text-red-600">*</span></label>
        <input type="text" value={data.jumlah ? `${data.jumlah} ${data.satuan}` : '-'} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed font-semibold text-gray-700 text-xs" disabled readOnly />
        <p className="text-xs text-gray-500 mt-1">{data.jenisBahan === 'padatan' ? 'Otomatis dikonversi ke gram (g)' : 'Otomatis dikonversi ke mililiter (mL)'}</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Merk/Brand</label>
        <input type="text" name="merkBrand" value={data.merkBrand} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
        <select name="penyimpanan" value={data.penyimpanan} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs">
          <option value="">Pilih Lokasi</option>
          {MASTER_LOKASI.map((lokasi, idx) => (<option key={idx} value={lokasi}>{lokasi}</option>))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Tanggal Kadaluarsa <span className="text-gray-400 text-xs">(Opsional)</span></label>
        <input type="date" name="tanggalKadaluarsa" value={data.tanggalKadaluarsa} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs" />
      </div>
    </>
  );

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Bahan Kimia</h1>
          <p className="text-gray-600">Kelola data bahan kimia laboratorium</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Total Bahan</p>
            <p className="text-3xl font-bold text-gray-900">{totalBahan}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Larutan</p>
            <p className="text-3xl font-bold text-blue-600">{totalLarutan}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Padatan</p>
            <p className="text-3xl font-bold text-purple-600">{totalPadatan}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Stok Menipis</p>
            <p className="text-3xl font-bold text-red-600">{stokMenipis}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-2">Exp. Alert</p>
            <p className="text-3xl font-bold text-orange-500">{kadaluarsa}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama bahan, rumus kimia, atau spesifikasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {(filterLokasi || filterJenisBahan) && (
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {[filterLokasi, filterJenisBahan].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">
                <Plus className="w-4 h-4" />
                <span>Tambah Bahan</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Jenis Bahan</label>
                  <select value={filterJenisBahan} onChange={(e) => setFilterJenisBahan(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs">
                    <option value="">Semua Jenis</option>
                    <option value="larutan">Larutan</option>
                    <option value="padatan">Padatan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
                  <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs">
                    <option value="">Semua Lokasi</option>
                    {MASTER_LOKASI.map((lokasi, idx) => (<option key={idx} value={lokasi}>{lokasi}</option>))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={handleResetFilter} className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs">Reset Filter</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(filterLokasi || filterJenisBahan) && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-600">Filter aktif:</span>
            {filterJenisBahan && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Jenis: {filterJenisBahan.charAt(0).toUpperCase() + filterJenisBahan.slice(1)}
                <button onClick={() => setFilterJenisBahan('')} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterLokasi && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                Lokasi: {filterLokasi}
                <button onClick={() => setFilterLokasi('')} className="hover:bg-purple-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bahan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Bahan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Penyimpanan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadaluarsa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBahan.length > 0 ? (
                  filteredBahan.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 text-center">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-900">{item.namaBahan}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full text-gray-900`}>
                          {item.jenisBahan.charAt(0).toUpperCase() + item.jenisBahan.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full text-gray-900`}>
                          {formatJumlah(item.jumlah)} {item.satuan}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-900">{item.penyimpanan}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.tanggalKadaluarsa ? (
                          <div className="flex items-center gap-1">
                            {isExpired(item.tanggalKadaluarsa) ? (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">Kadaluarsa</span>
                            ) : isExpiringSoon(item.tanggalKadaluarsa) ? (
                              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">Segera Kadaluarsa</span>
                            ) : (
                              <span className="text-xs text-gray-600">{formatTanggal(item.tanggalKadaluarsa)}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button onClick={() => handleShowDetail(item)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Lihat Detail"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleShowEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-gray-300" />
                        <p className="text-xs">Tidak ada data bahan yang ditemukan</p>
                        {(searchTerm || filterLokasi || filterJenisBahan) && (
                          <button onClick={() => { setSearchTerm(''); handleResetFilter(); }} className="text-red-600 hover:text-red-700 text-xs font-medium">
                            Reset pencarian dan filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
        {showDetailModal && selectedBahan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detail Bahan Kimia</h2>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Bahan</label>
                    <p className="text-xs font-semibold text-gray-900">{selectedBahan.namaBahan}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rumus Kimia</label>
                    <p className="text-xs font-mono font-semibold text-gray-900">{selectedBahan.rumusKimia}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Spesifikasi</label>
                    <p className="text-xs text-gray-900">{selectedBahan.spesifikasi}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Bahan</label>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${selectedBahan.jenisBahan === 'padatan' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedBahan.jenisBahan.charAt(0).toUpperCase() + selectedBahan.jenisBahan.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah</label>
                    <p className="text-xs font-semibold text-gray-900">{selectedBahan.jumlah} {selectedBahan.satuan}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Merk/Brand</label>
                    <p className="text-xs text-gray-900">{selectedBahan.merkBrand || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Penyimpanan</label>
                    <p className="text-xs text-gray-900">{selectedBahan.penyimpanan || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Supplier</label>
                    {selectedBahan.suppliers && selectedBahan.suppliers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBahan.suppliers.map((supplier, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                              <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
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
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Kadaluarsa</label>
                    {selectedBahan.tanggalKadaluarsa ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-900">{formatTanggal(selectedBahan.tanggalKadaluarsa)}</span>
                        {isExpired(selectedBahan.tanggalKadaluarsa) && <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">Kadaluarsa</span>}
                        {isExpiringSoon(selectedBahan.tanggalKadaluarsa) && !isExpired(selectedBahan.tanggalKadaluarsa) && <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">Segera Kadaluarsa</span>}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">-</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status Stok</label>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBahan.jumlah)}`}>
                      {selectedBahan.jumlah < 500 ? 'Stok Menipis' : selectedBahan.jumlah < 1000 ? 'Stok Sedang' : 'Stok Cukup'}
                    </span>
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
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Bahan Kimia Baru</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFields data={formData} onChange={handleInputChange} />
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
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ namaBahan: '', rumusKimia: '', spesifikasi: '', jenisBahan: 'larutan', jumlahInput: '', satuanInput: 'mL', jumlah: '', satuan: 'mL', merkBrand: '', suppliers: [], penyimpanan: '', tanggalKadaluarsa: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs"
                  >
                    Batal
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
        {showEditModal && editingBahan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Bahan Kimia</h2>
                <button onClick={() => { setShowEditModal(false); setEditingBahan(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFields data={editFormData} onChange={handleEditInputChange} />
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
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingBahan(null); }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs"
                  >
                    Batal
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Add Supplier Modal (for Add form) ────────────────────────────────── */}
        <AddSupplierModal
          show={showAddSupplierModal}
          supplierData={newSupplierData}
          onChange={handleNewSupplierInputChange}
          onSave={handleAddNewSupplier}
          onClose={() => { setShowAddSupplierModal(false); setNewSupplierData({ namaSupplier: '', alamat: '', noWa: '' }); }}
          zIndex="z-[60]"
        />

        {/* ── Add Supplier Modal (for Edit form) ───────────────────────────────── */}
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

export default BahanPage;