"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"

export default function detail({ params }) {
    const { id } = params
    const [order, setOrder] = useState([{jenis_pengujian:["acap","bubut"], nama_sample:"batu obsidian", jumlah_sample:3, wujud_sample:"cair", pelarut:"asam", preparasi_sample:"panas", target_senyawa:"zat besi", metode_parameter:"mudah", jurnal_pendukung:"wwwe", keterangan:"sasdasdasd",hasil_analisis:"asdasdas"}])

    // useEffect(async ()=>{
    //     const data = [{nama_sample:"rujak"},{nama_sample:"sambel"}];         
    //     setOrder(data)
    // },[])

    return (
        <>
            <div>
                <p>detail</p>

                <div>
                    <p>status :</p>
                    <p>total harga  :</p>
                    <div><p>invoice : </p></div>
                    <div><p>kuitansi : </p></div>
                    <div><p>bukti pembayaran : </p></div>
                </div>
                <div>
                    {order.map((e, i) => {
                        return <OrderCard  jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={++i} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_sample={e.preparasi_sample} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} keterangan={e.keterangan} hasil_analisis={e.hasil_analisis}/>
                    })}
                </div>
            </div>
        </>
    )
}