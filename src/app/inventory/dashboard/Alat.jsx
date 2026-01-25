import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X } from 'lucide-react';

// Data master supplier dan lokasi
const MASTER_SUPPLIERS = [
  { id: 1, namaSupplier: 'PT Kimia Jaya' },
  { id: 2, namaSupplier: 'CV Labora Indonesia' },
  { id: 3, namaSupplier: 'PT Sains Nusantara' },
  { id: 4, namaSupplier: 'Toko Kimia Sejahtera' },
];

const MASTER_LOKASI = [
  { id: 1, penyimpanan: 'Lemari Kuning' },
  { id: 2, penyimpanan: 'Lemari Kanan' },
  { id: 3, penyimpanan: 'Rak 1' },
  { id: 4, penyimpanan: 'Rak 2' },
  { id: 5, penyimpanan: 'Rak 3' },
  { id: 6, penyimpanan: 'Freezer A' },
];

const AlatPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  
  const [formData, setFormData] = useState({
    namaAlat: '',
    spesifikasi: '',
    jumlah: '',
    merkBrand: '',
    supplier: null,
    penyimpanan: ''
  });

  // State untuk dropdown
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
  const [lokasiSearch, setLokasiSearch] = useState('');
  const [showLokasiDropdown, setShowLokasiDropdown] = useState(false);
  const [selectedLokasi, setSelectedLokasi] = useState('');

  const [alatList, setAlatList] = useState([
    { id: 1, no: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', jumlah: 1, merkBrand: 'Pyrex', supplier: MASTER_SUPPLIERS[0], penyimpanan: 'Lemari Kanan' },
    { id: 2, no: 2, namaAlat: 'Erlenmeyer', spesifikasi: '50 ml', jumlah: 3, merkBrand: 'Pyrex', supplier: null, penyimpanan: 'Rak 2' },
    { id: 3, no: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 4, merkBrand: '', supplier: MASTER_SUPPLIERS[1], penyimpanan: 'Rak 2' },
    { id: 4, no: 4, namaAlat: 'Labu jantung', spesifikasi: '50 ml', jumlah: 4, merkBrand: 'Duran', supplier: MASTER_SUPPLIERS[0], penyimpanan: 'Rak 3' },
    { id: 5, no: 5, namaAlat: 'Buret', spesifikasi: '10 ml', jumlah: 15, merkBrand: '', supplier: null, penyimpanan: 'Rak 1' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk memilih supplier
  const selectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData(prev => ({ ...prev, supplier: supplier }));
    setShowSupplierDropdown(false);
    setSupplierSearch('');
  };

  // Fungsi untuk clear supplier
  const clearSupplier = () => {
    setSelectedSupplier(null);
    setFormData(prev => ({ ...prev, supplier: null }));
  };

  // Fungsi untuk memilih lokasi
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
      supplier: null,
      penyimpanan: ''
    });
    setSelectedSupplier(null);
    setSelectedLokasi('');
    setSupplierSearch('');
    setLokasiSearch('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alat ini?')) {
      setAlatList(alatList.filter(item => item.id !== id));
    }
  };

  // Filter alat
  const filteredAlat = alatList.filter(item =>
    (item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterLokasi === '' || item.penyimpanan === filterLokasi)
  );

  // Filter dropdown
  const filteredSuppliers = MASTER_SUPPLIERS.filter(s =>
    s.namaSupplier.toLowerCase().includes(supplierSearch.toLowerCase())
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyimpanan</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.merkBrand || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.supplier ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {item.supplier.namaSupplier}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.penyimpanan || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
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

                  {/* Supplier Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier (Opsional)</label>
                    <div className="relative">
                      {selectedSupplier ? (
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between">
                          <span>{selectedSupplier.namaSupplier}</span>
                          <X
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={clearSupplier}
                          />
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Cari supplier..."
                            value={supplierSearch}
                            onChange={(e) => {
                              setSupplierSearch(e.target.value);
                              setShowSupplierDropdown(true);
                            }}
                            onFocus={() => setShowSupplierDropdown(true)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                          
                          {showSupplierDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {filteredSuppliers.length > 0 ? (
                                filteredSuppliers.map(supplier => (
                                  <button
                                    key={supplier.id}
                                    onClick={() => selectSupplier(supplier)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition"
                                  >
                                    {supplier.namaSupplier}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                  Supplier tidak ditemukan
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
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
                </div>
                
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
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
      </div>
    </div>
  );
};

export default AlatPage;