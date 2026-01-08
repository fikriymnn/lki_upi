import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const AlatPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    no: '',
    namaAlat: '',
    spesifikasi: '',
    jumlah: '',
    penyimpanan: ''
  });

  // Data dummy alat
  const [alatList, setAlatList] = useState([
    { id: 1, no: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', jumlah: 1, penyimpanan: 'lemari kanan' },
    { id: 2, no: 2, namaAlat: 'Erlenmeyer', spesifikasi: '50 ml', jumlah: 3, penyimpanan: '' },
    { id: 3, no: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 4, penyimpanan: '' },
    { id: 4, no: 4, namaAlat: 'Erlenmeyer', spesifikasi: '250 ml', jumlah: 1, penyimpanan: '' },
    { id: 5, no: 5, namaAlat: 'Labu jantung', spesifikasi: '50 ml', jumlah: 4, penyimpanan: '' },
    { id: 6, no: 6, namaAlat: 'Labu jantung', spesifikasi: '100 ml', jumlah: 6, penyimpanan: '' },
    { id: 7, no: 7, namaAlat: 'Buret', spesifikasi: '10 ml', jumlah: 15, penyimpanan: '' },
    { id: 8, no: 8, namaAlat: 'Buret', spesifikasi: '50 ml', jumlah: 12, penyimpanan: '' },
    { id: 9, no: 9, namaAlat: 'buret Kolom', spesifikasi: 'besar', jumlah: 7, penyimpanan: '' },
    { id: 10, no: 10, namaAlat: 'buret Kolom', spesifikasi: 'sedang', jumlah: 2, penyimpanan: '' },
    { id: 11, no: 11, namaAlat: 'buret Kolom', spesifikasi: 'kecil', jumlah: 1, penyimpanan: '' },
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
    const newAlat = {
      id: alatList.length + 1,
      ...formData,
      no: alatList.length + 1,
      jumlah: parseInt(formData.jumlah)
    };
    setAlatList([...alatList, newAlat]);
    setShowAddModal(false);
    setFormData({
      no: '',
      namaAlat: '',
      spesifikasi: '',
      jumlah: '',
      penyimpanan: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alat ini?')) {
      setAlatList(alatList.filter(item => item.id !== id));
    }
  };

  const filteredAlat = alatList.filter(item =>
    item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
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
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Tambah Alat Baru</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Alat
                  </label>
                  <input
                    type="text"
                    name="namaAlat"
                    value={formData.namaAlat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spesifikasi
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
                    Jumlah
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
                    Penyimpanan (Opsional)
                  </label>
                  <input
                    type="text"
                    name="penyimpanan"
                    value={formData.penyimpanan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
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

export default AlatPage;