"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Plus, Pencil, Trash2, X, ShoppingBag, ChevronDown, ChevronUp,
  ArrowLeft, Search, Wrench, DoorOpen, FlaskConical, Package
} from 'lucide-react';

// ── Konfigurasi tiap tipe layanan — key HARUS match enum `tipe_layanan` di Catalog model ──
const JENIS_CONFIG = {
  sewa_alat: {
    label: 'Sewa Alat',
    icon: Wrench,
    color: 'blue',
    namaLabel: 'Nama Alat',
    namaPlaceholder: 'Contoh: Shaker, Furnace, Autoklaf',
    secondaryField: 'deskripsi',
    secondaryLabel: 'Spesifikasi',
    secondaryPlaceholder: 'Contoh: Max. 200 rpm',
    hasSatuan: true,
    satuanPlaceholder: 'Contoh: Per hari, Per jam, Per liter',
    hasJumlahSampel: false,
    hasVarian: false,
    hasJenisJasa: true,
  },
  sewa_lab: {
    label: 'Sewa Lab',
    icon: DoorOpen,
    color: 'purple',
    namaLabel: 'Nama Paket / Waktu Sewa',
    namaPlaceholder: 'Contoh: Harian, Bulanan',
    secondaryField: null,
    secondaryLabel: null,
    hasSatuan: false,
    hasJumlahSampel: false,
    hasVarian: false,
    hasJenisJasa: false,
  },
  layanan_analisis: {
    label: 'Layanan Analisis',
    icon: FlaskConical,
    color: 'teal',
    namaLabel: 'Nama Layanan Analisis',
    namaPlaceholder: 'Contoh: AAS, FTIR, GCMS',
    secondaryField: 'metode_analisis',
    secondaryLabel: 'Metode Analisis',
    secondaryPlaceholder: 'Contoh: Gravimetri, SNI 2897:2008',
    hasSatuan: true,
    satuanPlaceholder: 'Contoh: Per Sampel, Per Spectra',
    hasJumlahSampel: true,
    hasVarian: true,
    hasJenisJasa: false,
  },
  pembelian_bahan: {
    label: 'Pembelian Bahan',
    icon: Package,
    color: 'amber',
    namaLabel: 'Nama Bahan',
    namaPlaceholder: 'Contoh: NaCl, HCl 37%',
    secondaryField: 'deskripsi',
    secondaryLabel: 'Deskripsi',
    secondaryPlaceholder: 'Contoh: PRD-0012',
    hasSatuan: true,
    satuanPlaceholder: 'Contoh: Gram, Liter, Pcs',
    hasJumlahSampel: false,
    hasVarian: false,
    hasJenisJasa: false,
  },
};

const COLOR_CLASS = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', iconBg: 'bg-teal-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
};

const SEGMEN_OPTIONS = ['Internal UPI', 'Eksternal'];
const JENIS_JASA_OPTIONS = ['', 'Tanpa Jasa', 'Dengan Jasa'];

const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const emptyTarifRow = () => ({ _rowKey: newId(), segmen: 'Internal UPI', golongan: '', varian: '', jenis_jasa: '', harga: '' });

const emptyForm = (affiliateId, tipe = '') => ({
  id_affiliate: affiliateId,
  tipe_layanan: tipe,
  sub_kategori: '',
  nama_item: '',
  deskripsi: '',
  metode_analisis: '',
  satuan: '',
  jumlah_minimal_sampel: '',
  keterangan: '',
  tarif: [emptyTarifRow()],
});

const convertRupiah = (angka = 0) => {
  const parts = angka?.toString().split('').reverse().join('').match(/\d{1,3}/g);
  return parts?.join('.').split('').reverse().join('') ?? '0';
};

