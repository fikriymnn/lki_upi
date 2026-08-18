"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, FileText, Plus, X, Pencil, Trash2 } from 'lucide-react';

const EMPTY_FORM = { nama_laboratorium: '', kode_laboratorium: '', no_whatsapp: '', email: '', alamat: '' };

export default function AffiliateList({ setActivePage, setSelectedAffiliate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate`, {
        params: { search },
        withCredentials: true,
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.nama_laboratorium || !form.kode_laboratorium || !form.no_whatsapp || !form.email || saving) return;
    try {
      setSaving(true);
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate`, form, { withCredentials: true });
      setForm(EMPTY_FORM);
      setShowAdd(false);
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (v) => {
    setEditId(v._id);
    setEditForm({
      nama_laboratorium: v.nama_laboratorium,
      kode_laboratorium: v.kode_laboratorium || '',
      no_whatsapp: v.no_whatsapp,
      email: v.email,
      alamat: v.alamat || '',
    });
    setShowEdit(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.nama_laboratorium || !editForm.kode_laboratorium || !editForm.no_whatsapp || !editForm.email || editSaving) return;
    try {
      setEditSaving(true);
      await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/${editId}`, editForm, { withCredentials: true });
      setShowEdit(false);
      setEditId(null);
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setEditSaving(false);
    }
  };

  const openDelete = (v) => {
    setDeleteId(v._id);
    setDeleteName(v.nama_laboratorium);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    try {
      setDeleting(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/${deleteId}`, { withCredentials: true });
      setShowDelete(false);
      setDeleteId(null);
      setDeleteName('');
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="min-w-6xl max-w-[90rem] mx-auto">

        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Affiliate</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola data laboratorium mitra affiliate</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#b91c1c] text-white rounded-lg hover:bg-red-800 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Tambah Lab Affiliate
          </button>
        </div>

        {/* ── Search Panel ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" /> Cari Nama Laboratorium
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama laboratorium..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
              />
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    { label: 'No', w: 'w-12' },
                    { label: 'Nama Laboratorium', w: '' },
                    { label: 'Kode', w: 'w-24' },
                    { label: 'No. WhatsApp', w: 'w-40' },
                    { label: 'Email', w: 'w-56' },
                    { label: 'Aksi', w: 'w-32' },
                  ].map((h) => (
                    <th key={h.label} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${h.w}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-3 w-6 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-40 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-14 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-28 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-36 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="w-20 h-8 bg-gray-200 rounded-lg" /></td>
                    </tr>
                  ))
                ) : data.length > 0 ? data.map((v, i) => (
                  <tr key={v._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-medium text-gray-900">{v.nama_laboratorium}</span></td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[11px] font-semibold">
                        {v.kode_laboratorium || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs text-gray-600">{v.no_whatsapp}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs text-gray-600">{v.email}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          onClick={() => openEdit(v)}
                          title="Edit Lab Affiliate"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </span>
                        <span
                          onClick={() => { setSelectedAffiliate(v); setActivePage('detail'); }}
                          title="Detail Lab Affiliate"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                        </span>
                        <span
                          onClick={() => openDelete(v)}
                          title="Hapus Lab Affiliate"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Tidak ada data lab affiliate</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal Tambah ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah Lab Affiliate</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nama Laboratorium</label>
                <input
                  type="text"
                  value={form.nama_laboratorium}
                  onChange={(e) => setForm((f) => ({ ...f, nama_laboratorium: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Lab Kimia Nusantara"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Kode Laboratorium</label>
                <input
                  type="text"
                  value={form.kode_laboratorium}
                  onChange={(e) => setForm((f) => ({ ...f, kode_laboratorium: e.target.value.toUpperCase() }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase"
                  placeholder="Contoh: LKOB"
                  maxLength={10}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Kode unik, dipakai untuk penomoran invoice: 001/afiliasi/{form.kode_laboratorium || 'KODE'}/2026
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">No. WhatsApp</label>
                <input
                  type="text"
                  value={form.no_whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, no_whatsapp: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="nama@lab.id"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Alamat (opsional)</label>
                <input
                  type="text"
                  value={form.alamat}
                  onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Bandung, Jawa Barat"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full py-2.5 bg-[#b91c1c] hover:bg-red-800 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Edit ── */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Lab Affiliate</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nama Laboratorium</label>
                <input
                  type="text"
                  value={editForm.nama_laboratorium}
                  onChange={(e) => setEditForm((f) => ({ ...f, nama_laboratorium: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Kode Laboratorium</label>
                <input
                  type="text"
                  value={editForm.kode_laboratorium}
                  onChange={(e) => setEditForm((f) => ({ ...f, kode_laboratorium: e.target.value.toUpperCase() }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent uppercase"
                  maxLength={10}
                />
                <p className="text-[11px] text-amber-600 mt-1">
                  Perhatian: mengubah kode tidak akan mengubah no. invoice order yang sudah ada sebelumnya.
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">No. WhatsApp</label>
                <input
                  type="text"
                  value={editForm.no_whatsapp}
                  onChange={(e) => setEditForm((f) => ({ ...f, no_whatsapp: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Alamat</label>
                <input
                  type="text"
                  value={editForm.alamat}
                  onChange={(e) => setEditForm((f) => ({ ...f, alamat: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={editSaving}
                className="mt-2 w-full py-2.5 bg-gray-600 hover:bg-gray-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition"
              >
                {editSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Delete ── */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 relative">
            <button
              onClick={() => setShowDelete(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Hapus Lab Affiliate</h2>
                <p className="text-sm text-gray-500">Konfirmasi penghapusan</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus lab affiliate <span className="font-semibold">{deleteName}</span>? 
              Data akan dihapus secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}