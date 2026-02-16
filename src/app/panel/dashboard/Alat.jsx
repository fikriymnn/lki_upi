import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Eye, Building2, ChevronDown } from 'lucide-react';

const AlatPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedAlat, setSelectedAlat] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [lokasiSearch, setLokasiSearch] = useState('');
  const [showLokasiDropdown, setShowLokasiDropdown] = useState(false);
  const [selectedLokasi, setSelectedLokasi] = useState('');
  
  const [formData, setFormData] = useState({
    namaAlat: '',
    spesifikasi: '',
    jumlah: '',
    merkBrand: '',
    suppliers: [], // Changed to array
    penyimpanan: ''
  });

  const [newSupplierData, setNewSupplierData] = useState({
    namaSupplier: '',
    alamat: '',
    noWa: ''
  });

  // Master Data Supplier
  const [masterSuppliers, setMasterSuppliers] = useState([
    {
      id: 1,
      namaSupplier: 'PT Kimia Jaya',
      alamat: 'Jl. Industri No. 123, Jakarta',
      noWa: '081234567890'
    },
    {
      id: 2,
      namaSupplier: 'CV Labora Indonesia',
      alamat: 'Jl. Raya Bogor KM 45, Bogor',
      noWa: '081298765432'
    },
    {
      id: 3,
      namaSupplier: 'PT Sains Nusantara',
      alamat: 'Jl. Sudirman No. 88, Bandung',
      noWa: '081223344556'
    },
    {
      id: 4,
      namaSupplier: 'Toko Kimia Sejahtera',
      alamat: 'Jl. Gatot Subroto No. 45, Surabaya',
      noWa: '081334455667'
    }
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
      id: 1, 
      no: 1, 
      namaAlat: 'Erlenmeyer', 
      spesifikasi: '25 ml', 
      jumlah: 1, 
      merkBrand: 'Pyrex', 
      suppliers: [
        { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' }
      ],
      penyimpanan: 'Lemari Kanan' 
    },
    { 
      id: 2, 
      no: 2, 
      namaAlat: 'Erlenmeyer', 
      spesifikasi: '50 ml', 
      jumlah: 3, 
      merkBrand: 'Pyrex', 
      suppliers: [],
      penyimpanan: 'Rak 2' 
    },
    { 
      id: 3, 
      no: 3, 
      namaAlat: 'Erlenmeyer', 
      spesifikasi: '100 ml', 
      jumlah: 4, 
      merkBrand: '', 
      suppliers: [
        { id: 2, namaSupplier: 'CV Labora Indonesia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' }
      ],
      penyimpanan: 'Rak 2' 
    },
    { 
      id: 4, 
      no: 4, 
      namaAlat: 'Labu jantung', 
      spesifikasi: '50 ml', 
      jumlah: 4, 
      merkBrand: 'Duran', 
      suppliers: [
        { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' },
        { id: 3, namaSupplier: 'PT Sains Nusantara', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' }
      ],
      penyimpanan: 'Rak 3' 
    },
    { 
      id: 5, 
      no: 5, 
      namaAlat: 'Buret', 
      spesifikasi: '10 ml', 
      jumlah: 15, 
      merkBrand: '', 
      suppliers: [],
      penyimpanan: 'Rak 1' 
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Generate new ID
    const newId = masterSuppliers.length > 0 
      ? Math.max(...masterSuppliers.map(s => s.id)) + 1 
      : 1;

    const newSupplier = {
      id: newId,
      ...newSupplierData
    };

    // Add to master suppliers
    setMasterSuppliers(prev => [...prev, newSupplier]);

    // Add to current form data
    setFormData(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, newSupplier]
    }));

    // Reset form and close modal
    setNewSupplierData({
      namaSupplier: '',
      alamat: '',
      noWa: ''
    });
    setShowAddSupplierModal(false);
  };

  const handleSelectSupplierFromMaster = (supplier) => {
    // Check if supplier already added
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

  const selectLokasi = (lokasi) => {
    setSelectedLokasi(lokasi);
    setFormData(prev => ({ ...prev, penyimpanan: lokasi }));
    setShowLokasiDropdown(false);
    setLokasiSearch('');
  };

  const handleSubmit = () => {
    if (formData.namaAlat && formData.spesifikasi && formData.jumlah) {
      const newAlat = {
        id: alatList.length + 1,
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
    setFormData({
      namaAlat: '',
      spesifikasi: '',
      jumlah: '',
      merkBrand: '',
      suppliers: [],
      penyimpanan: ''
    });
    setSelectedLokasi('');
    setSupplierSearchTerm('');
    setLokasiSearch('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alat ini?')) {
      setAlatList(alatList.filter(item => item.id !== id));
    }
  };

  const handleShowDetail = (alat) => {
    setSelectedAlat(alat);
    setShowDetailModal(true);
  };

  // Filter alat
  const filteredAlat = alatList.filter(item =>
    (item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterLokasi === '' || item.penyimpanan === filterLokasi)
  );

  // Filter dropdown suppliers
  const filteredSuppliers = masterSuppliers.filter(supplier =>
    supplier.namaSupplier.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
    supplier.alamat.toLowerCase().includes(supplierSearchTerm.toLowerCase())
  );

  const filteredLokasiList = MASTER_LOKASI.filter(l =>
    l.penyimpanan.toLowerCase().includes(lokasiSearch.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Alat Laboratorium</h1>
          <p className="text-gray-600">Kelola data alat laboratorium kimia</p>
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
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Alat</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
                  <select
                    value={filterLokasi}
                    onChange={(e) => setFilterLokasi(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAlat.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.namaAlat}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.spesifikasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                        {item.jumlah} unit
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {item.suppliers && item.suppliers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.suppliers.slice(0, 2).map((supplier, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                {supplier.namaSupplier}
                              </span>
                            ))}
                            {item.suppliers.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                                +{item.suppliers.length - 2} lainnya
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td> */}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedAlat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detail Alat Laboratorium</h2>
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
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nama Alat</label>
                    <p className="text-base font-semibold text-gray-900">{selectedAlat.namaAlat}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Spesifikasi</label>
                    <p className="text-base text-gray-900">{selectedAlat.spesifikasi}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Jumlah</label>
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                      {selectedAlat.jumlah} unit
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Merk/Brand</label>
                    <p className="text-base text-gray-900">{selectedAlat.merkBrand || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Lokasi Penyimpanan</label>
                    <p className="text-base text-gray-900">{selectedAlat.penyimpanan || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Supplier</label>
                    {selectedAlat.suppliers && selectedAlat.suppliers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedAlat.suppliers.map((supplier, idx) => (
                          <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start gap-3">
                              <Building2 className="w-5 h-5 text-purple-600 mt-0.5" />
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

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Alat Baru</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Alat <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaAlat"
                      value={formData.namaAlat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spesifikasi <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleInputChange}
                      placeholder="Contoh: 100 ml, besar, sedang"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="jumlah"
                      value={formData.jumlah}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Merk/Brand (Opsional)</label>
                    <input
                      type="text"
                      name="merkBrand"
                      value={formData.merkBrand}
                      onChange={handleInputChange}
                      placeholder="Contoh: Pyrex, Duran, dll"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Lokasi Penyimpanan Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Penyimpanan</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari lokasi penyimpanan..."
                        value={selectedLokasi || lokasiSearch}
                        onChange={(e) => {
                          setLokasiSearch(e.target.value);
                          setSelectedLokasi('');
                          setShowLokasiDropdown(true);
                        }}
                        onFocus={() => setShowLokasiDropdown(true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      
                      {showLokasiDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredLokasiList.length > 0 ? (
                            filteredLokasiList.map(lokasi => (
                              <button
                                key={lokasi.id}
                                type="button"
                                onClick={() => selectLokasi(lokasi.penyimpanan)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition"
                              >
                                {lokasi.penyimpanan}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              Lokasi tidak ditemukan
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supplier Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier <span className="text-gray-400 text-xs">(Opsional)</span>
                    </label>
                    
                    {/* Selected Suppliers */}
                    {formData.suppliers.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {formData.suppliers.map((supplier) => (
                          <div key={supplier.id} className="flex items-start justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex items-start gap-2 flex-1">
                              <Building2 className="w-4 h-4 text-purple-600 mt-0.5" />
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
                </div>
                
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              </div>
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

export default AlatPage;