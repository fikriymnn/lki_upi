"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Search, ClipboardList, X, FlaskConical, DoorOpen, Package, Wrench,
  FileText, Download, Eye, Receipt, CreditCard, Plus, Trash2,
  Check, Pencil, Save, ChevronDown, Loader2
} from 'lucide-react';
import InvoiceTemplate from '../../../../../components/affiliate/InvoiceTemplate';

// ── Status flow (harus sama persis dengan enum status_pengujian di backend) ──
const STATUS_OPTIONS = [
  'Menunggu Order Dikonfirmasi',
  'Order Dikonfirmasi',
  'Order Ditolak',
  'Order Diproses',
  'Menunggu Diverifikasi',
  'Selesai Diverifikasi',
  'Menunggu Pembayaran',
  'Menunggu Verifikasi Pembayaran',
  'Selesai',
];

const STATUS_CLASS = {
  'Menunggu Order Dikonfirmasi': 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  'Order Dikonfirmasi': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'Order Ditolak': 'bg-red-50 text-red-700 ring-1 ring-red-200',
  'Order Diproses': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  'Menunggu Diverifikasi': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  'Selesai Diverifikasi': 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
  'Menunggu Pembayaran': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  'Menunggu Verifikasi Pembayaran': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'Selesai': 'bg-green-50 text-green-700 ring-1 ring-green-200',
};

const ADMIN_ACTIONABLE_STATUS = ['Selesai Diverifikasi', 'Menunggu Verifikasi Pembayaran'];

const convertRupiah = (angka = 0) => {
  const parts = angka?.toString().split('').reverse().join('').match(/\d{1,3}/g);
  return parts?.join('.').split('').reverse().join('') ?? '0';
};

const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

const MASTER_JENIS_LAYANAN_ANALISIS = [
  'Preparasi Sampel',
  'Uji Stabilitas',
  'Spektrofotometer UV VIS',
  'Autoklaf',
  'FTIR',
  'pH',
  'TPC (Total Plate Count)',
  'Uji Fitokimia (Flavonoid)',
];

let rowSeq = 0;
const newRowId = () => `row_${Date.now()}_${rowSeq++}`;

const buildInvoiceRows = (order) => {
  const rows = [];

  (order.layanan_analisis || []).forEach((item) => {
    const jenisList = item.jenis_layanan?.length ? item.jenis_layanan : ['Layanan Analisis'];
    jenisList.forEach((jenis) => {
      rows.push({
        id: newRowId(),
        tanggal: order.date,
        deskripsi: jenis,
        keterangan: item.nama_sample || '',
        jumlah: Number(item.jumlah_sample) || 1,
        satuan: 'sampel',
        harga_satuan: 0,
        total: 0,
      });
    });
  });

  (order.sewa_lab || []).forEach((item) => {
    rows.push({
      id: newRowId(),
      tanggal: item.tanggal_mulai || order.date,
      deskripsi: `Sewa Lab (${item.jenis_sewa || '-'})`,
      keterangan: item.keterangan || '',
      jumlah: Number(item.jumlah) || 1,
      satuan: item.jenis_sewa === 'Harian' ? 'hari' : 'OH',
      harga_satuan: 0,
      total: 0,
    });
  });

  (order.sewa_alat || []).forEach((item) => {
    rows.push({
      id: newRowId(),
      tanggal: item.tanggal_mulai || order.date,
      deskripsi: item.nama_alat || 'Sewa Alat',
      keterangan: item.keterangan || '',
      jumlah: Number(item.jumlah) || 1,
      satuan: (item.jenis_sewa || '').toLowerCase() || 'unit',
      harga_satuan: 0,
      total: 0,
    });
  });

  (order.pembelian_bahan || []).forEach((item) => {
    rows.push({
      id: newRowId(),
      tanggal: order.date,
      deskripsi: item.jenis_bahan || 'Bahan',
      keterangan: item.keterangan || '',
      jumlah: 1,
      satuan: item.satuan || '-',
      harga_satuan: 0,
      total: 0,
    });
  });

  return rows;
};

