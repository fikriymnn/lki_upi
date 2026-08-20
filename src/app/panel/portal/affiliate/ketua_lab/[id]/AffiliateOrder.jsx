"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {
  Search, ClipboardList, ArrowLeft, FlaskConical, DoorOpen, Package, Wrench,
  FileText, FileCheck, Download, Eye, Receipt, ShieldCheck, RotateCcw, User, Loader2,
  Pencil, Save, X, Plus, Trash2, ChevronDown, FileSpreadsheet, UploadCloud
} from 'lucide-react';
import InvoiceTemplate from '../../../../../../components/affiliate/InvoiceTemplate';
import KwitansiTemplate from '../../../../../../components/affiliate/KwitansiTemplate';

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

// ── Ketua Lab hanya bisa bertindak (verifikasi status) saat order "Menunggu Diverifikasi" ──
const KETUA_LAB_ACTIONABLE_STATUS = ['Menunggu Diverifikasi'];

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

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

// ───────────────────────── Kategori file (samakan dgn backend, konsisten di semua role) ─────────────────────────
const FILE_CATEGORY = {
  laporan: 'laporan',
  rincian_biaya: 'rincianbiaya',
  foto_sample: 'fotosample',
  jurnal_pendukung: 'jurnalpendukung',
  hasil_analisis: 'hasilanalisis',
  bukti_pembayaran: 'buktipembayaran',
};

const FILE_BASE_URL = process.env.NEXT_PUBLIC_FILE_URL;

