"use client";
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, AlertTriangle, Eye, X, Calendar, Building2, ChevronDown } from 'lucide-react';

const BahanPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBahan, setSelectedBahan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  
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

  const [newSupplierData, setNewSupplierData] = useState({
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

  // Master Data Supplier (dummy static data)
  const [masterSuppliers, setMasterSuppliers] = useState([
    {
      id: 1,
      namaSupplier: 'PT Kimia Jaya',
      alamat: 'Jl. Industri No. 123, Jakarta',
      noWa: '081234567890'
    },
    {
      id: 2,
      namaSupplier: 'CV Sumber Kimia',
      alamat: 'Jl. Raya Bogor KM 45, Bogor',
      noWa: '081298765432'
    },
    {
      id: 3,
      namaSupplier: 'PT Mitra Laboratorium',
      alamat: 'Jl. Sudirman No. 88, Bandung',
      noWa: '081223344556'
    },
    {
      id: 4,
      namaSupplier: 'UD Cahaya Kimia',
      alamat: 'Jl. Gatot Subroto No. 45, Surabaya',
      noWa: '081334455667'
    }
  ]);

  // Master Data Lokasi Penyimpanan
  const MASTER_LOKASI = [
    'Lemari Kuning',
    'Lemari Kanan',
    'Lemari Asam',
    'Lemari Penyimpanan',
    'Rak 1',
    'Rak 2',
    'Rak 3',
    'Freezer A',
    'Freezer B'
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
      suppliers: [
        { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' }
      ],
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
      suppliers: [
        { id: 2, namaSupplier: 'CV Sumber Kimia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' }
      ],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'jenisBahan') {
      const newSatuan = value === 'padatan' ? 'g' : 'mL';
      const newSatuanInput = value === 'padatan' ? 'g' : 'mL';

      setFormData(prev => ({
        ...prev,
        [name]: value,
        satuan: newSatuan,
        satuanInput: newSatuanInput,
        jumlahInput: '',
        jumlah: ''
      }));
    }
    else if (name === 'satuanInput' || name === 'jumlahInput') {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };

        if (newData.jumlahInput && !isNaN(newData.jumlahInput)) {
          const jumlahNum = parseFloat(newData.jumlahInput);
          let hasilKonversi = 0;

          if (newData.jenisBahan === 'padatan') {
            hasilKonversi = jumlahNum * konversiPadatan[newData.satuanInput];
          } else {
            hasilKonversi = jumlahNum * konversiLarutan[newData.satuanInput];
          }

          newData.jumlah = hasilKonversi.toFixed(3);
        } else {
          newData.jumlah = '';
        }

        return newData;
      });
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewSupplierInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplierData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewSupplier = () => {
    if (!newSupplierData.namaSupplier || !newSupplierData.alamat || !newSupplierData.noWa) {
      alert('Mohon lengkapi semua field supplier!');
      return;
    }

    const newId = masterSuppliers.length > 0
      ? Math.max(...masterSuppliers.map(s => s.id)) + 1
      : 1;

    const newSupplier = {
      id: newId,
      ...newSupplierData
    };

    setMasterSuppliers(prev => [...prev, newSupplier]);

    setFormData(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, newSupplier]
    }));

    setNewSupplierData({
      namaSupplier: '',
      alamat: '',
      noWa: ''
    });
    setShowAddSupplierModal(false);
  };

  const handleSelectSupplierFromMaster = (supplier) => {
    const isAlreadyAdded = formData.suppliers.some(s => s.id === supplier.id);

    if (isAlreadyAdded) {
      alert('Supplier sudah ditambahkan!');
      return;
    }

    setFormData(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, supplier]
    }));
    setShowSupplierDropdown(false);
    setSupplierSearchTerm('');
  };

  const handleRemoveSupplier = (supplierId) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter(s => s.id !== supplierId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.suppliers.length === 0) {
      alert('Mohon tambahkan minimal satu supplier!');
      return;
    }

    const newBahan = {
      id: bahanList.length + 1,
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
    setFormData({
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
  };

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

  // Filter bahan dengan lokasi dan jenis bahan
  const filteredBahan = bahanList.filter(item => {
    const matchSearch = item.namaBahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rumusKimia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchLokasi = filterLokasi === '' || item.penyimpanan === filterLokasi;
    const matchJenisBahan = filterJenisBahan === '' || item.jenisBahan === filterJenisBahan;

    return matchSearch && matchLokasi && matchJenisBahan;
  });

  const filteredSuppliers = masterSuppliers.filter(supplier =>
    supplier.namaSupplier.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
    supplier.alamat.toLowerCase().includes(supplierSearchTerm.toLowerCase())
  );

  const getStatusColor = (jumlah) => {
    if (jumlah < 500) return 'bg-red-100 text-red-700';
    if (jumlah < 1000) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (tanggal) => {
    if (!tanggal) return false;
    const today = new Date();
    const expDate = new Date(tanggal);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (tanggal) => {
    if (!tanggal) return false;
    const today = new Date();
    const expDate = new Date(tanggal);
    return expDate < today;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Bahan Kimia</h1>
          <p className="text-gray-600">Kelola data bahan kimia laboratorium</p>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                {(filterLokasi || filterJenisBahan) && (
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {[filterLokasi, filterJenisBahan].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Bahan</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Bahan</label>
                  <select
                    value={filterJenisBahan}
                    onChange={(e) => setFilterJenisBahan(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="larutan">Larutan</option>
                    <option value="padatan">Padatan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
                  <select
                    value={filterLokasi}
                    onChange={(e) => setFilterLokasi(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Semua Lokasi</option>
                    {MASTER_LOKASI.map((lokasi, idx) => (
                      <option key={idx} value={lokasi}>{lokasi}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleResetFilter}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(filterLokasi || filterJenisBahan) && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filter aktif:</span>
            {filterJenisBahan && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Jenis: {filterJenisBahan.charAt(0).toUpperCase() + filterJenisBahan.slice(1)}
                <button
                  onClick={() => setFilterJenisBahan('')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterLokasi && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Lokasi: {filterLokasi}
                <button
                  onClick={() => setFilterLokasi('')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bahan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Bahan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Penyimpanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadaluarsa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBahan.length > 0 ? (
                  filteredBahan.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.namaBahan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.jenisBahan === 'padatan'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}>
                          {item.jenisBahan.charAt(0).toUpperCase() + item.jenisBahan.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.jumlah)}`}>
                          {item.jumlah} {item.satuan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.penyimpanan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.tanggalKadaluarsa ? (
                          <div className="flex items-center gap-2">
                            {isExpired(item.tanggalKadaluarsa) ? (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                                Kadaluarsa
                              </span>
                            ) : isExpiringSoon(item.tanggalKadaluarsa) ? (
                              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                                Segera Kadaluarsa
                              </span>
                            ) : (
                              <span className="text-sm text-gray-600">
                                {formatTanggal(item.tanggalKadaluarsa)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShowDetail(item)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-gray-300" />
                        <p className="text-sm">Tidak ada data bahan yang ditemukan</p>
                        {(searchTerm || filterLokasi || filterJenisBahan) && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              handleResetFilter();
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
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

        {/* Rest of the modals remain the same... */}
        {/* Detail Modal, Add Modal, Add Supplier Modal - keep the same as before */}

        {/* Detail Modal */}
        {showDetailModal && selectedBahan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detail Bahan Kimia</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nama Bahan</label>
                    <p className="text-base font-semibold text-gray-900">{selectedBahan.namaBahan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Rumus Kimia</label>
                    <p className="text-base font-mono font-semibold text-gray-900">{selectedBahan.rumusKimia}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Spesifikasi</label>
                    <p className="text-base text-gray-900">{selectedBahan.spesifikasi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Bahan</label>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${selectedBahan.jenisBahan === 'padatan'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {selectedBahan.jenisBahan.charAt(0).toUpperCase() + selectedBahan.jenisBahan.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Jumlah</label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBahan.jumlah} {selectedBahan.satuan}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Merk/Brand</label>
                    <p className="text-base text-gray-900">{selectedBahan.merkBrand || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Penyimpanan</label>
                    <p className="text-base text-gray-900">{selectedBahan.penyimpanan || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Supplier</label>
                    {selectedBahan.suppliers && selectedBahan.suppliers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBahan.suppliers.map((supplier, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{supplier.namaSupplier}</p>
                                <p className="text-sm text-gray-600 mt-1">{supplier.alamat}</p>
                                <p className="text-sm text-gray-600 mt-1">WhatsApp: {supplier.noWa}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-gray-400">-</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Kadaluarsa</label>
                    {selectedBahan.tanggalKadaluarsa ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-base text-gray-900">
                          {formatTanggal(selectedBahan.tanggalKadaluarsa)}
                        </span>
                        {isExpired(selectedBahan.tanggalKadaluarsa) && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                            Kadaluarsa
                          </span>
                        )}
                        {isExpiringSoon(selectedBahan.tanggalKadaluarsa) && !isExpired(selectedBahan.tanggalKadaluarsa) && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                            Segera Kadaluarsa
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-base text-gray-400">-</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status Stok</label>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedBahan.jumlah)}`}>
                      {selectedBahan.jumlah < 500 ? 'Stok Menipis' : selectedBahan.jumlah < 1000 ? 'Stok Sedang' : 'Stok Cukup'}
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Bahan Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Bahan Kimia Baru</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Bahan <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaBahan"
                      value={formData.namaBahan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rumus Kimia <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="rumusKimia"
                      value={formData.rumusKimia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {/* Supplier Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier <span className="text-red-600">*</span>
                    </label>

                    {/* Selected Suppliers */}
                    {formData.suppliers.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {formData.suppliers.map((supplier) => (
                          <div key={supplier.id} className="flex items-start justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-2 flex-1">
                              <Building2 className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{supplier.namaSupplier}</p>
                                <p className="text-xs text-gray-600">{supplier.alamat}</p>
                                <p className="text-xs text-gray-600">WA: {supplier.noWa}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSupplier(supplier.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Supplier Buttons */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <button
                          type="button"
                          onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
                          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <span className="text-sm text-gray-700">Pilih dari Master Supplier</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Supplier Dropdown */}
                        {showSupplierDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Cari supplier..."
                                value={supplierSearchTerm}
                                onChange={(e) => setSupplierSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredSuppliers.length > 0 ? (
                                filteredSuppliers.map((supplier) => (
                                  <button
                                    key={supplier.id}
                                    type="button"
                                    onClick={() => handleSelectSupplierFromMaster(supplier)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                                  >
                                    <p className="text-sm font-medium text-gray-900">{supplier.namaSupplier}</p>
                                    <p className="text-xs text-gray-600 mt-1">{supplier.alamat}</p>
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 text-center">Supplier tidak ditemukan</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddSupplierModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Tambah Baru</span>
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spesifikasi <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Bahan <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="jenisBahan"
                      value={formData.jenisBahan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="larutan">Larutan</option>
                      <option value="padatan">Padatan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satuan Input <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="satuanInput"
                      value={formData.satuanInput}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      {formData.jenisBahan === 'padatan' ? (
                        <>
                          <option value="mg">Miligram (mg)</option>
                          <option value="g">Gram (g)</option>
                          <option value="kg">Kilogram (kg)</option>
                        </>
                      ) : (
                        <>
                          <option value="μL">Mikroliter (μL)</option>
                          <option value="mL">Mililiter (mL)</option>
                          <option value="L">Liter (L)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Input <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="jumlahInput"
                      value={formData.jumlahInput}
                      onChange={handleInputChange}
                      placeholder="Masukkan jumlah"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hasil Konversi <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.jumlah ? `${formData.jumlah} ${formData.satuan}` : '-'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed font-semibold text-gray-700"
                        disabled
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.jenisBahan === 'padatan'
                        ? 'Otomatis dikonversi ke gram (g)'
                        : 'Otomatis dikonversi ke mililiter (mL)'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Merk/Brand
                    </label>
                    <input
                      type="text"
                      name="merkBrand"
                      value={formData.merkBrand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Penyimpanan
                    </label>
                    <select
                      name="penyimpanan"
                      value={formData.penyimpanan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Pilih Lokasi</option>
                      {MASTER_LOKASI.map((lokasi, idx) => (
                        <option key={idx} value={lokasi}>{lokasi}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Kadaluarsa <span className="text-gray-400 text-xs">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="tanggalKadaluarsa"
                        value={formData.tanggalKadaluarsa}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({
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
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add New Supplier Modal */}
        {showAddSupplierModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Supplier Baru</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Supplier <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaSupplier"
                      value={newSupplierData.namaSupplier}
                      onChange={handleNewSupplierInputChange}
                      placeholder="Contoh: PT Kimia Jaya"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="alamat"
                      value={newSupplierData.alamat}
                      onChange={handleNewSupplierInputChange}
                      placeholder="Masukkan alamat lengkap"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="noWa"
                      value={newSupplierData.noWa}
                      onChange={handleNewSupplierInputChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSupplierModal(false);
                      setNewSupplierData({
                        namaSupplier: '',
                        alamat: '',
                        noWa: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewSupplier}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Tambah Supplier
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

export default BahanPage;