'use client'
import React, { useState, useMemo, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import axios from 'axios';
import Navigasi from '@/components/Navigasi';
import { Search, Plus, Pencil, Trash2, X, Image as ImageIcon, FileImage, AlertTriangle } from 'lucide-react';

const ModalWrapper = ({ children, maxWidth = 'max-w-2xl' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
    <div className={`bg-white rounded-2xl w-full ${maxWidth} shadow-2xl my-8`}>
      {children}
    </div>
  </div>
);

// ── Skeleton primitives ──────────────────────────────────────
const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
        <Shimmer className="h-3 w-24 mb-3" />
        <Shimmer className="h-7 w-10 mb-2" />
        <Shimmer className="h-2.5 w-28" />
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['w-10', 'w-16', '', '', 'w-28', 'w-24'].map((w, i) => (
              <th key={i} className={`px-4 py-3 ${w}`}>
                <Shimmer className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3"><Shimmer className="h-3 w-4" /></td>
              <td className="px-4 py-3"><Shimmer className="w-12 h-12 rounded-lg" /></td>
              <td className="px-4 py-3">
                <Shimmer className="h-3.5 w-36 mb-2" />
                <Shimmer className="h-2.5 w-24" />
              </td>
              <td className="px-4 py-3">
                <Shimmer className="h-2.5 w-full mb-1.5" />
                <Shimmer className="h-2.5 w-3/4" />
              </td>
              <td className="px-4 py-3"><Shimmer className="h-5 w-16 rounded-full" /></td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <Shimmer className="w-8 h-8 rounded-lg" />
                  <Shimmer className="w-8 h-8 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Adminn() {
  const [layananCard, setLayananCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({ title: '', foto: '', contoh_hasil: '' });
  const [sub_title, setSub_title] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  // ── Fetch list ──────────────────────────────────────────
  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content`, {
        withCredentials: true
      });
      if (data.data.success) setLayananCard(data.data.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  // ── Helpers ──────────────────────────────────────────────
  const resetForm = () => {
    setForm({ title: '', foto: '', contoh_hasil: '' });
    setSub_title('');
    setDeskripsi('');
  };

  const openAdd = () => {
    setEditingItem(null);
    resetForm();
    setShowFormModal(true);
  };

  const openEdit = async (id) => {
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`, {
        withCredentials: true
      });
      if (data.data.success) {
        const obj = data.data.data;
        setForm({ title: obj.title, foto: obj.foto, contoh_hasil: obj.contoh_hasil });
        setSub_title(obj.sub_title);
        setDeskripsi(obj.deskripsi);
        setEditingItem(obj);
        setShowFormModal(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpload = async (file, field) => {
    const downloadURL = await axios.post(
      `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=files`,
      { file },
      { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
    );
    if (downloadURL.data.filename) {
      setForm(prev => ({ ...prev, [field]: downloadURL.data.filename }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/content/${editingItem._id}`,
          { title: form.title, sub_title, deskripsi, foto: form.foto, contoh_hasil: form.contoh_hasil },
          { withCredentials: true }
        );
        if (res) {
          setShowFormModal(false);
          fetchList();
        }
      } else {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/content`,
          { title: form.title, sub_title, deskripsi, foto: form.foto, contoh_hasil: form.contoh_hasil },
          { withCredentials: true }
        );
        if (data.data === 'success') {
          setShowFormModal(false);
          fetchList();
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/api/content/${deleteTarget._id}`,
        { withCredentials: true }
      );
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = layananCard.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stripHtml = (html) => {
    if (!html) return '—';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '—';
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto md:px-10 pb-16">

        {/* Header */}
        <div className="my-6">
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola konten layanan yang ditampilkan di halaman publik</p>
        </div>

        {loading ? (
          <>
            <StatsSkeleton />
            {/* Toolbar skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center justify-between">
              <Shimmer className="h-9 w-72 rounded-lg" />
              <Shimmer className="h-9 w-36 rounded-lg" />
            </div>
            <TableSkeleton />
          </>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Konten', value: layananCard.length, sub: 'Layanan terdaftar' },
                { label: 'Dengan Foto', value: layananCard.filter(c => c.foto).length, sub: 'Memiliki thumbnail' },
                { label: 'Dengan Contoh Hasil', value: layananCard.filter(c => c.contoh_hasil).length, sub: 'Ada file contoh' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul konten..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Konten
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Foto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul &amp; Sub Judul</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Contoh Hasil</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.length > 0 ? filtered.map((item, i) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          {item.foto
                            ? <img src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${item.foto}`} className="w-12 h-12 rounded-lg object-cover border border-gray-200" alt="" />
                            : <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-300" /></div>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{stripHtml(item.sub_title)}</p>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-xs text-gray-500 line-clamp-2">{stripHtml(item.deskripsi)}</p>
                        </td>
                        <td className="px-4 py-3">
                          {item.contoh_hasil
                            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"><FileImage className="w-3 h-3" />Ada file</span>
                            : <span className="text-xs text-gray-400">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEdit(item._id)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setDeleteTarget(item); setShowDeleteModal(true); }}
                              className="p-2 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-14 text-center">
                          <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Tidak ada konten ditemukan</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal Form (Add / Edit) ─────────────────────── */}
      {showFormModal && (
        <ModalWrapper maxWidth="max-w-2xl">
          <div className="p-5 border-b border-gray-200 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit Konten' : 'Tambah Konten Baru'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {editingItem ? editingItem.title : 'Isi form berikut untuk menambah layanan'}
              </p>
            </div>
            <button onClick={() => setShowFormModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              {/* Upload row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Foto Thumbnail</p>
                  {form.foto && (
                    <img src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${form.foto}`} className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2" alt="" />
                  )}
                  <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'foto')} className="text-xs text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Contoh Hasil</p>
                  {form.contoh_hasil && (
                    <img src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${form.contoh_hasil}`} className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2" alt="" />
                  )}
                  <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'contoh_hasil')} className="text-xs text-gray-500" />
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Judul <span className="text-red-600">*</span></p>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Masukkan judul layanan..."
                />
              </div>

              {/* Sub judul */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Sub Judul</p>
                <ReactQuill className="h-36 rounded-lg" theme="snow" value={sub_title} onChange={setSub_title} />
              </div>

              {/* Deskripsi */}
              <div className="mt-10">
                <p className="text-sm font-medium text-gray-700 mb-1">Deskripsi</p>
                <ReactQuill className="h-36 rounded-lg" theme="snow" value={deskripsi} onChange={setDeskripsi} />
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex gap-3 justify-end mt-4">
              <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                {editingItem ? 'Simpan Perubahan' : 'Simpan Konten'}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── Modal Confirm Delete ────────────────────────── */}
      {showDeleteModal && deleteTarget && (
        <ModalWrapper maxWidth="max-w-sm">
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Hapus Konten Ini?</h3>
            <p className="text-sm text-gray-500">
              <strong>&quot;{deleteTarget.title}&quot;</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
              Batal
            </button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
              Ya, Hapus
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}