// Kalau value sudah full URL (data lama) dipakai apa adanya,
// kalau cuma nama file dibangun jadi {FILE_URL}/file/{category}/{filename}
const buildFileUrl = (category, value) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${FILE_BASE_URL}/file/${category}/${value}`;
};

// Upload satu file ke API file server → mengembalikan URL siap-pakai untuk href
const uploadFileToServer = async (file, category, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(
    `${FILE_BASE_URL}/api/file?category=${category}`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 10 * 60 * 1000,
      onUploadProgress: (progressEvent) => {
        if (!onProgress) return;
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      },
    }
  );
  const raw = res.data?.data?.filename ?? res.data?.filename ?? res.data?.downloadURL ?? res.data?.data;
  return buildFileUrl(category, raw);
};

const convertRupiah = (angka = 0) => {
  const parts = angka?.toString().split('').reverse().join('').match(/\d{1,3}/g);
  return parts?.join('.').split('').reverse().join('') ?? '0';
};

const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
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

const DETAIL_TABS = [
  { key: 'ringkasan', label: 'Rincian Order', icon: User },
  { key: 'dokumen', label: 'Dokumen', icon: FileText },
];

const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent";

export default function AffiliateOrder({ affiliateId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ── Filter bulan + tahun (client-side, cocok dengan field `year`/`month` di dokumen order) ──
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(''); // 0-indexed (string), sama seperti field `month` di DB

  // ── activeOrder != null → tampilkan halaman detail inline (bukan modal) ──
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [detailLoading, setDetailLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState(null);

  const [saving, setSaving] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [downloadingKwitansi, setDownloadingKwitansi] = useState(false);
  const [kwitansiData, setKwitansiData] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

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

  // ── Opsi tahun diambil dari data yang sudah ter-fetch, terbaru di atas ──
  const uniqueYears = [...new Set(data.map((v) => v.year).filter(Boolean))].sort((a, b) => b.localeCompare(a));

  const filtered = data
    .filter((v) =>
      (v.no_invoice || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.nama_lengkap || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter((v) => (statusFilter ? v.status_pengujian === statusFilter : true))
    .filter((v) => (yearFilter ? v.year === yearFilter : true))
    .filter((v) => (monthFilter !== '' ? v.month === monthFilter : true));

  // ─────────────────────────── Buka / tutup halaman detail ───────────────────────────
  const openDetail = async (order) => {
    setActiveTab('ringkasan');
    setEditMode(false);
    setEditDraft(null);
    // Tampilkan data list dulu (langsung terasa responsif), lalu refresh dengan data lengkap
    setActiveOrder(order);
    setDetailLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${order._id}`, { withCredentials: true });
      setActiveOrder(res.data.success ? res.data.data : order);
    } catch (err) {
      // biarkan tetap pakai data dari list kalau fetch detail gagal
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setActiveOrder(null);
    setEditMode(false);
    setEditDraft(null);
  };

  // ─────────────────────────── Aksi Verifikasi (Ketua Lab) ───────────────────────────
  const changeStatus = async (status_pengujian) => {
    if (saving) return;
    try {
      setSaving(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${activeOrder._id}/status`,
        { status_pengujian },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = { ...res.data.data, id_affiliate: activeOrder.id_affiliate };
        setData((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
        setActiveOrder(updated);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAcc = () => changeStatus('Selesai Diverifikasi');
  const handleKembalikan = () => changeStatus('Order Diproses');

  // ─────────────────────────── Edit data order (data pemohon + rincian layanan) ───────────────────────────
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
      } else {
        alert(res.data.message || 'Gagal menyimpan data');
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

  // Dipakai ItemSectionEditable untuk upload foto_sample / jurnal_pendukung — upload sungguhan ke file server
  const uploadItemFile = (key, file, onProgress) => uploadFileToServer(file, FILE_CATEGORY[key], onProgress);

  // ─────────────────────────── Download Invoice PDF (view-only, ketua_lab tidak boleh edit invoice) ───────────────────────────
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

  // ─────────────────────────── Download Kuitansi PDF (hanya saat status "Selesai") ───────────────────────────
  const handleDownloadKuitansi = async () => {
    if (downloadingKwitansi || !activeOrder?._id) return;
    try {
      setDownloadingKwitansi(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${activeOrder._id}/kwitansi`, { withCredentials: true });
      if (!res.data.success) {
        alert(res.data.message || 'Gagal mengambil data kuitansi');
        return;
      }
      const kwitansi = res.data.data;
      setKwitansiData(kwitansi);

      // beri waktu satu tick agar template kuitansi sempat ter-render ke DOM sebelum di-capture
      await new Promise((resolve) => setTimeout(resolve, 100));

      const el = document.getElementById('kwitansi-print-area');
      if (!el) return;

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`kwitansi-${kwitansi.no_kwitansi.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDownloadingKwitansi(false);
      setKwitansiData(null);
    }
  };

  // ─────────────────────────── Download Laporan Excel (list order, ikut filter aktif) ───────────────────────────
  const handleDownloadExcel = async () => {
    if (downloadingExcel) return;
    try {
      setDownloadingExcel(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate_export`, {
        params: {
          id_affiliate: affiliateId,
          search,
          status: statusFilter,
          year: yearFilter,
          month: monthFilter !== '' ? Number(monthFilter) + 1 : '', // BE expect 1-12, field lokal 0-indexed
        },
        withCredentials: true,
      });
      if (!res.data.success) {
        alert(res.data.message || 'Gagal mengambil data laporan');
        return;
      }
      const rows = res.data.data.map((r) => ({
        'No': r.no,
        'No. Invoice': r.no_invoice,
        'Tanggal': r.tanggal,
        'Nama Pemohon': r.nama_pemohon,
        'Email': r.email,
        'No. WhatsApp': r.no_whatsapp,
        'Nama Instansi': r.nama_institusi,
        'Program Studi': r.program_studi,
        'Laboratorium': r.nama_laboratorium,
        'Jenis Layanan': r.jenis_layanan,
        'Status': r.status,
        'Total Keseluruhan': r.total_keseluruhan,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Order Affiliate');
      XLSX.writeFile(wb, `laporan-order-affiliate-${Date.now()}.xlsx`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const actionLabel = (order) =>
    KETUA_LAB_ACTIONABLE_STATUS.includes(order.status_pengujian) ? 'Verifikasi' : 'Detail';

  // ══════════════════════════════ DETAIL: halaman order terpilih ══════════════════════════════
  if (activeOrder) {
    const itemCount =
      (activeOrder.layanan_analisis?.length || 0) +
      (activeOrder.sewa_lab?.length || 0) +
      (activeOrder.sewa_alat?.length || 0) +
      (activeOrder.pembelian_bahan?.length || 0);

    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={closeDetail}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              {activeOrder.no_invoice}
              {detailLoading && <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
            </h1>
            <p className="text-sm text-gray-500">Detail order — verifikasi laporan sebelum lanjut ke tahap invoice</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Pemohon</p>
            <p className="text-base font-semibold text-gray-900 truncate">{activeOrder.nama_lengkap || '—'}</p>
            <p className="text-xs text-gray-400 mt-1 truncate">{activeOrder.nama_institusi || '—'}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Total Keseluruhan</p>
            <p className="text-2xl font-bold text-blue-600">Rp {convertRupiah(activeOrder.total_keseluruhan)}</p>
            <p className="text-xs text-gray-400 mt-1">{itemCount} item layanan</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">Status Order</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${STATUS_CLASS[activeOrder.status_pengujian] || 'bg-gray-100 text-gray-600'}`}>
              {activeOrder.status_pengujian}
            </span>
            <p className="text-xs text-gray-400 mt-2">{formatDate(activeOrder.date)}</p>
          </div>
        </div>

        {/* Panel aksi verifikasi — hanya muncul saat "Menunggu Diverifikasi" */}
        {activeOrder.status_pengujian === 'Menunggu Diverifikasi' && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-yellow-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verifikasi Laporan
            </p>
            <p className="text-[11px] text-yellow-700 mb-3">
              Periksa laporan & rincian biaya dari laboran di tab Dokumen. Kalau sudah sesuai, ACC untuk lanjut ke tahap invoice. Kalau masih ada yang perlu diperbaiki, kembalikan ke laboran.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAcc}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                Selesai Diverifikasi
              </button>
              <button
                onClick={handleKembalikan}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs font-medium rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Kembalikan ke Laboran
              </button>
            </div>
          </div>
        )}
        {activeOrder.status_pengujian !== 'Menunggu Diverifikasi' && (
          <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-center mb-6">
            <p className="text-xs text-gray-500">
              Order ini sedang ditangani oleh {statusOwnerHint(activeOrder.status_pengujian)}. Sebagai ketua lab, Anda hanya bisa memverifikasi saat status &quot;Menunggu Diverifikasi&quot;, namun tetap bisa mengedit data order di tab Rincian Order.
            </p>
          </div>
        )}

        {/* Tab Bar */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {DETAIL_TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === t.key ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" />{t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab: Rincian Order — Data Pemohon (editable) lalu Layanan (editable) */}
        {activeTab === 'ringkasan' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Data Pemohon
                </p>
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
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan Data
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {APPLICANT_FIELDS
                  .filter((f) => !f.conditional || (editMode ? editDraft : activeOrder).jenis_institusi === f.conditional)
                  .map((f) => (
                    <div key={f.key} className="min-w-0">
                      <p className="text-xs text-gray-400 mb-1">{f.label}</p>
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
                        <p className="text-sm font-medium mt-0.5 break-words">{activeOrder[f.key] || '—'}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {editMode ? (
              Object.entries(FIELD_CONFIG).map(([jenis, cfg]) => (
                <div key={jenis} className="bg-white rounded-xl border border-gray-200 p-5">
                  <ItemSectionEditable
                    jenis={jenis}
                    config={cfg}
                    items={editDraft[jenis] || []}
                    onUpdate={updateEditItem}
                    onAdd={addEditItem}
                    onRemove={removeEditItem}
                    onUploadFile={uploadItemFile}
                  />
                </div>
              ))
            ) : (
              <>
                {Object.entries(FIELD_CONFIG).map(([jenis, cfg]) => (
                  activeOrder[jenis]?.length > 0 && (
                    <div key={jenis} className="bg-white rounded-xl border border-gray-200 p-5">
                      <ItemSectionReadOnly config={cfg} items={activeOrder[jenis]} />
                    </div>
                  )
                ))}
                {itemCount === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-400 italic">Tidak ada layanan pada order ini.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab: Dokumen — grid link dokumen, Rincian Invoice di bagian paling bawah */}
        {activeTab === 'dokumen' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Dokumen Terkait
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ✅ Semua field file di sini dilewatkan lewat buildFileUrl supaya aman
                    baik value-nya sudah full URL maupun cuma filename */}
                <FileLink label="Laporan (laboran)" href={buildFileUrl(FILE_CATEGORY.laporan, activeOrder.laporan)} />
                <FileLink label="Rincian Biaya (laboran)" href={buildFileUrl(FILE_CATEGORY.rincian_biaya, activeOrder.rincian_biaya)} />

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

                {/* ── Kuitansi — hanya tersedia setelah status "Selesai" (sinkron dengan endpoint BE) ── */}
                {activeOrder.status_pengujian === 'Selesai' ? (
                  <button
                    onClick={handleDownloadKuitansi}
                    disabled={downloadingKwitansi}
                    className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition disabled:opacity-60"
                  >
                    <span className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                      <FileCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Kuitansi</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-red-700">
                      {downloadingKwitansi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      {downloadingKwitansi ? 'Membuat PDF...' : 'Unduh PDF'}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white">
                    <span className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                      <FileCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Kuitansi</span>
                    </span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 px-2.5 py-1.5">Tersedia setelah Selesai</span>
                  </div>
                )}

                <FileLink label="Bukti Pembayaran (user)" href={buildFileUrl(FILE_CATEGORY.bukti_pembayaran, activeOrder.bukti_pembayaran)} />
                <FileLink label="Hasil Analisis (laboran)" href={buildFileUrl(FILE_CATEGORY.hasil_analisis, activeOrder.hasil_analisis)} />
              </div>
            </div>

            {/* ── Rincian Invoice — di bagian paling bawah tab Dokumen ── */}
            {activeOrder.rincian_harga_invoice?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5 text-gray-400" /> Rincian Invoice
                </p>
                <InvoiceTable rows={activeOrder.rincian_harga_invoice} />
              </div>
            )}
          </div>
        )}

        {activeOrder.rincian_harga_invoice?.length > 0 && (
          <div style={{ position: 'fixed', top: 0, left: '-99999px' }}>
            <InvoiceTemplate order={activeOrder} printId="invoice-print-area" />
          </div>
        )}

        {/* Template kuitansi tersembunyi, dipakai html2canvas untuk generate PDF */}
        {kwitansiData && (
          <div style={{ position: 'fixed', top: 0, left: '-99999px' }}>
            <KwitansiTemplate data={kwitansiData} printId="kwitansi-print-area" />
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════ LIST: daftar order ══════════════════════════════
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ── Judul Halaman ── */}
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Order</h1>
        </div>
        <button
          onClick={handleDownloadExcel}
          disabled={downloadingExcel}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 disabled:opacity-50 rounded-lg transition"
        >
          {downloadingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
          {downloadingExcel ? 'Membuat Excel...' : 'Download Excel'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-12">
        Kelola order, verifikasi, upload dokumen, & input invoice
      </p>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
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
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-56"
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-40"
          >
            <option value="">Semua Bulan</option>
            {MONTH_NAMES.map((m, idx) => <option key={m} value={String(idx)}>{m}</option>)}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-32"
          >
            <option value="">Semua Tahun</option>
            {uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                  <tr key={i}>
                    <td className="px-4 py-4"><div className="h-3 w-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-32 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-28 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-5 w-32 bg-gray-100 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-7 w-24 bg-gray-100 rounded-lg animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length > 0 ? filtered.map((v, i) => {
                const needsAction = KETUA_LAB_ACTIONABLE_STATUS.includes(v.status_pengujian);
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
                        {needsAction ? <ShieldCheck className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
      </div>
    </div>
  );
}

function statusOwnerHint(status) {
  switch (status) {
    case 'Menunggu Order Dikonfirmasi': return 'laboran (menunggu konfirmasi)';
    case 'Order Dikonfirmasi': return 'laboran (bersiap memproses)';
    case 'Order Ditolak': return 'laboran (order ditolak)';
    case 'Order Diproses': return 'laboran (sedang memproses sampel)';
    case 'Selesai Diverifikasi': return 'admin (input invoice)';
    case 'Menunggu Pembayaran': return 'user (menunggu pembayaran)';
    case 'Menunggu Verifikasi Pembayaran': return 'admin (verifikasi pembayaran)';
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

// ✅ Modifikasi: bangun URL file lewat buildFileUrl (bukan pakai r[ff.key] mentah),
// supaya link tetap benar baik untuk foto_sample/jurnal_pendukung yang berasal dari
// form order awal (biasanya cuma filename) maupun yang sudah diedit (sudah full URL).
function ItemSectionReadOnly({ config, items }) {
  const { title, icon: Icon, cls, fields, fileFields } = config;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700 mb-3.5 flex items-center gap-2">
        <span className={`w-6 h-6 rounded-md flex items-center justify-center ${cls}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {items.map((r, idx) => {
          const availableFiles = (fileFields || [])
            .filter((ff) => r[ff.key])
            .map((ff) => ({ ...ff, url: buildFileUrl(FILE_CATEGORY[ff.key], r[ff.key]) }));
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
                    <a key={ff.key}
                      href={ff.url}
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

function ItemSectionEditable({ jenis, config, items, onUpdate, onAdd, onRemove, onUploadFile }) {
  const { title, icon: Icon, cls, fields, fileFields } = config;
  // key: `${idx}-${fieldKey}` -> progress (0-100). Ada di map = sedang upload.
  const [uploadingMap, setUploadingMap] = useState({});

  const handleFileChange = async (idx, ff, file) => {
    if (!file) return;
    const mapKey = `${idx}-${ff.key}`;
    setUploadingMap((m) => ({ ...m, [mapKey]: 0 }));
    try {
      const url = await onUploadFile(ff.key, file, (percent) => {
        setUploadingMap((m) => ({ ...m, [mapKey]: percent }));
      });
      onUpdate(jenis, idx, ff.key, url);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal upload file');
    } finally {
      setUploadingMap((m) => {
        const next = { ...m };
        delete next[mapKey];
        return next;
      });
    }
  };

  return (
    <div>
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

            {/* ✅ Foto Sample / Jurnal Pendukung — upload sungguhan ke file server + progress bar */}
            {fileFields && fileFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pr-8 mt-6 pt-5 border-t border-gray-200">
                {fileFields.map((ff) => {
                  const mapKey = `${idx}-${ff.key}`;
                  const isUploading = mapKey in uploadingMap;
                  return (
                    <div key={ff.key} className="min-w-0">
                      <p className="text-[11px] text-gray-400 mb-2">{ff.label}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="file"
                          id={`file-${jenis}-${idx}-${ff.key}`}
                          className="hidden"
                          onChange={(e) => handleFileChange(idx, ff, e.target.files?.[0])}
                        />
                        <label
                          htmlFor={`file-${jenis}-${idx}-${ff.key}`}
                          className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 rounded-lg text-[11px] font-medium bg-white text-gray-600 hover:bg-gray-50 transition"
                        >
                          <UploadCloud className="w-3 h-3" /> {item[ff.key] ? 'Ganti File' : 'Pilih File'}
                        </label>
                        {isUploading && <span className="text-[11px] text-gray-500">{uploadingMap[mapKey]}%</span>}
                        {item[ff.key] && !isUploading && (
                          <a href={item[ff.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-red-700 underline truncate max-w-[140px]"
                          >
                            Lihat file saat ini
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoiceTable({ rows }) {
  const total = rows.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <tr key={r.id || r._id || idx}>
                <td className="px-3 py-2 text-gray-400 align-top">{idx + 1}</td>
                <td className="px-2 py-2 align-top"><span className="text-gray-700 whitespace-nowrap">{formatDate(r.tanggal)}</span></td>
                <td className="px-2 py-2 align-top"><span className="text-gray-800 font-medium">{r.deskripsi || '—'}</span></td>
                <td className="px-2 py-2 align-top"><span className="text-gray-600">{r.keterangan || '—'}</span></td>
                <td className="px-2 py-2 align-top text-right"><span className="text-gray-700">{r.jumlah}</span></td>
                <td className="px-2 py-2 align-top"><span className="text-gray-700">{r.satuan || '—'}</span></td>
                <td className="px-2 py-2 align-top text-right"><span className="text-gray-700">Rp {convertRupiah(r.harga_satuan)}</span></td>
                <td className="px-3 py-2 align-top text-right font-semibold text-gray-800 whitespace-nowrap">Rp {convertRupiah(r.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={7} className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Total Keseluruhan</td>
              <td className="px-3 py-2.5 text-right text-sm font-bold text-gray-900 whitespace-nowrap">Rp {convertRupiah(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
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