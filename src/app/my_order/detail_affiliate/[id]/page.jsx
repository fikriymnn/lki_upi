// src/app/my_order/detail_affiliate/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    FileText, Download, CreditCard, ChevronLeft, Upload, Check, X, User,
    Building2, FlaskConical, Boxes, CalendarDays, PackageCheck, Pencil,
    Save, Plus, Trash2, ChevronDown, Loader2, UploadCloud, FileCheck,
    Send, Clock, AlertTriangle, ArrowRight, // ✅ tambahan untuk StatusInfoPanel
} from "lucide-react";
import InvoiceTemplate from "../../../../components/affiliate/InvoiceTemplate"; // ⚠️ sesuaikan path sesuai lokasi file di project-mu
import KwitansiTemplate from "../../../../components/affiliate/KwitansiTemplate"; // ⚠️ sesuaikan path sesuai lokasi file di project-mu

// Harus sama persis dengan STATUS_OPTIONS di order_affiliate_controller.js (BE)
const STATUS_STEPS = [
    "Menunggu Order Dikonfirmasi",
    "Order Dikonfirmasi",
    "Order Diproses",
    "Menunggu Diverifikasi",
    "Selesai Diverifikasi",
    "Menunggu Pembayaran",
    "Menunggu Verifikasi Pembayaran",
    "Selesai",
];

// ── Data order (data pemesan + rincian layanan) hanya boleh diedit user SEBELUM laboran mulai
// memproses sample — begitu status jadi "Order Diproses", data sudah jadi acuan kerja laboran. ──
const DATA_EDITABLE_STATUS = ["Menunggu Order Dikonfirmasi", "Order Dikonfirmasi"];

// ───────────────────────── Kategori file (samakan dgn backend, konsisten di semua role) ─────────────────────────
const FILE_CATEGORY = {
    laporan: "laporan",
    rincian_biaya: "rincianbiaya",
    foto_sample: "fotosample",
    jurnal_pendukung: "jurnalpendukung",
    hasil_analisis: "hasilanalisis",
    bukti_pembayaran: "buktipembayaran",
};

const FILE_BASE_URL = process.env.NEXT_PUBLIC_FILE_URL;

