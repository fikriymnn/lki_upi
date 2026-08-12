"use client";
import { useState, useEffect } from 'react';
import {
  Search, ClipboardList, X, FlaskConical, DoorOpen, Package, Wrench,
  FileText, Download, CheckCircle2, Eye, Receipt, CreditCard
} from 'lucide-react';

// ── Status flow (harus sama persis dengan enum status_pengujian di backend) ──
// Urutan flow:
// Menunggu Order Dikonfirmasi -> [laboran] -> Order Dikonfirmasi | Order Ditolak
// Order Dikonfirmasi -> [laboran mulai proses] -> Order Diproses
// Order Diproses -> [laboran selesai upload laporan+rincian] -> Menunggu Diverifikasi
// Menunggu Diverifikasi -> [ketua_lab] -> Selesai Diverifikasi | kembali ke Order Diproses
// Selesai Diverifikasi -> [admin input invoice] -> Menunggu Pembayaran
// Menunggu Pembayaran -> [user upload bukti bayar] -> Menunggu Verifikasi Pembayaran
// Menunggu Verifikasi Pembayaran -> [admin ACC] -> Selesai
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
  'Menunggu Order Dikonfirmasi': 'bg-gray-100 text-gray-600',
  'Order Dikonfirmasi': 'bg-blue-100 text-blue-700',
  'Order Ditolak': 'bg-red-100 text-red-700',
  'Order Diproses': 'bg-indigo-100 text-indigo-700',
  'Menunggu Diverifikasi': 'bg-yellow-100 text-yellow-700',
  'Selesai Diverifikasi': 'bg-cyan-100 text-cyan-700',
  'Menunggu Pembayaran': 'bg-orange-100 text-orange-700',
  'Menunggu Verifikasi Pembayaran': 'bg-amber-100 text-amber-700',
  'Selesai': 'bg-green-100 text-green-700',
};

// ── Status di mana admin punya aksi konkret; selain ini admin read-only ──
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

