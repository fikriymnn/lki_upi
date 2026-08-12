"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Users, X, Plus, Edit2, Trash2, Building2, Mail, Phone,
  ShieldCheck, KeyRound, CheckCircle2, XCircle
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'laboran', label: 'Laboran' },
  { value: 'ketua_lab', label: 'Ketua Lab' },
];

const ROLE_CLASS = {
  laboran: 'bg-indigo-100 text-indigo-700',
  ketua_lab: 'bg-purple-100 text-purple-700',
};

const roleLabel = (r) => ROLE_OPTIONS.find((o) => o.value === r)?.label || r;

const emptyForm = (affiliateId) => ({
  id: null,
  nama_lengkap: '',
  email: '',
  no_whatsapp: '',
  id_affiliate: affiliateId,
  role: 'laboran',
  status: 'aktif',
  password: '',
});

export default function AffiliateUserManagement({ affiliateId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [namaAffiliateAktif, setNamaAffiliateAktif] = useState('—');

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('create');
  const [form, setForm] = useState(emptyForm(affiliateId));
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!affiliateId) return;
    axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/${affiliateId}`, { withCredentials: true })
      .then((res) => { if (res.data.success) setNamaAffiliateAktif(res.data.data.nama_laboratorium); })
      .catch(() => {});
  }, [affiliateId]);

  const fetchList = useCallback(async () => {
    if (!affiliateId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/affiliate_user`, {
        params: { id_affiliate: affiliateId, search, ...(roleFilter && { role: roleFilter }) },
        withCredentials: true,
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [affiliateId, search, roleFilter]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const openCreate = () => {
    setMode('create');
    setForm(emptyForm(affiliateId));
    setShowModal(true);
  };

  const openEdit = (user) => {
    setMode('edit');
    setForm({
      id: user._id, nama_lengkap: user.nama_lengkap, email: user.email,
      no_whatsapp: user.no_whatsapp, id_affiliate: affiliateId, role: user.role,
      status: user.status, password: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm(affiliateId));
  };

  const isFormValid =
    form.nama_lengkap.trim() &&
    form.email.trim() &&
    form.no_whatsapp.trim() &&
    form.role &&
    (mode === 'edit' || form.password.trim().length >= 6);

  const handleSave = async () => {
    if (!isFormValid || saving) return;
    try {
      setSaving(true);
      if (mode === 'create') {
        await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/affiliate_user`, {
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          no_whatsapp: form.no_whatsapp,
          id_affiliate: form.id_affiliate,
          role: form.role,
          password: form.password,
        }, { withCredentials: true });
      } else {
        const payload = {
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          no_whatsapp: form.no_whatsapp,
          role: form.role,
          status: form.status,
        };
        if (form.password.trim()) payload.password = form.password;
        await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/affiliate_user/${form.id}`, payload, { withCredentials: true });
      }
      closeModal();
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';
      await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/affiliate_user/${user._id}`, { status: newStatus }, { withCredentials: true });
      setData((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (user) => {
    if (deleting) return;
    try {
      setDeleting(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/affiliate_user/${user._id}`, { withCredentials: true });
      setShowDeleteConfirm(null);
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> Daftar User
          </p>
          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> {namaAffiliateAktif}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-medium rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition sm:w-48"
        >
          <option value="">Semua Role</option>
          {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['No', 'Nama', 'Email', 'No. WhatsApp', 'Role', 'Status', ''].map((h) => (
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
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-3 w-full bg-gray-200 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? data.map((u, i) => (
              <tr key={u._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3"><span className="text-xs text-gray-400">{i + 1}</span></td>
                <td className="px-4 py-3"><span className="text-sm font-medium text-gray-900">{u.nama_lengkap}</span></td>
                <td className="px-4 py-3"><span className="text-xs text-gray-600">{u.email}</span></td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs text-gray-600">{u.no_whatsapp}</span></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_CLASS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                    <ShieldCheck className="w-3 h-3" />{roleLabel(u.role)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(u)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition ${
                      u.status === 'aktif' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {u.status === 'aktif' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(u)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Belum ada user untuk lab affiliate ini</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal Tambah / Edit User ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {mode === 'create' ? 'Tambah User' : 'Edit User'}
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              {mode === 'create'
                ? `Buat akun laboran atau ketua lab untuk ${namaAffiliateAktif}.`
                : 'Perbarui data user.'}
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.nama_lengkap}
                  onChange={(e) => setForm((f) => ({ ...f, nama_lengkap: e.target.value }))}
                  placeholder="Nama lengkap user"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="nama@email.com"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> No. WhatsApp</label>
                <input
                  type="text"
                  value={form.no_whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, no_whatsapp: e.target.value }))}
                  placeholder="08xxxxxxxxxx"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> Lab Affiliate</label>
                <div className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500">
                  {namaAffiliateAktif}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Role</label>
                <div className="flex gap-2 mt-1">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                        form.role === r.value
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> {mode === 'create' ? 'Password' : 'Password Baru (opsional)'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={mode === 'create' ? 'Minimal 6 karakter' : 'Kosongkan jika tidak diubah'}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {mode === 'edit' && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Status</label>
                  <div className="flex gap-2 mt-1">
                    {['aktif', 'nonaktif'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, status: s }))}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition capitalize ${
                          form.status === s
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={!isFormValid || saving}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-[#b91c1c] hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
            >
              {saving ? 'Menyimpan...' : mode === 'create' ? 'Buat User' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {/* ── Konfirmasi Hapus User ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <p className="text-sm font-semibold text-gray-900 mb-1">Hapus User?</p>
            <p className="text-xs text-gray-500 mb-5">
              Akun <span className="font-medium text-gray-700">{showDeleteConfirm.nama_lengkap}</span> ({roleLabel(showDeleteConfirm.role)}) akan dihapus permanen dan tidak bisa login kembali.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
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
  );
}