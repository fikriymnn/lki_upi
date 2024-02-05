"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Image from 'next/image'

export default function tracking({ params }) {
    const { id } = params
    const [invoice, setInvoice] = useState({})

    useEffect(()=>{
        async function getInvoice(){
            try{
                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`,{withCredentials:true})
                if(data.data.success){
                  setInvoice(data.data.data)
                  console.log(invoice)
                }
              
            }catch(err){
              console.log(err.message)
            }
           }
           getInvoice()
    },[])




    return (
        <>
            <div className="m-auto">
            <p className=' text-4xl font-bold text-gray-800 mt-7 text-center'>PROGRESS</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 '/>
        </div>
                <div className="m-auto">
                    <div className="m-auto md:mx-40 sm:mx-20 mx-5 border-2 rounded-lg">
                        <br/>
                        <br/>
                        <div className="flex">
                            {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"?<Image width={50} height={50} src={'/tracking/on/on1.png'}/>:<Image width={50} height={50} src={'/tracking/on/on1.png'}/>}
                        <div className="md:ml-20 sm:ml-10 ml-5">
                        {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">form dikirim</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">form dikirim</p></div>}
                        {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu acc</p><p className="  text-xs">{invoice.s1_date}</p></div>:<div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu acc</p></div>}
                        </div>
                        </div>
                        
                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">form diterima</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">form diterima</p></div>}
                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu sample diterima oleh admin</p><p className="  text-xs">{invoice.s2_date}</p></div>:<div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu sample diterima oleh admin</p></div>}


                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">sample diterima oleh admin</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">sample sedang dikirim ke operator</p><p className="  text-xs">{invoice.s3_date}</p></div>:<div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">Sedang dikirim ke operator </p></div>}


                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">sample diterima oleh operator</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">sample diterima oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ?<div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">sedang dikerjakan oleh operator</p><p className="  text-xs">{invoice.s4_date}</p></div>:<div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">Sedang dikerjakan oleh operator</p></div>}


                        { invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">selesai dikerjakan oleh operator</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">selesai dikerjakan oleh operator </p></div>}
                        {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu verifikasi</p><p className="  text-xs">{invoice.s5_date}</p></div>:<div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu verifikasi </p></div>}

                        
                        {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"  ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">selesai verifikasi</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">selesai verifikasi </p></div>}
                        {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu pembayaran</p><p className="  text-xs">{invoice.s6_date}</p></div>:<div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">Menunggu pembayaran </p></div>}


                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">pembayaran selesai</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">pembayaran selesai</p></div>}
                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"  ? <div><p className="">menunggu pembayaran dikonfirmasi</p><p className="  text-xs">{invoice.s7_date}</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">menunggu pembayaran dikonfirmasi</p></div>}

                        
                        {invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-3xl sm:text-xl text-sm font-semibold">selesai</p><p className="  text-xs">{invoice.s8_date}</p></div> : <div className=""><p className="text-gray-400 md:text-3xl sm:text-xl text-sm font-semibold">selesai</p></div>}
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
        </>
    )
}

