import React, { useState } from 'react';
import { Search, AlertTriangle, DollarSign, CheckCircle, XCircle, Filter } from 'lucide-react';

const SanksiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);

  // Data sanksi keterlambatan
  const [penaltyList, setPenaltyList] = useState([
    {
      id: 1,
      userName: 'Siti Nurhaliza',
      nim: '2001235',
      prodi: 'Pendidikan Kimia',
      phone: '081234567891',
      itemType: 'bahan',
      itemName: 'Carbon disulfide',
      quantity: 100,
      unit: 'mL',
      borrowDate: '2024-01-04',
      returnDate: '2024-01-09',
      actualReturnDate: null,
      daysLate: 3,
      penaltyAmount: 15000,
      status: 'Belum Lunas',
      notes: 'Masih dipinjam, sudah terlambat'
    },
    {
      id: 2,
      userName: 'Dewi Lestari',
      nim: '2001237',
      prodi: 'Pendidikan Kimia',
      phone: '081234567893',
      itemType: 'bahan',
      itemName: 'Petroleum benzene',
      quantity: 50,
      unit: 'mL',
      borrowDate: '2024-01-02',
      returnDate: '2024-01-07',
      actualReturnDate: '2024-01-09',
      daysLate: 2,
      penaltyAmount: 10000,
      status: 'Belum Lunas',
      notes: 'Sudah dikembalikan, denda belum dibayar'
    },
    {
      id: 3,
      userName: 'Rizki Pratama',
      nim: '2001238',
      prodi: 'Kimia',
      phone: '081234567894',
      itemType: 'alat',
      itemName: 'Buret 50ml',
      quantity: 2,
      borrowDate: '2023-12-28',
      returnDate: '2024-01-02',
      actualReturnDate: '2024-01-05',
      daysLate: 3,
      penaltyAmount: 15000,
      status: 'Lunas',
      paidDate: '2024-01-05',
      notes: 'Denda sudah dibayar saat pengembalian'
    },
    {
      id: 4,
      userName: 'Andi Wijaya',
      nim: '2001239',
      prodi: 'Kimia',
      phone: '081234567895',
      itemType: 'alat',
      itemName: 'Erlenmeyer 250ml',
      quantity: 1,
      borrowDate: '2023-12-20',
      returnDate: '2023-12-27',
      actualReturnDate: '2024-01-03',
      daysLate: 7,
      penaltyAmount: 35000,
      status: 'Belum Lunas',
      notes: 'Terlambat lebih dari seminggu'
    },
  ]);

  const handlePayment = (penalty) => {
    setSelectedPenalty(penalty);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    setPenaltyList(penaltyList.map(item =>
      item.id === selectedPenalty.id
        ? { ...item, status: 'Lunas', paidDate: new Date().toISOString().split('T')[0] }
        : item
    ));
    setShowPaymentModal(false);
    setSelectedPenalty(null);
  };

  const filteredPenalties = penaltyList.filter(item =>
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nim.includes(searchTerm) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPenalties = penaltyList.filter(p => p.status === 'Belum Lunas').length;
  const totalAmount = penaltyList
    .filter(p => p.status === 'Belum Lunas')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);
  const totalPaid = penaltyList.filter(p => p.status === 'Lunas').length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sanksi Keterlambatan</h1>
          <p className="text-gray-600">Kelola denda dan sanksi keterlambatan pengembalian</p>
        </div>

        {/* Warning Alert */}
        {totalPenalties > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">Perhatian!</h3>
              <p className="text-sm text-red-700">
                Ada {totalPenalties} mahasiswa dengan denda yang belum dibayar. Total denda: Rp {totalAmount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Sanksi</p>
                <p className="text-2xl font-bold text-gray-900">{penaltyList.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Belum Lunas</p>
                <p className="text-2xl font-bold text-red-600">{totalPenalties}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Sudah Lunas</p>
                <p className="text-2xl font-bold text-green-600">{totalPaid}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Tagihan</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {(totalAmount / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Aturan Sanksi Keterlambatan</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Denda: Rp 5.000 per hari keterlambatan</li>
            <li>• Maksimal keterlambatan yang diizinkan: 14 hari</li>
            <li>• Setelah 14 hari, mahasiswa akan dikenakan sanksi administratif</li>
            <li>• Peminjam yang terlambat 3 kali akan diblokir untuk peminjaman berikutnya</li>
          </ul>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NIM, atau item..."
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
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pinjam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Jatuh Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terlambat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denda</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPenalties.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                      <div className="text-xs text-gray-500">NIM: {item.nim}</div>
                      <div className="text-xs text-gray-500">{item.prodi}</div>
                      <div className="text-xs text-gray-500">📱 {item.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.itemName}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} {item.unit || 'unit'} - {item.itemType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.borrowDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.returnDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-sm font-bold bg-red-100 text-red-700 rounded-full">
                        {item.daysLate} hari
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">
                        Rp {item.penaltyAmount.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === 'Lunas'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                      {item.paidDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Dibayar: {new Date(item.paidDate).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.status === 'Belum Lunas' ? (
                        <button
                          onClick={() => handlePayment(item)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          Bayar Denda
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">✓ Lunas</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPenalty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Konfirmasi Pembayaran Denda</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Peminjam:</span>
                    <span className="font-medium">{selectedPenalty.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NIM:</span>
                    <span className="font-medium">{selectedPenalty.nim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{selectedPenalty.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terlambat:</span>
                    <span className="font-bold text-red-600">{selectedPenalty.daysLate} hari</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">Total Denda:</span>
                      <span className="text-2xl font-bold text-red-600">
                        Rp {selectedPenalty.penaltyAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    Pastikan pembayaran telah diterima sebelum mengkonfirmasi.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPenalty(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={confirmPayment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SanksiPage;