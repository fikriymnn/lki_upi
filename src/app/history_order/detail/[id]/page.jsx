"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"
import { Button } from 'flowbite-react';
import axios from 'axios'
import month_bahasa from '@/utils/month_bahasa'


export default function hdetail({ params,searchParams }) {
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
                const dataOrder = await axios.get(`http://localhost:5000/api/order?success=true&no_invoice=${no_invoice}&skip=0&limit=100`,{withCredentials:true})
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
                    <div className="flex my-1"><p className="text-lg ">invoice : </p>{invoice.status=="selesai"?<Button className="ml-5 "  color="blue" size={5} onClick={downloadInvoice}>download invoice</Button>:<p className="ml-5">-</p>}</div>
                    <div  className="flex my-1"><p className="text-lg ">kuitansi : </p>{invoice?.status=="selesai"?<Button className="ml-5" color="blue" size={5} onClick={downloadKuitansi}>download kuitansi</Button>:<p className="ml-5">-</p>}</div>
                    <div className="flex"><p className="text-lg ">bukti pembayaran : </p> {invoice?.bukti_pembayaran?<Button className="ml-5" color="blue" size={5} onClick={downloadBuktiTransfer}>download bukti pembayaran</Button>:""} </div>
                    
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