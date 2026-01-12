"use client"
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const MasterSupplierPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    namaSupplier: '',
    alamat: '',
    noWa: '',
  });

  const [supplierList, setSupplierList] = useState([
    { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Sudirman No. 123, Jakarta', noWa: '081234567890' },
    { id: 2, namaSupplier: 'CV Labora Indonesia', alamat: 'Jl. Gatot Subroto No. 45, Bandung', noWa: '082345678901' },
    { id: 3, namaSupplier: 'PT Sains Nusantara', alamat: 'Jl. Ahmad Yani No. 78, Surabaya', noWa: '083456789012' },
    { id: 4, namaSupplier: 'Toko Kimia Sejahtera', alamat: 'Jl. Merdeka No. 56, Yogyakarta', noWa: '084567890123' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.namaSupplier && formData.alamat && formData.noWa) {
      const newSupplier = {
        id: supplierList.length + 1,
        ...formData,
      };
      setSupplierList([...supplierList, newSupplier]);
      setShowAddModal(false);
      setFormData({ namaSupplier: '', alamat: '', noWa: '' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      setSupplierList(supplierList.filter(item => item.id !== id));
    }
  };

  const filteredSupplier = supplierList.filter(item =>
    item.namaSupplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Supplier</h1>
          <p className="text-gray-600">Kelola data supplier alat dan bahan kimia</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama supplier atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Supplier</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No WhatsApp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSupplier.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.namaSupplier}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.alamat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.noWa}</td>
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

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Supplier Baru</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Supplier <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaSupplier"
                    value={formData.namaSupplier}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No WhatsApp <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="noWa"
                    value={formData.noWa}
                    onChange={handleInputChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
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

export default MasterSupplierPage;