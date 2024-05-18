'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from 'flowbite-react';


export default function DetailOrderOperator({ params, searchParams }) {
    const { id } = params
    const { no_invoice } = searchParams
    const [order, setOrder] = useState([])
    const [invoice, setInvoice] = useState({ id_user: {} })

    useEffect(() => {
        async function getnvoice() {
            try {

                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, { withCredentials: true })
                const dataOrder = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`, { withCredentials: true })
                console.log(data.data.data)
                if (data.data.success) {
                    setInvoice(data.data.data)
                    
                    setOrder(dataOrder.data.data)
                    
                }

            } catch (err) {
                console.log(err.message)
            }
        }
        getnvoice()
    }, [])

    return (
        <>
            <p className='text-center text-4xl font-bold text-gray-800 mt-7'>EDIT ORDER</p>
            <div className='flex justify-center'>
                <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
            </div>
            <div className="md:mx-20 mx-5">
            
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">No Invoice : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.no_invoice ? invoice.no_invoice : ""}</p></div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Status : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.status ? invoice.status : ""}</p></div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Estimasi selesai : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.estimasi_date ? invoice.estimasi_date : ""}</p></div>
            </div>
            <br />
            <div className="md:mx-20 mx-5">
                {
                    order.map((e, i) => {
                        return (<AdminOrderCard status={invoice.status} no_invoice={invoice.no_invoice} riwayat_pengujian={e.riwayat_pengujian} sample_dikembalikan={e.sample_dikembalikan} uuid={e.uuid} id={e._id} jenis_pengujian={e.jenis_pengujian} kode_pengujian={e.kode_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={i + 1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} foto_sample={e.foto_sample} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} key={i} lama_pengerjaan={e.lama_pengerjaan} nama_pembimbing={e.nama_pembimbing}
                        />)

                    })
                }
            </div>
        </>
    )
}