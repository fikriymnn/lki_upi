"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search, FlaskConical, X, Plus, Edit2, Trash2, Building2,
  CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';

const emptyForm = (idAffiliate) => ({
  id: null,
  id_affiliate: idAffiliate,
  nama_layanan: '',
  is_active: true,
});

export default function AffiliateLayananAnalisis({ idAffiliate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [affiliateName, setAffiliateName] = useState('—');

  useEffect(() => {
    if (!idAffiliate) return;
    axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/${idAffiliate}`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) setAffiliateName(res.data.data.nama_laboratorium);
      })
      .catch(() => {});
  }, [idAffiliate]);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' | 'edit'
  const [form, setForm] = useState(emptyForm(idAffiliate));
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(async () => {
    if (!idAffiliate) return;
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/layanan_analisis`, {
        params: {
          id_affiliate: idAffiliate,
          search,
          ...(statusFilter && { is_active: statusFilter === 'aktif' }),
        },
        withCredentials: true,
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [idAffiliate, search, statusFilter]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const openCreate = () => {
    setMode('create');
    setForm(emptyForm(idAffiliate));
    setShowModal(true);
  };

  const openEdit = (item) => {
    setMode('edit');
    setForm({ id: item._id, id_affiliate: idAffiliate, nama_layanan: item.nama_layanan, is_active: item.is_active });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm(idAffiliate));
  };

  const isFormValid = form.nama_layanan.trim().length > 0;

  const handleSave = async () => {
    if (!isFormValid || saving) return;
    try {
      setSaving(true);
      if (mode === 'create') {
        await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/layanan_analisis`, {
          id_affiliate: form.id_affiliate,
          nama_layanan: form.nama_layanan,
          is_active: form.is_active,
        }, { withCredentials: true });
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/layanan_analisis/${form.id}`, {
          nama_layanan: form.nama_layanan,
          is_active: form.is_active,
        }, { withCredentials: true });
      }
      closeModal();
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/layanan_analisis/${item._id}`, {
        is_active: !item.is_active,
      }, { withCredentials: true });
      setData((prev) => prev.map((d) => (d._id === item._id ? { ...d, is_active: !d.is_active } : d)));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm || deleting) return;
    try {
      setDeleting(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/layanan_analisis/${showDeleteConfirm._id}`, {
        withCredentials: true,
      });
      setShowDeleteConfirm(null);
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* ── Judul Halaman ── */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Layanan Analisis Lab</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-12">
          Kelola daftar layanan analisis untuk {affiliateName}
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <FlaskConical className="w-3.5 h-3.5" /> Master Layanan Analisis
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-medium rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Layanan
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama layanan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-48"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['No', 'Nama Layanan', 'Status', 'Aksi'].map((h) => (
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
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-3 w-full bg-gray-200 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : data.length > 0 ? data.map((item, i) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-medium text-gray-900">{item.nama_layanan}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition ${
                          item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {item.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Belum ada layanan analisis untuk lab ini</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal Tambah / Edit */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>

                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {mode === 'create' ? 'Tambah Layanan Analisis' : 'Edit Layanan Analisis'}
                </h2>
                <p className="text-xs text-gray-500 mb-5">
                  {mode === 'create'
                    ? `Tambahkan jenis layanan analisis baru untuk ${affiliateName}.`
                    : 'Perbarui data layanan analisis.'}
                </p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Nama Layanan</label>
                    <input
                      type="text"
                      value={form.nama_layanan}
                      onChange={(e) => setForm((f) => ({ ...f, nama_layanan: e.target.value }))}
                      placeholder="Contoh: TPC (Total Plate Count)"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> Lab Affiliate</label>
                    <div className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500">
                      {affiliateName}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">Status</label>
                    <div className="flex gap-2 mt-1">
                      {[{ v: true, label: 'Aktif' }, { v: false, label: 'Nonaktif' }].map((s) => (
                        <button
                          key={String(s.v)}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, is_active: s.v }))}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                            form.is_active === s.v
                              ? 'bg-red-50 border-red-300 text-red-700'
                              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!isFormValid || saving}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-[#b91c1c] hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
                >
                  {saving ? 'Menyimpan...' : mode === 'create' ? 'Tambah Layanan' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {/* Konfirmasi Hapus */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Hapus Layanan Analisis?</p>
                <p className="text-xs text-gray-500 mb-5">
                  Layanan <span className="font-medium text-gray-700">{showDeleteConfirm.nama_layanan}</span> akan dihapus permanen.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition"
                  >
                    {deleting ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}