export default function AffiliateCatalog({ affiliateId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJenis, setActiveJenis] = useState(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm(affiliateId));
  const [saving, setSaving] = useState(false);

  const fetchList = useCallback(async () => {
    if (!affiliateId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/catalog`, {
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

  const toggleExpand = (id) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const hargaRange = (tarif) => {
    const nums = tarif.map((t) => Number(t.harga)).filter((n) => !isNaN(n) && n > 0);
    if (nums.length === 0) return '—';
    const min = Math.min(...nums), max = Math.max(...nums);
    return min === max ? `Rp ${convertRupiah(min)}` : `Rp ${convertRupiah(min)} – ${convertRupiah(max)}`;
  };

  const jenisCount = (tipe) => data.filter((v) => v.tipe_layanan === tipe).length;

  const itemsInJenis = data
    .filter((v) => v.tipe_layanan === activeJenis)
    .filter((v) => v.nama_item.toLowerCase().includes(search.toLowerCase()));

  const grouped = itemsInJenis.reduce((acc, v) => {
    const key = v.sub_kategori || '(Tanpa sub kategori)';
    (acc[key] = acc[key] || []).push(v);
    return acc;
  }, {});

  const existingSubKategori = (tipe) =>
    [...new Set(data.filter((v) => v.tipe_layanan === tipe && v.sub_kategori).map((v) => v.sub_kategori))];

  // ── Modal handlers ──
  const openAdd = (lockedTipe) => {
    setEditId(null);
    setForm(emptyForm(affiliateId, lockedTipe || ''));
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditId(v._id);
    setForm({
      id_affiliate: affiliateId,
      tipe_layanan: v.tipe_layanan, sub_kategori: v.sub_kategori || '', nama_item: v.nama_item,
      deskripsi: v.deskripsi || '', metode_analisis: v.metode_analisis || '', satuan: v.satuan || '',
      jumlah_minimal_sampel: v.jumlah_minimal_sampel || '', keterangan: v.keterangan || '',
      tarif: v.tarif.length > 0
        ? v.tarif.map((t) => ({ _rowKey: t._id || newId(), _id: t._id, segmen: t.segmen, golongan: t.golongan, varian: t.varian || '', jenis_jasa: t.jenis_jasa || '', harga: t.harga }))
        : [emptyTarifRow()],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm(affiliateId));
  };

  const addTarifRow = () => setForm((f) => ({ ...f, tarif: [...f.tarif, emptyTarifRow()] }));
  const removeTarifRow = (rowKey) => setForm((f) => ({ ...f, tarif: f.tarif.filter((t) => t._rowKey !== rowKey) }));
  const updateTarifRow = (rowKey, key, value) =>
    setForm((f) => ({ ...f, tarif: f.tarif.map((t) => (t._rowKey === rowKey ? { ...t, [key]: value } : t)) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tipe_layanan || !form.nama_item.trim() || saving) return;
    const cleanTarif = form.tarif.filter((t) => t.golongan && t.harga !== '');
    if (cleanTarif.length === 0) return;

    const payload = {
      id_affiliate: form.id_affiliate,
      tipe_layanan: form.tipe_layanan,
      sub_kategori: form.sub_kategori,
      nama_item: form.nama_item,
      deskripsi: form.deskripsi,
      metode_analisis: form.metode_analisis,
      satuan: form.satuan,
      jumlah_minimal_sampel: form.jumlah_minimal_sampel,
      keterangan: form.keterangan,
      tarif: cleanTarif.map((t) => ({
        ...(t._id && { _id: t._id }),
        segmen: t.segmen,
        golongan: t.golongan,
        varian: t.varian,
        jenis_jasa: t.jenis_jasa,
        harga: Number(t.harga),
      })),
    };

    try {
      setSaving(true);
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/catalog/${editId}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/catalog`, payload, { withCredentials: true });
      }
      closeModal();
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus item katalog ini?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/catalog/${id}`, { withCredentials: true });
      setExpanded((prev) => { const next = new Set(prev); next.delete(id); return next; });
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const cfg = form.tipe_layanan ? JENIS_CONFIG[form.tipe_layanan] : null;

  // ══════════════════════════════ LANDING: pilih tipe layanan ══════════════════════════════
  if (!activeJenis) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5" /> Katalog Produk
          </p>
          <button
            onClick={() => openAdd(null)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#b91c1c] text-white rounded-lg hover:bg-red-800 transition text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Katalog
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {Object.entries(JENIS_CONFIG).map(([tipe, c]) => {
              const Icon = c.icon;
              const cls = COLOR_CLASS[c.color];
              return (
                <button
                  key={tipe}
                  onClick={() => setActiveJenis(tipe)}
                  className="text-left p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition bg-white"
                >
                  <div className={`w-9 h-9 rounded-lg ${cls.iconBg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4.5 h-4.5 ${cls.text}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{jenisCount(tipe)} item katalog</p>
                </button>
              );
            })}
          </div>
        )}

        {showModal && (
          <CatalogModal
            form={form} setForm={setForm} cfg={cfg} editId={editId}
            existingSubKategori={existingSubKategori} onClose={closeModal}
            onSubmit={handleSubmit} addTarifRow={addTarifRow} removeTarifRow={removeTarifRow}
            updateTarifRow={updateTarifRow} jenisLocked={false} saving={saving}
          />
        )}
      </div>
    );
  }

  // ══════════════════════════════ DETAIL: dalam satu tipe layanan ══════════════════════════════
  const activeCfg = JENIS_CONFIG[activeJenis];
  const ActiveIcon = activeCfg.icon;
  const activeCls = COLOR_CLASS[activeCfg.color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <button onClick={() => setActiveJenis(null)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4 transition">
        <ArrowLeft className="w-3.5 h-3.5" /> Semua Jenis Layanan
      </button>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${activeCls.iconBg} flex items-center justify-center`}>
            <ActiveIcon className={`w-4 h-4 ${activeCls.text}`} />
          </div>
          <p className="text-sm font-semibold text-gray-900">{activeCfg.label}</p>
        </div>
        <button
          onClick={() => openAdd(activeJenis)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#b91c1c] text-white rounded-lg hover:bg-red-800 transition text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Katalog
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text" placeholder={`Cari di ${activeCfg.label}...`} value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
        />
      </div>

      {loading ? (
        <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      ) : Object.keys(grouped).length === 0 ? (
        <div className="px-6 py-16 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Belum ada katalog untuk {activeCfg.label}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([subKategori, items]) => (
            <div key={subKategori} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{subKategori}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {[
                        activeCfg.namaLabel,
                        ...(activeCfg.secondaryLabel ? [activeCfg.secondaryLabel] : []),
                        ...(activeCfg.hasSatuan ? ['Satuan'] : []),
                        'Tarif', 'Aksi',
                      ].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((v) => (
                      <RowWithDetail
                        key={v._id} v={v} cfg={activeCfg} expanded={expanded.has(v._id)}
                        onToggle={() => toggleExpand(v._id)} onEdit={() => openEdit(v)} onDelete={() => handleDelete(v._id)}
                        hargaRange={hargaRange} convertRupiah={convertRupiah}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CatalogModal
          form={form} setForm={setForm} cfg={cfg} editId={editId}
          existingSubKategori={existingSubKategori} onClose={closeModal}
          onSubmit={handleSubmit} addTarifRow={addTarifRow} removeTarifRow={removeTarifRow}
          updateTarifRow={updateTarifRow} jenisLocked={!editId && !!activeJenis} saving={saving}
        />
      )}
    </div>
  );
}

// ── Baris tabel + detail tarif expandable ──
function RowWithDetail({ v, cfg, expanded, onToggle, onEdit, onDelete, hargaRange, convertRupiah }) {
  return (
    <>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-4 py-3"><span className="text-sm font-medium text-gray-900">{v.nama_item}</span></td>
        {cfg.secondaryLabel && (
          <td className="px-4 py-3"><span className="text-xs text-gray-600">{v[cfg.secondaryField] || '—'}</span></td>
        )}
        {cfg.hasSatuan && <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs text-gray-600">{v.satuan || '—'}</span></td>}
        <td className="px-4 py-3">
          <button onClick={onToggle} className="flex items-center gap-1 text-xs font-medium text-gray-800 hover:text-red-700 transition">
            {hargaRange(v.tarif)}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span onClick={onEdit} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition cursor-pointer">
              <Pencil className="w-4 h-4" />
            </span>
            <span onClick={onDelete} title="Hapus" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </span>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50/60">
          <td colSpan={5} className="px-4 pb-4 pt-1">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Segmen', 'Golongan', ...(cfg.hasVarian ? ['Varian'] : []), ...(cfg.hasJenisJasa ? ['Jenis Jasa'] : []), 'Harga (Rp)'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {v.tarif.map((t) => (
                    <tr key={t._id}>
                      <td className="px-3 py-2 text-xs text-gray-600">{t.segmen}</td>
                      <td className="px-3 py-2 text-xs text-gray-800 font-medium">{t.golongan}</td>
                      {cfg.hasVarian && <td className="px-3 py-2 text-xs text-gray-600">{t.varian || '—'}</td>}
                      {cfg.hasJenisJasa && <td className="px-3 py-2 text-xs text-gray-600">{t.jenis_jasa || '—'}</td>}
                      <td className="px-3 py-2 text-xs font-medium text-gray-800">Rp {convertRupiah(t.harga)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(v.jumlah_minimal_sampel || v.keterangan) && (
                <div className="px-3 py-2 border-t border-gray-100 flex flex-col gap-0.5">
                  {v.jumlah_minimal_sampel && <p className="text-[11px] text-gray-500"><span className="font-medium text-gray-600">Jumlah minimal sampel:</span> {v.jumlah_minimal_sampel}</p>}
                  {v.keterangan && <p className="text-[11px] text-gray-500"><span className="font-medium text-gray-600">Keterangan:</span> {v.keterangan}</p>}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Modal Tambah/Edit — tipe layanan wajib dipilih dulu, field lain menyesuaikan ──
function CatalogModal({ form, setForm, cfg, editId, existingSubKategori, onClose, onSubmit, addTarifRow, removeTarifRow, updateTarifRow, jenisLocked, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400">
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{editId ? 'Edit Katalog' : 'Tambah Katalog'}</h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* ── Step 1: pilih tipe layanan ── */}
          <div>
            <label className="text-xs font-medium text-gray-500">Jenis Layanan</label>
            {jenisLocked || editId ? (
              <div className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700">
                {JENIS_CONFIG[form.tipe_layanan]?.label}
              </div>
            ) : (
              <select
                value={form.tipe_layanan}
                onChange={(e) => setForm((f) => ({ ...f, tipe_layanan: e.target.value, sub_kategori: '' }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Pilih jenis layanan...</option>
                {Object.entries(JENIS_CONFIG).map(([tipe, c]) => <option key={tipe} value={tipe}>{c.label}</option>)}
              </select>
            )}
          </div>

          {/* ── Field lain hanya muncul setelah tipe layanan dipilih ── */}
          {cfg && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500">Sub Kategori (opsional)</label>
                <input
                  type="text" list="sub-kategori-list" value={form.sub_kategori}
                  onChange={(e) => setForm((f) => ({ ...f, sub_kategori: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Parameter Kimia, Parameter Mikrobiologi"
                />
                <datalist id="sub-kategori-list">
                  {existingSubKategori(form.tipe_layanan).map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">{cfg.namaLabel}</label>
                  <input
                    type="text" value={form.nama_item} onChange={(e) => setForm((f) => ({ ...f, nama_item: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={cfg.namaPlaceholder}
                  />
                </div>
                {cfg.secondaryField && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">{cfg.secondaryLabel}</label>
                    <input
                      type="text" value={form[cfg.secondaryField]}
                      onChange={(e) => setForm((f) => ({ ...f, [cfg.secondaryField]: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={cfg.secondaryPlaceholder}
                    />
                  </div>
                )}
              </div>

              {(cfg.hasSatuan || cfg.hasJumlahSampel) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cfg.hasSatuan && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Satuan</label>
                      <input
                        type="text" value={form.satuan} onChange={(e) => setForm((f) => ({ ...f, satuan: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={cfg.satuanPlaceholder}
                      />
                    </div>
                  )}
                  {cfg.hasJumlahSampel && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Jumlah Minimal Sampel</label>
                      <input
                        type="text" value={form.jumlah_minimal_sampel} onChange={(e) => setForm((f) => ({ ...f, jumlah_minimal_sampel: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Contoh: Cair: 100 mL, Padat: 10 gram"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500">Keterangan (opsional)</label>
                <textarea
                  value={form.keterangan} onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))} rows={2}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Contoh: Ca, Fe, Cu, dan Cd"
                />
              </div>

              {/* ── Tarif dinamis ── */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">Daftar Tarif</label>
                  <button type="button" onClick={addTarifRow} className="flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800">
                    <Plus className="w-3.5 h-3.5" /> Tambah Tarif
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {form.tarif.map((t) => (
                    <div
                      key={t._rowKey}
                      className={`grid grid-cols-1 sm:[grid-template-columns:1fr_1fr_${cfg.hasVarian ? '1fr_' : ''}${cfg.hasJenisJasa ? '1fr_' : ''}1fr_auto] gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-2`}
                    >
                      <select value={t.segmen} onChange={(e) => updateTarifRow(t._rowKey, 'segmen', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        {SEGMEN_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="text" value={t.golongan} onChange={(e) => updateTarifRow(t._rowKey, 'golongan', e.target.value)}
                        placeholder="Golongan (mis. Mahasiswa Kimia)"
                        className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      {cfg.hasVarian && (
                        <input type="text" value={t.varian} onChange={(e) => updateTarifRow(t._rowKey, 'varian', e.target.value)}
                          placeholder="Varian (mis. Kalibrasi)"
                          className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      )}
                      {cfg.hasJenisJasa && (
                        <select value={t.jenis_jasa} onChange={(e) => updateTarifRow(t._rowKey, 'jenis_jasa', e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          {JENIS_JASA_OPTIONS.map((j) => <option key={j} value={j}>{j || '— (tidak ada)'}</option>)}
                        </select>
                      )}
                      <input type="number" value={t.harga} onChange={(e) => updateTarifRow(t._rowKey, 'harga', e.target.value)}
                        placeholder="Harga"
                        className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      <button type="button" onClick={() => removeTarifRow(t._rowKey)} disabled={form.tarif.length === 1}
                        title="Hapus baris tarif"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed justify-self-center">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="mt-1 w-full py-2.5 bg-[#b91c1c] hover:bg-red-800 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}