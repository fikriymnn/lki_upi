// src/app/my_order/detail_affiliate/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    FileText,
    Download,
    CreditCard,
    ChevronLeft,
    Upload,
    Check,
    X,
    User,
    Building2,
    FlaskConical,
    Boxes,
    CalendarDays,
    PackageCheck,
} from "lucide-react";
import InvoiceTemplate from "@/components/affiliate/InvoiceTemplate"; // ⚠️ sesuaikan path sesuai lokasi file InvoiceTemplate.jsx di project-mu

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

export default function DetailAffiliate({ params }) {
    const { id } = params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info");
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [addBukti, setAddBukti] = useState(false);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

    // id unik untuk elemen invoice yang di-capture jadi PDF
    const printId = `invoice-print-${id}`;

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

    const handleBP = (event) => {
        const imageFile = event.target.files[0];
        if (!imageFile) return;

        const imageFilname = imageFile.name;
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const MAX_WIDTH = 700;
                const MAX_HEIGHT = 700;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        const file = new File([blob], imageFilname, {
                            type: imageFile.type,
                            lastModified: Date.now(),
                        });
                        setBuktiPembayaran(file);
                    },
                    imageFile.type,
                    1
                );
            };
            img.onerror = () => alert("invalid image content");
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    };

    const handleUploadBukti = async (e) => {
        e.preventDefault();
        if (!buktiPembayaran) {
            alert("Pilih file terlebih dahulu");
            return;
        }
        setIsUploading(true);
        try {
            // Upload file dulu ke file service (sama seperti order utama)
            const upload = await axios.post(
                `${process.env.NEXT_PUBLIC_FILE_URL}/api/file?category=affiliate_pembayaran`,
                { file: buktiPembayaran },
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );

            if (upload.data.filename) {
                const res = await axios.put(
                    `${process.env.NEXT_PUBLIC_URL}/api/order_affiliate/${id}/bukti_pembayaran`,
                    { bukti_pembayaran: upload.data.filename },
                    { withCredentials: true }
                );
                if (res.data.success) {
                    alert("Bukti pembayaran berhasil dikirim");
                    window.location.reload();
                }
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    // ==============================
    // DOWNLOAD INVOICE — full client-side.
    // InvoiceTemplate dirender tersembunyi di DOM (lihat bagian render di bawah),
    // lalu di-capture jadi PNG via html2canvas dan dibungkus jadi PDF via jsPDF.
    // Tidak ada request ke server, karena BE memang tidak punya endpoint generate_invoice.
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

            // kalau invoice lebih panjang dari 1 halaman A4, lanjut ke halaman berikutnya
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

    const buktiPembayaranEditable = [
        "Menunggu Pembayaran",
        "Menunggu Verifikasi Pembayaran",
        "Selesai",
    ].includes(order.status_pengujian);

    const hasilAnalisisAvailable = order.status_pengujian === "Selesai" && order.hasil_analisis;

    // Gabungkan semua item layanan jadi satu list dengan label kategori
    const semuaItem = [
        ...(order.layanan_analisis || []).map((it) => ({ ...it, kategori: "Layanan Analisis" })),
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

            {/* Status Stepper — pengganti halaman tracking, karena affiliate tidak punya tracking terpisah */}
            {/* {!isDitolak ? (
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <PackageCheck className="w-3.5 h-3.5" /> Progress Order
                    </p>
                    <div className="flex items-center overflow-x-auto pb-2">
                        {STATUS_STEPS.map((step, i) => {
                            const done = i < currentStepIndex;
                            const active = i === currentStepIndex;
                            return (
                                <div key={step} className="flex items-center flex-shrink-0">
                                    <div className="flex flex-col items-center min-w-[92px]">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${done
                                                    ? "bg-green-500 text-white"
                                                    : active
                                                        ? "bg-red-600 text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                        </div>
                                        <p
                                            className={`text-[10px] text-center mt-1.5 leading-tight px-1 ${active ? "text-red-600 font-semibold" : done ? "text-gray-600" : "text-gray-400"
                                                }`}
                                        >
                                            {step}
                                        </p>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div className={`h-0.5 w-8 flex-shrink-0 ${done ? "bg-green-500" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 mb-6">
                    <span className="font-semibold">Order ditolak.</span>{" "}
                    {order?.catatan || "Hubungi laboratorium mitra untuk informasi lebih lanjut."}
                </div>
            )} */}

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
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Data Pemesan
                        </p>
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
                    </div>

                    {/* Rincian Item Layanan */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Boxes className="w-3.5 h-3.5" /> Rincian Layanan
                        </p>

                        {semuaItem.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {semuaItem.map((item, i) => (
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
                                    </div>
                                ))}

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
                                                    <div className="w-3.5 h-3.5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
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

                        {/* Hasil Analisis */}
                        <div className={`border border-gray-200 rounded-xl overflow-hidden ${!hasilAnalisisAvailable ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FlaskConical className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">Hasil Analisis</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[140px] sm:max-w-none">
                                        {hasilAnalisisAvailable ? order.hasil_analisis : "Tersedia setelah order selesai"}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-auto">
                                    {hasilAnalisisAvailable ? (

                                        <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${order.hasil_analisis}`}
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
                                            {order?.bukti_pembayaran || "Belum ada bukti pembayaran"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {order?.bukti_pembayaran && !addBukti && (

                                        <a href={`${process.env.NEXT_PUBLIC_FILE_URL}/file/hasilanalisis/${order.bukti_pembayaran}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Unduh</span>
                                        </a>
                                    )}

                                    {isUploading ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5">
                                            <div className="w-4 h-4 border-2 border-t-transparent border-amber-500 rounded-full animate-spin" />
                                            <span className="text-xs text-gray-500 hidden sm:inline">Mengirim...</span>
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
                                        accept="image/*"
                                        name="bukti_pembayaran"
                                        onChange={handleBP}
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
          Diposisikan fixed di luar viewport (bukan display:none) supaya
          html2canvas tetap bisa membaca layout & ukuran elemennya.
          Hanya dirender kalau data invoice sudah tersedia.
         ============================== */}
            {invoiceAvailable && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "-9999px",
                        zIndex: -1,
                    }}
                    aria-hidden="true"
                >
                    <InvoiceTemplate order={order} printId={printId} />
                </div>
            )}
        </div>
    );
}