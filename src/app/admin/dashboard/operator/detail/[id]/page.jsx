'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from 'flowbite-react';


export default function detailOrderOperator({ params, searchParams }) {
    const { id } = params
    const { no_invoice } = searchParams
    const [order, setOrder] = useState([])
    const [invoice, setInvoice] = useState({ id_user: {} })

    useEffect(() => {
        async function getnvoice() {
            try {

                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`, { withCredentials: true })
                const dataOrder = await axios.get(`http://localhost:5000/api/order?no_invoice=${no_invoice}&skip=0&limit=20`, { withCredentials: true })
                console.log(data.data.data)
                if (data.data.success) {
                    setInvoice(data.data.data)
                    console.log(dataOrder)
                    setOrder(dataOrder.data.data)
                    console.log(order)
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
            <div className="mx-20">
            
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold ">No Invoice : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.no_invoice ? invoice.no_invoice : ""}</p></div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold ">Status : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.status ? invoice.status : ""}</p></div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold ">Estimasi selesai : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.estimasi_date ? invoice.estimasi_date : ""}</p></div>
            </div>
            <br />
            <div className="mx-20">
                {
                    order.map((e, i) => {
                        return (<AdminOrderCard riwayat_pengujian={e.riwayat_pengujian} sample_dikembalikan={e.sample_dikembalikan} uuid={e.uuid} id={e._id} jenis_pengujian={e.jenis_pengujian} kode_pengujian={e.kode_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={i + 1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} foto_sample={e.foto_sample} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} key={i} />)

                    })
                }
            </div>
        </>
    )
}