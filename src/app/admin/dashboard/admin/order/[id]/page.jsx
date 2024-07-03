'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from 'flowbite-react';


export default function DetailOrderAdmin({ params, searchParams }) {
    const { id } = params
    const { no_invoice } = searchParams
    const [order, setOrder] = useState([])
    const [invoice, setInvoice] = useState({ id_user: {} })

    const downloadInvoice = async (e) => {
        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
            console.log(response.data)

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_invoice.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert(err.message)
        }
    }

    const downloadKuitansi = async (e) => {
        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_kuitansi?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
            console.log(response.data)

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_kuitansi.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert(err.message)
        }
    }

    const downloadBuktiTransfer = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/download_bukti_pembayaran/${id}`, { withCredentials: true, responseType: 'arraybuffer', withCredentials: true });
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = invoice?.bukti_pembayaran;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    useEffect(() => {
        async function getnvoice() {
            try {
                console.log(process.env.NEXT_PUBLIC_URL)
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, { withCredentials: true })
                const dataOrder = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`, { withCredentials: true })
                
                if (data.data.success) {
                    setInvoice(data.data.data)
                    console.log(data.data.data)
          
                  }
                  if (dataOrder.data.success) {
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
            <p className='text-center md:text-4xl sm:text-3xl text-xl font-bold text-gray-800 mt-7'>EDIT ORDER</p>
            <div className='flex justify-center'>
                <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
            </div>
            <div className="md:mx-20 mx-5">
                <div className=" grid md:grid-cols-2 gap-5">
                    <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Nama lengkap : {invoice.id_user?.nama_lengkap}</p> </div>
                    <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Email : {invoice.id_user?.email}</p> </div>
                    <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">No whatsapp : {invoice.id_user?.no_whatsapp}</p> </div>
                    <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">No telepon : {invoice.id_user?.no_telp}</p> </div>
                    <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Nama Institusi : {invoice.id_user?.nama_institusi}</p> </div>
                    {invoice.id_user?.jenis_institusi == "Perguruan Tinggi" ? <>
                        <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Fakultas : {invoice.id_user?.fakultas}</p> </div>
                        <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Program studi : {invoice.id_user?.program_studi}</p> </div>


                    </> : ""}

                </div>
                <br />
                <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Estimasi selesai : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.estimasi_date ? invoice.estimasi_date : ""}</p></div>
                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">No invoice : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.no_invoice ? invoice.no_invoice : ""}</p></div>

                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Status : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.status ? invoice.status : ""}</p></div>
                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Total harga : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.total_harga ? invoice.total_harga : ""}</p></div>

                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Catatan : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.catatan ? invoice.catatan : ""}</p></div>

                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold">Invoice : </p>{invoice.status == "Form Dikonfirmasi" || invoice.status == "Sample Diterima Admin" || invoice.status == "Sample Dikerjakan Operator" || invoice.status == "Menunggu Verifikasi" || invoice.status == "Menunggu Pembayaran" || invoice.status == "Menunggu Konfirmasi Pembayaran" || invoice.status == "Selesai" ? <Button className="ml-5 " color="blue" size={5} onClick={downloadInvoice}>download</Button> : <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">-</p>}</div>

                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Kuitansi : </p>{invoice?.status == "Selesai" && invoice?.dana_penelitian == true ? <Button className="ml-5" color="blue" size={5} onClick={downloadKuitansi}>download</Button> : <p className="ml-5">-</p>}</div>

                    <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Bukti pembayaran : </p> {invoice?.bukti_pembayaran ? <Button className="ml-5" color="blue" size={5} href={invoice?.bukti_pembayaran}>download</Button> : ""} </div>
                </div>
            </div>
            <br />
            <div className="md:mx-20 mx-5">
                {
                    order.map((e, i) => {
                        return (<AdminOrderCard no_invoice={invoice.no_invoice} riwayat_pengujian={e.riwayat_pengujian} sample_dikembalikan={e.sample_dikembalikan} uuid={e.uuid} id={e._id} jenis_pengujian={e.jenis_pengujian} kode_pengujian={e.kode_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={i + 1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} foto_sample={e.foto_sample} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} key={i} lama_pengerjaan={e.lama_pengerjaan} nama_pembimbing={e.nama_pembimbing}/>)

                    })
                }
            </div>
        </>
    )
}