"use client"
import React, { useState } from 'react';
import { Plus, Search, User, Calendar, Clock, AlertCircle } from 'lucide-react';

const PeminjamanPage = () => {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    newUserName: '',
    newUserNIM: '',
    newUserProdi: '',
    newUserPhone: '',
    itemType: 'alat',
    itemId: '',
    itemName: '',
    quantity: '',
    tanggalPinjam: '',
    tanggalKembali: '',
    keperluan: ''
  });

  // Data dummy users
  const [userList] = useState([
    { id: 1, name: 'Ahmad Fauzi', nim: '2001234', prodi: 'Kimia', phone: '081234567890' },
    { id: 2, name: 'Siti Nurhaliza', nim: '2001235', prodi: 'Pendidikan Kimia', phone: '081234567891' },
    { id: 3, name: 'Budi Santoso', nim: '2001236', prodi: 'Kimia', phone: '081234567892' },
    { id: 4, name: 'Dewi Lestari', nim: '2001237', prodi: 'Pendidikan Kimia', phone: '081234567893' },
  ]);

  // Data dummy alat
  const alatList = [
    { id: 1, name: 'Erlenmeyer 25ml', available: 1 },
    { id: 2, name: 'Erlenmeyer 50ml', available: 3 },
    { id: 3, name: 'Buret 10ml', available: 15 },
    { id: 4, name: 'Labu jantung 50ml', available: 4 },
  ];

  // Data dummy bahan
  const bahanList = [
    { id: 1, name: 'Carbon disulfide (Cs2)', available: 1000, unit: 'mL' },
    { id: 2, name: 'Petroleum benzene (C5C6)', available: 4000, unit: 'mL' },
    { id: 3, name: 'Terte-butylamine (C4H11N)', available: 900, unit: 'mL' },
  ];

  // Data dummy peminjaman
  const [peminjamanList, setPeminjamanList] = useState([
    {
      id: 1,
      userName: 'Ahmad Fauzi',
      nim: '2001234',
      itemType: 'alat',
      itemName: 'Erlenmeyer 25ml',
      quantity: 2,
      tanggalPinjam: '2024-01-05',
      tanggalKembali: '2024-01-10',
      status: 'Dipinjam',
      keperluan: 'Praktikum Kimia Analitik'
    },
    {
      id: 2,
      userName: 'Siti Nurhaliza',
      nim: '2001235',
      itemType: 'bahan',
      itemName: 'Carbon disulfide',
      quantity: 100,
      unit: 'mL',
      tanggalPinjam: '2024-01-04',
      tanggalKembali: '2024-01-09',
      status: 'Terlambat',
      keperluan: 'Penelitian Skripsi'
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill user data when selecting from dropdown
    if (name === 'userId' && value) {
      const selectedUser = userList.find(u => u.id === parseInt(value));
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          userName: selectedUser.name
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let userName = formData.userName;
    
    // If creating new user, use new user name
    if (showNewUserForm) {
      userName = formData.newUserName;
    }

    const newPeminjaman = {
      id: peminjamanList.length + 1,
      userName: userName,
      nim: showNewUserForm ? formData.newUserNIM : userList.find(u => u.id === parseInt(formData.userId))?.nim,
      itemType: formData.itemType,
      itemName: formData.itemName,
      quantity: parseInt(formData.quantity),
      unit: formData.itemType === 'bahan' ? bahanList.find(b => b.id === parseInt(formData.itemId))?.unit : null,
      tanggalPinjam: formData.tanggalPinjam,
      tanggalKembali: formData.tanggalKembali,
      status: 'Dipinjam',
      keperluan: formData.keperluan
    };

    setPeminjamanList([...peminjamanList, newPeminjaman]);
    setShowBorrowModal(false);
    setShowNewUserForm(false);
    setFormData({
      userId: '',
      userName: '',
      newUserName: '',
      newUserNIM: '',
      newUserProdi: '',
      newUserPhone: '',
      itemType: 'alat',
      itemId: '',
      itemName: '',
      quantity: '',
      tanggalPinjam: '',
      tanggalKembali: '',
      keperluan: ''
    });
  };

  const handleReturn = (id) => {
    setPeminjamanList(peminjamanList.map(item => 
      item.id === id ? { ...item, status: 'Dikembalikan' } : item
    ));
  };

  const filteredPeminjaman = peminjamanList.filter(item =>
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nim.includes(searchTerm) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Dipinjam': return 'bg-blue-100 text-blue-700';
      case 'Terlambat': return 'bg-red-100 text-red-700';
      case 'Dikembalikan': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Peminjaman Alat & Bahan</h1>
          <p className="text-gray-600">Kelola peminjaman alat dan bahan laboratorium</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Sedang Dipinjam</p>
                <p className="text-2xl font-bold text-gray-900">
                  {peminjamanList.filter(p => p.status === 'Dipinjam').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Terlambat</p>
                <p className="text-2xl font-bold text-red-600">
                  {peminjamanList.filter(p => p.status === 'Terlambat').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Peminjam</p>
                <p className="text-2xl font-bold text-gray-900">{userList.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama peminjam, NIM, atau item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowBorrowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Peminjaman</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pinjam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Kembali</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPeminjaman.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                        <div className="text-xs text-gray-500">NIM: {item.nim}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                        {item.itemType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.itemName}</div>
                      <div className="text-xs text-gray-500">{item.keperluan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.quantity} {item.unit || 'unit'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.tanggalPinjam).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.tanggalKembali).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.status === 'Dipinjam' || item.status === 'Terlambat' ? (
                        <button
                          onClick={() => handleReturn(item.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                        >
                          Kembalikan
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Borrow Modal */}
        {showBorrowModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Form Peminjaman</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Peminjam <span className="text-red-600">*</span>
                    </label>
                    {!showNewUserForm ? (
                      <div className="space-y-2">
                        <select
                          name="userId"
                          value={formData.userId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">-- Pilih Peminjam --</option>
                          {userList.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name} - {user.nim} ({user.prodi})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowNewUserForm(true)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          + Tambah Peminjam Baru
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Data Peminjam Baru</span>
                          <button
                            type="button"
                            onClick={() => setShowNewUserForm(false)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Batal
                          </button>
                        </div>
                        <input
                          type="text"
                          name="newUserName"
                          value={formData.newUserName}
                          onChange={handleInputChange}
                          placeholder="Nama Lengkap"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          name="newUserNIM"
                          value={formData.newUserNIM}
                          onChange={handleInputChange}
                          placeholder="NIM"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          name="newUserProdi"
                          value={formData.newUserProdi}
                          onChange={handleInputChange}
                          placeholder="Program Studi"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="tel"
                          name="newUserPhone"
                          value={formData.newUserPhone}
                          onChange={handleInputChange}
                          placeholder="No. Telepon"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Item Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Item <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="itemType"
                      value={formData.itemType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="alat">Alat</option>
                      <option value="bahan">Bahan Kimia</option>
                    </select>
                  </div>

                  {/* Item Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Item <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="itemId"
                      value={formData.itemId}
                      onChange={(e) => {
                        handleInputChange(e);
                        const itemId = parseInt(e.target.value);
                        const itemList = formData.itemType === 'alat' ? alatList : bahanList;
                        const item = itemList.find(i => i.id === itemId);
                        setFormData(prev => ({
                          ...prev,
                          itemName: item?.name || ''
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Pilih Item --</option>
                      {(formData.itemType === 'alat' ? alatList : bahanList).map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Tersedia: {item.available} {item.unit || 'unit'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Tanggal Pinjam */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Pinjam <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalPinjam"
                        value={formData.tanggalPinjam}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Tanggal Kembali */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Kembali <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalKembali"
                      value={formData.tanggalKembali}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Keperluan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keperluan <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="keperluan"
                      value={formData.keperluan}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Contoh: Praktikum Kimia Analitik, Penelitian Skripsi, dll"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBorrowModal(false);
                      setShowNewUserForm(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Simpan Peminjaman
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

export default PeminjamanPage;