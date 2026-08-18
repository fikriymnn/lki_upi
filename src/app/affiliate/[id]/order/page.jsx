"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Check, Plus, Pencil, Trash2, X, ChevronRight, ChevronLeft,
  FlaskConical, Wrench, DoorOpen, Package, User, Send, Loader2
} from 'lucide-react';

// ── Checklist layanan — "Sewa Alat" TIDAK dicentang terpisah, otomatis ikut "Analisis" ──
const SERVICE_OPTIONS = [
  { key: 'analisis', label: 'Analisis', icon: FlaskConical, target: 'layanan_analisis' },
  { key: 'sewa_lab', label: 'Sewa Lab', icon: DoorOpen, target: 'sewa_lab' },
  { key: 'pembelian_bahan', label: 'Pembelian Bahan', icon: Package, target: 'pembelian_bahan' },
];

// ── Dummy user session — nanti ganti axios.get(`/api/user/${token}`) seperti Order_analisis.jsx ──
const DUMMY_USER = {
  nama_lengkap: 'Fauzan Ramadhan',
  email: 'fauzan@mail.com',
  no_telp: '081234567890',
  no_whatsapp: '081234567890',
  jenis_institusi: 'Perguruan Tinggi',
  nama_institusi: 'Universitas Pendidikan Indonesia',
  program_studi: 'Pendidikan Kimia',
  fakultas: 'FPMIPA',
};

const emptyItem = (key) => {
  if (key === 'analisis') return { jenis_layanan: [], nama_sample: '', pelarut: '', jumlah_sample: '', metode_parameter: '', foto_sample: '', jurnal_pendukung: '', keterangan: '' };
  if (key === 'sewa_alat') return { nama_alat: '', jenis_sewa: '', tanggal_mulai: '', tanggal_selesai: '', jumlah: '', keterangan: '' };
  if (key === 'sewa_lab') return { jenis_sewa: '', tanggal_mulai: '', tanggal_selesai: '', jumlah: '', keterangan: '' };
  return { jenis_bahan: '', jumlah: '', satuan: '', nomor_produk: '', keterangan: '' }; // pembelian_bahan
};

const iClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition bg-white placeholder:text-gray-400";
const iReadOnlyClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50 cursor-not-allowed";

// ══════════════════════ VALIDASI ══════════════════════

// Field wajib di step "Informasi" — sisanya (no_telp, program_studi, fakultas, nama_pembimbing) opsional
const REQUIRED_INFORMASI_FIELDS = [
  { key: 'nama_lengkap', label: 'Nama Lengkap' },
  { key: 'email', label: 'Email' },
  { key: 'no_whatsapp', label: 'No. WhatsApp' },
  { key: 'jenis_institusi', label: 'Jenis Institusi' },
  { key: 'nama_institusi', label: 'Nama Institusi' },
];

const isFilled = (v) => v !== undefined && v !== null && v.toString().trim() !== '';

const informasiValid = (form) => REQUIRED_INFORMASI_FIELDS.every((f) => isFilled(form[f.key]));

const getInformasiMissing = (form) => REQUIRED_INFORMASI_FIELDS.filter((f) => !isFilled(form[f.key])).map((f) => f.label);

// Field wajib per jenis item (sisanya opsional: keterangan, pelarut, metode_parameter, foto_sample, jurnal_pendukung, nomor_produk)
const ITEM_REQUIRED_FIELDS = {
  analisis: [
    { key: 'jenis_layanan', label: 'Jenis Layanan', isArray: true },
    { key: 'nama_sample', label: 'Nama Sampel' },
    { key: 'jumlah_sample', label: 'Jumlah Sampel' },
  ],
  sewa_alat: [
    { key: 'nama_alat', label: 'Nama Alat' },
    { key: 'jenis_sewa', label: 'Jenis Sewa' },
    { key: 'tanggal_mulai', label: 'Tanggal Mulai' },
    { key: 'tanggal_selesai', label: 'Tanggal Selesai' },
    { key: 'jumlah', label: 'Jumlah' },
  ],
  sewa_lab: [
    { key: 'jenis_sewa', label: 'Jenis Sewa' },
    { key: 'tanggal_mulai', label: 'Tanggal Mulai' },
    { key: 'tanggal_selesai', label: 'Tanggal Selesai' },
    { key: 'jumlah', label: 'Jumlah' },
  ],
  pembelian_bahan: [
    { key: 'jenis_bahan', label: 'Jenis Bahan' },
    { key: 'jumlah', label: 'Jumlah' },
    { key: 'satuan', label: 'Satuan' },
  ],
};

