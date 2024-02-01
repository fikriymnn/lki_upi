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

    const downloadInvoice = async (e)=>{
      try{

          const response = await axios.get(`http://localhost:5000/api/generate_invoice?no_invoice=${no_invoice}`,{withCredentials:true,responseType: 'blob'});
          console.log(response.data)
    
          // Create a blob from the response data
          const blob = new Blob([response.data], { type: 'application/octet-stream' });
    
          // Create a link element and click it to trigger the download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}_invoice.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }catch(err){
        alert(err.message)
      }
    }

    const downloadKuitansi = async (e)=>{
      try{

          const response = await axios.get(`http://localhost:5000/api/generate_kuitansi?no_invoice=${no_invoice}`,{withCredentials:true,responseType: 'blob'});
          console.log(response.data)
    
          // Create a blob from the response data
          const blob = new Blob([response.data], { type: 'application/octet-stream' });
    
          // Create a link element and click it to trigger the download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}_kuitansi.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }catch(err){
        alert(err.message)
      }
    }

    const downloadBuktiTransfer = async () => {
      try {
          const response = await axios.get(`http://localhost:5000/api/download_bukti_pembayaran/${id}`,{withCredentials:true,responseType: 'arraybuffer',withCredentials:true});
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
  
        // Create a link element and click it to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = invoice?.bukti_pembayaran?.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };
    
    useEffect(()=>{
        async function getInvoice(){
            try{
  
           
                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`,{withCredentials:true})
                const dataOrder = await axios.get(`http://localhost:5000/api/order?no_invoice=${no_invoice}&skip=0&limit=20`,{withCredentials:true})
                console.log(data)
                if(data.data.success){
                  setInvoice(data.data.data)
                  
              
                }
                if(dataOrder.data.success){
                  setOrder(dataOrder.data.data)
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
                  <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1">
                    <div className="grid grid-cols-2 md:w-10/12 border-2 rounded-lg p-2 border-b-8"><p className="md:text-2xl sm:text-xl text-lg font-semibold">status : </p><p className="ml-3 font-semibold text-gray-800 md:text-base sm:text-sm text-xs">{invoice?.status}</p>
                    {invoice?.status=="form dikonfirmasi"?<p>*kirim sample ke alamat yang tertera \n (Jl.lorem ipsum dolor)</p>:""}
                    </div>
                    

                    <div className="grid grid-cols-2 md:w-10/12 border-2 rounded-lg p-2 border-b-8"><p className="md:text-2xl sm:text-xl text-lg font-semibold">total harga  : </p><p className="ml-3 font-semibold text-gray-800 md:text-base sm:text-sm text-xs">Rp.{invoice?.total_harga}</p></div>

                    <div className="grid grid-cols-2 md:w-10/12 border-2 rounded-lg p-2 border-b-8"><p className="md:text-2xl sm:text-xl text-lg font-semibold ">estimasi selesai : </p> <p className="ml-3 font-semibold text-gray-800 md:text-base sm:text-sm text-xs">{invoice.estimasi_date?invoice.estimasi_date:""}</p></div>

                    <div className="grid grid-cols-2 md:w-10/12 border-2 rounded-lg p-2 border-b-8"><p className="md:text-2xl sm:text-xl text-lg font-semibold">invoice : </p>{invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ?<Button className="ml-5 "  color="blue" size={5} onClick={downloadInvoice}>download invoice</Button>:<p className="ml-3 font-semibold text-gray-800 md:text-base sm:text-sm text-xs">-</p>}</div>

                    <div  className="grid grid-cols-2 md:w-10/12 border-2 rounded-lg p-2 border-b-8"><p className="md:text-2xl sm:text-xl text-lg font-semibold ">kuitansi : </p>{invoice?.status==invoice?.status=="menunggu pembayaran" || invoice?.status=="menunggu konfirmasi pembayaran"||invoice?.status=="selesai"?<Button className="ml-5" color="blue" size={5} onClick={downloadKuitansi}>download kuitansi</Button>:<p className="ml-5">-</p>}</div>

                    <div className="grid grid-cols-2 md:w-10/12 border-2 rounded-lg p-2 border-b-8"><p className="md:text-2xl sm:text-xl text-lg font-semibold  ">bukti pembayaran : </p> {invoice?.status=="menunggu pembayaran" || invoice?.status=="menunggu konfirmasi pembayaran"||invoice?.status=="selesai"?<div className="flex"><input className="ml-5" type="file" name="file" onChange={(e)=>setBuktiPembayaran(e.target.files[0])}/><Button className="ml-5" color="blue" size={5} onClick={handleBukti}>kirim</Button></div>:<p className="ml-5">-</p>}{invoice?.bukti_pembayaran?<Button className="ml-5" color="blue" size={5} onClick={downloadBuktiTransfer}>download bukti pembayaran</Button>:""} </div>
                    
                </div>
                </div>
                <div className="mx-20">
                    {order.map((e, i) => {
                        return <OrderCard id={e._id} status={invoice?.status} jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} kode_pengujian={e.kode_pengujian} jumlah_sample={e.jumlah_sample} index={i+1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} foto_sample={e.foto_sample}/>
                    })}
                </div>
            </div>
        </>
    )
}