// ── Dummy data — nanti ganti axios.get(`/api/affiliate/${affiliateId}/order`) ──
// Struktur item sudah disamakan dengan subdocument schema OrderAffiliate:
// layanan_analisis, sewa_lab, sewa_alat, pembelian_bahan
const DUMMY_ORDER = [
  {
    id: 'o1', no_invoice: '', date: '2026-08-01',
    nama_lengkap: 'Fauzan dkk', nama_institusi: 'SMAIT Ummul Quro',
    status_pengujian: 'Menunggu Order Dikonfirmasi', total_keseluruhan: 0,
    layanan_analisis: [
      { nama_sample: 'Krim Anti-UV', jenis_layanan: ['Preparasi Sampel'], pelarut: 'Aquadest', jumlah_sample: 3, metode_parameter: '', keterangan: '', harga_satuan: 30000, total: 90000 },
    ],
    sewa_lab: [], sewa_alat: [], pembelian_bahan: [],
    bukti_pembayaran: '', laporan: '', rincian_biaya: '', hasil_analisis: '',
  },
  {
    id: 'o2', no_invoice: '', date: '2026-07-28',
    nama_lengkap: 'Nadia Ramadhani', nama_institusi: 'Universitas Pendidikan Indonesia',
    status_pengujian: 'Order Diproses', total_keseluruhan: 0,
    layanan_analisis: [
      { nama_sample: 'Sampel Air Sungai', jenis_layanan: ['TPC (Total Plate Count)'], pelarut: '', jumlah_sample: 2, metode_parameter: 'SNI 2897:2008', keterangan: '', harga_satuan: 120000, total: 240000 },
    ],
    sewa_lab: [], sewa_alat: [], pembelian_bahan: [],
    bukti_pembayaran: '', laporan: '', rincian_biaya: '', hasil_analisis: '',
  },
  {
    id: 'o3', no_invoice: '', date: '2026-07-20',
    nama_lengkap: 'Rian Saputra', nama_institusi: 'PT Industri Kimia Jaya',
    status_pengujian: 'Selesai Diverifikasi', total_keseluruhan: 395000,
    layanan_analisis: [],
    sewa_alat: [
      { nama_alat: 'Shaker', jenis_sewa: 'Hari', tanggal_mulai: '2026-07-10', tanggal_selesai: '2026-07-12', jumlah: 2, keterangan: '', harga_satuan: 15000, total: 30000 },
    ],
    sewa_lab: [
      { jenis_sewa: 'Harian', tanggal_mulai: '2026-07-10', tanggal_selesai: '2026-07-10', jumlah: 1, keterangan: '', harga_satuan: 150000, total: 150000 },
    ],
    pembelian_bahan: [
      { jenis_bahan: 'NaCl', satuan: 'Gram (500)', keterangan: '', harga_satuan: 15000, total: 15000 },
    ],
    bukti_pembayaran: '', laporan: '/files/laporan-o3.pdf', rincian_biaya: '/files/rincian-o3.pdf', hasil_analisis: '',
  },
  {
    id: 'o4', no_invoice: '03/LRK/P/VII/2026', date: '2026-07-10',
    nama_lengkap: 'Dewi Anggraini', nama_institusi: 'Universitas Pendidikan Indonesia',
    status_pengujian: 'Menunggu Verifikasi Pembayaran', total_keseluruhan: 245000,
    layanan_analisis: [
      { nama_sample: 'Ekstrak Daun', jenis_layanan: ['FTIR'], pelarut: 'Etanol', jumlah_sample: 1, metode_parameter: '', keterangan: '', harga_satuan: 245000, total: 245000 },
    ],
    sewa_lab: [], sewa_alat: [], pembelian_bahan: [],
    bukti_pembayaran: '/files/bukti-bayar-o4.jpg', laporan: '/files/laporan-o4.pdf', rincian_biaya: '/files/rincian-o4.pdf', hasil_analisis: '',
  },
  {
    id: 'o5', no_invoice: '01/LRK/P/I/2026', date: '2026-01-07',
    nama_lengkap: 'Teguh Prasetyo', nama_institusi: 'SMAIT Ummul Quro',
    status_pengujian: 'Selesai', total_keseluruhan: 907500,
    layanan_analisis: [
      { nama_sample: 'Krim Anti-UV', jenis_layanan: ['Preparasi Sampel'], pelarut: '', jumlah_sample: 3, metode_parameter: '', keterangan: '', harga_satuan: 30000, total: 90000 },
    ],
    sewa_lab: [
      { jenis_sewa: 'Harian', tanggal_mulai: '2025-12-22', tanggal_selesai: '2025-12-22', jumlah: 1, keterangan: '', harga_satuan: 150000, total: 150000 },
    ],
    sewa_alat: [], pembelian_bahan: [],
    bukti_pembayaran: '/files/bukti-bayar-o5.jpg', laporan: '/files/laporan-o5.pdf', rincian_biaya: '/files/rincian-o5.pdf', hasil_analisis: '/files/hasil-o5.pdf',
  },
];

