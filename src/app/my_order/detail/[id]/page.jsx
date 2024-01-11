"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"
import { Button } from 'flowbite-react';
import axios from 'axios'


export default function detail({ params,searchParams }) {
    const { id } = params
    const {_id} = searchParams
    const [order, setOrder] = useState([{jenis_pengujian:["acap","bubut"], nama_sample:"batu obsidian", jumlah_sample:3, wujud_sample:"cair", pelarut:"asam", preparasi_sample:"panas", target_senyawa:"zat besi", metode_parameter:"mudah", jurnal_pendukung:"wwwe", keterangan:"sasdasdasd",hasil_analisis:"asdasdas"}])
    const [invoice,setInvoice]=useState({})

    useEffect(()=>{
        async function getInvoice(){
            try{
              const dataUser = await axios.get("http://localhost:5000/api/user",{withCredentials:true})
              console.log(dataUser)
              if(dataUser.data.success){
                console.log(dataUser)
                const data = await axios.get(`http://localhost:5000/api/invoice/${_id}`,{withCredentials:true})
                const dataOrder = await axios.get(`http://localhost:5000/api/order?invoice=${id}&skip=0&limit20`,{withCredentials:true})
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
                    <p className="text-lg ">status : menunggu form dikonfirmasi</p>
                    <p className="text-lg ">total harga  : Rp.300000</p>
                    <div className="flex my-1"><p className="text-lg ">invoice : </p><Button className="ml-5 "  color="blue" size={5}>download invoice</Button></div>
                    <div  className="flex my-1"><p className="text-lg ">kuitansi : </p><Button className="ml-5" color="blue" size={5}>download kuitansi</Button></div>
                    <div className="flex"><p className="text-lg ">bukti pembayaran : </p> <input className="ml-5" type="file" name="file"/></div>
                </div>
                <div className="mx-20">
                    {order.map((e, i) => {
                        return <OrderCard  jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={++i} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_sample={e.preparasi_sample} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} keterangan={e.keterangan} hasil_analisis={e.hasil_analisis}/>
                    })}
                </div>
            </div>
        </>
    )
}