const validateItem = (itemKey, item) => {
  const rules = ITEM_REQUIRED_FIELDS[itemKey] || [];
  const missing = rules.filter((r) => (r.isArray ? (item[r.key] || []).length === 0 : !isFilled(item[r.key])));
  if (missing.length === 0) return null;
  return `Mohon lengkapi field wajib: ${missing.map((m) => m.label).join(', ')}`;
};

export default function AffiliateOrderPage() {
  const { id } = useParams(); // id = id_affiliate (lab tujuan order)
  const router = useRouter();

  const [phase, setPhase] = useState('checklist'); // checklist | wizard
  const [selected, setSelected] = useState(new Set());
  const [stepIdx, setStepIdx] = useState(0);

  const [user, setUser] = useState({});
  const [untukOrangLain, setUntukOrangLain] = useState(false);

  // ── Master layanan analisis — diambil dari /api/layanan_analisis, scoped per id_affiliate ──
  const [masterAnalisis, setMasterAnalisis] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(true);

  const [form, setForm] = useState({
    layanan_analisis: [],
    sewa_alat: [],
    sewa_lab: [],
    pembelian_bahan: [],
    nama_lengkap: '', email: '', no_telp: '', no_whatsapp: '',
    jenis_institusi: '', nama_institusi: '', program_studi: '', fakultas: '',
    nama_pembimbing: '', catatan: '', syarat_ketentuan: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [wizardSteps, setWizardSteps] = useState([]);

  // ── Ambil data user session — dummy statis dulu, nanti ganti axios.get(`/api/user/${token}`) ──
  useEffect(() => {
    async function getUser() {
      try {
        // const token = localStorage.getItem('access_token');
        // const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${token}`, { withCredentials: true });
        // const u = res.data.data;
        const u = DUMMY_USER; // TODO: ganti dengan fetch di atas
        setUser(u);
        setForm((f) => ({ ...f, ...u }));
      } catch (err) { console.log(err.message); }
    }
    getUser();
  }, []);

  // ── Ambil master layanan analisis milik lab ini (hanya yang aktif) ──
  useEffect(() => {
    async function fetchMasterAnalisis() {
      if (!id) return;
      try {
        setLoadingMaster(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/layanan_analisis`, {
          params: { id_affiliate: id, is_active: true, limit: 100 },
        });
        if (res.data.success) {
          setMasterAnalisis(res.data.data.map((d) => d.nama_layanan));
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoadingMaster(false);
      }
    }
    fetchMasterAnalisis();
  }, [id]);

  // ── Toggle "Order untuk orang lain" — sama pola dengan Order_analisis.jsx ──
  const handleUntukOrangLain = (e) => {
    const checked = e.target.checked;
    setUntukOrangLain(checked);
    if (checked) {
      setForm((f) => ({ ...f, nama_lengkap: '', email: '', no_telp: '', no_whatsapp: '', jenis_institusi: '', nama_institusi: '', program_studi: '', fakultas: '' }));
    } else {
      setForm((f) => ({ ...f, ...user }));
    }
  };

  const toggleService = (key) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  // ── Bangun wizardSteps: kalau 'analisis' dicentang, step-nya otomatis membawa section Sewa Alat juga ──
  const buildWizardSteps = () => {
    const steps = [{ key: 'informasi', label: 'Informasi', icon: User }];

    if (selected.has('analisis')) {
      steps.push({
        key: 'analisis_alat', label: 'Analisis & Sewa Alat', icon: FlaskConical,
        services: [
          { key: 'analisis', label: 'Analisis', icon: FlaskConical, target: 'layanan_analisis' },
          { key: 'sewa_alat', label: 'Sewa Alat', icon: Wrench, target: 'sewa_alat' },
        ],
      });
    }
    if (selected.has('sewa_lab')) steps.push({ key: 'sewa_lab', label: 'Sewa Lab', icon: DoorOpen, services: [SERVICE_OPTIONS[1]] });
    if (selected.has('pembelian_bahan')) steps.push({ key: 'pembelian_bahan', label: 'Pembelian Bahan', icon: Package, services: [SERVICE_OPTIONS[2]] });

    steps.push({ key: 'review', label: 'Review', icon: Check });
    return steps;
  };

  const startWizard = () => {
    if (selected.size === 0) return;
    setWizardSteps(buildWizardSteps());
    setStepIdx(0);
    setPhase('wizard');
  };

  const currentStep = wizardSteps[stepIdx];

  const openAddItem = (key) => { setModalKey(key); setModalItem(emptyItem(key)); setEditIdx(null); setShowModal(true); };
  const openEditItem = (key, item, idx) => { setModalKey(key); setModalItem({ ...item }); setEditIdx(idx); setShowModal(true); };
  const deleteItem = (target, idx) => setForm((f) => ({ ...f, [target]: f[target].filter((_, i) => i !== idx) }));

  const targetOf = (key) => key === 'analisis' ? 'layanan_analisis' : key;

  // ── Validasi field wajib sebelum item disimpan ──
  const saveItem = () => {
    const err = validateItem(modalKey, modalItem);
    if (err) { alert(err); return; }

    const target = targetOf(modalKey);
    setForm((f) => {
      const arr = [...f[target]];
      if (editIdx !== null) arr[editIdx] = modalItem;
      else arr.push(modalItem);
      return { ...f, [target]: arr };
    });
    setShowModal(false);
  };

  // ── Validasi sebelum lanjut ke step berikutnya ──
  const canGoNext = () => {
    if (currentStep.key === 'informasi') return informasiValid(form);
    if (currentStep.key === 'review') return false;
    // Analisis wajib punya minimal 1 item; Sewa Alat di step yang sama sifatnya opsional
    if (currentStep.key === 'analisis_alat') return form.layanan_analisis.length > 0;
    return currentStep.services.some((s) => form[s.target].length > 0);
  };

  const handleNext = () => {
    if (currentStep.key === 'informasi' && !informasiValid(form)) {
      alert(`Mohon lengkapi field wajib: ${getInformasiMissing(form).join(', ')}`);
      return;
    }
    setStepIdx((i) => Math.min(wizardSteps.length - 1, i + 1));
  };

  // ── Submit order ke backend — no_invoice & status_pengujian dibuat otomatis di server ──
  const handleSubmit = async () => {
    if (!informasiValid(form)) {
      alert(`Mohon lengkapi field wajib di step Informasi: ${getInformasiMissing(form).join(', ')}`);
      return;
    }
    if (!form.syarat_ketentuan) { alert('Mohon setujui syarat dan ketentuan terlebih dahulu.'); return; }
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        id_affiliate: id,
        nama_lengkap: form.nama_lengkap,
        email: form.email,
        no_telp: form.no_telp,
        no_whatsapp: form.no_whatsapp,
        jenis_institusi: form.jenis_institusi,
        nama_institusi: form.nama_institusi,
        program_studi: form.program_studi,
        fakultas: form.fakultas,
        nama_pembimbing: form.nama_pembimbing,
        catatan: form.catatan,
        // ── Mapping field FE -> field schema OrderAffiliate ──
        layanan_analisis: form.layanan_analisis.map((item) => ({
          jenis_layanan: item.jenis_layanan,
          nama_sample: item.nama_sample,
          pelarut: item.pelarut,
          jumlah_sample: Number(item.jumlah_sample) || 0,
          metode_parameter: item.metode_parameter,
          foto_sample: item.foto_sample,
          jurnal_pendukung: item.jurnal_pendukung,
          keterangan: item.keterangan,
        })),
        sewa_alat: form.sewa_alat.map((item) => ({
          nama_alat: item.nama_alat,
          jenis_sewa: item.jenis_sewa,
          tanggal_mulai: item.tanggal_mulai,
          tanggal_selesai: item.tanggal_selesai,
          jumlah: Number(item.jumlah) || 0,
          keterangan: item.keterangan,
        })),
        sewa_lab: form.sewa_lab.map((item) => ({
          jenis_sewa: item.jenis_sewa,
          tanggal_mulai: item.tanggal_mulai,
          tanggal_selesai: item.tanggal_selesai,
          jumlah: Number(item.jumlah) || 0,
          keterangan: item.keterangan,
        })),
        pembelian_bahan: form.pembelian_bahan.map((item) => ({
          jenis_bahan: item.jenis_bahan,
          jumlah: Number(item.jumlah) || 0,
          satuan: item.satuan,
          nomor_produk: item.nomor_produk,
          keterangan: item.keterangan,
        })),
        syarat_ketentuan: form.syarat_ketentuan,
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate`, payload, { withCredentials: true });

      if (res.data.success) {
        alert(`Permintaan order berhasil dikirim! No. Invoice: ${res.data.data.no_invoice}`);
        router.push('/my_order');
      } else {
        alert(res.data.message || 'Gagal mengirim order');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ══════════════════════ PHASE: CHECKLIST ══════════════════════
  if (phase === 'checklist') {
    return (
      <main className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-lg font-bold text-gray-900 mb-1">Buat Order</p>
          <p className="text-sm text-gray-500 mb-5">Pilih layanan yang ingin diajukan</p>

          <div className="flex flex-col gap-2">
            {SERVICE_OPTIONS.map((s) => {
              const active = selected.has(s.key);
              return (
                <button
                  key={s.key} type="button" onClick={() => toggleService(s.key)}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-xl text-left transition ${active ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 ${active ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                    {active && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <s.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">{s.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={startWizard}
            disabled={selected.size === 0}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
          >
            Lanjut <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    );
  }

  // ══════════════════════ PHASE: WIZARD ══════════════════════
  return (
    <main className="max-w-2xl mx-auto p-6 pb-10">

      {/* Progress */}
      <div className="flex items-center mb-8 overflow-x-auto">
        {wizardSteps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition ${i === stepIdx ? 'bg-red-600 text-white' : i < stepIdx ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                {i < stepIdx ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${i === stepIdx ? 'text-red-700' : 'text-gray-400'}`}>{s.label}</span>
            </div>
            {i < wizardSteps.length - 1 && <div className={`w-10 h-0.5 mx-1 ${i < stepIdx ? 'bg-red-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-1">Step {stepIdx + 1} dari {wizardSteps.length}</p>
      <h2 className="text-xl font-bold text-gray-900 mb-5">{currentStep.label}</h2>

      {/* ── Step: Informasi Pemesan — mengikuti pola Order_analisis.jsx ── */}
      {currentStep.key === 'informasi' && (
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none px-1">
            <input type="checkbox" checked={untukOrangLain} onChange={handleUntukOrangLain} className="w-4 h-4 accent-red-500 flex-shrink-0" />
            <span className="text-sm text-gray-600">Order untuk orang lain</span>
          </label>

          <p className="text-xs text-gray-400 -mt-2 px-1">Field bertanda <span className="text-red-500">*</span> wajib diisi</p>

          <TextField label="Nama Lengkap" required value={form.nama_lengkap} readOnly={!untukOrangLain}
            placeholder="Contoh: Budi Santoso" onChange={(v) => setForm((f) => ({ ...f, nama_lengkap: v }))} />
          <TextField label="Email" required type="email" value={form.email} readOnly={!untukOrangLain}
            placeholder="nama@email.com" onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <TextField label="No. Telepon" value={form.no_telp} readOnly={!untukOrangLain}
            placeholder="Contoh: 022xxxxxxx" onChange={(v) => setForm((f) => ({ ...f, no_telp: v }))} />
          <TextField label="No. WhatsApp" required value={form.no_whatsapp} readOnly={!untukOrangLain}
            placeholder="Contoh: 08xxxxxxxxxx" onChange={(v) => setForm((f) => ({ ...f, no_whatsapp: v }))} />
          <TextField label="Jenis Institusi" required value={form.jenis_institusi} readOnly={!untukOrangLain}
            placeholder="Contoh: Perguruan Tinggi / SMA / Instansi Swasta" onChange={(v) => setForm((f) => ({ ...f, jenis_institusi: v }))} />
          <TextField label="Nama Institusi" required value={form.nama_institusi} readOnly={!untukOrangLain}
            placeholder="Contoh: Universitas Pendidikan Indonesia" onChange={(v) => setForm((f) => ({ ...f, nama_institusi: v }))} />
          <TextField label="Program Studi" value={form.program_studi} readOnly={!untukOrangLain}
            placeholder="Contoh: Pendidikan Kimia" onChange={(v) => setForm((f) => ({ ...f, program_studi: v }))} />
          <TextField label="Fakultas" value={form.fakultas} readOnly={!untukOrangLain}
            placeholder="Contoh: FPMIPA" onChange={(v) => setForm((f) => ({ ...f, fakultas: v }))} />

          {/* Nama Pembimbing — khusus field order lab, selalu editable (tidak ada di data User), opsional */}
          <TextField label="Nama Pembimbing" value={form.nama_pembimbing} readOnly={false}
            placeholder="Nama dosen/guru pembimbing (opsional)" onChange={(v) => setForm((f) => ({ ...f, nama_pembimbing: v }))} />
        </div>
      )}

      {/* ── Step: Analisis & Sewa Alat (1 halaman, 2 seksi) ── */}
      {currentStep.key === 'analisis_alat' && (
        <div className="flex flex-col gap-8">
          {currentStep.services.map((s) => (
            <div key={s.key}>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <s.icon className="w-4 h-4 text-gray-400" /> {s.label}
                {s.key === 'analisis' ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-xs font-normal text-gray-400">(opsional)</span>
                )}
              </p>
              <button
                onClick={() => openAddItem(s.key)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-red-300 text-red-700 rounded-xl text-sm font-medium hover:bg-red-50 transition w-full justify-center mb-4"
              >
                <Plus className="w-4 h-4" /> Tambah {s.label}
              </button>
              <div className="flex flex-col gap-3">
                {form[s.target].length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Belum ada item ditambahkan</p>
                ) : form[s.target].map((item, idx) => (
                  <ItemCard key={idx} itemKey={s.key} item={item}
                    onEdit={() => openEditItem(s.key, item, idx)}
                    onDelete={() => deleteItem(s.target, idx)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Step: Sewa Lab / Pembelian Bahan ── */}
      {['sewa_lab', 'pembelian_bahan'].includes(currentStep.key) && (
        <div>
          <button
            onClick={() => openAddItem(currentStep.key)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-red-300 text-red-700 rounded-xl text-sm font-medium hover:bg-red-50 transition w-full justify-center mb-4"
          >
            <Plus className="w-4 h-4" /> Tambah {currentStep.label}
          </button>
          <div className="flex flex-col gap-3">
            {form[currentStep.key].length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada item ditambahkan</p>
            ) : form[currentStep.key].map((item, idx) => (
              <ItemCard key={idx} itemKey={currentStep.key} item={item}
                onEdit={() => openEditItem(currentStep.key, item, idx)}
                onDelete={() => deleteItem(currentStep.key, idx)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Step: Review — sekarang menampilkan detail lengkap tiap item + data pemesan lengkap ── */}
      {currentStep.key === 'review' && (
        <div className="flex flex-col gap-5">

          <ReviewItemSection title="Analisis" icon={FlaskConical} items={form.layanan_analisis} itemKey="analisis" />
          <ReviewItemSection title="Sewa Alat" icon={Wrench} items={form.sewa_alat} itemKey="sewa_alat" />
          <ReviewItemSection title="Sewa Lab" icon={DoorOpen} items={form.sewa_lab} itemKey="sewa_lab" />
          <ReviewItemSection title="Pembelian Bahan" icon={Package} items={form.pembelian_bahan} itemKey="pembelian_bahan" />

          {/* Data Pemesan lengkap */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Data Pemesan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <ReviewField label="Nama Lengkap" value={form.nama_lengkap} />
              <ReviewField label="Email" value={form.email} />
              <ReviewField label="No. Telepon" value={form.no_telp} />
              <ReviewField label="No. WhatsApp" value={form.no_whatsapp} />
              <ReviewField label="Jenis Institusi" value={form.jenis_institusi} />
              <ReviewField label="Nama Institusi" value={form.nama_institusi} />
              <ReviewField label="Program Studi" value={form.program_studi} />
              <ReviewField label="Fakultas" value={form.fakultas} />
              <ReviewField label="Nama Pembimbing" value={form.nama_pembimbing} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Catatan (opsional)</label>
            <textarea
              value={form.catatan} onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))} rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none placeholder:text-gray-400"
              placeholder="Tuliskan catatan tambahan jika ada..."
            />
          </div>

          {form.catatan && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview Catatan</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{form.catatan}</p>
            </div>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.syarat_ketentuan}
              onChange={(e) => setForm((f) => ({ ...f, syarat_ketentuan: e.target.checked }))}
              className="mt-0.5 accent-red-500 w-4 h-4 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              Saya telah memahami syarat dan ketentuan yang berlaku di laboratorium. <span className="text-red-500">*</span>
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : <><Send className="w-4 h-4" /> Kirim Permintaan</>}
          </button>
        </div>
      )}

      {/* ── Navigasi — "Kembali" tetap tampil di step Review, "Lanjut" disembunyikan di sana ── */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={stepIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        {currentStep.key !== 'review' && (
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
          >
            Lanjut <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Modal Tambah/Edit Item ── */}
      {showModal && (
        <ItemModal
          itemKey={modalKey} item={modalItem} setItem={setModalItem}
          masterAnalisis={masterAnalisis} loadingMaster={loadingMaster}
          onClose={() => setShowModal(false)} onSave={saveItem}
        />
      )}
    </main>
  );
}

// ── Field text — mendukung readOnly, placeholder, dan indikator wajib ──
function TextField({ label, value, onChange, readOnly = false, placeholder = '', required = false, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} value={value} readOnly={readOnly} placeholder={placeholder}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        className={`mt-1 ${readOnly ? iReadOnlyClass : iClass}`}
      />
    </div>
  );
}

// ── Card ringkas 1 item dengan tombol Edit/Hapus (dipakai di step pengisian) ──
function ItemCard({ itemKey, item, onEdit, onDelete }) {
  const title = () => {
    if (itemKey === 'analisis') return item.jenis_layanan?.join(', ') || '(belum diisi)';
    if (itemKey === 'sewa_alat') return item.nama_alat || '(belum diisi)';
    if (itemKey === 'sewa_lab') return `Sewa Lab (${item.jenis_sewa || '-'})`;
    if (itemKey === 'pembelian_bahan') return item.jenis_bahan || '(belum diisi)';
    return '-';
  };
  const subtitle = () => {
    if (itemKey === 'analisis') return `${item.nama_sample || '-'} · ${item.jumlah_sample || 0} sampel`;
    if (itemKey === 'sewa_alat') return `${item.jenis_sewa || '-'} · ${item.tanggal_mulai || '-'} s/d ${item.tanggal_selesai || '-'} · ${item.jumlah || 0}`;
    if (itemKey === 'sewa_lab') return `${item.tanggal_mulai || '-'} s/d ${item.tanggal_selesai || '-'}`;
    if (itemKey === 'pembelian_bahan') return `${item.jumlah || 0} ${item.satuan || ''}`;
    return '';
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title()}</p>
        <p className="text-xs text-gray-500 truncate">{subtitle()}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
        <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 transition"><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
      </div>
    </div>
  );
}

// ── Baris label:value kecil di kartu Data Pemesan pada Review ──
function ReviewField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value && value.toString().trim() !== '' ? value : '—'}</p>
    </div>
  );
}

// ── Rows detail lengkap per jenis item, dipakai di Review ──
const getItemDetailRows = (itemKey, item) => {
  if (itemKey === 'analisis') return [
    { label: 'Jenis Layanan', value: item.jenis_layanan?.length ? item.jenis_layanan.join(', ') : null },
    { label: 'Nama Sampel', value: item.nama_sample },
    { label: 'Pelarut', value: item.pelarut },
    { label: 'Jumlah Sampel', value: item.jumlah_sample },
    { label: 'Metode / Parameter', value: item.metode_parameter },
    { label: 'Foto Sampel', value: item.foto_sample },
    { label: 'Jurnal Pendukung', value: item.jurnal_pendukung },
    { label: 'Keterangan', value: item.keterangan },
  ];
  if (itemKey === 'sewa_alat') return [
    { label: 'Nama Alat', value: item.nama_alat },
    { label: 'Jenis Sewa', value: item.jenis_sewa },
    { label: 'Tanggal Mulai', value: item.tanggal_mulai },
    { label: 'Tanggal Selesai', value: item.tanggal_selesai },
    { label: 'Jumlah', value: item.jumlah },
    { label: 'Keterangan', value: item.keterangan },
  ];
  if (itemKey === 'sewa_lab') return [
    { label: 'Jenis Sewa', value: item.jenis_sewa },
    { label: 'Tanggal Mulai', value: item.tanggal_mulai },
    { label: 'Tanggal Selesai', value: item.tanggal_selesai },
    { label: 'Jumlah', value: item.jumlah },
    { label: 'Keterangan', value: item.keterangan },
  ];
  if (itemKey === 'pembelian_bahan') return [
    { label: 'Jenis Bahan', value: item.jenis_bahan },
    { label: 'Jumlah', value: item.jumlah },
    { label: 'Satuan', value: item.satuan },
    { label: 'Nomor Produk', value: item.nomor_produk },
    { label: 'Keterangan', value: item.keterangan },
  ];
  return [];
};

// ── Section Review per kategori — tampil hanya jika ada item, menampilkan detail penuh tiap item ──
function ReviewItemSection({ title, icon: Icon, items, itemKey }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" /> {title}
        </p>
        <span className="text-xs font-medium text-gray-400">{items.length} item</span>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const rows = getItemDetailRows(itemKey, item).filter((r) => r.value && r.value.toString().trim() !== '');
          return (
            <div key={idx} className="border border-gray-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Item {idx + 1}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-700">
                {rows.length > 0 ? rows.map((r) => (
                  <p key={r.label}><span className="text-gray-400">{r.label}:</span> {r.value}</p>
                )) : (
                  <p className="text-gray-400 italic">Tidak ada detail tambahan</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Modal form tambah/edit ──
function ItemModal({ itemKey, item, setItem, masterAnalisis, loadingMaster, onClose, onSave }) {
  const set = (key, value) => setItem((f) => ({ ...f, [key]: value }));
  const toggleChecklist = (key, value) => setItem((f) => {
    const arr = f[key] || [];
    return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
  });

  const uploadFile = async (e, field, category) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=${category}`, formData, {
        withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' },
      });
      set(field, res.data.filename);
    } catch (err) { alert('Upload gagal: ' + err.message); }
  };

  const labelMap = { analisis: 'Analisis', sewa_alat: 'Sewa Alat', sewa_lab: 'Sewa Lab', pembelian_bahan: 'Pembelian Bahan' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition text-gray-400"><X className="w-4 h-4" /></button>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{labelMap[itemKey]}</h2>
        <p className="text-xs text-gray-400 mb-4">Field bertanda <span className="text-red-500">*</span> wajib diisi</p>

        <div className="flex flex-col gap-4">

          {itemKey === 'analisis' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">
                  Jenis Layanan <span className="text-red-500">*</span>
                </label>
                {loadingMaster ? (
                  <p className="text-xs text-gray-400 italic px-2 py-3">Memuat daftar layanan...</p>
                ) : masterAnalisis.length === 0 ? (
                  <p className="text-xs text-gray-400 italic px-2 py-3 border border-gray-200 rounded-lg">
                    Lab ini belum memiliki master layanan analisis. Hubungi admin lab.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {masterAnalisis.map((j) => (
                      <label key={j} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={item.jenis_layanan.includes(j)} onChange={() => toggleChecklist('jenis_layanan', j)} className="accent-red-500" />
                        {j}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <TextField label="Nama Sampel" required value={item.nama_sample} placeholder="Contoh: Ekstrak Daun Sirsak" onChange={(v) => set('nama_sample', v)} />
              <TextField label="Pelarut" value={item.pelarut} placeholder="Contoh: Etanol 96% (opsional)" onChange={(v) => set('pelarut', v)} />
              <TextField label="Jumlah Sampel" required type="number" value={item.jumlah_sample} placeholder="Contoh: 5" onChange={(v) => set('jumlah_sample', v)} />
              <TextField label="Metode / Parameter" value={item.metode_parameter} placeholder="Contoh: GC-MS / Kadar Air (opsional)" onChange={(v) => set('metode_parameter', v)} />
              <FileField label="Foto Sampel (opsional)" onChange={(e) => uploadFile(e, 'foto_sample', 'fotosample')} uploaded={item.foto_sample} />
              <FileField label="Jurnal Pendukung (opsional)" onChange={(e) => uploadFile(e, 'jurnal_pendukung', 'jurnalpendukung')} uploaded={item.jurnal_pendukung} />
            </>
          )}

          {itemKey === 'sewa_alat' && (
            <>
              <TextField label="Nama Alat" required value={item.nama_alat} placeholder="Contoh: Rotary Evaporator" onChange={(v) => set('nama_alat', v)} />
              <div>
                <label className="text-xs font-medium text-gray-500">Jenis Sewa <span className="text-red-500">*</span></label>
                <select value={item.jenis_sewa} onChange={(e) => set('jenis_sewa', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="">Pilih...</option>
                  <option value="Jam">Jam</option>
                  <option value="Hari">Hari</option>
                  <option value="Bulan">Bulan</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input type="date" value={item.tanggal_mulai} onChange={(e) => set('tanggal_mulai', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input type="date" value={item.tanggal_selesai} onChange={(e) => set('tanggal_selesai', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <TextField label="Jumlah (sesuai jenis sewa)" required type="number" value={item.jumlah} placeholder="Contoh: 3" onChange={(v) => set('jumlah', v)} />
            </>
          )}

          {itemKey === 'sewa_lab' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500">Jenis Sewa <span className="text-red-500">*</span></label>
                <select value={item.jenis_sewa} onChange={(e) => set('jenis_sewa', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="">Pilih...</option>
                  <option value="Hari">Hari</option>
                  <option value="Bulan">Bulan</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input type="date" value={item.tanggal_mulai} onChange={(e) => set('tanggal_mulai', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input type="date" value={item.tanggal_selesai} onChange={(e) => set('tanggal_selesai', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <TextField label="Jumlah (sesuai jenis sewa)" required type="number" value={item.jumlah} placeholder="Contoh: 2" onChange={(v) => set('jumlah', v)} />
            </>
          )}

          {itemKey === 'pembelian_bahan' && (
            <>
              <TextField label="Jenis Bahan" required value={item.jenis_bahan} placeholder="Contoh: Asam Sulfat (H2SO4)" onChange={(v) => set('jenis_bahan', v)} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Jumlah" required type="number" value={item.jumlah} placeholder="Contoh: 2" onChange={(v) => set('jumlah', v)} />
                <TextField label="Satuan" required value={item.satuan} placeholder="Contoh: Liter / Kg" onChange={(v) => set('satuan', v)} />
              </div>
              <TextField label="Nomor Produk" value={item.nomor_produk} placeholder="Nomor katalog/produk (opsional)" onChange={(v) => set('nomor_produk', v)} />
            </>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500">Keterangan (opsional)</label>
            <textarea value={item.keterangan} onChange={(e) => set('keterangan', e.target.value)} rows={2}
              placeholder="Tambahkan catatan untuk item ini jika perlu..."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none placeholder:text-gray-400" />
          </div>

          <button onClick={onSave} className="mt-1 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Upload field kecil ──
function FileField({ label, onChange, uploaded }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
      <input type="file" onChange={onChange} className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition" />
      {uploaded && <p className="text-xs text-green-600 mt-1">✓ {uploaded}</p>}
    </div>
  );
}