"use client";
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';

const BahanPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    namaBahan: '',
    rumusKimia: '',
    spesifikasi: '',
    jumlah: '',
    satuan: 'mL',
    merkBrand: '',
    suplayer: '',
    penyimpanan: ''
  });

  // Data dummy bahan kimia
  const [bahanList, setBahanList] = useState([
    { 
      id: 1, 
      namaBahan: 'Carbon disulfide', 
      rumusKimia: 'Cs2', 
      spesifikasi: 'for analisis', 
      jumlah: 1000, 
      satuan: 'mL', 
      merkBrand: '', 
      suplayer: '', 
      penyimpanan: 'lemari kuning',
      status: 'Tersedia'
    },
    { 
      id: 2, 
      namaBahan: 'Petroleum benzene', 
      rumusKimia: 'C5C6', 
      spesifikasi: 'for analisis', 
      jumlah: 4000, 
      satuan: 'mL', 
      merkBrand: '', 
      suplayer: '', 
      penyimpanan: '',
      status: 'Tersedia'
    },
    { 
      id: 3, 
      namaBahan: 'Terte-butylamine', 
      rumusKimia: 'C4H11N', 
      spesifikasi: 'for sintetis', 
      jumlah: 900, 
      satuan: 'mL', 
      merkBrand: '', 
      suplayer: '', 
      penyimpanan: '',
      status: 'Tersedia'
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBahan = {
      id: bahanList.length + 1,
      ...formData,
      jumlah: parseFloat(formData.jumlah),
      status: 'Tersedia'
    };
    setBahanList([...bahanList, newBahan]);
    setShowAddModal(false);
    setFormData({
      namaBahan: '',
      rumusKimia: '',
      spesifikasi: '',
      jumlah: '',
      satuan: 'mL',
      merkBrand: '',
      suplayer: '',
      penyimpanan: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
      setBahanList(bahanList.filter(item => item.id !== id));
    }
  };

  const filteredBahan = bahanList.filter(item =>
    item.namaBahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rumusKimia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (jumlah) => {
    if (jumlah < 500) return 'bg-red-100 text-red-700';
    if (jumlah < 1000) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Bahan Kimia</h1>
          <p className="text-gray-600">Kelola data bahan kimia laboratorium</p>
        </div>

        {/* Warning Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">Perhatian Stok Bahan</h3>
            <p className="text-sm text-yellow-700">
              Ada {bahanList.filter(b => b.jumlah < 500).length} bahan dengan stok menipis yang perlu segera ditambah.
            </p>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bahan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rumus Kimia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merk/Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suplayer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyimpanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBahan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.namaBahan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">{item.rumusKimia}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.spesifikasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.jumlah)}`}>
                        {item.jumlah}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.satuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.merkBrand || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.suplayer || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.penyimpanan || '-'}</td>
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
                      Jumlah <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="jumlah"
                      value={formData.jumlah}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satuan <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="satuan"
                      value={formData.satuan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="mL">mL</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="Kg">Kg</option>
                    </select>
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
                      Suplayer
                    </label>
                    <input
                      type="text"
                      name="suplayer"
                      value={formData.suplayer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penyimpanan
                    </label>
                    <input
                      type="text"
                      name="penyimpanan"
                      value={formData.penyimpanan}
                      onChange={handleInputChange}
                      placeholder="Contoh: lemari kuning, rak 3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
      </div>
    </div>
  );
};

export default BahanPage;