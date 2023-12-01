'use client'
import AdminOrderCard from "../../../../components/AdminOrderCard"
import { useState } from "react"

export default function DetailOrder(){
    const [invoice,setInvoice] = useState([{jenis_pengujian:["acap","bubut"], nama_sample:"batu obsidian", jumlah_sample:3, wujud_sample:"cair", pelarut:"asam", preparasi_sample:"panas", target_senyawa:"zat besi", metode_parameter:"mudah", jurnal_pendukung:"wwwe", keterangan:"sasdasdasd",hasil_analisis:"asdasdas"}])
    return (
        <>
        <p>Order</p>
        <div>
                    <p>status :</p>
                    <p>total harga  :</p>
                    <div><p>invoice : </p></div>
                    <div><p>kuitansi : </p></div>
                </div>
         {
            invoice.map((e,i)=>{
                return <AdminOrderCard jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={++i} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_sample={e.preparasi_sample} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} keterangan={e.keterangan} hasil_analisis={e.hasil_analisis} key={i}/>

            })
         }
        </>
    )
}