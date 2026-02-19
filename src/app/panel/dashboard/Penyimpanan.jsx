"use client"
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';

const MasterLokasiPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    penyimpanan: '',
  });

  const [lokasiList, setLokasiList] = useState([
    { id: 1, penyimpanan: 'Lemari Kuning' },
    { id: 2, penyimpanan: 'Lemari Kanan' },
    { id: 3, penyimpanan: 'Rak 1' },
    { id: 4, penyimpanan: 'Rak 2' },
    { id: 5, penyimpanan: 'Rak 3' },
    { id: 6, penyimpanan: 'Freezer A' },
    { id: 7, penyimpanan: 'Freezer B' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.penyimpanan) {
      const newLokasi = {
        id: lokasiList.length + 1,
        ...formData,
      };
      setLokasiList([...lokasiList, newLokasi]);
      setShowAddModal(false);
      setFormData({ penyimpanan: '' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      setLokasiList(lokasiList.filter(item => item.id !== id));
    }
  };

  const filteredLokasi = lokasiList.filter(item =>
    item.penyimpanan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Lokasi Penyimpanan</h1>
          <p className="text-gray-600">Kelola data lokasi penyimpanan alat dan bahan kimia</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari lokasi penyimpanan..."
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
              <span>Tambah Lokasi</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Penyimpanan</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredLokasi.map((item, index) => (
          <tr key={item.id} className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-middle">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap align-middle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{item.penyimpanan}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right align-middle">
              <div className="flex justify-end gap-1">
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
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
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Lokasi Baru</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lokasi Penyimpanan <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="penyimpanan"
                    value={formData.penyimpanan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Lemari Kuning, Rak 1, Freezer A"
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

export default MasterLokasiPage;