const FIELD_CONFIG = {
  layanan_analisis: {
    title: 'Layanan Analisis', icon: FlaskConical, cls: 'text-teal-700 bg-teal-50',
    fields: [
      { key: 'nama_sample', label: 'Nama Sample' },
      { key: 'jenis_layanan', label: 'Jenis Layanan', isArray: true, isMultiSelect: true, options: MASTER_JENIS_LAYANAN_ANALISIS },
      { key: 'pelarut', label: 'Pelarut' },
      { key: 'jumlah_sample', label: 'Jumlah Sample' },
      { key: 'metode_parameter', label: 'Metode / Parameter' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
    fileFields: [
      { key: 'foto_sample', label: 'Foto Sample' },
      { key: 'jurnal_pendukung', label: 'Jurnal Pendukung' },
    ],
  },
  sewa_lab: {
    title: 'Sewa Lab', icon: DoorOpen, cls: 'text-purple-700 bg-purple-50',
    fields: [
      { key: 'jenis_sewa', label: 'Jenis Sewa' },
      { key: 'tanggal_mulai', label: 'Tanggal Mulai', isDate: true },
      { key: 'tanggal_selesai', label: 'Tanggal Selesai', isDate: true },
      { key: 'jumlah', label: 'Jumlah' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
  },
  sewa_alat: {
    title: 'Sewa Alat', icon: Wrench, cls: 'text-blue-700 bg-blue-50',
    fields: [
      { key: 'nama_alat', label: 'Nama Alat' },
      { key: 'jenis_sewa', label: 'Jenis Sewa' },
      { key: 'tanggal_mulai', label: 'Tanggal Mulai', isDate: true },
      { key: 'tanggal_selesai', label: 'Tanggal Selesai', isDate: true },
      { key: 'jumlah', label: 'Jumlah' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
  },
  pembelian_bahan: {
    title: 'Pembelian Bahan', icon: Package, cls: 'text-amber-700 bg-amber-50',
    fields: [
      { key: 'jenis_bahan', label: 'Jenis Bahan' },
      { key: 'satuan', label: 'Satuan' },
      { key: 'keterangan', label: 'Keterangan' },
    ],
  },
};

const APPLICANT_FIELDS = [
  { key: 'nama_lengkap', label: 'Nama Pemohon' },
  { key: 'nama_institusi', label: 'Nama Instansi' },
  { key: 'email', label: 'Email' },
  { key: 'no_whatsapp', label: 'No. WhatsApp' },
  { key: 'no_telp', label: 'No. Telepon' },
  { key: 'jenis_institusi', label: 'Jenis Institusi', isSelect: true, options: ['Sekolah', 'Perguruan Tinggi', 'Industri', 'Lainnya'] },
  { key: 'nama_pembimbing', label: 'Nama Pembimbing' },
  { key: 'fakultas', label: 'Fakultas', conditional: 'Perguruan Tinggi' },
  { key: 'program_studi', label: 'Program Studi', conditional: 'Perguruan Tinggi' },
];

const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent";

export default function AffiliateOrder({ affiliateId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const [invoiceRows, setInvoiceRows] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState(null);

  const [statusDraft, setStatusDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const fetchList = useCallback(async () => {
    if (!affiliateId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate`, {
        params: { id_affiliate: affiliateId },
        withCredentials: true,
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const filtered = data
    .filter((v) =>
      (v.no_invoice || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.nama_lengkap || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter((v) => (statusFilter ? v.status_pengujian === statusFilter : true));

  // ─────────────────────────── Modal open / close ───────────────────────────
  const openDetail = async (order) => {
    setEditMode(false);
    setEditDraft(null);
    setStatusDraft(order.status_pengujian);
    setShowModal(true);

    // ambil detail lengkap (termasuk populate id_affiliate) untuk kebutuhan invoice PDF
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${order._id}`, { withCredentials: true });
      const full = res.data.success ? res.data.data : order;
      setActiveOrder(full);
      if (full.status_pengujian === 'Selesai Diverifikasi') {
        setInvoiceRows(full.rincian_harga_invoice?.length ? full.rincian_harga_invoice : buildInvoiceRows(full));
      } else {
        setInvoiceRows(null);
      }
    } catch (err) {
      setActiveOrder(order);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveOrder(null);
    setInvoiceRows(null);
    setEditMode(false);
    setEditDraft(null);
    setStatusDraft('');
  };

  // ─────────────────────────── Rincian invoice (tabel) ───────────────────────────
  const updateInvoiceRow = (idx, key, value) => {
    setInvoiceRows((rows) => rows.map((r, i) => {
      if (i !== idx) return r;
      const next = { ...r, [key]: value };
      if (key === 'jumlah' || key === 'harga_satuan') {
        const jumlah = key === 'jumlah' ? Number(value) || 0 : Number(next.jumlah) || 0;
        const harga = key === 'harga_satuan' ? Number(value) || 0 : Number(next.harga_satuan) || 0;
        next.total = jumlah * harga;
      }
      return next;
    }));
  };

  const addInvoiceRow = () => {
    setInvoiceRows((rows) => [...rows, { id: newRowId(), tanggal: activeOrder.date, deskripsi: '', keterangan: '', jumlah: 1, satuan: '', harga_satuan: 0, total: 0 }]);
  };

  const removeInvoiceRow = (idx) => {
    setInvoiceRows((rows) => rows.filter((_, i) => i !== idx));
  };

  // ── Aksi admin: konfirmasi rincian invoice -> status "Menunggu Pembayaran" ──
  const handleKonfirmasiInvoice = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${activeOrder._id}/invoice`,
        { rincian_harga_invoice: invoiceRows },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = { ...res.data.data, id_affiliate: activeOrder.id_affiliate };
        setData((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
        setActiveOrder(updated);
        setStatusDraft(updated.status_pengujian);
        setInvoiceRows(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────── Ubah status manual via dropdown ───────────────────────────
  const saveStatus = async () => {
    if (statusDraft === activeOrder.status_pengujian || saving) return;
    try {
      setSaving(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${activeOrder._id}/status`,
        { status_pengujian: statusDraft },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = { ...res.data.data, id_affiliate: activeOrder.id_affiliate };
        setData((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
        setActiveOrder(updated);
        setStatusDraft(updated.status_pengujian);
        if (updated.status_pengujian === 'Selesai Diverifikasi') {
          setInvoiceRows(updated.rincian_harga_invoice?.length ? updated.rincian_harga_invoice : buildInvoiceRows(updated));
        } else {
          setInvoiceRows(null);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      setStatusDraft(activeOrder.status_pengujian);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────── Edit data order ───────────────────────────
  const startEdit = () => {
    setEditDraft(JSON.parse(JSON.stringify(activeOrder)));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditDraft(null);
  };

  const saveEdit = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const payload = {
        nama_lengkap: editDraft.nama_lengkap,
        email: editDraft.email,
        no_telp: editDraft.no_telp,
        no_whatsapp: editDraft.no_whatsapp,
        jenis_institusi: editDraft.jenis_institusi,
        nama_institusi: editDraft.nama_institusi,
        program_studi: editDraft.program_studi,
        fakultas: editDraft.fakultas,
        nama_pembimbing: editDraft.nama_pembimbing,
        layanan_analisis: editDraft.layanan_analisis,
        sewa_lab: editDraft.sewa_lab,
        sewa_alat: editDraft.sewa_alat,
        pembelian_bahan: editDraft.pembelian_bahan,
      };
      // TODO: kalau ada foto_sample/jurnal_pendukung baru (object URL lokal dari input file),
      // upload dulu file-nya (multipart/form-data), lalu ganti value-nya jadi URL hasil upload backend.
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${editDraft._id}/data`,
        payload,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = { ...res.data.data, id_affiliate: activeOrder.id_affiliate };
        setData((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
        setActiveOrder(updated);
        setEditMode(false);
        setEditDraft(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateEditField = (key, value) => setEditDraft((d) => ({ ...d, [key]: value }));

  const updateEditItem = (jenis, idx, key, value) => setEditDraft((d) => ({
    ...d,
    [jenis]: d[jenis].map((r, i) => (i === idx ? { ...r, [key]: value } : r)),
  }));

  const addEditItem = (jenis) => setEditDraft((d) => ({
    ...d,
    [jenis]: [...(d[jenis] || []), Object.fromEntries(FIELD_CONFIG[jenis].fields.map((f) => [f.key, f.isArray ? [] : '']))],
  }));

  const removeEditItem = (jenis, idx) => setEditDraft((d) => ({
    ...d,
    [jenis]: d[jenis].filter((_, i) => i !== idx),
  }));

  // ─────────────────────────── Download Invoice PDF (generate di FE) ───────────────────────────
  const handleDownloadInvoice = async () => {
    if (downloadingInvoice || !activeOrder?.rincian_harga_invoice?.length) return;
    try {
      setDownloadingInvoice(true);
      const el = document.getElementById('invoice-print-area');
      if (!el) return;

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${activeOrder.no_invoice.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      alert('Gagal membuat PDF invoice: ' + err.message);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const actionLabel = (order) => {
    if (order.status_pengujian === 'Selesai Diverifikasi') return 'Input Invoice';
    if (order.status_pengujian === 'Menunggu Verifikasi Pembayaran') return 'Verifikasi Bayar';
    return 'Detail';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-400" /> Daftar Order
        </p>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
          Mode Admin — kelola invoice, data, dan status order
        </span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari no. invoice atau nama pemohon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-64"
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['No', 'No. Invoice', 'Pemohon', 'Instansi', 'Status', 'Total', 'Aksi'].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${i === 6 ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-4.5"><div className="h-3 w-full bg-gray-100 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? filtered.map((v, i) => {
              const needsAction = ADMIN_ACTIONABLE_STATUS.includes(v.status_pengujian);
              return (
                <tr key={v._id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-4 text-xs text-gray-400 align-middle">{i + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap align-middle">
                    <span className="text-sm font-medium text-gray-900">{v.no_invoice}</span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="text-sm text-gray-700">{v.nama_lengkap}</span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="text-xs text-gray-500">{v.nama_institusi}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap align-middle">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_CLASS[v.status_pengujian] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status_pengujian}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap align-middle">
                    <span className="text-sm font-semibold text-gray-900">Rp {convertRupiah(v.total_keseluruhan)}</span>
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <button
                      onClick={() => openDetail(v)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition shadow-sm ${needsAction ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                      {needsAction ? <CreditCard className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {actionLabel(v)}
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Belum ada order untuk lab affiliate ini</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal Detail Order ── */}
      {showModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
            style={{ scrollbarGutter: 'stable' }}
          >
            {/* Header modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h2 className="text-lg font-semibold text-gray-900">{activeOrder.no_invoice}</h2>

                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className={`text-[11px] font-semibold rounded-full pl-2.5 pr-6 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-red-500 ${STATUS_CLASS[statusDraft] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {statusDraft !== activeOrder.status_pengujian && (
                    <button
                      onClick={saveStatus}
                      disabled={saving}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[11px] font-medium rounded-full transition"
                    >
                      <Save className="w-3 h-3" /> Simpan Status
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">{formatDate(activeOrder.date)}</p>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Toolbar edit data */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Pemohon</p>
                {!editMode ? (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Data
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Batal
                    </button>
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition"
                    >
                      <Save className="w-3.5 h-3.5" /> Simpan Data
                    </button>
                  </div>
                )}
              </div>

              {/* Data pemohon */}
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-100">
                  {APPLICANT_FIELDS
                    .filter((f) => !f.conditional || (editMode ? editDraft : activeOrder).jenis_institusi === f.conditional)
                    .map((f) => (
                      <div key={f.key} className="min-w-0">
                        <p className="text-xs text-gray-400 mb-2">{f.label}</p>
                        {editMode ? (
                          f.isSelect ? (
                            <select
                              value={editDraft[f.key] || ''}
                              onChange={(e) => updateEditField(f.key, e.target.value)}
                              className={inputCls}
                            >
                              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={editDraft[f.key] || ''}
                              onChange={(e) => updateEditField(f.key, e.target.value)}
                              className={inputCls}
                            />
                          )
                        ) : (
                          <p className="text-sm font-medium text-gray-800 break-words">{activeOrder[f.key] || '—'}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* ── Konten utama: edit item / input invoice / lihat item + invoice ── */}
              {editMode ? (
                <>
                  {Object.entries(FIELD_CONFIG).map(([jenis, cfg]) => (
                    <ItemSectionEditable
                      key={jenis}
                      jenis={jenis}
                      config={cfg}
                      items={editDraft[jenis] || []}
                      onUpdate={updateEditItem}
                      onAdd={addEditItem}
                      onRemove={removeEditItem}
                    />
                  ))}
                </>
              ) : activeOrder.status_pengujian === 'Selesai Diverifikasi' && invoiceRows ? (
                <>
                  <div className="border border-cyan-200 bg-cyan-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-cyan-800 mb-1 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5" /> Input Rincian Invoice
                    </p>
                    <p className="text-[11px] text-cyan-700">
                      Baris sudah terisi otomatis dari data order — lengkapi tanggal, deskripsi, keterangan, jumlah, satuan, dan harga satuan tiap baris sesuai kebutuhan. Tambahkan baris baru bila ada biaya tambahan.
                    </p>
                  </div>

                  <InvoiceTable
                    rows={invoiceRows}
                    editable
                    onUpdateRow={updateInvoiceRow}
                    onAddRow={addInvoiceRow}
                    onRemoveRow={removeInvoiceRow}
                  />

                  <div className="flex items-center justify-end gap-2 mb-5">
                    <button
                      onClick={closeModal}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                    >
                      <X className="w-4 h-4" /> Batal
                    </button>
                    <button
                      onClick={handleKonfirmasiInvoice}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                    >
                      <Check className="w-4 h-4" /> Konfirmasi & Kirim Invoice
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {Object.entries(FIELD_CONFIG).map(([jenis, cfg]) => (
                    activeOrder[jenis]?.length > 0 && (
                      <ItemSectionReadOnly key={jenis} config={cfg} items={activeOrder[jenis]} />
                    )
                  ))}
                  {!activeOrder.layanan_analisis?.length && !activeOrder.sewa_lab?.length && !activeOrder.sewa_alat?.length && !activeOrder.pembelian_bahan?.length && (
                    <p className="text-sm text-gray-400 italic mb-4">Tidak ada layanan pada order ini.</p>
                  )}

                  {activeOrder.rincian_harga_invoice?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5 text-gray-400" /> Rincian Invoice
                      </p>
                      <InvoiceTable rows={activeOrder.rincian_harga_invoice} editable={false} />
                    </div>
                  )}
                </>
              )}

              {/* File-file terkait */}
              <div className="border-t border-gray-100 pt-5 mb-5">
                <p className="text-xs font-semibold text-gray-700 mb-3">Dokumen</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FileLink label="Laporan (laboran)" href={activeOrder.laporan} />
                  <FileLink label="Rincian Biaya (laboran)" href={activeOrder.rincian_biaya} />

                  {/* Invoice — di-generate PDF di FE, bukan link file dari server */}
                  {activeOrder.rincian_harga_invoice?.length > 0 ? (
                    <button
                      onClick={handleDownloadInvoice}
                      disabled={downloadingInvoice}
                      className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition disabled:opacity-60"
                    >
                      <span className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">Invoice</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-red-700">
                        {downloadingInvoice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        {downloadingInvoice ? 'Membuat PDF...' : 'Unduh PDF'}
                      </span>
                    </button>
                  ) : (
                    <FileLink label="Invoice" href={null} />
                  )}

                  <FileLink label="Bukti Pembayaran (user)" href={activeOrder.bukti_pembayaran} />
                  <FileLink label="Hasil Analisis (laboran)" href={activeOrder.hasil_analisis} />
                </div>
              </div>

              {!editMode && activeOrder.status_pengujian === 'Menunggu Verifikasi Pembayaran' && (
                <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Verifikasi Pembayaran
                  </p>
                  {activeOrder.bukti_pembayaran ? (
                    <p className="text-[11px] text-amber-700">
                      User sudah upload bukti pembayaran. Periksa file di bagian Dokumen di atas, lalu ubah status menjadi "Selesai" lewat dropdown status di bagian atas jika sudah sesuai — user bisa download hasil analisis serta kuitansi setelah itu.
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-700">Bukti pembayaran belum diupload user.</p>
                  )}
                </div>
              )}

              {!editMode && !ADMIN_ACTIONABLE_STATUS.includes(activeOrder.status_pengujian) && (
                <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">
                    Order ini sedang ditangani oleh {statusOwnerHint(activeOrder.status_pengujian)}. Gunakan dropdown status di bagian atas bila perlu mengubah secara manual.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Template invoice tersembunyi, dipakai html2canvas untuk generate PDF ── */}
          {activeOrder.rincian_harga_invoice?.length > 0 && (
            <div style={{ position: 'fixed', top: 0, left: '-99999px' }}>
              <InvoiceTemplate order={activeOrder} printId="invoice-print-area" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function statusOwnerHint(status) {
  switch (status) {
    case 'Menunggu Order Dikonfirmasi': return 'laboran (menunggu konfirmasi)';
    case 'Order Dikonfirmasi': return 'laboran (bersiap memproses)';
    case 'Order Ditolak': return 'laboran (order ditolak)';
    case 'Order Diproses': return 'laboran (sedang memproses sampel)';
    case 'Menunggu Diverifikasi': return 'ketua lab (menunggu verifikasi)';
    case 'Menunggu Pembayaran': return 'user (menunggu pembayaran)';
    case 'Selesai': return 'tidak ada — order sudah selesai';
    default: return 'pihak terkait';
  }
}

function formatFieldValue(field, item) {
  const raw = item[field.key];
  if (field.isArray) return (raw || []).length > 0 ? raw.join(', ') : '—';
  if (field.isDate) return formatDate(raw);
  if (raw === '' || raw === undefined || raw === null) return '—';
  return raw;
}

function ItemSectionReadOnly({ config, items }) {
  const { title, icon: Icon, cls, fields, fileFields } = config;
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-700 mb-3.5 flex items-center gap-2">
        <span className={`w-6 h-6 rounded-md flex items-center justify-center ${cls}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {items.map((r, idx) => {
          const availableFiles = (fileFields || []).filter((ff) => r[ff.key]);
          return (
            <div key={idx} className="border border-gray-200 rounded-xl bg-gray-50 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                {fields.map((f) => (
                  <div key={f.key} className="min-w-0">
                    <p className="text-[11px] text-gray-400 mb-1">{f.label}</p>
                    <p className="text-xs font-medium text-gray-700 break-words">{formatFieldValue(f, r)}</p>
                  </div>
                ))}
              </div>

              {availableFiles.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-5 pt-4 border-t border-gray-200">
                  {availableFiles.map((ff) => (
                    
                   <a   key={ff.key}
                      href={r[ff.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-red-700 bg-white hover:text-red-800 hover:bg-red-50 border border-red-100 rounded-lg transition"
                    >
                      <Download className="w-3 h-3" /> {ff.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ItemSectionEditable({ jenis, config, items, onUpdate, onAdd, onRemove }) {
  const { title, icon: Icon, cls, fields, fileFields } = config;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-md flex items-center justify-center ${cls}`}>
            <Icon className="w-3.5 h-3.5" />
          </span>
          {title}
        </p>
        <button
          type="button"
          onClick={() => onAdd(jenis)}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Plus className="w-3 h-3" /> Tambah
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-gray-400 italic mb-2.5">Belum ada data {title.toLowerCase()}.</p>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl bg-gray-50 p-4 relative">
            <button
              type="button"
              onClick={() => onRemove(jenis, idx)}
              className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pr-8">
              {fields.map((f) => (
                <div key={f.key} className="min-w-0">
                  <p className="text-[11px] text-gray-400 mb-2">{f.label}</p>
                  {f.isMultiSelect ? (
                    <MultiSelectDropdown
                      value={item[f.key] || []}
                      options={f.options || []}
                      onChange={(next) => onUpdate(jenis, idx, f.key, next)}
                      placeholder="Pilih jenis layanan"
                    />
                  ) : f.isArray ? (
                    <input
                      type="text"
                      value={(item[f.key] || []).join(', ')}
                      onChange={(e) => onUpdate(jenis, idx, f.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                      placeholder="Pisahkan dengan koma"
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : f.isDate ? (
                    <input
                      type="date"
                      value={item[f.key] ? item[f.key].slice(0, 10) : ''}
                      onChange={(e) => onUpdate(jenis, idx, f.key, e.target.value)}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[f.key] ?? ''}
                      onChange={(e) => onUpdate(jenis, idx, f.key, e.target.value)}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  )}
                </div>
              ))}
            </div>

            {fileFields && fileFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pr-8 mt-6 pt-5 border-t border-gray-200">
                {fileFields.map((ff) => (
                  <div key={ff.key} className="min-w-0">
                    <p className="text-[11px] text-gray-400 mb-2">{ff.label}</p>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        // TODO: upload file ke server (multipart/form-data), simpan URL hasil upload backend
                        onUpdate(jenis, idx, ff.key, URL.createObjectURL(file));
                      }}
                      className="w-full text-[11px] text-gray-500 file:mr-2.5 file:py-1.5 file:px-2.5 file:rounded-lg file:border file:border-gray-300 file:text-[11px] file:font-medium file:bg-white file:text-gray-600 hover:file:bg-gray-50 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoiceTable({ rows, editable, onUpdateRow, onAddRow, onRemoveRow }) {
  const total = rows.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const colCount = editable ? 9 : 8;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide w-8">No</th>
              <th className="px-2 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide w-28">Tanggal</th>
              <th className="px-2 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">Deskripsi</th>
              <th className="px-2 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">Keterangan</th>
              <th className="px-2 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wide w-16">Jumlah</th>
              <th className="px-2 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide w-16">Satuan</th>
              <th className="px-2 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wide w-28">Harga Satuan</th>
              <th className="px-3 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wide w-28">Total</th>
              {editable && <th className="px-2 py-2.5 w-9" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <tr key={r.id || r._id || idx}>
                <td className="px-3 py-2 text-gray-400 align-top">{idx + 1}</td>
                <td className="px-2 py-2 align-top">
                  {editable ? (
                    <input
                      type="date"
                      value={r.tanggal ? r.tanggal.slice(0, 10) : ''}
                      onChange={(e) => onUpdateRow(idx, 'tanggal', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <span className="text-gray-700 whitespace-nowrap">{formatDate(r.tanggal)}</span>
                  )}
                </td>
                <td className="px-2 py-2 align-top">
                  {editable ? (
                    <input
                      type="text"
                      value={r.deskripsi}
                      onChange={(e) => onUpdateRow(idx, 'deskripsi', e.target.value)}
                      className="w-full min-w-[140px] px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <span className="text-gray-800 font-medium">{r.deskripsi || '—'}</span>
                  )}
                </td>
                <td className="px-2 py-2 align-top">
                  {editable ? (
                    <input
                      type="text"
                      value={r.keterangan}
                      onChange={(e) => onUpdateRow(idx, 'keterangan', e.target.value)}
                      className="w-full min-w-[120px] px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <span className="text-gray-600">{r.keterangan || '—'}</span>
                  )}
                </td>
                <td className="px-2 py-2 align-top text-right">
                  {editable ? (
                    <input
                      type="number"
                      value={r.jumlah}
                      onChange={(e) => onUpdateRow(idx, 'jumlah', e.target.value)}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-right focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <span className="text-gray-700">{r.jumlah}</span>
                  )}
                </td>
                <td className="px-2 py-2 align-top">
                  {editable ? (
                    <input
                      type="text"
                      value={r.satuan}
                      onChange={(e) => onUpdateRow(idx, 'satuan', e.target.value)}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <span className="text-gray-700">{r.satuan || '—'}</span>
                  )}
                </td>
                <td className="px-2 py-2 align-top text-right">
                  {editable ? (
                    <input
                      type="number"
                      value={r.harga_satuan}
                      onChange={(e) => onUpdateRow(idx, 'harga_satuan', e.target.value)}
                      className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-right focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <span className="text-gray-700">Rp {convertRupiah(r.harga_satuan)}</span>
                  )}
                </td>
                <td className="px-3 py-2 align-top text-right font-semibold text-gray-800 whitespace-nowrap">
                  Rp {convertRupiah(r.total)}
                </td>
                {editable && (
                  <td className="px-2 py-2 align-top">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(idx)}
                      className="flex items-center justify-center w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-gray-400 italic">
                  Belum ada baris invoice.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={7} className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">
                Total Keseluruhan
              </td>
              <td className="px-3 py-2.5 text-right text-sm font-bold text-gray-900 whitespace-nowrap">
                Rp {convertRupiah(total)}
              </td>
              {editable && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
      {editable && (
        <div className="px-3 py-2.5 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Baris
          </button>
        </div>
      )}
    </div>
  );
}

function FileLink({ label, href }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white">
      <span className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {href ? (
        <a href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:text-red-800 hover:bg-red-50 rounded-md transition flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> Lihat
        </a>
      ) : (
        <span className="text-[11px] text-gray-400 flex-shrink-0 px-2.5 py-1.5">Belum ada</span>
      )}
    </div>
  );
}

function MultiSelectDropdown({ value = [], options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  const toggleOption = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 border border-gray-300 rounded-lg text-xs bg-white text-left focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <span className={`truncate ${value.length ? 'text-gray-700' : 'text-gray-400'}`}>
          {value.length ? value.join(', ') : (placeholder || 'Pilih opsi')}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1.5 w-full max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1.5">
            {options.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-400 italic">Belum ada master data.</p>
            ) : (
              options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt)}
                    onChange={() => toggleOption(opt)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                  />
                  {opt}
                </label>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}