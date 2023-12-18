'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState } from "react"

export default function DetailOrder() {
    const [edit, setEdit] = useState(false)
    const [invoice, setInvoice] = useState({ status: "", harga: "", invoice: "", kuitansi: "", bukti_pembayaran: "" ,estimasi_harga:""})
    const [order, setOrder] = useState([{ jenis_pengujian: ["acap", "bubut"], nama_sample: "batu obsidian", jumlah_sample: 3, wujud_sample: "cair", pelarut: "asam", preparasi_sample: "panas", target_senyawa: "zat besi", metode_parameter: "mudah", jurnal_pendukung: "wwwe", keterangan: "sasdasdasd", hasil_analisis: "asdasdas" }])
    return (
        <>
            <p className='text-center text-4xl font-bold text-gray-800 mt-7'>EDIT ORDER</p>
            <div className='flex justify-center'>
                <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
            </div>
            <div className="mx-20">
                {edit ? <button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Konfirmasi</button> : <button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Edit</button>}
                {edit ? <div><p className="text-lg ">status : <select>
                    <option value="menunggu form dikonfirmasi">menunggu form dikonfirmasi</option>
                    <option value="form dikonfirmasi">form dikonfirmasi</option>
                    <option value="sample diterima admin">sample diterima admin</option>
                    <option value="sample dikerjakan operator">sample dikerjakan operator</option>
                    <option value="menunggu pembayaran">menunggu pembayaran</option>
                    <option value="pembayaran selesai">pembayaran selesai</option>
                    <option value="selesai">selesai</option>
                </select></p>
                    <p className="text-lg ">total harga  : <input type="text" name="harga" /></p></div> : <div><p className="text-lg ">status : menunggu form dikonfirmasi{invoice.status}</p>
                    <p className="text-lg ">total harga  : {invoice.harga} Rp.700000</p></div>}
                <div className="flex"> <p className="text-lg ">estimasi harga  : {invoice.estimasi_harga} Rp.700000</p></div>
                <div className="flex"><p className="text-lg ">invoice : {invoice.invoice}(tergenerate otomatis)</p> </div>
                <div className="flex"><p className="text-lg ">kuitansi : {invoice.kuitansi}(tergenerate otomatis)</p></div>
                <div className="flex"><p className="text-lg ">bukti pembayaran : {invoice.bukti_pembayaran}(tergenerate otomatis)</p></div>
            </div>
            <br />
            <div className="mx-20">
                {
                    order.map((e, i) => {
                        return <AdminOrderCard jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={++i} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_sample={e.preparasi_sample} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} keterangan={e.keterangan} hasil_analisis={e.hasil_analisis} key={i} />

                    })
                }
            </div>
        </>
    )
}