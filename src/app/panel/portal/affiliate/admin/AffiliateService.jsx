"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Check, Wrench, DoorOpen, FlaskConical } from 'lucide-react';

// ── Master jenis layanan — data tetap/global sistem, nanti axios.get(`/api/master/jenis-layanan`) ──
const MASTER_JENIS_LAYANAN = [
  { id: 'j1', nama_jenis: 'Sewa Alat', icon: Wrench, color: 'blue' },
  { id: 'j2', nama_jenis: 'Sewa Lab', icon: DoorOpen, color: 'purple' },
  { id: 'j3', nama_jenis: 'Layanan Analisis', icon: FlaskConical, color: 'teal' },
];

const COLOR_CLASS = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', iconBg: 'bg-teal-100' },
};

// ── Jenis layanan yang sudah dipilih/aktif untuk lab affiliate ini — nanti axios.get(`/api/affiliate/${affiliateId}/layanan`) ──
const DUMMY_AFFILIATE_LAYANAN = [
  { id: 'al1', jenis_id: 'j1' },
  { id: 'al2', jenis_id: 'j3' },
];

export default function AffiliateService({ affiliateId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setData(DUMMY_AFFILIATE_LAYANAN);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [affiliateId]);

  // ── Join data affiliate ke master untuk ditampilkan ──
  const displayed = data
    .map((v) => ({ ...v, master: MASTER_JENIS_LAYANAN.find((m) => m.id === v.jenis_id) }))
    .filter((v) => v.master);

  const availableMaster = MASTER_JENIS_LAYANAN.filter((m) => !data.some((v) => v.jenis_id === m.id));

  const openAdd = () => { setSelected(new Set()); setShowModal(true); };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    if (selected.size === 0) return;
    // TODO: axios.post ke API affiliate/layanan (kirim array jenis_id)
    const newRows = [...selected].map((jenis_id) => ({ id: 'al' + Date.now() + jenis_id, jenis_id }));
    setData((prev) => [...prev, ...newRows]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!confirm('Hapus jenis layanan ini dari daftar lab affiliate?')) return;
    // TODO: axios.delete ke API affiliate/layanan/:id
    setData((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5" /> Jenis Layanan Tersedia
        </p>
        {availableMaster.length > 0 && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#b91c1c] text-white rounded-lg hover:bg-red-800 transition text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Jenis Layanan
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : displayed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {displayed.map((v) => {
            const Icon = v.master.icon;
            const cls = COLOR_CLASS[v.master.color];
            return (
              <div key={v.id} className="relative p-4 border border-gray-200 rounded-xl bg-white group">
                <div className={`w-9 h-9 rounded-lg ${cls.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4.5 h-4.5 ${cls.text}`} />
                </div>
                <p className="text-sm font-semibold text-gray-900">{v.master.nama_jenis}</p>
                <span
                  onClick={() => handleDelete(v.id)}
                  title="Hapus dari daftar"
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-6 py-16 text-center">
          <Wrench className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Belum ada jenis layanan yang dipilih</p>
        </div>
      )}

      {/* ── Modal Pilih Jenis Layanan dari Master ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Pilih Jenis Layanan</h2>
            <p className="text-xs text-gray-500 mb-4">Pilih jenis layanan yang tersedia di lab affiliate ini.</p>

            <div className="flex flex-col gap-2">
              {availableMaster.map((m) => {
                const isSelected = selected.has(m.id);
                const Icon = m.icon;
                const cls = COLOR_CLASS[m.color];
                return (
                  <button
                    key={m.id} type="button" onClick={() => toggleSelect(m.id)}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 border rounded-lg text-left transition ${
                      isSelected ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${cls.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${cls.text}`} />
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{m.nama_jenis}</p>
                    </div>
                    <div className={`w-5 h-5 flex-shrink-0 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button" onClick={handleAdd} disabled={selected.size === 0}
              className="mt-4 w-full py-2.5 bg-[#b91c1c] hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
            >
              Tambah {selected.size > 0 ? `(${selected.size} jenis)` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}