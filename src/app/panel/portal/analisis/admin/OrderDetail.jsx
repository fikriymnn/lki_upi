'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState, useEffect } from "react"
import axios from "axios"
import month_bahasa from "@/utils/month_bahasa";
import { usePathname } from "next/navigation";
import {
    User, Calendar, FileText, Download, ChevronRight,
    Edit2, Check, X, Plus, Trash2, ChevronLeft, Clock,
    CheckCircle, FileCheck, CreditCard, Image
} from "lucide-react";

export default function DetailOrderAdmin({ setActivePage, idInvoice, noInvoice }) {
    const id = idInvoice
    const no_invoice = noInvoice
    const [edit, setEdit] = useState(false)
    const [activeTab, setActiveTab] = useState('info')
    const [order, setOrder] = useState([])
    const [invoice, setInvoice] = useState({ id_user: {} })
    const [hargaSatuan, setHargaSatuan] = useState([
        { keterangan: "", jumlah: "", hargaSatuan: "" },
    ]);
    const path = usePathname()

    const handleHargaSatuan = (index, field, value) => {
        const updatedData = [...hargaSatuan];
        updatedData[index][field] = value;
        setHargaSatuan(updatedData);
    };

    const addHargaSatuan = () => {
        setHargaSatuan([
            ...hargaSatuan,
            { keterangan: "", jumlah: "", hargaSatuan: "" },
        ]);
    };

    const removeHargaSatuan = (index) => {
        if (hargaSatuan.length === 1) return;
        const updatedData = hargaSatuan.filter((_, i) => i !== index);
        setHargaSatuan(updatedData);
    };

    const downloadInvoice = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_invoice.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) { alert(err.message) }
    }

    const downloadKuitansi = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_kuitansi?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_kuitansi.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) { alert(err.message) }
    }

    const downloadBuktiTransfer = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/download_bukti_pembayaran/${id}`, { withCredentials: true, responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = invoice?.bukti_pembayaran;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) { console.error('Error downloading file:', error); }
    };

    const handleChange = async (e) => {
        const { value, name } = e.target;
        setInvoice((e) => ({ ...e, [name]: value }));
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setEdit(false);
        setActiveTab('info');
        let obj = {
            status: invoice?.status,
            estimasi_date: invoice?.estimasi_date,
            catatan: invoice?.catatan,
            harga_satuan: hargaSatuan,
        };
        try {
            function timeNow() {
                var d = new Date(),
                    h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
                    m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
                return h + ":" + m;
            }
            const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`;

            function selection() {
                switch (invoice?.status) {
                    case "Menunggu Form Dikonfirmasi": obj.s1_date = date_format; obj.success = false; return true;
                    case "Form Dikonfirmasi": obj.s2_date = date_format; obj.success = false; return true;
                    case "Sample Diterima Admin": obj.s3_date = date_format; obj.success = false; return true;
                    case "Sample Dikerjakan Operator": obj.s3_date = date_format; obj.s4_date = date_format; obj.success = false; return true;
                    case "Menunggu Verifikasi": obj.s5_date = date_format; obj.success = false; return true;
                    case "Menunggu Pembayaran": obj.success = true; obj.s6_date = date_format; return true;
                    case "Menunggu Konfirmasi Pembayaran": obj.success = true; obj.s7_date = date_format; return true;
                    case "Selesai": obj.success = true; obj.s8_date = date_format; return true;
                    case "Order Dibatalkan": obj.s8_date = date_format; return true;
                }
            }
            if (selection() === true) {
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, obj, { withCredentials: true });
                alert("update successfully");
                if (data.data.success) {
                    window.location.replace(`/notifikasi?url=${path}?no_invoice=${no_invoice}`);
                }
            }
        } catch (err) { alert(err.message); }
    };

    useEffect(() => {
        async function getInvoice() {
            try {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, { withCredentials: true })
                const dataOrder = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`, { withCredentials: true })
                if (data.data.success) {
                    setInvoice(data.data.data)
                    setHargaSatuan(data.data.data.harga_satuan)
                }
                if (dataOrder.data.success) {
                    setOrder(dataOrder.data.data)
                }
            } catch (err) { console.log(err.message) }
        }
        getInvoice()
    }, [])

    // Hitung total otomatis dari hargaSatuan
    useEffect(() => {
        const total = hargaSatuan.reduce((sum, item) => {
            const jumlah = parseFloat(item.jumlah) || 0
            const harga = parseFloat(item.hargaSatuan) || 0
            return sum + (jumlah * harga)
        }, 0)
        setInvoice(prev => ({ ...prev, total_harga: total }))
    }, [hargaSatuan])

    const convertRupiah = (angka) => {
        let angkaString = angka.toString();
        let bagianAngka = angkaString.split('').reverse().join('').match(/\d{1,3}/g);
        return bagianAngka.join('.').split('').reverse().join('');
    }

    const statusBadge = (status) => {
        const map = {
            "Selesai": "bg-green-100 text-green-800",
            "Menunggu Pembayaran": "bg-amber-100 text-amber-800",
            "Menunggu Konfirmasi Pembayaran": "bg-amber-100 text-amber-800",
            "Order Dibatalkan": "bg-red-100 text-red-800",
            "Form Dikonfirmasi": "bg-blue-100 text-blue-800",
            "Sample Diterima Admin": "bg-blue-100 text-blue-800",
            "Sample Dikerjakan Operator": "bg-blue-100 text-blue-800",
            "Menunggu Verifikasi": "bg-purple-100 text-purple-800",
            "Menunggu Form Dikonfirmasi": "bg-gray-100 text-gray-700",
        }
        return map[status] || "bg-gray-100 text-gray-700"
    }

    const invoiceAvailable = [
        "Form Dikonfirmasi", "Sample Diterima Admin", "Sample Dikerjakan Operator",
        "Menunggu Verifikasi", "Menunggu Pembayaran", "Menunggu Konfirmasi Pembayaran", "Selesai"
    ].includes(invoice?.status)

    const tabs = [
        { key: 'info', label: 'Informasi Pelanggan', icon: <User className="w-4 h-4" /> },
        { key: 'edit', label: 'Edit Order', icon: <Edit2 className="w-4 h-4" /> },
        { key: 'dokumen', label: 'Dokumen', icon: <FileText className="w-4 h-4" /> },
    ]

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => setActivePage("order")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Order</h1>
                    <p className="text-sm text-gray-500">Kelola dan perbarui status order pengujian kimia</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 mb-1">No. Invoice</p>
                    <p className="text-base font-semibold text-gray-900">{invoice?.no_invoice || '—'}</p>
                    <p className="text-xs text-gray-400 mt-1">Order ID: {id}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 mb-1">Total Harga</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {invoice?.total_harga ? `Rp ${convertRupiah(invoice.total_harga)}` : '—'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{order.length} item pengujian</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 mb-1">Status Order</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(invoice?.status)}`}>
                        {invoice?.status || '—'}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">Est. selesai: {invoice?.estimasi_date || '—'}</p>
                </div>
            </div>

            {/* Tab Bar */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => { setActiveTab(t.key); if (t.key !== 'edit') setEdit(false); if (t.key === 'edit') setEdit(true); }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === t.key ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab: Info Pelanggan */}
            {activeTab === 'info' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Data Pelanggan
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><p className="text-xs text-gray-400">Nama Lengkap</p><p className="text-sm font-medium mt-0.5">{invoice?.nama_lengkap || invoice?.id_user?.nama_lengkap || '—'}</p></div>
                            <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.email || '—'}</p></div>
                            <div><p className="text-xs text-gray-400">No. WhatsApp</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.no_whatsapp || '—'}</p></div>
                            <div><p className="text-xs text-gray-400">No. Telepon</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.no_telp || '—'}</p></div>
                            <div><p className="text-xs text-gray-400">Nama Institusi</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.nama_institusi || '—'}</p></div>
                            <div><p className="text-xs text-gray-400">Jenis Institusi</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.jenis_institusi || '—'}</p></div>
                            {invoice?.id_user?.jenis_institusi === "Perguruan Tinggi" && <>
                                <div><p className="text-xs text-gray-400">Fakultas</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.fakultas || '—'}</p></div>
                                <div><p className="text-xs text-gray-400">Program Studi</p><p className="text-sm font-medium mt-0.5">{invoice?.id_user?.program_studi || '—'}</p></div>
                            </>}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> Ringkasan Order
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><p className="text-xs text-gray-400">Estimasi Selesai</p><p className="text-sm font-medium mt-0.5">{invoice?.estimasi_date || '—'}</p></div>
                            <div><p className="text-xs text-gray-400">Catatan</p><p className="text-sm font-medium mt-0.5 text-gray-600">{invoice?.catatan || '—'}</p></div>
                            <div>
                                <p className="text-xs text-gray-400">Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(invoice?.status)}`}>
                                    {invoice?.status || '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Edit Order */}
            {activeTab === 'edit' && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-5 flex items-center gap-2">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Data Order
                    </p>

                    <div className="space-y-4 divide-y divide-gray-100">
                        {/* Status */}
                        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 items-start pt-4 first:pt-0">
                            <p className="text-sm font-medium text-gray-600 pt-1.5">Status</p>
                            <select
                                name="status"
                                onChange={(e) => setInvoice(a => ({ ...a, [e.target.name]: e.target.value }))}
                                value={invoice?.status || ''}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">Pilih status</option>
                                <option value="Order Dibatalkan">Batalkan Order</option>
                                <option value="Form Dikonfirmasi">Form Dikonfirmasi</option>
                                <option value="Sample Diterima Admin">Sample Diterima Admin</option>
                                <option value="Sample Dikerjakan Operator">Sample Diterima Admin dan Diproses</option>
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                                <option value="Selesai">Konfirmasi Pembayaran dan Selesai</option>
                            </select>
                        </div>

                        {/* Total Harga */}
                        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 items-start pt-4">
                            <p className="text-sm font-medium text-gray-600 pt-1.5">Total Harga</p>
                            <input
                                type="number"
                                name="total_harga"
                                readOnly
                                onChange={handleChange}
                                value={invoice?.total_harga || ''}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="..."
                            />
                        </div>

                        {/* Estimasi Selesai */}
                        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 items-start pt-4">
                            <p className="text-sm font-medium text-gray-600 pt-1.5">Estimasi Selesai</p>
                            <input
                                type="text"
                                name="estimasi_date"
                                onChange={handleChange}
                                value={invoice?.estimasi_date || ''}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Tanggal estimasi selesai"
                            />
                        </div>

                        {/* Catatan */}
                        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 items-start pt-4">
                            <p className="text-sm font-medium text-gray-600 pt-1.5">Catatan</p>
                            <textarea
                                name="catatan"
                                onChange={handleChange}
                                value={invoice?.catatan || ''}
                                rows={3}
                                placeholder="Tuliskan catatan..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    {/* Harga Satuan */}
                    <div className="mt-6">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <FileCheck className="w-3.5 h-3.5" /> Harga Satuan
                        </p>
                        <div className="flex flex-col gap-3 mb-4">
                            {hargaSatuan.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-center gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <input
                                        type="text"
                                        placeholder="Keterangan"
                                        value={item.keterangan}
                                        onChange={(e) => handleHargaSatuan(index, "keterangan", e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Jumlah"
                                        value={item.jumlah}
                                        onChange={(e) => handleHargaSatuan(index, "jumlah", e.target.value)}
                                        className="w-full md:w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Harga Satuan"
                                        value={item.hargaSatuan}
                                        onChange={(e) => handleHargaSatuan(index, "hargaSatuan", e.target.value)}
                                        className="w-full md:w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeHargaSatuan(index)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addHargaSatuan}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                        >
                            <Plus className="w-4 h-4" /> Tambah Baris
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
                        <button
                            onClick={() => { setActiveTab('info'); setEdit(false); }}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                        >
                            <X className="w-4 h-4" /> Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                            <Check className="w-4 h-4" /> Konfirmasi Perubahan
                        </button>
                    </div>
                </div>
            )}

            {/* Tab: Dokumen */}
            {activeTab === 'dokumen' && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> Dokumen Terkait
                    </p>
                    <div className="flex flex-col gap-3">

                        {/* Invoice */}
                        <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${!invoiceAvailable ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Invoice</p>
                                    <p className="text-xs text-gray-400">{invoiceAvailable ? `${invoice?.no_invoice}.pdf` : 'Tersedia setelah form dikonfirmasi'}</p>
                                </div>
                            </div>
                            {invoiceAvailable
                                ? <button onClick={downloadInvoice} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"><Download className="w-3.5 h-3.5" />Unduh</button>
                                : <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Belum tersedia</span>
                            }
                        </div>

                        {/* Kuitansi */}
                        <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${invoice?.status !== 'Selesai' ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileCheck className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Kuitansi</p>
                                    <p className="text-xs text-gray-400">{invoice?.status === 'Selesai' ? `${invoice?.no_invoice}_kuitansi.pdf` : 'Tersedia setelah order selesai'}</p>
                                </div>
                            </div>
                            {invoice?.status === 'Selesai'
                                ? <button onClick={downloadKuitansi} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition"><Download className="w-3.5 h-3.5" />Unduh</button>
                                : <span className="text-xs text-red-500 px-3 py-1.5 bg-red-50 rounded-lg">Belum tersedia</span>
                            }
                        </div>

                        {/* Bukti Pembayaran */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Bukti Pembayaran</p>
                                    <p className="text-xs text-gray-400">{invoice?.bukti_pembayaran || 'Belum ada bukti pembayaran'}</p>
                                </div>
                            </div>
                            {invoice?.bukti_pembayaran
                                ? <button onClick={downloadBuktiTransfer} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition"><Download className="w-3.5 h-3.5" />Unduh</button>
                                : <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">Belum ada</span>
                            }
                        </div>

                    </div>
                </div>
            )}

            {/* Daftar Order */}
            <div className="mt-8">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Daftar Order ({order.length} item)
                </p>
                <div className="flex flex-col gap-3">
                    {order.map((e, i) => (
                        <AdminOrderCard
                            key={i}
                            no_invoice={invoice.no_invoice}
                            riwayat_pengujian={e.riwayat_pengujian}
                            sample_dikembalikan={e.sample_dikembalikan}
                            uuid={e.uuid}
                            id={e._id}
                            jenis_pengujian={e.jenis_pengujian}
                            kode_pengujian={e.kode_pengujian}
                            nama_sample={e.nama_sample}
                            jumlah_sample={e.jumlah_sample}
                            index={i + 1}
                            wujud_sample={e.wujud_sample}
                            pelarut={e.pelarut}
                            preparasi_khusus={e.preparasi_khusus}
                            target_senyawa={e.target_senyawa}
                            metode_parameter={e.metode_parameter}
                            jurnal_pendukung={e.jurnal_pendukung}
                            foto_sample={e.foto_sample}
                            deskripsi={e.deskripsi_sample}
                            hasil_analisis={e.hasil_analisis}
                            lama_pengerjaan={e.lama_pengerjaan}
                            nama_pembimbing={e.nama_pembimbing}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}