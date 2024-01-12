"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"
import { Button } from 'flowbite-react';
import axios from 'axios'


export default function detail({ params,searchParams }) {
    const { id } = params
    const {no_invoice} = searchParams
    const [order, setOrder] = useState([])
    const [invoice,setInvoice]=useState({})

    useEffect(()=>{
        async function getInvoice(){
            try{
              const dataUser = await axios.get("http://localhost:5000/api/user",{withCredentials:true})
              console.log(dataUser)
              if(dataUser.data.success){
                console.log(dataUser)
                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`,{withCredentials:true})
                const dataOrder = await axios.get(`http://localhost:5000/api/order?no_invoice=${no_invoice}&skip=0&limit=20`,{withCredentials:true})
                console.log(data)
                if(data.data.success){
                  setInvoice(data.data.data)
                  setOrder(dataOrder.data.data)
                }
              }
            }catch(err){
              console.log(err.message)
            }
           }
           getInvoice()
    },[])

    return (
        <>
            <div>
            <p className='text-center text-4xl font-bold text-gray-800 mt-7'>DETAIL</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>

                <div className="mx-20">
                    <p className="text-lg ">status : {invoice.status}</p>
                    <p className="text-lg ">total harga  : Rp.{invoice.total_harga}</p>
                    <div className="flex my-1"><p className="text-lg ">invoice : </p>{invoice.status=="form dikonfirmasi"?<Button className="ml-5 "  color="blue" size={5}>download invoice</Button>:<p className="ml-5">-</p>}</div>
                    <div  className="flex my-1"><p className="text-lg ">kuitansi : </p>{invoice.status=="verifikasi selesai"?<Button className="ml-5" color="blue" size={5}>download kuitansi</Button>:<p className="ml-5">-</p>}</div>
                    <div className="flex"><p className="text-lg ">bukti pembayaran : </p> {invoice.status=="verifikasi selesai"?<input className="ml-5" type="file" name="file"/>:<p className="ml-5">-</p>}</div>
                </div>
                <div className="mx-20">
                    {order.map((e, i) => {
                        return <OrderCard  jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} kode_pengujian={e.kode_pengujian} jumlah_sample={e.jumlah_sample} index={i+1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} deskripsi={e.deskripsi} hasil_analisis={e.hasil_analisis} foto_sample={e.foto_sample}/>
                    })}
                </div>
            </div>
        </>
    )
}