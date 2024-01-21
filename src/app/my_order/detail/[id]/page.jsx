"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"
import { Button } from 'flowbite-react';
import axios from 'axios'
import month_bahasa from '@/utils/month_bahasa'


export default function detail({ params,searchParams }) {
    const { id } = params
    const {no_invoice} = searchParams
    const [order, setOrder] = useState([])
    const [invoice,setInvoice]=useState({})
    const [buktiPembayaran,setBuktiPembayaran] = useState('')

    function timeNow() {
      var d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
     return h + ':' + m;
    }

    const handleBukti = async (e)=>{
      e.preventDefault()
      try{
        const data = await axios.put(`http://localhost:5000/api/invoice/${id}`,{bukti_pembayaran:buktiPembayaran,status:'menunggu konfirmasi pembayaran',s7_date:`${timeNow()} ${new Date().getDate()} ${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`},{withCredentials:true})
        if(data.data.success){
          alert('sukses dikirim')
          window.location.reload()
        }
      
      }catch(err){
        alert(err.message)
      }
    }

    const downloadInvoice =async () => {
        //Wrapping the code with an async function, just for the sake of example.
      
        // const downloader = new Downloader({
        //   url: `http://localhost:5000/api/generate_invoice?no_invoice=${no_invoice}`, //If the file name already exists, a new file with the name 200MB1.zip is created.
        //   directory: "./downloads", //This folder will be created, if it doesn't exist.   
        // });
        // try {
        //   await downloader.download(); //Downloader.download() resolves with some useful properties.
      
        //   console.log("All done");
        // } catch (error) {
        //   //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
        //   //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
        //   console.log("Download failed", error);
        // }
      };
    
    useEffect(()=>{
        async function getInvoice(){
            try{
  
           
                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`,{withCredentials:true})
                const dataOrder = await axios.get(`http://localhost:5000/api/order?no_invoice=${no_invoice}&skip=0&limit=20`,{withCredentials:true})
                console.log(data)
                if(data.data.success){
                  setInvoice(data.data.data)
                  setOrder(dataOrder.data.data)
                  console.log(dataOrder.data.data)
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
                    <p className="text-lg ">status : {invoice?.status}</p>
                    {invoice?.status=="form dikonfirmasi"?<p>*kirim sample ke alamat yang tertera \n (Jl.lorem ipsum dolor)</p>:""}
                    <p className="text-lg ">total harga  : Rp.{invoice?.total_harga}</p>
                    <div className="flex my-1"><p className="text-lg ">invoice : </p>{invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ?<Button className="ml-5 "  color="blue" size={5} onClick={(e)=>downloadInvoice}>download invoice</Button>:<p className="ml-5">-</p>}</div>
                    <div  className="flex my-1"><p className="text-lg ">kuitansi : </p>{invoice?.status==invoice?.status=="menunggu pembayaran" || invoice?.status=="menunggu konfirmasi pembayaran"||invoice?.status=="selesai"?<Button className="ml-5" color="blue" size={5}>download kuitansi</Button>:<p className="ml-5">-</p>}</div>
                    <div className="flex"><p className="text-lg ">bukti pembayaran : </p> {invoice?.status=="menunggu pembayaran" || invoice?.status=="menunggu konfirmasi pembayaran"||invoice?.status=="selesai"?<div className="flex"><input className="ml-5" type="file" name="file" onChange={(a)=>setBuktiPembayaran("file")}/><Button className="ml-5" color="blue" size={5} onClick={handleBukti}>kirim</Button></div>:<p className="ml-5">-</p>} </div>
                </div>
                <div className="mx-20">
                    {order.map((e, i) => {
                        return <OrderCard status={invoice?.status} jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} kode_pengujian={e.kode_pengujian} jumlah_sample={e.jumlah_sample} index={i+1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} foto_sample={e.foto_sample}/>
                    })}
                </div>
            </div>
        </>
    )
}