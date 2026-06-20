"use client"
import React, { useState } from 'react';
import {
    Plus, Search, X, Filter, Eye, Edit2, Trash2, CheckCircle,
    ChevronDown, User, Calendar, FileText, Package, Wrench,
    AlertTriangle, AlertCircle, RotateCcw, BookOpen, Phone,
    Mail, Building2, FlaskConical, ClipboardList, ShoppingBag, Banknote
} from 'lucide-react';

const PraktikumPage = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const [showTambahModal, setShowTambahModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSelesaikanModal, setShowSelesaikanModal] = useState(false);
    const [showAlatRusakModal, setShowAlatRusakModal] = useState(false);
    const [showHapusConfirm, setShowHapusConfirm] = useState(false);

    const [selectedPraktikum, setSelectedPraktikum] = useState(null);
    const [selectedAlatRusak, setSelectedAlatRusak] = useState(null);
    const [selesaikanActiveTab, setSelesaikanActiveTab] = useState('alat');

    const [penanggungjawabSearch, setPenanggungjawabSearch] = useState('');
    const [showPJDropdown, setShowPJDropdown] = useState(false);
    const [showNewPJForm, setShowNewPJForm] = useState(false);
    const [alatSearch, setAlatSearch] = useState('');
    const [showAlatDropdown, setShowAlatDropdown] = useState(false);
    const [bahanSearch, setBahanSearch] = useState('');
    const [showBahanDropdown, setShowBahanDropdown] = useState(false);
    const [currentAlat, setCurrentAlat] = useState({ alatId: '', jumlah: '' });
    const [currentBahan, setCurrentBahan] = useState({ bahanId: '', jumlah: '' });

    const [rusakUserSearch, setRugakUserSearch] = useState('');
    const [showRusakUserDropdown, setShowRusakUserDropdown] = useState(false);
    const [showNewRusakUserForm, setShowNewRusakUserForm] = useState(false);
    const [rusakFormData, setRugakFormData] = useState({
        userId: null, userName: '', userNIK: '', userStatus: 'Mahasiswa',
        userInstitusi: '', userFakultas: '', userJurusan: '', userPhone: '', userEmail: '',
        newUserName: '', newUserNIK: '', newUserStatus: 'Mahasiswa',
        newUserInstitusi: '', newUserFakultas: '', newUserJurusan: '', newUserPhone: '', newUserEmail: '',
        bentukPenggantian: 'barang', jumlah: '', deskripsiKerusakan: ''
    });

    const STATUS_OPTIONS = ['Mahasiswa', 'Dosen', 'Staff', 'Peneliti', 'Umum'];

    const [masterPenanggungjawab, setMasterPenanggungjawab] = useState([
        { id: 1, name: 'Dr. Siti Nurhaliza, M.Si', nik: '198503152010122001', status: 'Dosen', institusi: 'Universitas Pendidikan Indonesia', fakultas: 'FPMIPA', jurusan: 'Pendidikan Kimia', phone: '081234567891', email: 'siti.nurhaliza@upi.edu' },
        { id: 2, name: 'Ahmad Fauzi', nik: '2001234', status: 'Mahasiswa', institusi: 'Universitas Pendidikan Indonesia', fakultas: 'FPMIPA', jurusan: 'Pendidikan Kimia', phone: '081234567890', email: 'ahmad.fauzi@upi.edu' },
        { id: 3, name: 'Prof. Budi Santoso, Ph.D', nik: '197001012000011001', status: 'Dosen', institusi: 'Universitas Pendidikan Indonesia', fakultas: 'FPMIPA', jurusan: 'Kimia', phone: '081234567893', email: 'budi.santoso@upi.edu' },
    ]);

    const [alatList] = useState([
        { id: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', jumlah: 10, merkBrand: 'Pyrex', penyimpanan: 'Lemari Kanan' },
        { id: 2, namaAlat: 'Erlenmeyer', spesifikasi: '50 ml', jumlah: 8, merkBrand: 'Pyrex', penyimpanan: 'Rak 2' },
        { id: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', jumlah: 12, merkBrand: '', penyimpanan: 'Rak 2' },
        { id: 4, namaAlat: 'Labu Jantung', spesifikasi: '50 ml', jumlah: 6, merkBrand: 'Duran', penyimpanan: 'Rak 3' },
        { id: 5, namaAlat: 'Buret', spesifikasi: '10 ml', jumlah: 20, merkBrand: '', penyimpanan: 'Rak 1' },
    ]);

    const [bahanList] = useState([
        { id: 1, namaBahan: 'Carbon disulfide', rumusKimia: 'CS₂', spesifikasi: 'for analisis', jumlah: 1000, satuan: 'mL', penyimpanan: 'Lemari Kuning' },
        { id: 2, namaBahan: 'Petroleum benzene', rumusKimia: 'C₅C₆', spesifikasi: 'for analisis', jumlah: 4000, satuan: 'mL', penyimpanan: 'Rak 2' },
        { id: 3, namaBahan: 'Natrium Klorida', rumusKimia: 'NaCl', spesifikasi: 'Pro Analisis', jumlah: 5000, satuan: 'g', penyimpanan: 'Lemari Penyimpanan' },
    ]);

    const [praktikumList, setPraktikumList] = useState([
        {
            id: 1,
            judul: 'Praktikum Titrasi Asam Basa',
            deskripsi: 'Praktikum penentuan kadar asam asetat dalam cuka dengan metode titrasi asam basa menggunakan NaOH sebagai titran.',
            tanggal: '2024-02-15',
            status: 'Berlangsung',
            penanggungjawab: { id: 1, name: 'Dr. Siti Nurhaliza, M.Si', nik: '198503152010122001', status: 'Dosen', institusi: 'UPI', phone: '081234567891', email: 'siti@upi.edu' },
            alat: [
                { alatId: 5, namaAlat: 'Buret', spesifikasi: '10 ml', jumlahDigunakan: 5, jumlahDikembalikan: 0, jumlahRusak: 0 },
                { alatId: 1, namaAlat: 'Erlenmeyer', spesifikasi: '25 ml', jumlahDigunakan: 8, jumlahDikembalikan: 0, jumlahRusak: 0 },
            ],
            bahan: [
                { bahanId: 3, namaBahan: 'Natrium Klorida', rumusKimia: 'NaCl', jumlahDipinjam: 200, jumlahDikembalikan: 0, satuan: 'g' },
            ],
            alatRusakList: []
        },
        {
            id: 2,
            judul: 'Analisis Kualitatif Senyawa Organik',
            deskripsi: 'Identifikasi gugus fungsi pada senyawa organik melalui uji kimia sederhana.',
            tanggal: '2024-01-20',
            status: 'Selesai',
            tanggalSelesai: '2024-01-20',
            penanggungjawab: { id: 3, name: 'Prof. Budi Santoso, Ph.D', nik: '197001012000011001', status: 'Dosen', institusi: 'UPI', phone: '081234567893', email: 'budi@upi.edu' },
            alat: [
                { alatId: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', jumlahDigunakan: 6, jumlahDikembalikan: 5, jumlahRusak: 1 },
            ],
            bahan: [
                { bahanId: 1, namaBahan: 'Carbon disulfide', rumusKimia: 'CS₂', jumlahDipinjam: 150, jumlahDikembalikan: 30, satuan: 'mL' },
            ],
            alatRusakList: [
                { id: 1, alatId: 3, namaAlat: 'Erlenmeyer', spesifikasi: '100 ml', jumlahRusak: 1, deskripsiKerusakan: 'Pecah saat digunakan', userName: 'Ahmad Fauzi', userNIK: '2001234', userStatus: 'Mahasiswa', userInstitusi: 'UPI', userFakultas: 'FPMIPA', userJurusan: 'Pendidikan Kimia', userPhone: '081234567890', userEmail: 'ahmad.fauzi@upi.edu', bentukPenggantian: 'barang', statusPenggantian: 'Belum Diganti' }
            ]
        },
    ]);

    const [formData, setFormData] = useState({
        judul: '', deskripsi: '', tanggal: '',
        pjId: null, pjName: '', pjNIK: '', pjStatus: 'Dosen', pjInstitusi: '', pjPhone: '', pjEmail: '',
        newPJName: '', newPJNIK: '', newPJStatus: 'Dosen', newPJInstitusi: '', newPJPhone: '', newPJEmail: '',
        alat: [], bahan: []
    });

    const [selesaikanData, setSelesaikanData] = useState({ alat: [], bahan: [] });

    const formatTanggal = (d) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        if (status === 'Berlangsung') return 'bg-blue-100 text-blue-700';
        if (status === 'Selesai') return 'bg-green-100 text-green-700';
        return 'bg-gray-100 text-gray-700';
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Mahasiswa': return 'bg-blue-100 text-blue-700';
            case 'Dosen': return 'bg-purple-100 text-purple-700';
            case 'Staff': return 'bg-green-100 text-green-700';
            case 'Peneliti': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const activePraktikum = praktikumList.filter(p => p.status !== 'Selesai');
    const selesaiPraktikum = praktikumList.filter(p => p.status === 'Selesai');

    const filteredPraktikum = praktikumList.filter(item => {
        const tabFilter = activeTab === 'active' ? item.status !== 'Selesai' : item.status === 'Selesai';
        const searchFilter = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.penanggungjawab.name.toLowerCase().includes(searchTerm.toLowerCase());
        let dateFilter = true;
        if (filterDateFrom && filterDateTo) {
            const d = new Date(item.tanggal);
            dateFilter = d >= new Date(filterDateFrom) && d <= new Date(filterDateTo);
        }
        return tabFilter && searchFilter && dateFilter;
    });

    const filteredPJ = masterPenanggungjawab.filter(p =>
        p.name.toLowerCase().includes(penanggungjawabSearch.toLowerCase()) ||
        p.nik.includes(penanggungjawabSearch)
    );

    const filteredAlatDropdown = alatList.filter(a =>
        a.jumlah > 0 && (
            a.namaAlat.toLowerCase().includes(alatSearch.toLowerCase()) ||
            a.spesifikasi.toLowerCase().includes(alatSearch.toLowerCase())
        )
    );

    const filteredBahanDropdown = bahanList.filter(b =>
        b.jumlah > 0 && (
            b.namaBahan.toLowerCase().includes(bahanSearch.toLowerCase()) ||
            b.rumusKimia.toLowerCase().includes(bahanSearch.toLowerCase())
        )
    );

    const filteredRusakUser = masterPenanggungjawab.filter(p =>
        p.name.toLowerCase().includes(rusakUserSearch.toLowerCase()) ||
        p.nik.includes(rusakUserSearch)
    );

    const resetForm = () => {
        setFormData({
            judul: '', deskripsi: '', tanggal: '',
            pjId: null, pjName: '', pjNIK: '', pjStatus: 'Dosen', pjInstitusi: '', pjPhone: '', pjEmail: '',
            newPJName: '', newPJNIK: '', newPJStatus: 'Dosen', newPJInstitusi: '', newPJPhone: '', newPJEmail: '',
            alat: [], bahan: []
        });
        setCurrentAlat({ alatId: '', jumlah: '' });
        setCurrentBahan({ bahanId: '', jumlah: '' });
        setPenanggungjawabSearch('');
        setShowNewPJForm(false);
        setShowTambahModal(false);
        setShowEditModal(false);
    };

    const selectPJ = (pj) => {
        setFormData(prev => ({
            ...prev, pjId: pj.id, pjName: pj.name, pjNIK: pj.nik, pjStatus: pj.status,
            pjInstitusi: pj.institusi, pjPhone: pj.phone, pjEmail: pj.email
        }));
        setShowPJDropdown(false);
        setPenanggungjawabSearch('');
    };

    const addAlatToForm = () => {
        if (!currentAlat.alatId || !currentAlat.jumlah) return;
        const alat = alatList.find(a => a.id === parseInt(currentAlat.alatId));
        if (!alat) return;
        const existing = formData.alat.findIndex(i => i.alatId === alat.id);
        if (existing >= 0) {
            const updated = [...formData.alat];
            updated[existing].jumlahDigunakan = parseInt(currentAlat.jumlah);
            setFormData(prev => ({ ...prev, alat: updated }));
        } else {
            setFormData(prev => ({
                ...prev,
                alat: [...prev.alat, { alatId: alat.id, namaAlat: alat.namaAlat, spesifikasi: alat.spesifikasi, jumlahDigunakan: parseInt(currentAlat.jumlah), jumlahDikembalikan: 0, jumlahRusak: 0 }]
            }));
        }
        setCurrentAlat({ alatId: '', jumlah: '' });
        setAlatSearch('');
    };

    const addBahanToForm = () => {
        if (!currentBahan.bahanId || !currentBahan.jumlah) return;
        const bahan = bahanList.find(b => b.id === parseInt(currentBahan.bahanId));
        if (!bahan) return;
        const existing = formData.bahan.findIndex(i => i.bahanId === bahan.id);
        if (existing >= 0) {
            const updated = [...formData.bahan];
            updated[existing].jumlahDipinjam = parseInt(currentBahan.jumlah);
            setFormData(prev => ({ ...prev, bahan: updated }));
        } else {
            setFormData(prev => ({
                ...prev,
                bahan: [...prev.bahan, { bahanId: bahan.id, namaBahan: bahan.namaBahan, rumusKimia: bahan.rumusKimia, jumlahDipinjam: parseInt(currentBahan.jumlah), jumlahDikembalikan: 0, satuan: bahan.satuan }]
            }));
        }
        setCurrentBahan({ bahanId: '', jumlah: '' });
        setBahanSearch('');
    };

    const handleSubmitPraktikum = (e) => {
        e.preventDefault();
        if (formData.alat.length === 0 && formData.bahan.length === 0) {
            alert('Tambahkan minimal satu alat atau bahan');
            return;
        }
        let pjData = {};
        if (showNewPJForm) {
            const newPJ = {
                id: masterPenanggungjawab.length + 1,
                name: formData.newPJName, nik: formData.newPJNIK, status: formData.newPJStatus,
                institusi: formData.newPJInstitusi, phone: formData.newPJPhone, email: formData.newPJEmail,
                fakultas: '', jurusan: ''
            };
            setMasterPenanggungjawab(prev => [...prev, newPJ]);
            pjData = { id: newPJ.id, name: newPJ.name, nik: newPJ.nik, status: newPJ.status, institusi: newPJ.institusi, phone: newPJ.phone, email: newPJ.email };
        } else {
            pjData = { id: formData.pjId, name: formData.pjName, nik: formData.pjNIK, status: formData.pjStatus, institusi: formData.pjInstitusi, phone: formData.pjPhone, email: formData.pjEmail };
        }

        if (showEditModal) {
            setPraktikumList(prev => prev.map(p => p.id === selectedPraktikum.id ? {
                ...p, judul: formData.judul, deskripsi: formData.deskripsi, tanggal: formData.tanggal,
                penanggungjawab: pjData, alat: formData.alat, bahan: formData.bahan
            } : p));
        } else {
            const newP = {
                id: praktikumList.length + 1, judul: formData.judul, deskripsi: formData.deskripsi,
                tanggal: formData.tanggal, status: 'Berlangsung', penanggungjawab: pjData,
                alat: formData.alat, bahan: formData.bahan, alatRusakList: []
            };
            setPraktikumList(prev => [...prev, newP]);
        }
        resetForm();
    };

    const openEditModal = (p) => {
        setSelectedPraktikum(p);
        setFormData({
            judul: p.judul, deskripsi: p.deskripsi, tanggal: p.tanggal,
            pjId: p.penanggungjawab.id, pjName: p.penanggungjawab.name, pjNIK: p.penanggungjawab.nik,
            pjStatus: p.penanggungjawab.status, pjInstitusi: p.penanggungjawab.institusi,
            pjPhone: p.penanggungjawab.phone, pjEmail: p.penanggungjawab.email,
            newPJName: '', newPJNIK: '', newPJStatus: 'Dosen', newPJInstitusi: '', newPJPhone: '', newPJEmail: '',
            alat: [...p.alat], bahan: [...p.bahan]
        });
        setShowEditModal(true);
    };

    const openSelesaikanModal = (p) => {
        setSelectedPraktikum(p);
        setSelesaikanData({
            alat: p.alat.map(a => ({ ...a, jumlahDikembalikan: 0, jumlahRusak: 0, keteranganRusak: '', rusakSudahDiisi: false })),
            bahan: p.bahan.map(b => ({ ...b, jumlahDikembalikan: 0 }))
        });
        setSelesaikanActiveTab('alat');
        setShowSelesaikanModal(true);
    };

    const allRusakFilled = () => {
        return selesaikanData.alat.every(item => {
            if ((item.jumlahRusak || 0) > 0) {
                return item.rusakSudahDiisi === true;
            }
            return true;
        });
    };

    const handleSelesaikanSubmit = (e) => {
        e.preventDefault();
        if (!allRusakFilled()) {
            alert('Harap isi data kerusakan untuk semua alat yang rusak sebelum konfirmasi selesai.');
            return;
        }
        setPraktikumList(prev => prev.map(p => {
            if (p.id !== selectedPraktikum.id) return p;
            return {
                ...p, status: 'Selesai', tanggalSelesai: new Date().toISOString().split('T')[0],
                alat: p.alat.map(a => {
                    const sd = selesaikanData.alat.find(sa => sa.alatId === a.alatId);
                    return sd ? { ...a, jumlahDikembalikan: sd.jumlahDikembalikan, jumlahRusak: sd.jumlahRusak } : a;
                }),
                bahan: p.bahan.map(b => {
                    const sd = selesaikanData.bahan.find(sb => sb.bahanId === b.bahanId);
                    return sd ? { ...b, jumlahDikembalikan: sd.jumlahDikembalikan } : b;
                })
            };
        }));
        setShowSelesaikanModal(false);
        setSelectedPraktikum(null);
    };

    const openAlatRusakModal = (alatItem) => {
        setSelectedAlatRusak(alatItem);
        setRugakFormData({
            userId: null, userName: '', userNIK: '', userStatus: 'Mahasiswa',
            userInstitusi: '', userFakultas: '', userJurusan: '', userPhone: '', userEmail: '',
            newUserName: '', newUserNIK: '', newUserStatus: 'Mahasiswa',
            newUserInstitusi: '', newUserFakultas: '', newUserJurusan: '', newUserPhone: '', newUserEmail: '',
            bentukPenggantian: 'barang', jumlah: '', deskripsiKerusakan: ''
        });
        setRugakUserSearch('');
        setShowNewRusakUserForm(false);
        setShowAlatRusakModal(true);
    };

    const handleAlatRusakSubmit = (e) => {
        e.preventDefault();
        const newRusak = {
            id: Date.now(),
            alatId: selectedAlatRusak.alatId,
            namaAlat: selectedAlatRusak.namaAlat,
            spesifikasi: selectedAlatRusak.spesifikasi,
            jumlahRusak: selesaikanData.alat.find(a => a.alatId === selectedAlatRusak.alatId)?.jumlahRusak || 0,
            deskripsiKerusakan: rusakFormData.deskripsiKerusakan,
            userName: showNewRusakUserForm ? rusakFormData.newUserName : rusakFormData.userName,
            userNIK: showNewRusakUserForm ? rusakFormData.newUserNIK : rusakFormData.userNIK,
            userStatus: showNewRusakUserForm ? rusakFormData.newUserStatus : rusakFormData.userStatus,
            userInstitusi: showNewRusakUserForm ? rusakFormData.newUserInstitusi : rusakFormData.userInstitusi,
            userFakultas: showNewRusakUserForm ? rusakFormData.newUserFakultas : rusakFormData.userFakultas,
            userJurusan: showNewRusakUserForm ? rusakFormData.newUserJurusan : rusakFormData.userJurusan,
            userPhone: showNewRusakUserForm ? rusakFormData.newUserPhone : rusakFormData.userPhone,
            userEmail: showNewRusakUserForm ? rusakFormData.newUserEmail : rusakFormData.userEmail,
            bentukPenggantian: rusakFormData.bentukPenggantian,
            jumlah: rusakFormData.jumlah,
            statusPenggantian: 'Belum Diganti'
        };
        setPraktikumList(prev => prev.map(p => p.id === selectedPraktikum.id ? {
            ...p, alatRusakList: [...(p.alatRusakList || []), newRusak]
        } : p));
        setSelesaikanData(prev => ({
            ...prev,
            alat: prev.alat.map(a => a.alatId === selectedAlatRusak.alatId ? { ...a, rusakSudahDiisi: true } : a)
        }));
        setShowAlatRusakModal(false);
    };

    const handleHapus = () => {
        setPraktikumList(prev => prev.filter(p => p.id !== selectedPraktikum.id));
        setShowHapusConfirm(false);
        setSelectedPraktikum(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Kegiatan Praktikum</h1>
                    <p className="text-gray-600">Kelola dan catat kegiatan praktikum laboratorium</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-gray-600 text-sm mb-1">Praktikum Berlangsung</p>
                        <p className="text-2xl font-bold text-blue-600">{activePraktikum.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-gray-600 text-sm mb-1">Praktikum Selesai</p>
                        <p className="text-2xl font-bold text-green-600">{selesaiPraktikum.length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 mb-6">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => setActiveTab('active')} className={`flex-1 px-6 py-3 text-sm font-medium transition ${activeTab === 'active' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                            Praktikum Berlangsung ({activePraktikum.length})
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`flex-1 px-6 py-3 text-sm font-medium transition ${activeTab === 'history' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                            Riwayat Praktikum ({selesaiPraktikum.length})
                        </button>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Cari judul praktikum atau penanggung jawab..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowFilterModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <Filter className="w-5 h-5" />
                                <span>Filter Tanggal</span>
                                {(filterDateFrom || filterDateTo) && <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">1</span>}
                            </button>
                            {activeTab === 'active' && (
                                <button onClick={() => setShowTambahModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                    <Plus className="w-5 h-5" />
                                    <span>Tambah Praktikum</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {(filterDateFrom || filterDateTo) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-gray-600">Filter aktif:</span>
                            {filterDateFrom && filterDateTo && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    {formatTanggal(filterDateFrom)} - {formatTanggal(filterDateTo)}
                                    <button onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); }} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                                </span>
                            )}
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Praktikum</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penanggung Jawab</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    {activeTab === 'history' && <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPraktikum.length > 0 ? filteredPraktikum.map((item, i) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-xs text-gray-500">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-semibold text-gray-900">{item.judul}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-medium text-gray-900">{item.penanggungjawab.name}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                                <span>{formatTanggal(item.tanggal)}</span>
                                            </div>
                                            {item.tanggalSelesai && (
                                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                                    <span>{formatTanggal(item.tanggalSelesai)}</span>
                                                </div>
                                            )}
                                        </td>
                                        {activeTab === 'history' && (
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
                                            </td>
                                        )}
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 justify-center">
                                                <button onClick={() => { setSelectedPraktikum(item); setShowDetailModal(true); }} title="Detail" className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition"><Eye className="w-4 h-4" /></button>
                                                {activeTab === 'active' && (
                                                    <>
                                                        <button onClick={() => openSelesaikanModal(item)} title="Selesaikan" className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition"><CheckCircle className="w-4 h-4" /></button>
                                                        <button onClick={() => openEditModal(item)} title="Edit" className="p-1.5 rounded-md text-yellow-600 hover:bg-yellow-50 transition"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => { setSelectedPraktikum(item); setShowHapusConfirm(true); }} title="Hapus" className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <BookOpen className="w-12 h-12 text-gray-300" />
                                                <p className="text-sm">{activeTab === 'active' ? 'Tidak ada praktikum berlangsung' : 'Tidak ada riwayat praktikum'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ===== FILTER MODAL ===== */}
                {showFilterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Filter Tanggal Praktikum</h2>
                                <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                                    <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                                    <input type="date" value={filterDateTo} min={filterDateFrom} onChange={e => setFilterDateTo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); setShowFilterModal(false); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Reset</button>
                                    <button onClick={() => setShowFilterModal(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Terapkan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== HAPUS CONFIRM MODAL ===== */}
                {showHapusConfirm && selectedPraktikum && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Hapus Praktikum</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-6">Apakah Anda yakin ingin menghapus praktikum <span className="font-semibold">&ldquo;{selectedPraktikum.judul}&rdquo;</span>?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowHapusConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">Batal</button>
                                <button onClick={handleHapus} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">Ya, Hapus</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== DETAIL MODAL ===== */}
                {showDetailModal && selectedPraktikum && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Detail Praktikum</h2>
                                    <span className={`inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedPraktikum.status)}`}>{selectedPraktikum.status}</span>
                                </div>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedPraktikum.judul}</h3>
                                    <p className="text-sm text-gray-600 mt-2">{selectedPraktikum.deskripsi}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatTanggal(selectedPraktikum.tanggal)}
                                        {selectedPraktikum.tanggalSelesai && <span className="ml-3 text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />Selesai: {formatTanggal(selectedPraktikum.tanggalSelesai)}</span>}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><User className="w-4 h-4" />Penanggung Jawab</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div><label className="text-xs text-gray-500">Nama</label><p className="text-sm font-medium text-gray-900">{selectedPraktikum.penanggungjawab.name}</p></div>
                                        <div><label className="text-xs text-gray-500">NIK/NIM</label><p className="text-sm text-gray-900">{selectedPraktikum.penanggungjawab.nik}</p></div>
                                        <div><label className="text-xs text-gray-500">Status</label><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(selectedPraktikum.penanggungjawab.status)}`}>{selectedPraktikum.penanggungjawab.status}</span></div>
                                        <div><label className="text-xs text-gray-500">Institusi</label><p className="text-sm text-gray-900">{selectedPraktikum.penanggungjawab.institusi}</p></div>
                                        <div><label className="text-xs text-gray-500">No. HP</label><p className="text-sm text-gray-900 flex items-center gap-1"><Phone className="w-3 h-3" />{selectedPraktikum.penanggungjawab.phone}</p></div>
                                        <div><label className="text-xs text-gray-500">Email</label><p className="text-sm text-gray-900 flex items-center gap-1"><Mail className="w-3 h-3" />{selectedPraktikum.penanggungjawab.email}</p></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Wrench className="w-4 h-4" />Alat yang Digunakan</h4>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Alat</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Digunakan</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dikembalikan</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Rusak</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedPraktikum.alat.map((a, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-2"><div className="text-sm font-medium text-gray-900">{a.namaAlat}</div><div className="text-xs text-gray-500">{a.spesifikasi}</div></td>
                                                        <td className="px-4 py-2 text-sm">{a.jumlahDigunakan} unit</td>
                                                        <td className="px-4 py-2 text-sm text-green-700 font-medium">{a.jumlahDikembalikan} unit</td>
                                                        <td className="px-4 py-2 text-sm">{a.jumlahRusak > 0 ? <span className="text-red-600 font-medium">{a.jumlahRusak} unit</span> : <span className="text-gray-400">-</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-4 h-4" />Bahan yang Digunakan</h4>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Bahan</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dipinjam</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Dikembalikan</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Terpakai</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedPraktikum.bahan.map((b, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-2"><div className="text-sm font-medium text-gray-900">{b.namaBahan}</div><div className="text-xs text-gray-500 font-mono">{b.rumusKimia}</div></td>
                                                        <td className="px-4 py-2 text-sm">{b.jumlahDipinjam} {b.satuan}</td>
                                                        <td className="px-4 py-2 text-sm text-green-700 font-medium">{b.jumlahDikembalikan} {b.satuan}</td>
                                                        <td className="px-4 py-2 text-sm text-orange-600 font-medium">{b.jumlahDipinjam - b.jumlahDikembalikan} {b.satuan}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {selectedPraktikum.alatRusakList?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-600" />Laporan Alat Rusak</h4>
                                        <div className="space-y-3">
                                            {selectedPraktikum.alatRusakList.map((r, idx) => (
                                                <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-orange-900">{r.namaAlat} ({r.spesifikasi})</p>
                                                            <p className="text-xs text-orange-700 mt-0.5">{r.jumlahRusak} unit — {r.deskripsiKerusakan}</p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${r.statusPenggantian === 'Sudah Diganti' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.statusPenggantian}</span>
                                                    </div>
                                                    <div className="border-t border-orange-200 pt-3">
                                                        <p className="text-xs font-medium text-orange-800 mb-2">Data Pengguna</p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                                            <div><span className="text-xs text-orange-600">Nama</span><p className="text-xs font-medium text-orange-900">{r.userName}</p></div>
                                                            <div><span className="text-xs text-orange-600">NIK/NIM</span><p className="text-xs text-orange-900">{r.userNIK || '-'}</p></div>
                                                            <div><span className="text-xs text-orange-600">Status</span><p className="mt-0.5"><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(r.userStatus)}`}>{r.userStatus || '-'}</span></p></div>
                                                            <div><span className="text-xs text-orange-600">Institusi</span><p className="text-xs text-orange-900">{r.userInstitusi || '-'}</p></div>
                                                            {r.userFakultas && <div><span className="text-xs text-orange-600">Fakultas</span><p className="text-xs text-orange-900">{r.userFakultas}</p></div>}
                                                            {r.userJurusan && <div><span className="text-xs text-orange-600">Jurusan</span><p className="text-xs text-orange-900">{r.userJurusan}</p></div>}
                                                            <div><span className="text-xs text-orange-600">No. HP</span><p className="text-xs text-orange-900 flex items-center gap-1"><Phone className="w-3 h-3" />{r.userPhone || '-'}</p></div>
                                                            <div><span className="text-xs text-orange-600">Email</span><p className="text-xs text-orange-900 flex items-center gap-1"><Mail className="w-3 h-3" />{r.userEmail || '-'}</p></div>
                                                        </div>
                                                        <div className="mt-2 pt-2 border-t border-orange-200 flex items-center gap-2">
                                                            <span className="text-xs text-orange-600">Penggantian:</span>
                                                            <span className="text-xs font-medium text-orange-900 capitalize">{r.bentukPenggantian}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200">
                                    <button onClick={() => setShowDetailModal(false)} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">Tutup</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== TAMBAH / EDIT MODAL ===== */}
                {(showTambahModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">{showEditModal ? 'Edit Praktikum' : 'Tambah Praktikum Baru'}</h2>
                                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleSubmitPraktikum} className="p-6 space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2"><ClipboardList className="w-5 h-5" />Informasi Praktikum</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Praktikum / Riset <span className="text-red-600">*</span></label>
                                        <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} placeholder="Contoh: Praktikum Titrasi Asam Basa" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Praktikum <span className="text-red-600">*</span></label>
                                        <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                        {formData.tanggal && <p className="mt-1 text-xs text-gray-500">{formatTanggal(formData.tanggal)}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-gray-400 text-xs">(Opsional)</span></label>
                                        <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows="3" placeholder="Deskripsi kegiatan praktikum..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><User className="w-5 h-5" />Penanggung Jawab</h3>
                                    {!showNewPJForm ? (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">Pilih Penanggung Jawab <span className="text-red-600">*</span></label>
                                            {formData.pjId ? (
                                                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{formData.pjName}</div>
                                                        <div className="text-sm text-gray-600 mt-0.5">
                                                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mr-2 ${getStatusBadgeColor(formData.pjStatus)}`}>{formData.pjStatus}</span>
                                                            {formData.pjNIK}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{formData.pjInstitusi}</div>
                                                    </div>
                                                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setFormData(prev => ({ ...prev, pjId: null, pjName: '', pjNIK: '', pjInstitusi: '' }))} />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <button type="button" onClick={() => setShowPJDropdown(!showPJDropdown)} className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
                                                        <span className="text-sm text-gray-700">Pilih dari Master Penanggung Jawab</span>
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    {showPJDropdown && (
                                                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                            <div className="p-2 border-b border-gray-200">
                                                                <input type="text" placeholder="Cari nama atau NIK/NIM..." value={penanggungjawabSearch} onChange={e => setPenanggungjawabSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                                            </div>
                                                            <div className="max-h-60 overflow-y-auto">
                                                                {filteredPJ.length > 0 ? filteredPJ.map(pj => (
                                                                    <button key={pj.id} type="button" onClick={() => selectPJ(pj)} className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                                                        <div className="font-medium text-gray-900">{pj.name}</div>
                                                                        <div className="text-sm text-gray-600 mt-0.5">
                                                                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mr-2 ${getStatusBadgeColor(pj.status)}`}>{pj.status}</span>
                                                                            {pj.nik}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">{pj.institusi}</div>
                                                                    </button>
                                                                )) : <div className="px-4 py-3 text-sm text-gray-500 text-center">Tidak ditemukan</div>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <button type="button" onClick={() => setShowNewPJForm(true)} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"><Plus className="w-4 h-4" />Input Manual (Penanggung Jawab Baru)</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Data Penanggung Jawab Baru</span>
                                                <button type="button" onClick={() => setShowNewPJForm(false)} className="text-sm text-red-600 hover:text-red-700 font-medium">&larr; Kembali ke Master</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-600">*</span></label><input type="text" name="newPJName" value={formData.newPJName} onChange={handleInputChange} placeholder="Nama lengkap" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">NIK/NIM <span className="text-red-600">*</span></label><input type="text" name="newPJNIK" value={formData.newPJNIK} onChange={handleInputChange} placeholder="NIK/NIM" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Status <span className="text-red-600">*</span></label><select name="newPJStatus" value={formData.newPJStatus} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Institusi <span className="text-red-600">*</span></label><input type="text" name="newPJInstitusi" value={formData.newPJInstitusi} onChange={handleInputChange} placeholder="Nama institusi" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">No. HP <span className="text-red-600">*</span></label><input type="tel" name="newPJPhone" value={formData.newPJPhone} onChange={handleInputChange} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-red-600">*</span></label><input type="email" name="newPJEmail" value={formData.newPJEmail} onChange={handleInputChange} placeholder="email@example.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><p className="text-xs text-blue-800">Data baru akan otomatis tersimpan ke master penanggung jawab</p></div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Wrench className="w-5 h-5" />Alat yang Digunakan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                        <div className="md:col-span-2 relative">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="text" placeholder="Cari nama alat atau spesifikasi..."
                                                    value={currentAlat.alatId ? alatList.find(a => a.id === parseInt(currentAlat.alatId))?.namaAlat || alatSearch : alatSearch}
                                                    onChange={e => { setAlatSearch(e.target.value); setCurrentAlat(prev => ({ ...prev, alatId: '' })); setShowAlatDropdown(true); }}
                                                    onFocus={() => setShowAlatDropdown(true)}
                                                    className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                                {(alatSearch || currentAlat.alatId) && <button type="button" onClick={() => { setAlatSearch(''); setCurrentAlat({ alatId: '', jumlah: '' }); setShowAlatDropdown(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                                            </div>
                                            {currentAlat.alatId && (
                                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs">
                                                    <span className="font-medium text-green-900">{alatList.find(a => a.id === parseInt(currentAlat.alatId))?.namaAlat}</span>
                                                    <span className="text-green-700 ml-2">{alatList.find(a => a.id === parseInt(currentAlat.alatId))?.spesifikasi}</span>
                                                    <span className="text-green-600 ml-2">• Stok: {alatList.find(a => a.id === parseInt(currentAlat.alatId))?.jumlah} unit</span>
                                                </div>
                                            )}
                                            {showAlatDropdown && !currentAlat.alatId && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-auto">
                                                    <div className="sticky top-0 bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex justify-between items-center">
                                                        <span className="text-xs text-gray-500">{filteredAlatDropdown.length} alat</span>
                                                        <button type="button" onClick={() => setShowAlatDropdown(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                                                    </div>
                                                    {filteredAlatDropdown.length > 0 ? filteredAlatDropdown.map(a => (
                                                        <button key={a.id} type="button" onClick={() => { setCurrentAlat(prev => ({ ...prev, alatId: a.id.toString() })); setShowAlatDropdown(false); setAlatSearch(''); }} className="w-full px-4 py-2.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 text-sm">
                                                            <span className="font-medium">{a.namaAlat}</span> <span className="text-gray-500">{a.spesifikasi}</span>
                                                            <span className="ml-2 text-xs text-green-600 font-medium">Stok: {a.jumlah}</span>
                                                        </button>
                                                    )) : <div className="px-4 py-6 text-center text-sm text-gray-500">Tidak ditemukan</div>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 h-10">
                                            <input type="number" value={currentAlat.jumlah} onChange={e => setCurrentAlat(prev => ({ ...prev, jumlah: e.target.value }))} placeholder="Jumlah" min="1" disabled={!currentAlat.alatId} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100" />
                                            <button type="button" onClick={addAlatToForm} disabled={!currentAlat.alatId || !currentAlat.jumlah} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300"><Plus className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    {formData.alat.length > 0 ? (
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Alat</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Jumlah</th><th className="px-4 py-2"></th></tr></thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {formData.alat.map((a, idx) => (
                                                        <tr key={idx}><td className="px-4 py-2 text-sm">{a.namaAlat} <span className="text-gray-500">{a.spesifikasi}</span></td><td className="px-4 py-2 text-sm">{a.jumlahDigunakan} unit</td><td className="px-4 py-2"><button type="button" onClick={() => setFormData(prev => ({ ...prev, alat: prev.alat.filter((_, i) => i !== idx) }))} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <div className="text-center py-6 bg-white rounded-lg border border-gray-200 text-sm text-gray-500">Belum ada alat yang ditambahkan</div>}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-5 h-5" />Bahan yang Digunakan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                        <div className="md:col-span-2 relative">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="text" placeholder="Cari nama bahan atau rumus kimia..."
                                                    value={currentBahan.bahanId ? bahanList.find(b => b.id === parseInt(currentBahan.bahanId))?.namaBahan || bahanSearch : bahanSearch}
                                                    onChange={e => { setBahanSearch(e.target.value); setCurrentBahan(prev => ({ ...prev, bahanId: '' })); setShowBahanDropdown(true); }}
                                                    onFocus={() => setShowBahanDropdown(true)}
                                                    className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                                {(bahanSearch || currentBahan.bahanId) && <button type="button" onClick={() => { setBahanSearch(''); setCurrentBahan({ bahanId: '', jumlah: '' }); setShowBahanDropdown(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                                            </div>
                                            {currentBahan.bahanId && (
                                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs">
                                                    <span className="font-medium text-green-900">{bahanList.find(b => b.id === parseInt(currentBahan.bahanId))?.namaBahan}</span>
                                                    <span className="text-green-700 font-mono ml-2">{bahanList.find(b => b.id === parseInt(currentBahan.bahanId))?.rumusKimia}</span>
                                                    <span className="text-green-600 ml-2">• Stok: {bahanList.find(b => b.id === parseInt(currentBahan.bahanId))?.jumlah} {bahanList.find(b => b.id === parseInt(currentBahan.bahanId))?.satuan}</span>
                                                </div>
                                            )}
                                            {showBahanDropdown && !currentBahan.bahanId && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-auto">
                                                    <div className="sticky top-0 bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex justify-between items-center">
                                                        <span className="text-xs text-gray-500">{filteredBahanDropdown.length} bahan</span>
                                                        <button type="button" onClick={() => setShowBahanDropdown(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                                                    </div>
                                                    {filteredBahanDropdown.length > 0 ? filteredBahanDropdown.map(b => (
                                                        <button key={b.id} type="button" onClick={() => { setCurrentBahan(prev => ({ ...prev, bahanId: b.id.toString() })); setShowBahanDropdown(false); setBahanSearch(''); }} className="w-full px-4 py-2.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 text-sm">
                                                            <span className="font-medium">{b.namaBahan}</span> <span className="text-gray-500 font-mono text-xs">{b.rumusKimia}</span>
                                                            <span className="ml-2 text-xs text-green-600 font-medium">Stok: {b.jumlah} {b.satuan}</span>
                                                        </button>
                                                    )) : <div className="px-4 py-6 text-center text-sm text-gray-500">Tidak ditemukan</div>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 h-10">
                                            <input type="number" value={currentBahan.jumlah} onChange={e => setCurrentBahan(prev => ({ ...prev, jumlah: e.target.value }))} placeholder="Jumlah" min="1" disabled={!currentBahan.bahanId} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100" />
                                            <button type="button" onClick={addBahanToForm} disabled={!currentBahan.bahanId || !currentBahan.jumlah} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300"><Plus className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    {formData.bahan.length > 0 ? (
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Bahan</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Jumlah Dipinjam</th><th className="px-4 py-2"></th></tr></thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {formData.bahan.map((b, idx) => (
                                                        <tr key={idx}><td className="px-4 py-2 text-sm">{b.namaBahan} <span className="text-gray-500 font-mono text-xs">{b.rumusKimia}</span></td><td className="px-4 py-2 text-sm">{b.jumlahDipinjam} {b.satuan}</td><td className="px-4 py-2"><button type="button" onClick={() => setFormData(prev => ({ ...prev, bahan: prev.bahan.filter((_, i) => i !== idx) }))} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <div className="text-center py-6 bg-white rounded-lg border border-gray-200 text-sm text-gray-500">Belum ada bahan yang ditambahkan</div>}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">{showEditModal ? 'Simpan Perubahan' : 'Tambah Praktikum'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ===== SELESAIKAN MODAL ===== */}
                {showSelesaikanModal && selectedPraktikum && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Selesaikan Praktikum</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedPraktikum.judul}</p>
                                </div>
                                <button onClick={() => setShowSelesaikanModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleSelesaikanSubmit} className="p-6">
                                <div className="bg-gray-50 rounded-lg p-4 mb-5 flex flex-wrap gap-4 text-xs">
                                    <div><span className="text-gray-500">Tanggal</span><p className="font-medium text-gray-900 mt-0.5">{formatTanggal(selectedPraktikum.tanggal)}</p></div>
                                    <div><span className="text-gray-500">Penanggung Jawab</span><p className="font-medium text-gray-900 mt-0.5">{selectedPraktikum.penanggungjawab.name}</p></div>
                                </div>

                                {selesaikanData.alat.some(a => (a.jumlahRusak || 0) > 0 && !a.rusakSudahDiisi) && (
                                    <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-700 font-medium">Terdapat alat rusak yang belum diisi data kerusakannya. Harap lengkapi sebelum konfirmasi selesai.</p>
                                    </div>
                                )}

                                <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-5">
                                    <button type="button" onClick={() => setSelesaikanActiveTab('alat')} className={`flex-1 py-2.5 text-sm font-medium transition flex items-center justify-center gap-2 ${selesaikanActiveTab === 'alat' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Wrench className="w-4 h-4" /> Alat ({selectedPraktikum.alat.length})
                                    </button>
                                    <button type="button" onClick={() => setSelesaikanActiveTab('bahan')} className={`flex-1 py-2.5 text-sm font-medium transition flex items-center justify-center gap-2 ${selesaikanActiveTab === 'bahan' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <Package className="w-4 h-4" /> Bahan ({selectedPraktikum.bahan.length})
                                    </button>
                                </div>

                                {selesaikanActiveTab === 'alat' && (
                                    <div className="space-y-4">
                                        {selesaikanData.alat.map((item, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{item.namaAlat}</p>
                                                        <p className="text-xs text-gray-500">{item.spesifikasi}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">Digunakan</p>
                                                        <p className="text-sm font-bold text-gray-900">{item.jumlahDigunakan} unit</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                            Jumlah Dikembalikan (Kondisi Baik)
                                                            <span className="text-gray-400 ml-1">(maks. {Math.max(0, item.jumlahDigunakan - (item.jumlahRusak || 0))} unit)</span>
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                value={item.jumlahDikembalikan || 0}
                                                                onChange={e => {
                                                                    const updated = [...selesaikanData.alat];
                                                                    const max = item.jumlahDigunakan - (item.jumlahRusak || 0);
                                                                    updated[index].jumlahDikembalikan = Math.max(0, Math.min(parseInt(e.target.value) || 0, max));
                                                                    setSelesaikanData(prev => ({ ...prev, alat: updated }));
                                                                }}
                                                                min="0"
                                                                max={Math.max(0, item.jumlahDigunakan - (item.jumlahRusak || 0))}
                                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                            <span className="text-xs text-gray-600">unit</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-red-700 mb-1.5">
                                                            Jumlah Rusak
                                                            <span className="text-gray-400 ml-1">(0 jika tidak ada)</span>
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                value={item.jumlahRusak || 0}
                                                                onChange={e => {
                                                                    const updated = [...selesaikanData.alat];
                                                                    const newRusak = Math.max(0, Math.min(parseInt(e.target.value) || 0, item.jumlahDigunakan - (item.jumlahDikembalikan || 0)));
                                                                    updated[index].jumlahRusak = newRusak;
                                                                    updated[index].rusakSudahDiisi = false;
                                                                    setSelesaikanData(prev => ({ ...prev, alat: updated }));
                                                                }}
                                                                min="0"
                                                                max={item.jumlahDigunakan - (item.jumlahDikembalikan || 0)}
                                                                className="w-24 px-3 py-2 border border-red-300 bg-red-50 rounded-lg text-sm text-center font-semibold text-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                            />
                                                            <span className="text-xs text-gray-600">unit</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(item.jumlahRusak || 0) > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openAlatRusakModal(item)}
                                                        className={`mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition ${item.rusakSudahDiisi ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' : 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100'}`}
                                                    >
                                                        {item.rusakSudahDiisi ? (
                                                            <><CheckCircle className="w-4 h-4" />Data Kerusakan Sudah Diisi (Edit)</>
                                                        ) : (
                                                            <><AlertTriangle className="w-4 h-4" />Wajib: Isi Data Kerusakan ({item.jumlahRusak} unit)</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {selectedPraktikum.alat.length === 0 && <p className="text-center text-sm text-gray-500 py-6">Tidak ada alat pada praktikum ini</p>}
                                    </div>
                                )}

                                {selesaikanActiveTab === 'bahan' && (
                                    <div className="space-y-4">
                                        {selesaikanData.bahan.map((item, index) => {
                                            const terpakai = item.jumlahDipinjam - (item.jumlahDikembalikan || 0);
                                            return (
                                                <div key={index} className="border border-gray-200 rounded-xl p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">{item.namaBahan}</p>
                                                            <p className="text-xs text-gray-500 font-mono">{item.rumusKimia}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">Dipinjam</p>
                                                            <p className="text-sm font-bold text-gray-900">{item.jumlahDipinjam} {item.satuan}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mb-4 text-center text-xs">
                                                        <div className="bg-orange-50 rounded-lg p-2">
                                                            <p className="text-orange-500">Terpakai (Sisa)</p>
                                                            <p className="font-semibold text-orange-700 mt-0.5">{terpakai >= 0 ? terpakai : 0} {item.satuan}</p>
                                                        </div>
                                                        <div className="bg-blue-50 rounded-lg p-2">
                                                            <p className="text-blue-500">Dikembalikan</p>
                                                            <p className="font-semibold text-blue-700 mt-0.5">{item.jumlahDikembalikan || 0} {item.satuan}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                                            Jumlah Dikembalikan
                                                            <span className="text-gray-400 ml-1">(maks. {item.jumlahDipinjam} {item.satuan})</span>
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                value={item.jumlahDikembalikan || 0}
                                                                onChange={e => {
                                                                    const updated = [...selesaikanData.bahan];
                                                                    updated[index].jumlahDikembalikan = Math.max(0, Math.min(parseInt(e.target.value) || 0, item.jumlahDipinjam));
                                                                    setSelesaikanData(prev => ({ ...prev, bahan: updated }));
                                                                }}
                                                                min="0"
                                                                max={item.jumlahDipinjam}
                                                                className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                            />
                                                            <span className="text-xs text-gray-600">{item.satuan}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {selectedPraktikum.bahan.length === 0 && <p className="text-center text-sm text-gray-500 py-6">Tidak ada bahan pada praktikum ini</p>}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                                    <button type="button" onClick={() => setShowSelesaikanModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">Batal</button>
                                    <button
                                        type="submit"
                                        disabled={!allRusakFilled()}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle className="w-4 h-4" />Konfirmasi Selesai
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ===== ALAT RUSAK MODAL ===== */}
                {showAlatRusakModal && selectedAlatRusak && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Data Alat Rusak</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedAlatRusak.namaAlat} — {selectedAlatRusak.spesifikasi}</p>
                                </div>
                                <button onClick={() => setShowAlatRusakModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleAlatRusakSubmit} className="p-6 space-y-5">
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-orange-700">
                                        Jumlah rusak: <span className="font-bold">{selesaikanData.alat.find(a => a.alatId === selectedAlatRusak.alatId)?.jumlahRusak || 0} unit</span>
                                    </p>
                                </div>

                                {/* User yang merusak */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pengguna yang Merusak <span className="text-red-600">*</span></label>
                                    {!showNewRusakUserForm ? (
                                        <div className="space-y-2">
                                            {rusakFormData.userId ? (
                                                <div className="px-4 py-3 border border-gray-300 rounded-lg bg-white">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 text-sm mb-2">{rusakFormData.userName}</div>
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                                <div>
                                                                    <span className="text-xs text-gray-500">NIK/NIM</span>
                                                                    <p className="text-xs text-gray-700">{rusakFormData.userNIK}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500">Status</span>
                                                                    <p className="mt-0.5"><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusBadgeColor(rusakFormData.userStatus)}`}>{rusakFormData.userStatus}</span></p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500">Institusi</span>
                                                                    <p className="text-xs text-gray-700">{rusakFormData.userInstitusi}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500">Fakultas</span>
                                                                    <p className="text-xs text-gray-700">{rusakFormData.userFakultas || '-'}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500">Jurusan</span>
                                                                    <p className="text-xs text-gray-700">{rusakFormData.userJurusan || '-'}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500">No. HP</span>
                                                                    <p className="text-xs text-gray-700 flex items-center gap-1"><Phone className="w-3 h-3" />{rusakFormData.userPhone}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="text-xs text-gray-500">Email</span>
                                                                    <p className="text-xs text-gray-700 flex items-center gap-1"><Mail className="w-3 h-3" />{rusakFormData.userEmail}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <X className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2" onClick={() => setRugakFormData(prev => ({ ...prev, userId: null, userName: '', userNIK: '', userStatus: 'Mahasiswa', userInstitusi: '', userFakultas: '', userJurusan: '', userPhone: '', userEmail: '' }))} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <button type="button" onClick={() => setShowRusakUserDropdown(!showRusakUserDropdown)} className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left text-sm">
                                                        <span className="text-gray-700">Pilih dari Master Pengguna</span>
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    {showRusakUserDropdown && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                            <div className="p-2 border-b border-gray-200">
                                                                <input type="text" placeholder="Cari nama atau NIK/NIM..." value={rusakUserSearch} onChange={e => setRugakUserSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                                                            </div>
                                                            <div className="max-h-48 overflow-y-auto">
                                                                {filteredRusakUser.map(u => (
                                                                    <button key={u.id} type="button" onClick={() => { setRugakFormData(prev => ({ ...prev, userId: u.id, userName: u.name, userNIK: u.nik, userStatus: u.status, userInstitusi: u.institusi, userFakultas: u.fakultas, userJurusan: u.jurusan, userPhone: u.phone, userEmail: u.email })); setShowRusakUserDropdown(false); setRugakUserSearch(''); }} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                                                        <div className="font-medium text-gray-900 text-sm">{u.name}</div>
                                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mr-2 ${getStatusBadgeColor(u.status)}`}>{u.status}</span>
                                                                            {u.nik} • {u.institusi}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <button type="button" onClick={() => setShowNewRusakUserForm(true)} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"><Plus className="w-4 h-4" />Input Manual (Pengguna Baru)</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-gray-700">Data Pengguna Baru</span>
                                                <button type="button" onClick={() => setShowNewRusakUserForm(false)} className="text-xs text-red-600 hover:text-red-700">&larr; Kembali</button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-600">*</span></label><input type="text" value={rusakFormData.newUserName} onChange={e => setRugakFormData(prev => ({ ...prev, newUserName: e.target.value }))} placeholder="Nama lengkap" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">NIK/NIM <span className="text-red-600">*</span></label><input type="text" value={rusakFormData.newUserNIK} onChange={e => setRugakFormData(prev => ({ ...prev, newUserNIK: e.target.value }))} placeholder="NIK/NIM" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={rusakFormData.newUserStatus} onChange={e => setRugakFormData(prev => ({ ...prev, newUserStatus: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Institusi <span className="text-red-600">*</span></label><input type="text" value={rusakFormData.newUserInstitusi} onChange={e => setRugakFormData(prev => ({ ...prev, newUserInstitusi: e.target.value }))} placeholder="Institusi" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Fakultas</label><input type="text" value={rusakFormData.newUserFakultas} onChange={e => setRugakFormData(prev => ({ ...prev, newUserFakultas: e.target.value }))} placeholder="Fakultas" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Jurusan</label><input type="text" value={rusakFormData.newUserJurusan} onChange={e => setRugakFormData(prev => ({ ...prev, newUserJurusan: e.target.value }))} placeholder="Jurusan" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">No. HP <span className="text-red-600">*</span></label><input type="tel" value={rusakFormData.newUserPhone} onChange={e => setRugakFormData(prev => ({ ...prev, newUserPhone: e.target.value }))} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                                <div><label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-red-600">*</span></label><input type="email" value={rusakFormData.newUserEmail} onChange={e => setRugakFormData(prev => ({ ...prev, newUserEmail: e.target.value }))} placeholder="email@example.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required /></div>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><p className="text-xs text-blue-800">Data baru akan otomatis tersimpan ke master pengguna</p></div>
                                        </div>
                                    )}
                                </div>

                                {/* Bentuk penggantian */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bentuk Penggantian <span className="text-red-600">*</span></label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setRugakFormData(prev => ({ ...prev, bentukPenggantian: 'barang' }))} className={`py-3 border rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${rusakFormData.bentukPenggantian === 'barang' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                            <ShoppingBag className="w-4 h-4" /> Barang
                                        </button>
                                        <button type="button" onClick={() => setRugakFormData(prev => ({ ...prev, bentukPenggantian: 'uang' }))} className={`py-3 border rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${rusakFormData.bentukPenggantian === 'uang' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                            <Banknote className="w-4 h-4" /> Uang
                                        </button>
                                    </div>
                                </div>

                                {/* Jumlah */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{rusakFormData.bentukPenggantian === 'uang' ? 'Jumlah (Rp)' : 'Jumlah Unit'} <span className="text-red-600">*</span></label>
                                    <input type="number" value={rusakFormData.jumlah} onChange={e => setRugakFormData(prev => ({ ...prev, jumlah: e.target.value }))} placeholder={rusakFormData.bentukPenggantian === 'uang' ? 'Contoh: 50000' : 'Jumlah unit'} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                                </div>

                                {/* Deskripsi kerusakan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kerusakan <span className="text-red-600">*</span></label>
                                    <textarea value={rusakFormData.deskripsiKerusakan} onChange={e => setRugakFormData(prev => ({ ...prev, deskripsiKerusakan: e.target.value }))} rows="3" placeholder="Contoh: Pecah saat digunakan untuk titrasi, retak pada bagian leher, dll." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none" required />
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button type="button" onClick={() => setShowAlatRusakModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">Batal</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium flex items-center justify-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />Simpan Data Kerusakan
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

export default PraktikumPage;