export default function AffiliateOrder({ affiliateId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ── Modal detail (read-only) & aksi khusus admin ──
  const [showModal, setShowModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [invoiceInput, setInvoiceInput] = useState('');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setData(DUMMY_ORDER);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [affiliateId]);

  const filtered = data
    .filter((v) =>
      v.no_invoice.toLowerCase().includes(search.toLowerCase()) ||
      v.nama_lengkap.toLowerCase().includes(search.toLowerCase())
    )
    .filter((v) => (statusFilter ? v.status_pengujian === statusFilter : true));

  const jenisBadges = (order) => {
    const badges = [];
    if (order.layanan_analisis?.length > 0) badges.push({ label: `Analisis (${order.layanan_analisis.length})`, icon: FlaskConical, cls: 'bg-teal-50 text-teal-700' });
    if (order.sewa_lab?.length > 0) badges.push({ label: `Sewa Lab (${order.sewa_lab.length})`, icon: DoorOpen, cls: 'bg-purple-50 text-purple-700' });
    if (order.sewa_alat?.length > 0) badges.push({ label: `Sewa Alat (${order.sewa_alat.length})`, icon: Wrench, cls: 'bg-blue-50 text-blue-700' });
    if (order.pembelian_bahan?.length > 0) badges.push({ label: `Bahan (${order.pembelian_bahan.length})`, icon: Package, cls: 'bg-amber-50 text-amber-700' });
    return badges;
  };

  const openDetail = (order) => {
    setActiveOrder(order);
    setInvoiceInput(order.no_invoice || '');
    setShowModal(true);
  };

  // ── Aksi admin #1: input invoice di status "Selesai Diverifikasi" -> "Menunggu Pembayaran" ──
  const handleKirimInvoice = () => {
    if (!invoiceInput.trim()) return;
    // TODO: axios.put ke API order/:id { no_invoice: invoiceInput, status_pengujian: 'Menunggu Pembayaran' }
    const updated = { ...activeOrder, no_invoice: invoiceInput.trim(), status_pengujian: 'Menunggu Pembayaran' };
    setData((prev) => prev.map((v) => (v.id === activeOrder.id ? updated : v)));
    setActiveOrder(updated);
  };

  // ── Aksi admin #2: ACC bukti pembayaran di status "Menunggu Verifikasi Pembayaran" -> "Selesai" ──
  const handleAccPembayaran = () => {
    if (!confirm('ACC pembayaran dan tandai order ini Selesai?')) return;
    // TODO: axios.put ke API order/:id { status_pengujian: 'Selesai' }
    const updated = { ...activeOrder, status_pengujian: 'Selesai' };
    setData((prev) => prev.map((v) => (v.id === activeOrder.id ? updated : v)));
    setActiveOrder(updated);
  };

  const actionLabel = (order) => {
    if (order.status_pengujian === 'Selesai Diverifikasi') return 'Input Invoice';
    if (order.status_pengujian === 'Menunggu Verifikasi Pembayaran') return 'Verifikasi Bayar';
    return 'Detail';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <ClipboardList className="w-3.5 h-3.5" /> Daftar Order
        </p>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
          Mode Admin — read only kecuali Input Invoice & Verifikasi Pembayaran
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari no. invoice atau nama pemohon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-64"
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['No', 'No. Invoice', 'Pemohon', 'Instansi', 'Jenis Layanan', 'Status', 'Total', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-3 w-full bg-gray-200 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? filtered.map((v, i) => {
              const needsAction = ADMIN_ACTIONABLE_STATUS.includes(v.status_pengujian);
              return (
                <tr key={v.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1}</span></td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">{v.no_invoice || '—'}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-700">{v.nama_lengkap}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600">{v.nama_institusi}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {jenisBadges(v).map((b) => (
                        <span key={b.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${b.cls}`}>
                          <b.icon className="w-3 h-3" />{b.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CLASS[v.status_pengujian] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status_pengujian}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">Rp {convertRupiah(v.total_keseluruhan)}</span></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openDetail(v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition ${needsAction ? 'bg-[#b91c1c] hover:bg-red-800' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                      {needsAction ? <CreditCard className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {actionLabel(v)}
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Belum ada order untuk lab affiliate ini</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal Detail Order (read-only + aksi khusus admin sesuai status) ── */}
      {showModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">{activeOrder.no_invoice || 'Belum ada No. Invoice'}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CLASS[activeOrder.status_pengujian] || 'bg-gray-100 text-gray-600'}`}>
                {activeOrder.status_pengujian}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{formatDate(activeOrder.date)}</p>

            {/* Data pemohon — read only */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div>
                <p className="text-xs font-medium text-gray-500">Nama Pemohon</p>
                <p className="text-sm text-gray-800 mt-1">{activeOrder.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Nama Instansi</p>
                <p className="text-sm text-gray-800 mt-1">{activeOrder.nama_institusi}</p>
              </div>
            </div>

            {/* Item Layanan Analisis — read only */}
            {activeOrder.layanan_analisis?.length > 0 && (
              <ItemSectionReadOnly
                title="Layanan Analisis" icon={FlaskConical} cls="text-teal-700 bg-teal-50"
                items={activeOrder.layanan_analisis}
                renderLabel={(r) => `${r.nama_sample || '—'} — ${(r.jenis_layanan || []).join(', ') || '—'}`}
              />
            )}

            {/* Item Sewa Lab — read only */}
            {activeOrder.sewa_lab?.length > 0 && (
              <ItemSectionReadOnly
                title="Sewa Lab" icon={DoorOpen} cls="text-purple-700 bg-purple-50"
                items={activeOrder.sewa_lab}
                renderLabel={(r) => `Sewa Lab (${r.jenis_sewa || '—'}) — ${formatDate(r.tanggal_mulai)} s/d ${formatDate(r.tanggal_selesai)}`}
              />
            )}

            {/* Item Sewa Alat — read only */}
            {activeOrder.sewa_alat?.length > 0 && (
              <ItemSectionReadOnly
                title="Sewa Alat" icon={Wrench} cls="text-blue-700 bg-blue-50"
                items={activeOrder.sewa_alat}
                renderLabel={(r) => `${r.nama_alat || '—'} (${r.jenis_sewa || '—'}) — ${formatDate(r.tanggal_mulai)} s/d ${formatDate(r.tanggal_selesai)}`}
              />
            )}

            {/* Item Pembelian Bahan — read only */}
            {activeOrder.pembelian_bahan?.length > 0 && (
              <ItemSectionReadOnly
                title="Pembelian Bahan" icon={Package} cls="text-amber-700 bg-amber-50"
                items={activeOrder.pembelian_bahan}
                renderLabel={(r) => `${r.jenis_bahan || '—'} (${r.satuan || '—'})`}
              />
            )}

            {/* File-file terkait — laporan & rincian biaya diupload laboran, bukti bayar diupload user, hasil analisis diupload laboran */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Dokumen</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FileLink label="Laporan (laboran)" href={activeOrder.laporan} />
                <FileLink label="Rincian Biaya (laboran)" href={activeOrder.rincian_biaya} />
                <FileLink label="Bukti Pembayaran (user)" href={activeOrder.bukti_pembayaran} />
                <FileLink label="Hasil Analisis (laboran)" href={activeOrder.hasil_analisis} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
              <span className="text-sm font-medium text-gray-500">Total Keseluruhan</span>
              <span className="text-base font-semibold text-gray-900">Rp {convertRupiah(activeOrder.total_keseluruhan)}</span>
            </div>

            {/* ── Aksi admin: hanya muncul di 2 status ini ── */}
            {activeOrder.status_pengujian === 'Selesai Diverifikasi' && (
              <div className="border border-cyan-200 bg-cyan-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-cyan-800 mb-2 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" /> Input Invoice
                </p>
                <p className="text-[11px] text-cyan-700 mb-3">
                  Order sudah diverifikasi ketua lab. Masukkan nomor invoice untuk mengirim tagihan ke user — status akan berubah menjadi "Menunggu Pembayaran".
                </p>
                <div className="flex gap-2">
                  <input
                    type="text" value={invoiceInput} onChange={(e) => setInvoiceInput(e.target.value)}
                    placeholder="Contoh: 04/LRK/P/VIII/2026"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleKirimInvoice}
                    disabled={!invoiceInput.trim()}
                    className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
                  >
                    Kirim Invoice
                  </button>
                </div>
              </div>
            )}

            {activeOrder.status_pengujian === 'Menunggu Verifikasi Pembayaran' && (
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Verifikasi Pembayaran
                </p>
                {activeOrder.bukti_pembayaran ? (
                  <p className="text-[11px] text-amber-700 mb-3">
                    User sudah upload bukti pembayaran. Periksa file di bagian Dokumen di atas, lalu ACC jika sudah sesuai — status akan berubah menjadi "Selesai" dan user bisa download hasil analisis serta kuitansi.
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-700 mb-3">Bukti pembayaran belum diupload user.</p>
                )}
                <button
                  onClick={handleAccPembayaran}
                  disabled={!activeOrder.bukti_pembayaran}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> ACC Pembayaran & Selesaikan Order
                </button>
              </div>
            )}

            {!ADMIN_ACTIONABLE_STATUS.includes(activeOrder.status_pengujian) && (
              <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500">
                  Order ini sedang ditangani oleh {statusOwnerHint(activeOrder.status_pengujian)}. Admin belum ada aksi di tahap ini.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hint pihak yang bertanggung jawab di status saat ini (informasi saja, read only) ──
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

// ── Section item read-only per jenis layanan ──
function ItemSectionReadOnly({ title, icon: Icon, cls, items, renderLabel }) {
  const convertRupiahLocal = convertRupiah;
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <span className={`w-6 h-6 rounded-md flex items-center justify-center ${cls}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        {title}
      </p>
      <div className="flex flex-col gap-2">
        {items.map((r, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-2.5">
            <p className="text-xs text-gray-700">{renderLabel(r)}</p>
            <div className="px-2 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md text-right">
              Rp {convertRupiahLocal(r.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Link file terupload (read only) ──
function FileLink({ label, href }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
      <span className="flex items-center gap-1.5 text-xs text-gray-600">
        <FileText className="w-3.5 h-3.5 text-gray-400" /> {label}
      </span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800">
          <Download className="w-3.5 h-3.5" /> Lihat
        </a>
      ) : (
        <span className="text-[11px] text-gray-400">Belum ada</span>
      )}
    </div>
  );
}