'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState } from "react"

export default function DetailOrder() {
    const [edit, setEdit] = useState(false)
    const [invoice, setInvoice] = useState({ status: "", harga: "", invoice: "", kuitansi: "", bukti_pembayaran: "" })
    const [order, setOrder] = useState([{ jenis_pengujian: ["acap", "bubut"], nama_sample: "batu obsidian", jumlah_sample: 3, wujud_sample: "cair", pelarut: "asam", preparasi_sample: "panas", target_senyawa: "zat besi", metode_parameter: "mudah", jurnal_pendukung: "wwwe", keterangan: "sasdasdasd", hasil_analisis: "asdasdas" }])
    return (
        <>
            <p>Order</p>
            {edit ? <button onClick={()=>setEdit(a => !a)} className="bg-blue-200">konfirmasi</button> : <button onClick={()=>setEdit(a => !a)} className="bg-blue-200">edit</button>}

            <div>
                {edit ? <div><p>status : <select>
                    <option value="menunggu form dikonfirmasi">menunggu form dikonfirmasi</option>
                    <option value="form dikonfirmasi">form dikonfirmasi</option>
                    <option value="sample diterima admin">sample diterima admin</option>
                    <option value="sample dikerjakan operator">sample dikerjakan operator</option>
                    <option value="menunggu pembayaran">menunggu pembayaran</option>
                    <option value="pembayaran selesai">pembayaran selesai</option>
                    <option value="selesai">selesai</option>
                </select></p>
                    <p>total harga  : <input type="text" name="harga"/></p></div> : <div><p>status : {invoice.status}</p>
                    <p>total harga  : {invoice.harga}</p></div>}
                <div><p>invoice : {invoice.invoice}</p></div>
                <div><p>kuitansi : {invoice.kuitansi}</p></div>
                <div><p>bukti pembayaran : {invoice.bukti_pembayaran}</p></div>
            </div>
            {
                order.map((e, i) => {
                    return <AdminOrderCard jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={++i} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_sample={e.preparasi_sample} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} keterangan={e.keterangan} hasil_analisis={e.hasil_analisis} key={i} />

                })
            }
        </>
    )
}