// Kalau value sudah full URL (data lama) dipakai apa adanya,
// kalau cuma nama file dibangun jadi {FILE_URL}/file/{category}/{filename}
const buildFileUrl = (category, value) => {
    if (!value) return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${FILE_BASE_URL}/file/${category}/${value}`;
};

// ─────────────────────────── Panel info status untuk user — menjelaskan apa yang perlu dilakukan ───────────────────────────
function StatusInfoPanel({ status, noInvoice, namaLab, catatan, onGoToDokumen }) {
    const MAP = {
        "Menunggu Order Dikonfirmasi": {
            cls: "border-gray-200 bg-gray-50",
            iconCls: "text-gray-500 bg-gray-100",
            icon: Clock,
            title: "Menunggu Konfirmasi Laboran",
            desc: "Order Anda sedang menunggu konfirmasi dari laboran. Anda akan melihat perubahan status di sini begitu order dikonfirmasi atau ditolak.",
        },
        "Order Dikonfirmasi": {
            cls: "border-blue-200 bg-blue-50",
            iconCls: "text-blue-600 bg-blue-100",
            icon: Send,
            title: "Kirim Sample ke Laboratorium",
            desc: `Order telah dikonfirmasi oleh ${namaLab || "laboratorium tujuan"}. Segera kirimkan sample Anda ke alamat laboratorium di atas, dan sertakan nomor invoice (${noInvoice || "—"}) pada kemasan agar mudah diidentifikasi oleh laboran.`,
        },
        "Order Ditolak": {
            cls: "border-red-200 bg-red-50",
            iconCls: "text-red-600 bg-red-100",
            icon: AlertTriangle,
            title: "Order Ditolak",
            desc: catatan
                ? `Mohon maaf, order ini ditolak oleh laboran. Catatan: ${catatan}`
                : "Mohon maaf, order ini ditolak oleh laboran. Silakan hubungi laboratorium mitra untuk informasi lebih lanjut.",
        },
        "Order Diproses": {
            cls: "border-indigo-200 bg-indigo-50",
            iconCls: "text-indigo-600 bg-indigo-100",
            icon: FlaskConical,
            title: "Sample Sedang Diproses",
            desc: "Sample Anda sedang diproses dan dianalisis oleh laboran. Mohon tunggu hingga tahap pengujian selesai, tidak ada tindakan yang perlu Anda lakukan saat ini.",
        },
        "Menunggu Diverifikasi": {
            cls: "border-yellow-200 bg-yellow-50",
            iconCls: "text-yellow-600 bg-yellow-100",
            icon: Clock,
            title: "Menunggu Verifikasi Ketua Lab",
            desc: "Laporan hasil pengujian sudah diunggah laboran dan sedang menunggu verifikasi dari ketua lab sebelum invoice diterbitkan.",
        },
        "Selesai Diverifikasi": {
            cls: "border-cyan-200 bg-cyan-50",
            iconCls: "text-cyan-600 bg-cyan-100",
            icon: FileCheck,
            title: "Menunggu Invoice dari Admin",
            desc: "Laporan sudah diverifikasi oleh ketua lab. Admin sedang menyiapkan rincian invoice untuk order Anda.",
        },
        "Menunggu Pembayaran": {
            cls: "border-orange-200 bg-orange-50",
            iconCls: "text-orange-600 bg-orange-100",
            icon: CreditCard,
            title: "Lakukan Pembayaran",
            desc: "Invoice sudah tersedia. Silakan unduh invoice, lakukan pembayaran sesuai rincian, lalu unggah bukti pembayaran Anda.",
            actionLabel: "Buka Dokumen & Pembayaran",
        },
        "Menunggu Verifikasi Pembayaran": {
            cls: "border-amber-200 bg-amber-50",
            iconCls: "text-amber-600 bg-amber-100",
            icon: Clock,
            title: "Menunggu Verifikasi Pembayaran",
            desc: "Bukti pembayaran Anda sudah dikirim dan sedang diverifikasi oleh admin. Proses ini biasanya memakan waktu 1x24 jam kerja.",
        },
        "Selesai": {
            cls: "border-green-200 bg-green-50",
            iconCls: "text-green-600 bg-green-100",
            icon: PackageCheck,
            title: "Order Selesai",
            desc: "Pembayaran telah dikonfirmasi. Anda sudah bisa mengunduh hasil analisis dan kuitansi pembayaran.",
            actionLabel: "Unduh Hasil & Kuitansi",
        },
    };

    const info = MAP[status];
    if (!info) return null;
    const Icon = info.icon;

    return (
        <div className={`border rounded-xl p-4 mb-6 ${info.cls}`}>
            <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${info.iconCls}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{info.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{info.desc}</p>
                    {info.actionLabel && (
                        <button
                            onClick={onGoToDokumen}
                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            {info.actionLabel} <ArrowRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Upload satu file ke API file server → mengembalikan URL siap-pakai untuk href
const uploadFileToServer = async (file, category, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
        `${FILE_BASE_URL}/api/file?category=${category}`,
        formData,
        {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 10 * 60 * 1000, // 10 menit, jaga-jaga file besar / koneksi lambat
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

const statusBadge = (status) => {
    const map = {
        "Selesai": "bg-green-100 text-green-800",
        "Order Ditolak": "bg-red-100 text-red-800",
        "Menunggu Pembayaran": "bg-amber-100 text-amber-800",
        "Menunggu Verifikasi Pembayaran": "bg-amber-100 text-amber-800",
        "Menunggu Order Dikonfirmasi": "bg-gray-100 text-gray-700",
        "Order Dikonfirmasi": "bg-blue-100 text-blue-800",
        "Order Diproses": "bg-blue-100 text-blue-800",
        "Menunggu Diverifikasi": "bg-purple-100 text-purple-800",
        "Selesai Diverifikasi": "bg-purple-100 text-purple-800",
    };
    return map[status] || "bg-gray-100 text-gray-700";
};

const formatTanggal = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit", month: "long", year: "numeric",
    });
};

const formatRupiah = (angka) => {
    if (angka === undefined || angka === null) return "—";
    return `Rp ${angka.toLocaleString("id-ID")}`;
};

// ── Field data pemesan yang bisa diedit user (mengikuti field yang sudah ditampilkan di tab Ringkasan) ──
const APPLICANT_EDIT_FIELDS = [
    { key: "nama_lengkap", label: "Nama Lengkap" },
    { key: "email", label: "Email" },
    { key: "no_whatsapp", label: "No. WhatsApp" },
    { key: "no_telp", label: "No. Telepon" },
    { key: "jenis_institusi", label: "Jenis Institusi", isSelect: true, options: ["Sekolah", "Perguruan Tinggi", "Industri", "Lainnya"] },
    { key: "nama_institusi", label: "Nama Institusi" },
    { key: "nama_pembimbing", label: "Nama Pembimbing" },
    { key: "fakultas", label: "Fakultas", conditional: "Perguruan Tinggi" },
    { key: "program_studi", label: "Program Studi", conditional: "Perguruan Tinggi" },
    { key: "catatan", label: "Catatan", isTextarea: true },
];

// ── Master data & konfigurasi rincian layanan — sama persis dengan yang dipakai di halaman admin
// (AffiliateOrder.jsx) supaya field/opsinya konsisten ──
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
        title: 'Sewa Lab', icon: CalendarDays, cls: 'text-purple-700 bg-purple-50',
        fields: [
            { key: 'jenis_sewa', label: 'Jenis Sewa' },
            { key: 'tanggal_mulai', label: 'Tanggal Mulai', isDate: true },
            { key: 'tanggal_selesai', label: 'Tanggal Selesai', isDate: true },
            { key: 'jumlah', label: 'Jumlah' },
            { key: 'keterangan', label: 'Keterangan' },
        ],
    },
    sewa_alat: {
        title: 'Sewa Alat', icon: Boxes, cls: 'text-blue-700 bg-blue-50',
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
        title: 'Pembelian Bahan', icon: PackageCheck, cls: 'text-amber-700 bg-amber-50',
        fields: [
            { key: 'jenis_bahan', label: 'Jenis Bahan' },
            { key: 'satuan', label: 'Satuan' },
            { key: 'keterangan', label: 'Keterangan' },
        ],
    },
};

const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent";

export default function DetailAffiliate({ params }) {
    const { id } = params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info");

    // ── Bukti pembayaran ──
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [addBukti, setAddBukti] = useState(false);

    // ── Invoice & Kuitansi ──
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [isGeneratingKwitansi, setIsGeneratingKwitansi] = useState(false);
    const [kwitansiData, setKwitansiData] = useState(null);

    // ── Edit data pemesan + rincian layanan ──
    const [editMode, setEditMode] = useState(false);
    const [editDraft, setEditDraft] = useState(null);
    const [saving, setSaving] = useState(false);

    // id unik untuk elemen invoice/kuitansi yang di-capture jadi PDF
    const printId = `invoice-print-${id}`;
    const kwitansiPrintId = `kwitansi-print-${id}`;

    useEffect(() => {
        async function getOrder() {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${id}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    setOrder(res.data.data);
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
        getOrder();
    }, [id]);

    // ─────────────────────────── Upload Bukti Pembayaran (via file server, konsisten dgn role lain) ───────────────────────────
    const handleUploadBukti = async () => {
        if (!buktiPembayaran) {
            alert("Pilih file terlebih dahulu");
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        try {
            const url = await uploadFileToServer(buktiPembayaran, FILE_CATEGORY.bukti_pembayaran, (percent) => {
                setUploadProgress(percent);
            });

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${id}/bukti_pembayaran`,
                { bukti_pembayaran: url },
                { withCredentials: true }
            );
            if (res.data.success) {
                setOrder(res.data.data);
                setAddBukti(false);
                setBuktiPembayaran(null);
                alert("Bukti pembayaran berhasil dikirim");
            } else {
                alert(res.data.message || "Gagal mengirim bukti pembayaran");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Gagal upload bukti pembayaran");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // ==============================
    // DOWNLOAD INVOICE — full client-side.
    // InvoiceTemplate dirender tersembunyi di DOM, lalu di-capture jadi PNG via html2canvas,
    // dibungkus jadi PDF via jsPDF. Tidak ada request ke server untuk generate file-nya.
    // ==============================
    const downloadInvoice = async () => {
        const element = document.getElementById(printId);
        if (!element) {
            alert("Data invoice belum tersedia");
            return;
        }

        setIsGeneratingInvoice(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const filename = order?.no_invoice
                ? `${order.no_invoice.replace(/\//g, "_")}_invoice.pdf`
                : `invoice_${id}.pdf`;

            pdf.save(filename);
        } catch (err) {
            alert(err.message || "Gagal membuat invoice PDF");
        } finally {
            setIsGeneratingInvoice(false);
        }
    };

    // ==============================
    // DOWNLOAD KUITANSI — hanya tersedia setelah status "Selesai".
    // Data kuitansi diambil dari BE (biasanya berisi info pembayaran, tanggal lunas, dll)
    // lalu dirender ke KwitansiTemplate tersembunyi, di-capture jadi PDF sama seperti invoice.
    // ==============================
    const downloadKuitansi = async () => {
        if (isGeneratingKwitansi || !order?._id) return;
        setIsGeneratingKwitansi(true);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${order._id}/kwitansi`,
                { withCredentials: true }
            );
            if (!res.data.success) {
                alert(res.data.message || "Gagal mengambil data kuitansi");
                return;
            }
            const kwitansi = res.data.data;
            setKwitansiData(kwitansi);

            // beri waktu agar template kuitansi selesai ter-render dulu sebelum di-capture
            await new Promise((resolve) => setTimeout(resolve, 150));

            const element = document.getElementById(kwitansiPrintId);
            if (!element) {
                alert("Template kuitansi belum siap, coba lagi");
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const filename = kwitansi?.no_kwitansi
                ? `${kwitansi.no_kwitansi.replace(/\//g, "_")}_kuitansi.pdf`
                : `kuitansi_${id}.pdf`;

            pdf.save(filename);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Gagal membuat kuitansi PDF");
        } finally {
            setIsGeneratingKwitansi(false);
            setKwitansiData(null);
        }
    };

    // ─────────────────────────── Edit data order (data pemesan + rincian layanan) ───────────────────────────
    const startEdit = () => {
        setEditDraft(JSON.parse(JSON.stringify(order)));
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
                catatan: editDraft.catatan,
                layanan_analisis: editDraft.layanan_analisis,
                sewa_lab: editDraft.sewa_lab,
                sewa_alat: editDraft.sewa_alat,
                pembelian_bahan: editDraft.pembelian_bahan,
            };
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${id}/data`,
                payload,
                { withCredentials: true }
            );
            if (res.data.success) {
                setOrder(res.data.data);
                setEditMode(false);
                setEditDraft(null);
            } else {
                alert(res.data.message || "Gagal menyimpan perubahan");
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

    if (loading) {
        return (
            <div className="p-6 max-w-5xl mx-auto animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                <div className="h-40 bg-gray-200 rounded-xl mb-4" />
                <div className="h-40 bg-gray-200 rounded-xl" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 max-w-5xl mx-auto text-center py-20">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Data order tidak ditemukan</p>
            </div>
        );
    }

    const isDitolak = order.status_pengujian === "Order Ditolak";
    const currentStepIndex = STATUS_STEPS.indexOf(order.status_pengujian);

    const invoiceAvailable = [
        "Menunggu Pembayaran",
        "Menunggu Verifikasi Pembayaran",
        "Selesai",
    ].includes(order.status_pengujian);

    // Kuitansi hanya tersedia setelah order benar-benar "Selesai"
    const kuitansiAvailable = order.status_pengujian === "Selesai";

    const buktiPembayaranEditable = [
        "Menunggu Pembayaran",
        "Menunggu Verifikasi Pembayaran",
        "Selesai",
    ].includes(order.status_pengujian);

    const hasilAnalisisAvailable = order.status_pengujian === "Selesai" && order.hasil_analisis;

    // Data order (data pemesan + rincian layanan) hanya boleh diedit selama status masih di window awal
    const isDataEditableWindow = DATA_EDITABLE_STATUS.includes(order.status_pengujian);

    const itemCount =
        (order.layanan_analisis?.length || 0) +
        (order.sewa_lab?.length || 0) +
        (order.sewa_alat?.length || 0) +
        (order.pembelian_bahan?.length || 0);

    // Gabungkan semua item layanan jadi satu list dengan label kategori (tampilan read-only)
    const semuaItem = [
        ...(order.layanan_analisis || []).map((it) => ({ ...it, kategori: "Layanan Analisis", _fileFields: FIELD_CONFIG.layanan_analisis.fileFields })),
        ...(order.sewa_lab || []).map((it) => ({ ...it, kategori: "Sewa Lab" })),
        ...(order.sewa_alat || []).map((it) => ({ ...it, kategori: "Sewa Alat" })),
        ...(order.pembelian_bahan || []).map((it) => ({ ...it, kategori: "Pembelian Bahan" })),
    ];

    const tabs = [
        { key: "info", label: "Ringkasan Order", icon: <FileText className="w-4 h-4" /> },
        { key: "dokumen", label: "Dokumen & Pembayaran", icon: <CreditCard className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Order Affiliate</h1>
                    <p className="text-sm text-gray-500">
                        Order layanan ke {order?.id_affiliate?.nama_laboratorium || "laboratorium mitra"}
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 mb-1">No. Invoice</p>
                    <p className="text-base font-semibold text-gray-900">{order?.no_invoice || "—"}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTanggal(order?.date)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 mb-1">Total Biaya</p>
                    <p className="text-2xl font-bold text-blue-600">{formatRupiah(order?.total_keseluruhan)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {order?.total_keseluruhan ? "sudah dihitung admin" : "belum dihitung admin"}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 mb-1">Status Order</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(order?.status_pengujian)}`}>
                        {order?.status_pengujian || "—"}
                    </span>
                </div>
            </div>

            {/* ── Panel info & langkah selanjutnya, sesuai status order saat ini ── */}
            <StatusInfoPanel
                status={order.status_pengujian}
                noInvoice={order?.no_invoice}
                namaLab={order?.id_affiliate?.nama_laboratorium}
                catatan={order?.catatan}
                onGoToDokumen={() => setActiveTab("dokumen")}
            />

            {/* Tab Bar */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === t.key
                                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                                : "text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab: Ringkasan Order */}
            {activeTab === "info" && (
                <div className="space-y-4">

                    {/* Lab Affiliate Tujuan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" /> Laboratorium Tujuan
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-400">Nama Laboratorium</p>
                                <p className="text-sm font-medium mt-0.5">{order?.id_affiliate?.nama_laboratorium || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-medium mt-0.5">{order?.id_affiliate?.email || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">No. WhatsApp</p>
                                <p className="text-sm font-medium mt-0.5">{order?.id_affiliate?.no_whatsapp || "—"}</p>
                            </div>
                            <div className="md:col-span-3">
                                <p className="text-xs text-gray-400">Alamat</p>
                                <p className="text-sm font-medium mt-0.5">{order?.id_affiliate?.alamat || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Pemesan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Data Pemesan
                            </p>

                            {isDataEditableWindow && (
                                !editMode ? (
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
                                )
                            )}
                        </div>

                        {editMode ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {APPLICANT_EDIT_FIELDS
                                    .filter((f) => !f.conditional || editDraft.jenis_institusi === f.conditional)
                                    .map((f) => (
                                        <div key={f.key} className={`min-w-0 ${f.isTextarea ? 'md:col-span-3' : ''}`}>
                                            <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                                            {f.isSelect ? (
                                                <select
                                                    value={editDraft[f.key] || ''}
                                                    onChange={(e) => updateEditField(f.key, e.target.value)}
                                                    className={inputCls}
                                                >
                                                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            ) : f.isTextarea ? (
                                                <textarea
                                                    value={editDraft[f.key] || ''}
                                                    onChange={(e) => updateEditField(f.key, e.target.value)}
                                                    rows={3}
                                                    className={inputCls}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={editDraft[f.key] || ''}
                                                    onChange={(e) => updateEditField(f.key, e.target.value)}
                                                    className={inputCls}
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">Nama Lengkap</p>
                                    <p className="text-sm font-medium mt-0.5">{order?.nama_lengkap || order?.id_user?.nama_lengkap || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm font-medium mt-0.5">{order?.email || order?.id_user?.email || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">No. WhatsApp</p>
                                    <p className="text-sm font-medium mt-0.5">{order?.no_whatsapp || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">No. Telepon</p>
                                    <p className="text-sm font-medium mt-0.5">{order?.no_telp || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Jenis Institusi</p>
                                    <p className="text-sm font-medium mt-0.5">{order?.jenis_institusi || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Nama Institusi</p>
                                    <p className="text-sm font-medium mt-0.5">{order?.nama_institusi || "—"}</p>
                                </div>
                                {order?.program_studi && (
                                    <div>
                                        <p className="text-xs text-gray-400">Program Studi</p>
                                        <p className="text-sm font-medium mt-0.5">{order.program_studi}</p>
                                    </div>
                                )}
                                {order?.fakultas && (
                                    <div>
                                        <p className="text-xs text-gray-400">Fakultas</p>
                                        <p className="text-sm font-medium mt-0.5">{order.fakultas}</p>
                                    </div>
                                )}
                                {order?.nama_pembimbing && (
                                    <div>
                                        <p className="text-xs text-gray-400">Nama Pembimbing</p>
                                        <p className="text-sm font-medium mt-0.5">{order.nama_pembimbing}</p>
                                    </div>
                                )}
                                {order?.catatan && (
                                    <div className="md:col-span-3">
                                        <p className="text-xs text-gray-400">Catatan</p>
                                        <p className="text-sm font-medium mt-0.5 text-gray-600">{order.catatan}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!isDataEditableWindow && !editMode && (
                            <p className="text-[11px] text-gray-400 mt-4 pt-4 border-t border-gray-100">
                                Data order sudah tidak bisa diubah karena laboran sudah mulai memproses.
                            </p>
                        )}
                    </div>

                    {/* Rincian Item Layanan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Boxes className="w-3.5 h-3.5" /> Rincian Layanan
                        </p>

                        {editMode ? (
                            <div className="flex flex-col gap-5">
                                {Object.entries(FIELD_CONFIG).map(([jenis, cfg]) => (
                                    <ItemSectionEditable
                                        key={jenis}
                                        jenis={jenis}
                                        config={cfg}
                                        items={editDraft[jenis] || []}
                                        onUpdate={updateEditItem}
                                        onAdd={addEditItem}
                                        onRemove={removeEditItem}
                                        onUploadFile={uploadItemFile}
                                    />
                                ))}
                            </div>
                        ) : semuaItem.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {semuaItem.map((item, i) => {
                                    const fileLinks = (item._fileFields || [])
                                        .filter((ff) => item[ff.key])
                                        .map((ff) => ({ ...ff, url: buildFileUrl(FILE_CATEGORY[ff.key], item[ff.key]) }));

                                    return (
                                        <div key={i} className="border border-gray-100 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">
                                                    {item.kategori}
                                                </span>
                                                {item.total !== undefined && item.total !== null && (
                                                    <span className="text-sm font-semibold text-gray-800">{formatRupiah(item.total)}</span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-600">
                                                {item.jenis_layanan?.length > 0 && (
                                                    <p><span className="text-gray-400">Layanan:</span> {item.jenis_layanan.join(", ")}</p>
                                                )}
                                                {item.nama_sample && <p><span className="text-gray-400">Nama Sample:</span> {item.nama_sample}</p>}
                                                {item.pelarut && <p><span className="text-gray-400">Pelarut:</span> {item.pelarut}</p>}
                                                {item.jumlah_sample !== undefined && <p><span className="text-gray-400">Jumlah Sample:</span> {item.jumlah_sample}</p>}
                                                {item.metode_parameter && <p><span className="text-gray-400">Metode/Parameter:</span> {item.metode_parameter}</p>}
                                                {item.nama_alat && <p><span className="text-gray-400">Nama Alat:</span> {item.nama_alat}</p>}
                                                {item.jenis_bahan && <p><span className="text-gray-400">Jenis Bahan:</span> {item.jenis_bahan}</p>}
                                                {item.satuan && <p><span className="text-gray-400">Satuan:</span> {item.satuan}</p>}
                                                {item.jenis_sewa && <p><span className="text-gray-400">Jenis Sewa:</span> {item.jenis_sewa}</p>}
                                                {item.jumlah !== undefined && <p><span className="text-gray-400">Jumlah:</span> {item.jumlah}</p>}
                                                {(item.tanggal_mulai || item.tanggal_selesai) && (
                                                    <p className="flex items-center gap-1">
                                                        <CalendarDays className="w-3 h-3 text-gray-400" />
                                                        {formatTanggal(item.tanggal_mulai)} — {formatTanggal(item.tanggal_selesai)}
                                                    </p>
                                                )}
                                                {item.keterangan && <p className="sm:col-span-2"><span className="text-gray-400">Keterangan:</span> {item.keterangan}</p>}
                                                {item.harga_satuan !== undefined && item.harga_satuan !== null && (
                                                    <p><span className="text-gray-400">Harga Satuan:</span> {formatRupiah(item.harga_satuan)}</p>
                                                )}
                                            </div>

                                            {/* ✅ Link download Foto Sample / Jurnal Pendukung */}
                                            {fileLinks.length > 0 && (
                                                <div className="flex flex-wrap gap-2.5 mt-4 pt-3 border-t border-gray-100">
                                                    {fileLinks.map((ff) => (

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

                                <div className="flex justify-end pt-2 border-t border-gray-100 mt-1">
                                    <p className="text-sm">
                                        <span className="text-gray-400 mr-2">Total Keseluruhan:</span>
                                        <span className="font-bold text-blue-600">{formatRupiah(order?.total_keseluruhan)}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-6">Belum ada rincian layanan</p>
                        )}
                    </div>
                </div>
            )}

            {/* Tab: Dokumen & Pembayaran */}
            {activeTab === "dokumen" && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> Dokumen Terkait
                    </p>
                    <div className="flex flex-col gap-3">

                        {/* Invoice */}
                        <div className={`border border-gray-200 rounded-xl overflow-hidden ${!invoiceAvailable ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">Invoice</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[140px] sm:max-w-none">
                                        {invoiceAvailable ? `${order?.no_invoice}.pdf` : "Tersedia setelah invoice diinput admin"}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-auto">
                                    {invoiceAvailable ? (
                                        <button
                                            onClick={downloadInvoice}
                                            disabled={isGeneratingInvoice}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                                        >
                                            {isGeneratingInvoice ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    Membuat...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-3.5 h-3.5" /> Unduh
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg whitespace-nowrap">
                                            Belum tersedia
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ✅ Kuitansi — hanya tersedia setelah status "Selesai" */}
                        <div className={`border border-gray-200 rounded-xl overflow-hidden ${!kuitansiAvailable ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileCheck className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">Kuitansi</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[140px] sm:max-w-none">
                                        {kuitansiAvailable ? `${order?.no_invoice}_kuitansi.pdf` : "Tersedia setelah order selesai"}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-auto">
                                    {kuitansiAvailable ? (
                                        <button
                                            onClick={downloadKuitansi}
                                            disabled={isGeneratingKwitansi}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                                        >
                                            {isGeneratingKwitansi ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    Membuat...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-3.5 h-3.5" /> Unduh
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-red-500 px-3 py-1.5 bg-red-50 rounded-lg whitespace-nowrap">
                                            Belum tersedia
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hasil Analisis */}
                        <div className={`border border-gray-200 rounded-xl overflow-hidden ${!hasilAnalisisAvailable ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FlaskConical className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">Hasil Analisis</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[140px] sm:max-w-none">
                                        {hasilAnalisisAvailable ? "Klik unduh untuk membuka" : "Tersedia setelah order selesai"}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-auto">
                                    {hasilAnalisisAvailable ? (

                                        <a href={buildFileUrl(FILE_CATEGORY.hasil_analisis, order.hasil_analisis)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition whitespace-nowrap"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Unduh
                                        </a>
                                    ) : (
                                        <span className="text-xs text-red-500 px-3 py-1.5 bg-red-50 rounded-lg whitespace-nowrap">
                                            Belum tersedia
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bukti Pembayaran */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="flex items-center gap-2 flex-wrap px-4 py-3">
                                <div className={`flex items-center gap-3 flex-1 min-w-0 ${!buktiPembayaranEditable ? "opacity-50" : ""}`}>
                                    <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800">Bukti Pembayaran</p>
                                        <p className="text-xs text-gray-400 truncate max-w-[140px] sm:max-w-none">
                                            {order?.bukti_pembayaran ? "Sudah diunggah" : "Belum ada bukti pembayaran"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {order?.bukti_pembayaran && !addBukti && (

                                        <a href={buildFileUrl(FILE_CATEGORY.bukti_pembayaran, order.bukti_pembayaran)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Lihat</span>
                                        </a>
                                    )}

                                    {isUploading ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5">
                                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                                            <span className="text-xs text-gray-500 hidden sm:inline">Mengunggah... {uploadProgress}%</span>
                                        </div>
                                    ) : addBukti ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleUploadBukti}
                                                disabled={!buktiPembayaran}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Kirim</span>
                                            </button>
                                            <button
                                                onClick={() => { setAddBukti(false); setBuktiPembayaran(null); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Batal</span>
                                            </button>
                                        </div>
                                    ) : buktiPembayaranEditable ? (
                                        <button
                                            onClick={() => setAddBukti(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>{order?.bukti_pembayaran ? "Update" : "Upload"}</span>
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
                                            Belum tersedia
                                        </span>
                                    )}
                                </div>
                            </div>

                            {addBukti && !isUploading && (
                                <div className="px-4 py-3 border-t border-gray-100">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        name="bukti_pembayaran"
                                        onChange={(e) => setBuktiPembayaran(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    {buktiPembayaran && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {buktiPembayaran.name} — {(buktiPembayaran.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* ==============================
          HIDDEN INVOICE TEMPLATE — untuk di-capture jadi PDF via html2canvas.
         ============================== */}
            {invoiceAvailable && (
                <div style={{ position: "fixed", top: 0, left: "-9999px", zIndex: -1 }} aria-hidden="true">
                    <InvoiceTemplate order={order} printId={printId} />
                </div>
            )}

            {/* ==============================
          HIDDEN KWITANSI TEMPLATE — hanya dirender saat data kuitansi sudah di-fetch,
          persis sebelum tombol "Unduh" di-capture jadi PDF.
         ============================== */}
            {kwitansiData && (
                <div style={{ position: "fixed", top: 0, left: "-9999px", zIndex: -1 }} aria-hidden="true">
                    <KwitansiTemplate data={kwitansiData} printId={kwitansiPrintId} />
                </div>
            )}
        </div>
    );
}

// ─────────────────────────── Komponen form rincian layanan (mode edit) ───────────────────────────
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
            alert(err.response?.data?.message || err.message || "Gagal upload file");
        } finally {
            setUploadingMap((m) => {
                const next = { ...m };
                delete next[mapKey];
                return next;
            });
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl p-4">
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
                                                    <UploadCloud className="w-3 h-3" /> {item[ff.key] ? "Ganti File" : "Pilih File"}
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