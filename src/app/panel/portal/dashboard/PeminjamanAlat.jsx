"use client"
import React, { useState } from 'react';
import { Plus, Search, User, Calendar, Clock, AlertCircle, X, Trash2, Edit2, Package, Filter, ChevronDown, Building2, Mail, Phone, Eye, FileText, Wrench, AlertTriangle, Undo, CheckCircle, RotateCcw } from 'lucide-react';

const PeminjamanAlatPage = () => {
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

    const [alatSearch, setAlatSearch] = useState('');
    const [showAlatDropdown, setShowAlatDropdown] = useState(false);

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
        returnItems: [],
        catatanPengembalian: '',
        damagedItems: []
    });

    const STATUS_OPTIONS = [
        'Mahasiswa',
        'Dosen',
        'Staff',
        'Peneliti',
        'Umum'
    ];

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

    const [alatList, setAlatList] = useState([
        {
            id: 1,
            namaAlat: 'Erlenmeyer',
            spesifikasi: '25 ml',
            jumlah: 10,
            merkBrand: 'Pyrex',
            suppliers: [
                { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' }
            ],
            penyimpanan: 'Lemari Kanan'
        },
        {
            id: 2,
            namaAlat: 'Erlenmeyer',
            spesifikasi: '50 ml',
            jumlah: 8,
            merkBrand: 'Pyrex',
            suppliers: [],
            penyimpanan: 'Rak 2'
        },
        {
            id: 3,
            namaAlat: 'Erlenmeyer',
            spesifikasi: '100 ml',
            jumlah: 12,
            merkBrand: '',
            suppliers: [
                { id: 2, namaSupplier: 'CV Labora Indonesia', alamat: 'Jl. Raya Bogor KM 45, Bogor', noWa: '081298765432' }
            ],
            penyimpanan: 'Rak 2'
        },
        {
            id: 4,
            namaAlat: 'Labu jantung',
            spesifikasi: '50 ml',
            jumlah: 6,
            merkBrand: 'Duran',
            suppliers: [
                { id: 1, namaSupplier: 'PT Kimia Jaya', alamat: 'Jl. Industri No. 123, Jakarta', noWa: '081234567890' },
                { id: 3, namaSupplier: 'PT Sains Nusantara', alamat: 'Jl. Sudirman No. 88, Bandung', noWa: '081223344556' }
            ],
            penyimpanan: 'Rak 3'
        },
        {
            id: 5,
            namaAlat: 'Buret',
            spesifikasi: '10 ml',
            jumlah: 20,
            merkBrand: '',
            suppliers: [],
            penyimpanan: 'Rak 1'
        },
    ]);

    const [alatRusakList, setAlatRusakList] = useState([]);

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
                    alatId: 1,
                    namaAlat: 'Erlenmeyer',
                    spesifikasi: '25 ml',
                    jumlahPinjam: 3,
                    jumlahKembali: 0,
                    jumlahRusak: 0
                }
            ],
            tanggalPinjam: '2024-02-01',
            tanggalKembali: '2024-02-10',
            status: 'Dipinjam',
            keperluan: 'Praktikum Kimia Analitik',
            catatanPengembalian: ''
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
                    alatId: 4,
                    namaAlat: 'Labu jantung',
                    spesifikasi: '50 ml',
                    jumlahPinjam: 2,
                    jumlahKembali: 2,
                    jumlahRusak: 0
                }
            ],
            tanggalPinjam: '2024-01-28',
            tanggalKembali: '2024-02-05',
            tanggalDikembalikan: '2024-02-04',
            status: 'Dikembalikan',
            keperluan: 'Penelitian',
            catatanPengembalian: 'Semua alat dikembalikan dalam kondisi baik'
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
                    alatId: 5,
                    namaAlat: 'Buret',
                    spesifikasi: '10 ml',
                    jumlahPinjam: 5,
                    jumlahKembali: 5,
                    jumlahRusak: 0
                }
            ],
            tanggalPinjam: '2024-01-15',
            tanggalKembali: '2024-01-25',
            tanggalDikembalikan: '2024-02-20',
            status: 'Dikembalikan',
            keperluan: 'Quality Control',
            catatanPengembalian: 'Pengembalian terlambat'
        },
    ]);

    const [currentItem, setCurrentItem] = useState({
        alatId: '',
        jumlah: ''
    });

    // Format tanggal ke format huruf
    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const isLate = (tanggalKembali, tanggalDikembalikan) => {
        if (!tanggalDikembalikan) return false;
        const targetDate = new Date(tanggalKembali);
        const returnDate = new Date(tanggalDikembalikan);
        return returnDate > targetDate;
    };

    const calculateLateDays = (tanggalKembali, tanggalDikembalikan) => {
        if (!tanggalDikembalikan) return 0;
        const targetDate = new Date(tanggalKembali);
        const returnDate = new Date(tanggalDikembalikan);
        const diffTime = returnDate - targetDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Hitung statistik per peminjam
    const getPeminjamStats = (nik) => {
        const transactions = peminjamanList.filter(p => p.userNIK === nik);
        const lateTransactions = transactions.filter(p =>
            p.tanggalDikembalikan && isLate(p.tanggalKembali, p.tanggalDikembalikan)
        );
        return {
            totalTransaksi: transactions.length,
            totalTerlambat: lateTransactions.length
        };
    };

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

    const selectAlat = (alat) => {
        setCurrentItem(prev => ({
            ...prev,
            alatId: alat.id.toString()
        }));
        setShowAlatDropdown(false);
        setAlatSearch('');
    };

    const addItemToList = () => {
        if (currentItem.alatId && currentItem.jumlah) {
            const alat = alatList.find(a => a.id === parseInt(currentItem.alatId));

            if (alat) {
                const existingItemIndex = formData.items.findIndex(item => item.alatId === alat.id);

                if (existingItemIndex >= 0) {
                    const updatedItems = [...formData.items];
                    updatedItems[existingItemIndex].jumlahPinjam = parseInt(currentItem.jumlah);
                    setFormData(prev => ({ ...prev, items: updatedItems }));
                } else {
                    const newItem = {
                        alatId: alat.id,
                        namaAlat: alat.namaAlat,
                        spesifikasi: alat.spesifikasi,
                        jumlahPinjam: parseInt(currentItem.jumlah),
                        jumlahKembali: 0,
                        jumlahRusak: 0
                    };
                    setFormData(prev => ({
                        ...prev,
                        items: [...prev.items, newItem]
                    }));
                }

                setCurrentItem({ alatId: '', jumlah: '' });
                setAlatSearch('');
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
            alert('Silakan tambahkan minimal satu alat untuk dipinjam');
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
            keperluan: formData.keperluan,
            catatanPengembalian: ''
        };

        const updatedAlatList = alatList.map(alat => {
            const borrowedItem = formData.items.find(item => item.alatId === alat.id);
            if (borrowedItem) {
                return {
                    ...alat,
                    jumlah: alat.jumlah - borrowedItem.jumlahPinjam
                };
            }
            return alat;
        });

        setAlatList(updatedAlatList);
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
        setCurrentItem({ alatId: '', jumlah: '' });
        setPeminjamSearch('');
        setAlatSearch('');
    };

    const openReturnModal = (peminjaman) => {
        setSelectedPeminjaman(peminjaman);

        const returnItems = peminjaman.items.map(item => ({
            alatId: item.alatId,
            namaAlat: item.namaAlat,
            spesifikasi: item.spesifikasi,
            jumlahPinjam: item.jumlahPinjam,
            jumlahSudahKembali: item.jumlahKembali,
            jumlahDikembalikan: item.jumlahPinjam - item.jumlahKembali,
            jumlahRusak: 0,
            keteranganRusak: '',
            showKeterangan: false
        }));

        setReturnFormData({
            returnItems,
            catatanPengembalian: '',
            damagedItems: []
        });
        setShowReturnModal(true);
    };

    const handleReturnQuantityChange = (index, value) => {
        const updatedReturnItems = [...returnFormData.returnItems];
        const item = updatedReturnItems[index];
        const sisa = item.jumlahPinjam - item.jumlahSudahKembali;
        const maxDikembalikan = sisa - (item.jumlahRusak || 0);
        const newValue = Math.max(0, Math.min(parseInt(value) || 0, maxDikembalikan));
        updatedReturnItems[index].jumlahDikembalikan = newValue;
        setReturnFormData(prev => ({ ...prev, returnItems: updatedReturnItems }));
    };

    const handleDamagedQuantityChange = (index, value) => {
        const updatedReturnItems = [...returnFormData.returnItems];
        const item = updatedReturnItems[index];
        const maxReturnable = item.jumlahPinjam - item.jumlahSudahKembali;
        let newValue = parseInt(value) || 0;
        newValue = Math.max(0, Math.min(newValue, maxReturnable));
        item.jumlahRusak = newValue;
        const maxDikembalikan = maxReturnable - newValue;
        if (item.jumlahDikembalikan > maxDikembalikan) {
            item.jumlahDikembalikan = maxDikembalikan;
        }
        setReturnFormData(prev => ({ ...prev, returnItems: updatedReturnItems }));
    };

    const handleLostQuantityChange = (index, value) => {
        const updatedReturnItems = [...returnFormData.returnItems];
        const item = updatedReturnItems[index];
        const maxReturnable = item.jumlahPinjam - item.jumlahSudahKembali;
        let newValue = parseInt(value) || 0;
        newValue = Math.max(0, Math.min(newValue, maxReturnable));
        item.jumlahHilang = newValue;
        const maxDikembalikan = maxReturnable - item.jumlahRusak - newValue;
        if (item.jumlahDikembalikan > maxDikembalikan) {
            item.jumlahDikembalikan = maxDikembalikan;
        }
        setReturnFormData(prev => ({ ...prev, returnItems: updatedReturnItems }));
    };

    const handleDamagedNoteChange = (index, value) => {
        const updatedReturnItems = [...returnFormData.returnItems];
        updatedReturnItems[index].keteranganRusak = value;
        setReturnFormData(prev => ({ ...prev, returnItems: updatedReturnItems }));
    };

    const handleLostNoteChange = (index, value) => {
        const updatedReturnItems = [...returnFormData.returnItems];
        updatedReturnItems[index].keteranganHilang = value;
        setReturnFormData(prev => ({ ...prev, returnItems: updatedReturnItems }));
    };

    const handleReturnSubmit = (e) => {
        e.preventDefault();

        const todayDate = new Date().toISOString().split('T')[0];

        for (const item of returnFormData.returnItems) {
            const sisa = item.jumlahPinjam - item.jumlahSudahKembali;
            const total = item.jumlahDikembalikan + (item.jumlahRusak || 0);
            if (total > sisa) {
                alert(`Total pengembalian untuk ${item.namaAlat} melebihi sisa pinjaman!`);
                return;
            }
        }

        const late = isLate(selectedPeminjaman.tanggalKembali, todayDate);
        const lateDays = calculateLateDays(selectedPeminjaman.tanggalKembali, todayDate);

        let finalCatatan = returnFormData.catatanPengembalian;
        if (late) {
            const lateNote = `Pengembalian terlambat ${lateDays} hari.`;
            finalCatatan = finalCatatan ? `${lateNote} ${finalCatatan}` : lateNote;
        }

        const newDamagedItems = [];
        const damagedItemsForState = [];

        returnFormData.returnItems.forEach(item => {
            const alat = alatList.find(a => a.id === item.alatId);
            if (item.jumlahRusak > 0) {
                const damagedItem = {
                    id_peminjaman: selectedPeminjaman.id,
                    alatId: item.alatId,
                    nama_alat: item.namaAlat,
                    spesifikasi: item.spesifikasi,
                    merk_brand: alat?.merkBrand || '',
                    penyimpanan: alat?.penyimpanan || '',
                    suppliers: alat?.suppliers || [],
                    user_name: selectedPeminjaman.userName,
                    user_nik: selectedPeminjaman.userNIK,
                    user_status: selectedPeminjaman.userStatus,
                    user_institusi: selectedPeminjaman.userInstitusi,
                    user_fakultas: selectedPeminjaman.userFakultas || '',
                    user_jurusan: selectedPeminjaman.userJurusan || '',
                    user_phone: selectedPeminjaman.userPhone,
                    user_alamat: selectedPeminjaman.userAlamat || '',
                    user_email: selectedPeminjaman.userEmail || '',
                    jumlah_rusak: item.jumlahRusak,
                    deskripsi_kerusakan: item.keteranganRusak || 'Tidak ada keterangan',
                    status_penggantian: 'Belum Diganti'
                };
                newDamagedItems.push(damagedItem);
                damagedItemsForState.push({
                    ...damagedItem,
                    id: Date.now() + Math.random(),
                    tanggal_rusak: todayDate
                });
                finalCatatan += ` ${item.namaAlat} (${item.spesifikasi}): ${item.jumlahRusak} unit rusak.`;
            }
        });

        // Always set status to 'Dikembalikan' regardless of damage
        const updatedPeminjamanList = peminjamanList.map(peminjaman => {
            if (peminjaman.id === selectedPeminjaman.id) {
                const updatedItems = peminjaman.items.map(item => {
                    const returnItem = returnFormData.returnItems.find(ri => ri.alatId === item.alatId);
                    if (returnItem) {
                        return {
                            ...item,
                            jumlahKembali: returnItem.jumlahDikembalikan,
                            jumlahRusak: returnItem.jumlahRusak || 0,
                            keteranganRusak: returnItem.keteranganRusak || '',
                        };
                    }
                    return item;
                });

                return {
                    ...peminjaman,
                    items: updatedItems,
                    status: 'Dikembalikan',
                    tanggalDikembalikan: todayDate,
                    catatanPengembalian: finalCatatan,
                    adaKerusakan: newDamagedItems.length > 0
                };
            }
            return peminjaman;
        });

        // Only return good items to stock
        const updatedAlatList = alatList.map(alat => {
            const returnItem = returnFormData.returnItems.find(ri => ri.alatId === alat.id);
            if (returnItem) {
                return {
                    ...alat,
                    jumlah: alat.jumlah + returnItem.jumlahDikembalikan
                };
            }
            return alat;
        });

        if (newDamagedItems.length > 0) {
            console.log('Data alat rusak yang akan dikirim ke backend:', newDamagedItems);
            setAlatRusakList(prev => [...prev, ...damagedItemsForState]);
        }

        setAlatList(updatedAlatList);
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
            item.items.some(i => i.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()));

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

    const filteredAlat = alatList.filter(a =>
        a.jumlah > 0 && (
            a.namaAlat.toLowerCase().includes(alatSearch.toLowerCase()) ||
            a.spesifikasi.toLowerCase().includes(alatSearch.toLowerCase()) ||
            (a.merkBrand && a.merkBrand.toLowerCase().includes(alatSearch.toLowerCase()))
        )
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Dipinjam': return 'bg-blue-100 text-blue-700';
            case 'Dikembalikan': return 'bg-green-100 text-green-700';
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Peminjaman Alat Laboratorium</h1>
                    <p className="text-gray-600">Kelola peminjaman alat laboratorium</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Total Peminjaman</p>
                            <p className="text-2xl font-bold text-gray-900">{peminjamanList.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Sedang Dipinjam</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {peminjamanList.filter(p => p.status === 'Dipinjam').length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Sudah Dikembalikan</p>
                            <p className="text-2xl font-bold text-green-600">
                                {peminjamanList.filter(p => p.status === 'Dikembalikan').length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Alat Rusak</p>
                            <p className="text-2xl font-bold text-red-600">{alatRusakList.length}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition ${activeTab === 'active'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Peminjaman Aktif ({activePeminjaman.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition ${activeTab === 'history'
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
                                placeholder="Cari nama peminjam, NIM/NIK, atau alat..."
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
                                        {formatTanggal(filterDateFrom)} - {formatTanggal(filterDateTo)}
                                        <button onClick={handleResetFilter} className="hover:bg-blue-200 rounded-full p-0.5">
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                                    {activeTab === 'history' && (
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    )}
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPeminjaman.length > 0 ? (
                                    filteredPeminjaman.map((item, i) => {
                                        const late = item.tanggalDikembalikan && isLate(item.tanggalKembali, item.tanggalDikembalikan);
                                        const lateDays = late ? calculateLateDays(item.tanggalKembali, item.tanggalDikembalikan) : 0;

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                                {/* No */}
                                                <td className="px-4 py-3">
                                                    <span className="text-xs text-gray-500">{i + 1}</span>
                                                </td>

                                                {/* Peminjam */}
                                                <td className="px-4 py-3">
                                                    <p className="text-xs font-semibold text-gray-900">{item.userName}</p>
                                                </td>

                                                {/* Tanggal */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                                        <span>Pinjam: {formatTanggal(item.tanggalPinjam)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                                        <span>Target: {formatTanggal(item.tanggalKembali)}</span>
                                                    </div>
                                                    {item.tanggalDikembalikan && (
                                                        <div className={`flex items-center gap-1 text-xs mt-1 ${late ? 'text-red-600' : 'text-green-600'}`}>
                                                            <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                            <span>Kembali: {formatTanggal(item.tanggalDikembalikan)}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Keperluan */}
                                                <td className="px-4 py-3">
                                                    <span className="text-xs text-gray-600">{item.keperluan || '-'}</span>
                                                </td>

                                                {/* Status - hanya history */}
                                                {activeTab === 'history' && (
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                            {item.adaKerusakan && (
                                                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                                                                    Ada Kerusakan
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}

                                                {/* Aksi */}
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleShowDetail(item)}
                                                            title="Lihat Detail"
                                                            className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {activeTab === 'active' && item.status !== 'Dikembalikan' && (
                                                            <button
                                                                onClick={() => openReturnModal(item)}
                                                                title="Kembalikan Alat"
                                                                className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Wrench className="w-12 h-12 text-gray-300" />
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
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Late Warning */}
                                    {selectedPeminjaman.tanggalDikembalikan && isLate(selectedPeminjaman.tanggalKembali, selectedPeminjaman.tanggalDikembalikan) && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-red-800">Pengembalian Terlambat</p>
                                                <p className="text-xs text-red-700 mt-1">
                                                    Terlambat {calculateLateDays(selectedPeminjaman.tanggalKembali, selectedPeminjaman.tanggalDikembalikan)} hari dari tanggal target pengembalian
                                                </p>
                                            </div>
                                        </div>
                                    )}

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
                                        {/* Statistik peminjam */}
                                        {(() => {
                                            const stats = getPeminjamStats(selectedPeminjaman.userNIK);
                                            return (
                                                <div className="mt-3 pt-3 border-t border-gray-200 flex gap-4">
                                                    <div className="text-sm">
                                                        <span className="text-gray-500">Total Transaksi: </span>
                                                        <span className="font-semibold text-gray-800">{stats.totalTransaksi}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-gray-500">Riwayat Terlambat: </span>
                                                        <span className={`font-semibold ${stats.totalTerlambat > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {stats.totalTerlambat}x
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Alat yang Dipinjam */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Wrench className="w-5 h-5" />
                                            Alat yang Dipinjam
                                        </h3>
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Alat</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dipinjam</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dikembalikan</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Rusak</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Sisa</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {selectedPeminjaman.items.map((item, idx) => {
                                                        const rusak = item.jumlahRusak || 0;
                                                        const sisa = item.jumlahPinjam - item.jumlahKembali - rusak;
                                                        return (
                                                            <tr key={idx}>
                                                                <td className="px-4 py-2">
                                                                    <div className="text-sm font-medium text-gray-900">{item.namaAlat}</div>
                                                                    <div className="text-xs text-gray-500">{item.spesifikasi}</div>
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-900">{item.jumlahPinjam} unit</td>
                                                                <td className="px-4 py-2 text-sm text-green-700 font-medium">{item.jumlahKembali} unit</td>
                                                                <td className="px-4 py-2 text-sm text-red-600 font-medium">
                                                                    {rusak > 0 ? (
                                                                        <span>{rusak} unit</span>
                                                                    ) : (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm font-medium text-blue-600">{sisa} unit</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Info kerusakan jika ada */}
                                    {selectedPeminjaman.items.some(item => item.jumlahRusak > 0) && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-1">
                                                <AlertTriangle className="w-4 h-4" />
                                                Alat Rusak (Menunggu Penggantian)
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedPeminjaman.items.filter(item => item.jumlahRusak > 0).map((item, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        <span className="font-medium">{item.namaAlat}</span> ({item.spesifikasi}):
                                                        <span className="text-red-600 font-medium"> {item.jumlahRusak} unit rusak</span>
                                                        {item.keteranganRusak && (
                                                            <p className="text-xs text-gray-600 mt-0.5">Keterangan: {item.keteranganRusak}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Detail Peminjaman */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Pinjam</label>
                                            <p className="text-sm text-gray-900">{formatTanggal(selectedPeminjaman.tanggalPinjam)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Target Kembali</label>
                                            <p className="text-sm text-gray-900">{formatTanggal(selectedPeminjaman.tanggalKembali)}</p>
                                        </div>
                                        {selectedPeminjaman.tanggalDikembalikan && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Dikembalikan</label>
                                                <p className={`text-sm font-medium ${isLate(selectedPeminjaman.tanggalKembali, selectedPeminjaman.tanggalDikembalikan) ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatTanggal(selectedPeminjaman.tanggalDikembalikan)}
                                                    {isLate(selectedPeminjaman.tanggalKembali, selectedPeminjaman.tanggalDikembalikan) &&
                                                        ` (Terlambat ${calculateLateDays(selectedPeminjaman.tanggalKembali, selectedPeminjaman.tanggalDikembalikan)} hari)`
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Keperluan</label>
                                            <p className="text-sm text-gray-900">{selectedPeminjaman.keperluan || '-'}</p>
                                        </div>
                                        {selectedPeminjaman.catatanPengembalian && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                                                    <FileText className="w-4 h-4" />
                                                    Catatan Pengembalian
                                                </label>
                                                <div className={`border rounded-lg p-3 ${isLate(selectedPeminjaman.tanggalKembali, selectedPeminjaman.tanggalDikembalikan) ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                                                    <p className="text-sm text-gray-900">{selectedPeminjaman.catatanPengembalian}</p>
                                                </div>
                                            </div>
                                        )}
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

                {/* Filter Modal - with date range */}
                {showFilterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Filter Tanggal Peminjaman</h2>
                                <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                                        <input
                                            type="date"
                                            value={filterDateFrom}
                                            onChange={(e) => setFilterDateFrom(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                        />
                                        {filterDateFrom && (
                                            <p className="mt-1 text-xs text-gray-500">{formatTanggal(filterDateFrom)}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                                        <input
                                            type="date"
                                            value={filterDateTo}
                                            onChange={(e) => setFilterDateTo(e.target.value)}
                                            min={filterDateFrom}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                        />
                                        {filterDateTo && (
                                            <p className="mt-1 text-xs text-gray-500">{formatTanggal(filterDateTo)}</p>
                                        )}
                                    </div>
                                    {filterDateFrom && filterDateTo && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-xs text-blue-800">
                                                Menampilkan peminjaman dari <strong>{formatTanggal(filterDateFrom)}</strong> sampai <strong>{formatTanggal(filterDateTo)}</strong>
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => { handleResetFilter(); setShowFilterModal(false); }}
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
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Form Peminjaman Alat Laboratorium</h2>
                                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
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
                                                            <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" onClick={clearPeminjam} />
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
                                                                        filteredPeminjam.map(peminjam => {
                                                                            const stats = getPeminjamStats(peminjam.nik);
                                                                            return (
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
                                                                                    <div className="flex items-center gap-3 mt-1">
                                                                                        <span className="text-xs text-gray-400">{stats.totalTransaksi} transaksi</span>
                                                                                        {stats.totalTerlambat > 0 && (
                                                                                            <span className="text-xs text-red-500 font-medium">{stats.totalTerlambat}x terlambat</span>
                                                                                        )}
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">Peminjam tidak ditemukan</div>
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
                                                    <button type="button" onClick={() => setShowNewUserForm(false)} className="text-sm text-red-600 hover:text-red-700 font-medium">
                                                        &larr; Kembali ke Master
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-600">*</span></label>
                                                        <input type="text" name="newUserName" value={formData.newUserName} onChange={handleInputChange} placeholder="Nama lengkap" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">NIK/NIM <span className="text-red-600">*</span></label>
                                                        <input type="text" name="newUserNIK" value={formData.newUserNIK} onChange={handleInputChange} placeholder="NIK/NIM" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Status <span className="text-red-600">*</span></label>
                                                        <select name="newUserStatus" value={formData.newUserStatus} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
                                                            {STATUS_OPTIONS.map(status => (<option key={status} value={status}>{status}</option>))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Institusi/Kampus <span className="text-red-600">*</span></label>
                                                        <input type="text" name="newUserInstitusi" value={formData.newUserInstitusi} onChange={handleInputChange} placeholder="Nama institusi/kampus" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Fakultas <span className="text-gray-400">(Opsional)</span></label>
                                                        <input type="text" name="newUserFakultas" value={formData.newUserFakultas} onChange={handleInputChange} placeholder="Nama fakultas" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Jurusan/Prodi <span className="text-gray-400">(Opsional)</span></label>
                                                        <input type="text" name="newUserJurusan" value={formData.newUserJurusan} onChange={handleInputChange} placeholder="Nama jurusan/prodi" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">No. HP <span className="text-red-600">*</span></label>
                                                        <input type="tel" name="newUserPhone" value={formData.newUserPhone} onChange={handleInputChange} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-red-600">*</span></label>
                                                        <input type="email" name="newUserEmail" value={formData.newUserEmail} onChange={handleInputChange} placeholder="email@example.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Alamat <span className="text-red-600">*</span></label>
                                                        <textarea name="newUserAlamat" value={formData.newUserAlamat} onChange={handleInputChange} placeholder="Alamat lengkap" rows="2" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                                    </div>
                                                </div>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <p className="text-xs text-blue-800">💡 Data peminjam baru akan otomatis tersimpan ke master peminjam</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items Section */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Wrench className="w-5 h-5" />
                                            Alat yang Dipinjam
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                            <div className="md:col-span-2 relative">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Cari nama alat, spesifikasi, atau merk..."
                                                        value={currentItem.alatId ? alatList.find(a => a.id === parseInt(currentItem.alatId))?.namaAlat || alatSearch : alatSearch}
                                                        onChange={(e) => {
                                                            setAlatSearch(e.target.value);
                                                            setCurrentItem(prev => ({ ...prev, alatId: '' }));
                                                            setShowAlatDropdown(true);
                                                        }}
                                                        onFocus={() => setShowAlatDropdown(true)}
                                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    />
                                                    {(alatSearch || currentItem.alatId) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setAlatSearch('');
                                                                setCurrentItem(prev => ({ ...prev, alatId: '', jumlah: '' }));
                                                                setShowAlatDropdown(false);
                                                            }}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {currentItem.alatId && (
                                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-green-900">
                                                                    {alatList.find(a => a.id === parseInt(currentItem.alatId))?.namaAlat}
                                                                </p>
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <span className="text-xs text-green-700">{alatList.find(a => a.id === parseInt(currentItem.alatId))?.spesifikasi}</span>
                                                                    {alatList.find(a => a.id === parseInt(currentItem.alatId))?.merkBrand && (
                                                                        <span className="text-xs text-green-600">• {alatList.find(a => a.id === parseInt(currentItem.alatId))?.merkBrand}</span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <Wrench className="w-3 h-3 text-green-600" />
                                                                        <span className="text-xs font-semibold text-green-800">
                                                                            Stok Tersedia: {alatList.find(a => a.id === parseInt(currentItem.alatId))?.jumlah} unit
                                                                        </span>
                                                                    </div>
                                                                    {alatList.find(a => a.id === parseInt(currentItem.alatId))?.penyimpanan && (
                                                                        <span className="text-xs text-green-600">• {alatList.find(a => a.id === parseInt(currentItem.alatId))?.penyimpanan}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => { setAlatSearch(''); setCurrentItem(prev => ({ ...prev, alatId: '', jumlah: '' })); }} className="p-1 text-green-600 hover:bg-green-100 rounded transition ml-2">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {showAlatDropdown && !currentItem.alatId && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                                                        <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                                                            <span className="text-xs font-medium text-gray-600">{filteredAlat.length} alat ditemukan</span>
                                                            <button type="button" onClick={() => setShowAlatDropdown(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto">
                                                            {filteredAlat.length > 0 ? (
                                                                filteredAlat.map(alat => (
                                                                    <button
                                                                        key={alat.id}
                                                                        type="button"
                                                                        onClick={() => selectAlat(alat)}
                                                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition border-b border-gray-100 last:border-0"
                                                                    >
                                                                        <div className="font-medium text-gray-900">{alat.namaAlat}</div>
                                                                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                                                            <span className="text-xs">{alat.spesifikasi}</span>
                                                                            {alat.merkBrand && <span className="text-xs text-gray-500">• {alat.merkBrand}</span>}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-3">
                                                                            <span className="flex items-center gap-1">
                                                                                <Wrench className="w-3 h-3" />
                                                                                Tersedia: <span className="font-semibold text-green-600">{alat.jumlah} unit</span>
                                                                            </span>
                                                                            {alat.penyimpanan && <span className="text-gray-400">• {alat.penyimpanan}</span>}
                                                                        </div>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-8 text-center">
                                                                    <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                                    <p className="text-sm text-gray-500">Alat tidak ditemukan</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 h-10">
                                                <input
                                                    type="number"
                                                    name="jumlah"
                                                    value={currentItem.jumlah}
                                                    onChange={handleCurrentItemChange}
                                                    placeholder="Jumlah"
                                                    min="1"
                                                    max={currentItem.alatId ? alatList.find(a => a.id === parseInt(currentItem.alatId))?.jumlah : undefined}
                                                    disabled={!currentItem.alatId}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addItemToList}
                                                    disabled={!currentItem.alatId || !currentItem.jumlah}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {currentItem.alatId && !currentItem.jumlah && (
                                            <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Masukkan jumlah alat yang ingin dipinjam (Max: {alatList.find(a => a.id === parseInt(currentItem.alatId))?.jumlah} unit)
                                            </p>
                                        )}

                                        {formData.items.length > 0 && (
                                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Alat</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Spesifikasi</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Jumlah</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {formData.items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 text-sm text-gray-900">{item.namaAlat}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-600">{item.spesifikasi}</td>
                                                                <td className="px-4 py-2 text-sm text-gray-900">{item.jumlahPinjam} unit</td>
                                                                <td className="px-4 py-2">
                                                                    <button type="button" onClick={() => removeItemFromList(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
                                                <Wrench className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                <p>Belum ada alat yang ditambahkan</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tanggal */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Pinjam <span className="text-red-600">*</span>
                                            </label>
                                            <input type="date" name="tanggalPinjam" value={formData.tanggalPinjam} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                            {formData.tanggalPinjam && <p className="mt-1 text-xs text-gray-500">{formatTanggal(formData.tanggalPinjam)}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Kembali <span className="text-red-600">*</span>
                                            </label>
                                            <input type="date" name="tanggalKembali" value={formData.tanggalKembali} onChange={handleInputChange} min={formData.tanggalPinjam} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                            {formData.tanggalKembali && <p className="mt-1 text-xs text-gray-500">{formatTanggal(formData.tanggalKembali)}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Keperluan <span className="text-gray-400 text-xs font-normal">(Opsional)</span>
                                        </label>
                                        <textarea
                                            name="keperluan"
                                            value={formData.keperluan}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Contoh: Praktikum Kimia Analitik, Penelitian Skripsi, dll"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t mt-6">
                                    <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Simpan Peminjaman</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Return Modal - Simplified */}
                {showReturnModal && selectedPeminjaman && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Pengembalian Alat</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedPeminjaman.userName} &mdash; {selectedPeminjaman.userNIK}</p>
                                </div>
                                <button onClick={() => { setShowReturnModal(false); setSelectedPeminjaman(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleReturnSubmit} className="p-6">
                                <div className="space-y-5">
                                    {/* Late Warning */}
                                    {(() => {
                                        const todayDate = new Date().toISOString().split('T')[0];
                                        const late = isLate(selectedPeminjaman.tanggalKembali, todayDate);
                                        const lateDays = late ? calculateLateDays(selectedPeminjaman.tanggalKembali, todayDate) : 0;
                                        return late && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-red-800">Pengembalian Terlambat {lateDays} Hari</p>
                                                    <p className="text-xs text-red-700 mt-0.5">Target: {formatTanggal(selectedPeminjaman.tanggalKembali)}. Catatan keterlambatan otomatis ditambahkan.</p>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Info Peminjaman */}
                                    <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 text-xs">Tanggal Pinjam</span>
                                            <p className="font-medium text-gray-900 text-xs mt-0.5">{formatTanggal(selectedPeminjaman.tanggalPinjam)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs">Target Kembali</span>
                                            <p className="font-medium text-gray-900 text-xs mt-0.5">{formatTanggal(selectedPeminjaman.tanggalKembali)}</p>
                                        </div>
                                        {selectedPeminjaman.keperluan && (
                                            <div>
                                                <span className="text-gray-500 text-xs">Keperluan</span>
                                                <p className="font-medium text-gray-900 text-xs mt-0.5">{selectedPeminjaman.keperluan}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Per-alat cards */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Detail Pengembalian Alat</p>
                                        <div className="space-y-3">
                                            {returnFormData.returnItems.map((item, index) => {
                                                const sisa = item.jumlahPinjam - item.jumlahSudahKembali;
                                                const maxKembali = sisa - (item.jumlahRusak || 0);
                                                return (
                                                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{item.namaAlat}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">{item.spesifikasi}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500">Dipinjam</p>
                                                                <p className="text-sm font-bold text-gray-900">{item.jumlahPinjam} unit</p>
                                                            </div>
                                                        </div>

                                                        {/* Summary row */}
                                                        <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                                                            <div className="bg-gray-50 rounded-lg p-2">
                                                                <p className="text-gray-500">Sudah Kembali</p>
                                                                <p className="font-semibold text-gray-700 mt-0.5">{item.jumlahSudahKembali} unit</p>
                                                            </div>
                                                            <div className="bg-orange-50 rounded-lg p-2">
                                                                <p className="text-orange-500">Sisa Belum Kembali</p>
                                                                <p className="font-semibold text-orange-700 mt-0.5">{sisa} unit</p>
                                                            </div>
                                                            <div className="bg-blue-50 rounded-lg p-2">
                                                                <p className="text-blue-500">Dikembalikan Baik</p>
                                                                <p className="font-semibold text-blue-700 mt-0.5">{item.jumlahDikembalikan} unit</p>
                                                            </div>
                                                        </div>

                                                        {/* Jumlah kembali (baik) */}
                                                        <div className="mb-3">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                                Jumlah Dikembalikan (Kondisi Baik) <span className="text-gray-400">(maks. {maxKembali} unit)</span>
                                                            </label>
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="range"
                                                                    value={item.jumlahDikembalikan}
                                                                    onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                                                                    min="0"
                                                                    max={maxKembali}
                                                                    className="flex-1 accent-green-600"
                                                                />
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={item.jumlahDikembalikan}
                                                                        onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                                                                        min="0"
                                                                        max={maxKembali}
                                                                        className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-center font-semibold"
                                                                    />
                                                                    <span className="text-xs text-gray-600">unit</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Jumlah rusak */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-red-700 mb-1.5">
                                                                Jumlah Rusak / Hilang <span className="text-gray-400">(0 jika tidak ada)</span>
                                                            </label>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <input
                                                                    type="range"
                                                                    value={item.jumlahRusak || 0}
                                                                    onChange={(e) => handleDamagedQuantityChange(index, e.target.value)}
                                                                    min="0"
                                                                    max={sisa - item.jumlahDikembalikan}
                                                                    className="flex-1 accent-red-500"
                                                                />
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={item.jumlahRusak || 0}
                                                                        onChange={(e) => handleDamagedQuantityChange(index, e.target.value)}
                                                                        min="0"
                                                                        max={sisa - item.jumlahDikembalikan}
                                                                        className="w-16 px-2 py-1.5 border border-red-300 bg-red-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-center font-semibold text-red-700"
                                                                    />
                                                                    <span className="text-xs text-gray-600">unit</span>
                                                                </div>
                                                            </div>
                                                            {(item.jumlahRusak || 0) > 0 && (
                                                                <input
                                                                    type="text"
                                                                    value={item.keteranganRusak || ''}
                                                                    onChange={(e) => handleDamagedNoteChange(index, e.target.value)}
                                                                    placeholder="Keterangan kerusakan (pecah, retak, hilang, dll.)"
                                                                    className="w-full px-3 py-2 text-xs border border-red-200 bg-red-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Ringkasan */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-1.5">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Ringkasan</p>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total dipinjam</span>
                                            <span className="font-semibold text-gray-800">{returnFormData.returnItems.reduce((s, i) => s + i.jumlahPinjam, 0)} unit</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Dikembalikan baik</span>
                                            <span className="font-semibold text-green-700">{returnFormData.returnItems.reduce((s, i) => s + i.jumlahDikembalikan, 0)} unit</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Rusak / hilang</span>
                                            <span className={`font-semibold ${returnFormData.returnItems.reduce((s, i) => s + (i.jumlahRusak || 0), 0) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {returnFormData.returnItems.reduce((s, i) => s + (i.jumlahRusak || 0), 0)} unit
                                            </span>
                                        </div>
                                    </div>

                                    {/* Catatan */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                            <FileText className="w-4 h-4" />
                                            Catatan <span className="text-gray-400 text-xs font-normal">(Opsional)</span>
                                        </label>
                                        <textarea
                                            value={returnFormData.catatanPengembalian}
                                            onChange={(e) => setReturnFormData(prev => ({ ...prev, catatanPengembalian: e.target.value }))}
                                            rows="2"
                                            placeholder="Kondisi alat, keterangan tambahan, dll."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                                        />
                                    </div>

                                    {returnFormData.returnItems.some(i => (i.jumlahRusak || 0) > 0) && (
                                        <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-orange-700">
                                                <span className="font-semibold">Info:</span> Alat rusak/hilang tidak akan menambah stok dan akan dicatat untuk proses penggantian. Status peminjaman akan langsung menjadi <strong>Dikembalikan</strong>.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-6 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowReturnModal(false); setSelectedPeminjaman(null); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
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

export default PeminjamanAlatPage;