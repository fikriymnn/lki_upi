"use client"
import React, { useState } from 'react';
import { Plus, Search, User, Calendar, Clock, AlertCircle, X, Trash2, Edit2, Package, Filter, ChevronDown, Building2, Mail, Phone, Eye,MapPin } from 'lucide-react';

const PeminjamanBahanPage = () => {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [peminjamSearch, setPeminjamSearch] = useState('');
  const [showPeminjamDropdown, setShowPeminjamDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  
  const [formData, setFormData] = useState({
    userId: null,
    userName: '',
    userNIK: '',
    userStatus: 'Mahasiswa',
    userInstitusi: '',
    userFakultas: '',
    userJurusan: '',
    userPhone: '',
    userAlamat: '',
    userEmail: '',
    // Data untuk user baru
    newUserName: '',
    newUserNIK: '',
    newUserStatus: 'Mahasiswa',
    newUserInstitusi: '',
    newUserFakultas: '',
    newUserJurusan: '',
    newUserPhone: '',
    newUserAlamat: '',
    newUserEmail: '',
    tanggalPinjam: '',
    tanggalKembali: '',
    keperluan: '',
    items: []
  });

  const [returnFormData, setReturnFormData] = useState({
    returnItems: []
  });

  // Status options
  const STATUS_OPTIONS = [
    'Mahasiswa',
    'Dosen',
    'Staff',
    'Peneliti',
    'Umum'
  ];

  // Data master peminjam dengan struktur lengkap
  const [masterPeminjam, setMasterPeminjam] = useState([
    { 
      id: 1, 
      name: 'Ahmad Fauzi', 
      nik: '2001234', 
      status: 'Mahasiswa',
      institusi: 'Universitas Pendidikan Indonesia',
      fakultas: 'FPMIPA',
      jurusan: 'Pendidikan Kimia',
      phone: '081234567890',
      alamat: 'Jl. Setiabudhi No. 229, Bandung',
      email: 'ahmad.fauzi@upi.edu'
    },
    { 
      id: 2, 
      name: 'Dr. Siti Nurhaliza, M.Si', 
      nik: '198503152010122001', 
      status: 'Dosen',
      institusi: 'Universitas Pendidikan Indonesia',
      fakultas: 'FPMIPA',
      jurusan: 'Pendidikan Kimia',
      phone: '081234567891',
      alamat: 'Jl. Dr. Setiabudhi No. 100, Bandung',
      email: 'siti.nurhaliza@upi.edu'
    },
    { 
      id: 3, 
      name: 'Budi Santoso', 
      nik: '3201012345678901', 
      status: 'Umum',
      institusi: 'PT Kimia Indonesia',
      fakultas: '',
      jurusan: '',
      phone: '081234567892',
      alamat: 'Jl. Industri No. 45, Bandung',
      email: 'budi.santoso@kimia.co.id'
    },
  ]);

  // Data bahan kimia
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
      suppliers: [],
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
        { id: 3, namaSupplier: 'PT Mitra Laboratorium', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' }
      ],
      penyimpanan: 'Lemari Penyimpanan',
      tanggalKadaluarsa: '',
      status: 'Tersedia'
    },
  ]);

  // Data peminjaman
  const [peminjamanList, setPeminjamanList] = useState([
    {
      id: 1,
      userName: 'Ahmad Fauzi',
      userNIK: '2001234',
      userStatus: 'Mahasiswa',
      userInstitusi: 'Universitas Pendidikan Indonesia',
      userFakultas: 'FPMIPA',
      userJurusan: 'Pendidikan Kimia',
      userPhone: '081234567890',
      userEmail: 'ahmad.fauzi@upi.edu',
      items: [
        {
          bahanId: 1,
          namaBahan: 'Carbon disulfide',
          rumusKimia: 'Cs2',
          jumlahPinjam: 100,
          jumlahKembali: 0,
          satuan: 'mL'
        }
      ],
      tanggalPinjam: '2024-02-01',
      tanggalKembali: '2024-02-10',
      status: 'Dipinjam',
      keperluan: 'Praktikum Kimia Analitik'
    },
    {
      id: 2,
      userName: 'Dr. Siti Nurhaliza, M.Si',
      userNIK: '198503152010122001',
      userStatus: 'Dosen',
      userInstitusi: 'Universitas Pendidikan Indonesia',
      userFakultas: 'FPMIPA',
      userJurusan: 'Pendidikan Kimia',
      userPhone: '081234567891',
      userEmail: 'siti.nurhaliza@upi.edu',
      items: [
        {
          bahanId: 3,
          namaBahan: 'Natrium Klorida',
          rumusKimia: 'NaCl',
          jumlahPinjam: 500,
          jumlahKembali: 300,
          satuan: 'g'
        }
      ],
      tanggalPinjam: '2024-01-28',
      tanggalKembali: '2024-02-05',
      status: 'Sebagian Dikembalikan',
      keperluan: 'Penelitian'
    },
    {
      id: 3,
      userName: 'Budi Santoso',
      userNIK: '3201012345678901',
      userStatus: 'Umum',
      userInstitusi: 'PT Kimia Indonesia',
      userFakultas: '',
      userJurusan: '',
      userPhone: '081234567892',
      userEmail: 'budi.santoso@kimia.co.id',
      items: [
        {
          bahanId: 1,
          namaBahan: 'Carbon disulfide',
          rumusKimia: 'Cs2',
          jumlahPinjam: 150,
          jumlahKembali: 150,
          satuan: 'mL'
        }
      ],
      tanggalPinjam: '2024-01-15',
      tanggalKembali: '2024-01-25',
      tanggalDikembalikan: '2024-01-24',
      status: 'Dikembalikan',
      keperluan: 'Quality Control'
    },
  ]);

  const [currentItem, setCurrentItem] = useState({
    bahanId: '',
    jumlah: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrentItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectPeminjam = (peminjam) => {
    setFormData(prev => ({
      ...prev,
      userId: peminjam.id,
      userName: peminjam.name,
      userNIK: peminjam.nik,
      userStatus: peminjam.status,
      userInstitusi: peminjam.institusi,
      userFakultas: peminjam.fakultas || '',
      userJurusan: peminjam.jurusan || '',
      userPhone: peminjam.phone,
      userAlamat: peminjam.alamat,
      userEmail: peminjam.email
    }));
    setShowPeminjamDropdown(false);
    setPeminjamSearch('');
  };

  const clearPeminjam = () => {
    setFormData(prev => ({
      ...prev,
      userId: null,
      userName: '',
      userNIK: '',
      userStatus: 'Mahasiswa',
      userInstitusi: '',
      userFakultas: '',
      userJurusan: '',
      userPhone: '',
      userAlamat: '',
      userEmail: ''
    }));
  };

  const addItemToList = () => {
    if (currentItem.bahanId && currentItem.jumlah) {
      const bahan = bahanList.find(b => b.id === parseInt(currentItem.bahanId));

      if (bahan) {
        const existingItemIndex = formData.items.findIndex(item => item.bahanId === bahan.id);

        if (existingItemIndex >= 0) {
          const updatedItems = [...formData.items];
          updatedItems[existingItemIndex].jumlahPinjam = parseInt(currentItem.jumlah);
          setFormData(prev => ({ ...prev, items: updatedItems }));
        } else {
          const newItem = {
            bahanId: bahan.id,
            namaBahan: bahan.namaBahan,
            rumusKimia: bahan.rumusKimia,
            jumlahPinjam: parseInt(currentItem.jumlah),
            jumlahKembali: 0,
            satuan: bahan.satuan
          };
          setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
          }));
        }

        setCurrentItem({ bahanId: '', jumlah: '' });
      }
    }
  };

  const removeItemFromList = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert('Silakan tambahkan minimal satu bahan untuk dipinjam');
      return;
    }

    let userData = {};

    if (showNewUserForm) {
      const newPeminjamId = masterPeminjam.length > 0 
        ? Math.max(...masterPeminjam.map(p => p.id)) + 1 
        : 1;
      
      const newPeminjam = {
        id: newPeminjamId,
        name: formData.newUserName,
        nik: formData.newUserNIK,
        status: formData.newUserStatus,
        institusi: formData.newUserInstitusi,
        fakultas: formData.newUserFakultas,
        jurusan: formData.newUserJurusan,
        phone: formData.newUserPhone,
        alamat: formData.newUserAlamat,
        email: formData.newUserEmail
      };

      setMasterPeminjam(prev => [...prev, newPeminjam]);

      userData = {
        userName: formData.newUserName,
        userNIK: formData.newUserNIK,
        userStatus: formData.newUserStatus,
        userInstitusi: formData.newUserInstitusi,
        userFakultas: formData.newUserFakultas,
        userJurusan: formData.newUserJurusan,
        userPhone: formData.newUserPhone,
        userAlamat: formData.newUserAlamat,
        userEmail: formData.newUserEmail
      };
    } else {
      userData = {
        userName: formData.userName,
        userNIK: formData.userNIK,
        userStatus: formData.userStatus,
        userInstitusi: formData.userInstitusi,
        userFakultas: formData.userFakultas,
        userJurusan: formData.userJurusan,
        userPhone: formData.userPhone,
        userAlamat: formData.userAlamat,
        userEmail: formData.userEmail
      };
    }

    const newPeminjaman = {
      id: peminjamanList.length + 1,
      ...userData,
      items: formData.items,
      tanggalPinjam: formData.tanggalPinjam,
      tanggalKembali: formData.tanggalKembali,
      status: 'Dipinjam',
      keperluan: formData.keperluan
    };

    const updatedBahanList = bahanList.map(bahan => {
      const borrowedItem = formData.items.find(item => item.bahanId === bahan.id);
      if (borrowedItem) {
        return {
          ...bahan,
          jumlah: bahan.jumlah - borrowedItem.jumlahPinjam
        };
      }
      return bahan;
    });

    setBahanList(updatedBahanList);
    setPeminjamanList([...peminjamanList, newPeminjaman]);
    resetForm();
  };

  const resetForm = () => {
    setShowBorrowModal(false);
    setShowNewUserForm(false);
    setFormData({
      userId: null,
      userName: '',
      userNIK: '',
      userStatus: 'Mahasiswa',
      userInstitusi: '',
      userFakultas: '',
      userJurusan: '',
      userPhone: '',
      userAlamat: '',
      userEmail: '',
      newUserName: '',
      newUserNIK: '',
      newUserStatus: 'Mahasiswa',
      newUserInstitusi: '',
      newUserFakultas: '',
      newUserJurusan: '',
      newUserPhone: '',
      newUserAlamat: '',
      newUserEmail: '',
      tanggalPinjam: '',
      tanggalKembali: '',
      keperluan: '',
      items: []
    });
    setCurrentItem({ bahanId: '', jumlah: '' });
    setPeminjamSearch('');
  };

  const openReturnModal = (peminjaman) => {
    setSelectedPeminjaman(peminjaman);

    const returnItems = peminjaman.items
      .filter(item => item.jumlahKembali < item.jumlahPinjam)
      .map(item => ({
        bahanId: item.bahanId,
        namaBahan: item.namaBahan,
        jumlahPinjam: item.jumlahPinjam,
        jumlahSudahKembali: item.jumlahKembali,
        jumlahDikembalikan: item.jumlahPinjam - item.jumlahKembali,
        satuan: item.satuan
      }));

    setReturnFormData({ returnItems });
    setShowReturnModal(true);
  };

  const handleReturnQuantityChange = (index, value) => {
    const updatedReturnItems = [...returnFormData.returnItems];
    const maxReturn = updatedReturnItems[index].jumlahPinjam - updatedReturnItems[index].jumlahSudahKembali;
    updatedReturnItems[index].jumlahDikembalikan = Math.min(parseInt(value) || 0, maxReturn);
    setReturnFormData({ returnItems: updatedReturnItems });
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();

    const updatedPeminjamanList = peminjamanList.map(peminjaman => {
      if (peminjaman.id === selectedPeminjaman.id) {
        const updatedItems = peminjaman.items.map(item => {
          const returnItem = returnFormData.returnItems.find(ri => ri.bahanId === item.bahanId);
          if (returnItem) {
            return {
              ...item,
              jumlahKembali: item.jumlahKembali + returnItem.jumlahDikembalikan
            };
          }
          return item;
        });

        const allReturned = updatedItems.every(item => item.jumlahKembali >= item.jumlahPinjam);
        const someReturned = updatedItems.some(item => item.jumlahKembali > 0);

        return {
          ...peminjaman,
          items: updatedItems,
          status: allReturned ? 'Dikembalikan' : (someReturned ? 'Sebagian Dikembalikan' : 'Dipinjam'),
          tanggalDikembalikan: allReturned ? new Date().toISOString().split('T')[0] : peminjaman.tanggalDikembalikan
        };
      }
      return peminjaman;
    });

    const updatedBahanList = bahanList.map(bahan => {
      const returnItem = returnFormData.returnItems.find(ri => ri.bahanId === bahan.id);
      if (returnItem) {
        return {
          ...bahan,
          jumlah: bahan.jumlah + returnItem.jumlahDikembalikan
        };
      }
      return bahan;
    });

    setBahanList(updatedBahanList);
    setPeminjamanList(updatedPeminjamanList);
    setShowReturnModal(false);
    setSelectedPeminjaman(null);
  };

  const handleResetFilter = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const handleShowDetail = (peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowDetailModal(true);
  };

  const filteredPeminjaman = peminjamanList.filter(item => {
    const tabFilter = activeTab === 'active' 
      ? item.status !== 'Dikembalikan'
      : item.status === 'Dikembalikan';

    const searchFilter = item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userNIK.includes(searchTerm) ||
      item.items.some(i => i.namaBahan.toLowerCase().includes(searchTerm.toLowerCase()));

    let dateFilter = true;
    if (filterDateFrom && filterDateTo) {
      const pinjamDate = new Date(item.tanggalPinjam);
      const fromDate = new Date(filterDateFrom);
      const toDate = new Date(filterDateTo);
      dateFilter = pinjamDate >= fromDate && pinjamDate <= toDate;
    }

    return tabFilter && searchFilter && dateFilter;
  });

  const filteredPeminjam = masterPeminjam.filter(p =>
    p.name.toLowerCase().includes(peminjamSearch.toLowerCase()) ||
    p.nik.includes(peminjamSearch) ||
    p.institusi.toLowerCase().includes(peminjamSearch.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dipinjam': return 'bg-blue-100 text-blue-700';
      case 'Sebagian Dikembalikan': return 'bg-yellow-100 text-yellow-700';
      case 'Dikembalikan': return 'bg-green-100 text-green-700';
      case 'Terlambat': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Mahasiswa': return 'bg-blue-100 text-blue-700';
      case 'Dosen': return 'bg-purple-100 text-purple-700';
      case 'Staff': return 'bg-green-100 text-green-700';
      case 'Peneliti': return 'bg-orange-100 text-orange-700';
      case 'Umum': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const activePeminjaman = peminjamanList.filter(p => p.status !== 'Dikembalikan');
  const completedPeminjaman = peminjamanList.filter(p => p.status === 'Dikembalikan');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Peminjaman Bahan Kimia</h1>
          <p className="text-gray-600">Kelola peminjaman bahan kimia laboratorium</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Peminjaman</p>
                <p className="text-2xl font-bold text-gray-900">{peminjamanList.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Sedang Dipinjam</p>
                <p className="text-2xl font-bold text-blue-600">
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
                <p className="text-gray-600 text-sm mb-1">Sebagian Kembali</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {peminjamanList.filter(p => p.status === 'Sebagian Dikembalikan').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Peminjam</p>
                <p className="text-2xl font-bold text-gray-900">{masterPeminjam.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'active'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Peminjaman Aktif ({activePeminjaman.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Riwayat Peminjaman ({completedPeminjaman.length})
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama peminjam, NIM/NIK, atau bahan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter className="w-5 h-5" />
                <span>Filter Tanggal</span>
                {(filterDateFrom || filterDateTo) && (
                  <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">1</span>
                )}
              </button>
              {activeTab === 'active' && (
                <button
                  onClick={() => setShowBorrowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tambah Peminjaman</span>
                </button>
              )}
            </div>
          </div>

          {(filterDateFrom || filterDateTo) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {filterDateFrom && filterDateTo && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {new Date(filterDateFrom).toLocaleDateString('id-ID')} - {new Date(filterDateTo).toLocaleDateString('id-ID')}
                    <button
                      onClick={handleResetFilter}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bahan yang Dipinjam</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPeminjaman.length > 0 ? (
                  filteredPeminjaman.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                          <div className="text-xs text-gray-500">NIK/NIM: {item.userNIK}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(item.userStatus)}`}>
                              {item.userStatus}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{item.userInstitusi}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {item.items.map((bahanItem, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium text-gray-900">{bahanItem.namaBahan}</span>
                              <span className="text-gray-500"> ({bahanItem.rumusKimia})</span>
                              <div className="text-xs text-gray-600">
                                Dipinjam: {bahanItem.jumlahPinjam} {bahanItem.satuan} |
                                Dikembalikan: {bahanItem.jumlahKembali} {bahanItem.satuan}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1 text-xs mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>Pinjam: {new Date(item.tanggalPinjam).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>Target: {new Date(item.tanggalKembali).toLocaleDateString('id-ID')}</span>
                        </div>
                        {item.tanggalDikembalikan && (
                          <div className="flex items-center gap-1 text-xs mt-1 text-green-600">
                            <Clock className="w-3 h-3" />
                            <span>Kembali: {new Date(item.tanggalDikembalikan).toLocaleDateString('id-ID')}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{item.keperluan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShowDetail(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {activeTab === 'active' && item.status !== 'Dikembalikan' && (
                            <button
                              onClick={() => openReturnModal(item)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                            >
                              Kembalikan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-12 h-12 text-gray-300" />
                        <p className="text-sm">
                          {activeTab === 'active' 
                            ? 'Tidak ada peminjaman aktif' 
                            : 'Tidak ada riwayat peminjaman'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedPeminjaman && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detail Peminjaman</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Data Peminjam */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Data Peminjam
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                        <p className="text-sm text-gray-900">{selectedPeminjaman.userName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">NIK/NIM</label>
                        <p className="text-sm text-gray-900">{selectedPeminjaman.userNIK}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadgeColor(selectedPeminjaman.userStatus)}`}>
                          {selectedPeminjaman.userStatus}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Institusi</label>
                        <p className="text-sm text-gray-900">{selectedPeminjaman.userInstitusi}</p>
                      </div>
                      {selectedPeminjaman.userFakultas && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Fakultas</label>
                          <p className="text-sm text-gray-900">{selectedPeminjaman.userFakultas}</p>
                        </div>
                      )}
                      {selectedPeminjaman.userJurusan && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Jurusan</label>
                          <p className="text-sm text-gray-900">{selectedPeminjaman.userJurusan}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">No. HP</label>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedPeminjaman.userPhone}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selectedPeminjaman.userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bahan yang Dipinjam */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Bahan yang Dipinjam
                    </h3>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Bahan</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dipinjam</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dikembalikan</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedPeminjaman.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2">
                                <div className="text-sm font-medium text-gray-900">{item.namaBahan}</div>
                                <div className="text-xs text-gray-500">{item.rumusKimia}</div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.jumlahPinjam} {item.satuan}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.jumlahKembali} {item.satuan}
                              </td>
                              <td className="px-4 py-2">
                                {item.jumlahKembali >= item.jumlahPinjam ? (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Lunas</span>
                                ) : item.jumlahKembali > 0 ? (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Sebagian</span>
                                ) : (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Belum</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Detail Peminjaman */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Pinjam</label>
                      <p className="text-sm text-gray-900">{new Date(selectedPeminjaman.tanggalPinjam).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Kembali</label>
                      <p className="text-sm text-gray-900">{new Date(selectedPeminjaman.tanggalKembali).toLocaleDateString('id-ID')}</p>
                    </div>
                    {selectedPeminjaman.tanggalDikembalikan && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Dikembalikan</label>
                        <p className="text-sm text-green-600 font-medium">{new Date(selectedPeminjaman.tanggalDikembalikan).toLocaleDateString('id-ID')}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Keperluan</label>
                      <p className="text-sm text-gray-900">{selectedPeminjaman.keperluan}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status Peminjaman</label>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPeminjaman.status)}`}>
                        {selectedPeminjaman.status}
                      </span>
                    </div>
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

        {/* Filter Modal - Keep as before */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Filter Tanggal Peminjaman</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      handleResetFilter();
                      setShowFilterModal(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Borrow Modal */}
        {showBorrowModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Form Peminjaman Bahan Kimia</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Peminjam Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Data Peminjam
                    </h3>

                    {!showNewUserForm ? (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Pilih Peminjam <span className="text-red-600">*</span>
                        </label>
                        {formData.userId ? (
                          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{formData.userName}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mr-2 ${getStatusBadgeColor(formData.userStatus)}`}>
                                    {formData.userStatus}
                                  </span>
                                  NIK/NIM: {formData.userNIK}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formData.userInstitusi}
                                  {formData.userFakultas && ` - ${formData.userFakultas}`}
                                  {formData.userJurusan && ` - ${formData.userJurusan}`}
                                </div>
                              </div>
                              <X
                                className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={clearPeminjam}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowPeminjamDropdown(!showPeminjamDropdown)}
                              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left"
                            >
                              <span className="text-sm text-gray-700">Pilih dari Master Peminjam</span>
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {showPeminjamDropdown && (
                              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <div className="p-2 border-b border-gray-200">
                                  <input
                                    type="text"
                                    placeholder="Cari nama, NIK/NIM, atau institusi..."
                                    value={peminjamSearch}
                                    onChange={(e) => setPeminjamSearch(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                  {filteredPeminjam.length > 0 ? (
                                    filteredPeminjam.map(peminjam => (
                                      <button
                                        key={peminjam.id}
                                        type="button"
                                        onClick={() => selectPeminjam(peminjam)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                                      >
                                        <div className="font-medium text-gray-900">{peminjam.name}</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mr-2 ${getStatusBadgeColor(peminjam.status)}`}>
                                            {peminjam.status}
                                          </span>
                                          NIK/NIM: {peminjam.nik}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{peminjam.institusi}</div>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                      Peminjam tidak ditemukan
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowNewUserForm(true)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Input Manual (Peminjam Baru)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Input Data Peminjam Baru</span>
                          <button
                            type="button"
                            onClick={() => setShowNewUserForm(false)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            ← Kembali ke Master
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Nama Lengkap <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              name="newUserName"
                              value={formData.newUserName}
                              onChange={handleInputChange}
                              placeholder="Nama lengkap"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              NIK/NIM <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              name="newUserNIK"
                              value={formData.newUserNIK}
                              onChange={handleInputChange}
                              placeholder="NIK/NIM"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Status <span className="text-red-600">*</span>
                            </label>
                            <select
                              name="newUserStatus"
                              value={formData.newUserStatus}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            >
                              {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Institusi/Kampus <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              name="newUserInstitusi"
                              value={formData.newUserInstitusi}
                              onChange={handleInputChange}
                              placeholder="Nama institusi/kampus"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Fakultas <span className="text-gray-400">(Opsional)</span>
                            </label>
                            <input
                              type="text"
                              name="newUserFakultas"
                              value={formData.newUserFakultas}
                              onChange={handleInputChange}
                              placeholder="Nama fakultas"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Jurusan/Prodi <span className="text-gray-400">(Opsional)</span>
                            </label>
                            <input
                              type="text"
                              name="newUserJurusan"
                              value={formData.newUserJurusan}
                              onChange={handleInputChange}
                              placeholder="Nama jurusan/prodi"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              No. HP <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="tel"
                              name="newUserPhone"
                              value={formData.newUserPhone}
                              onChange={handleInputChange}
                              placeholder="08xxxxxxxxxx"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Email <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="email"
                              name="newUserEmail"
                              value={formData.newUserEmail}
                              onChange={handleInputChange}
                              placeholder="email@example.com"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Alamat <span className="text-red-600">*</span>
                            </label>
                            <textarea
                              name="newUserAlamat"
                              value={formData.newUserAlamat}
                              onChange={handleInputChange}
                              placeholder="Alamat lengkap"
                              rows="2"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-800">
                            💡 Data peminjam baru akan otomatis tersimpan ke master peminjam
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Bahan yang Dipinjam
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="md:col-span-2">
                        <select
                          name="bahanId"
                          value={currentItem.bahanId}
                          onChange={handleCurrentItemChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">-- Pilih Bahan --</option>
                          {bahanList.filter(b => b.jumlah > 0).map(bahan => (
                            <option key={bahan.id} value={bahan.id}>
                              {bahan.namaBahan} ({bahan.rumusKimia}) - Tersedia: {bahan.jumlah} {bahan.satuan}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="jumlah"
                          value={currentItem.jumlah}
                          onChange={handleCurrentItemChange}
                          placeholder="Jumlah"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={addItemToList}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {formData.items.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Bahan</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Rumus</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Jumlah</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {formData.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.namaBahan}</td>
                                <td className="px-4 py-2 text-sm text-gray-600 font-mono">{item.rumusKimia}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.jumlahPinjam} {item.satuan}
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    type="button"
                                    onClick={() => removeItemFromList(index)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {formData.items.length === 0 && (
                      <div className="text-center py-6 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
                        Belum ada bahan yang ditambahkan
                      </div>
                    )}
                  </div>

                  {/* Detail Peminjaman */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

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

                <div className="flex gap-3 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
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

        {/* Return Modal */}
        {showReturnModal && selectedPeminjaman && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Form Pengembalian Bahan</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Peminjam: {selectedPeminjaman.userName} ({selectedPeminjaman.userNIK})
                </p>
              </div>
              <form onSubmit={handleReturnSubmit} className="p-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Bahan</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Dipinjam</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Sudah Kembali</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Sisa</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Dikembalikan Sekarang</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {returnFormData.returnItems.map((item, index) => {
                          const sisa = item.jumlahPinjam - item.jumlahSudahKembali;
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{item.namaBahan}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {item.jumlahPinjam} {item.satuan}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {item.jumlahSudahKembali} {item.satuan}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                {sisa} {item.satuan}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={item.jumlahDikembalikan}
                                    onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                                    min="0"
                                    max={sisa}
                                    className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                  />
                                  <span className="text-sm text-gray-600">{item.satuan}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Catatan:</strong> Stok bahan akan otomatis bertambah sesuai jumlah yang dikembalikan.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReturnModal(false);
                      setSelectedPeminjaman(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Konfirmasi Pengembalian
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

export default PeminjamanBahanPage;