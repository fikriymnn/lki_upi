'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from 'flowbite-react';


export default function detailOrderAdmin({ params, searchParams }) {
    const { id } = params
    const { no_invoice } = searchParams
    const [order, setOrder] = useState([])
    const [invoice, setInvoice] = useState({ id_user: {} })

    const downloadInvoice = async (e) => {
        try {

            const response = await axios.get(`http://localhost:5000/api/generate_invoice?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
            console.log(response.data)

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_invoice.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert(err.message)
        }
    }

    const downloadKuitansi = async (e) => {
        try {

            const response = await axios.get(`http://localhost:5000/api/generate_kuitansi?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
            console.log(response.data)

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_kuitansi.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert(err.message)
        }
    }

    const downloadBuktiTransfer = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/download_bukti_pembayaran/${id}`, { withCredentials: true, responseType: 'arraybuffer', withCredentials: true });
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
            <div className="md:mx-20 mx-5">
                <div className=" grid md:grid-cols-2 gap-5">
                    <div className="flex input-style-lki"><p className="text-lg ">Nama lengkap : {invoice.id_user?.nama_lengkap}</p> </div>
                    <div className="flex input-style-lki"><p className="text-lg ">Nama lengkap : {invoice.id_user?.email}</p> </div>
                    <div className="flex input-style-lki"><p className="text-lg ">No whatsapp : {invoice.id_user?.no_whatsapp}</p> </div>
                    <div className="flex input-style-lki"><p className="text-lg ">No telepon : {invoice.id_user?.no_telp}</p> </div>
                    <div className="flex input-style-lki"><p className="text-lg ">Nama Institusi : {invoice.id_user?.nama_institusi}</p> </div>
                    {invoice.id_user?.jenis_institusi == "Perguruan Tinggi" ? <>
                        <div className="flex input-style-lki"><p className="text-lg ">Fakultas : {invoice.id_user?.fakultas}</p> </div>
                        <div className="flex input-style-lki"><p className="text-lg ">Program studi : {invoice.id_user?.program_studi}</p> </div>


                    </> : ""}

                </div>
                <br />
                <div className="flex "><p className="text-lg ">no invoice : </p> <p>{invoice.no_invoice}</p></div>
                <div className="flex "><p className="text-lg ">status : </p> <p>{invoice.status}</p></div>
                <div className="flex "><p className="text-lg ">estimasi selesai : </p> <p>{invoice.estimasi_date ? invoice.estimasi_date : ""}</p></div>
                <div className="flex "><p className="text-lg ">invoice : </p> {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Button className="ml-5 mb-3" color="blue" size={5} onClick={downloadInvoice}>download invoice</Button> : <p>-</p>}</div>
                <div className="flex "><p className="text-lg ">kuitansi : </p>{invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Button className="ml-5 mb-3" color="blue" size={5} onClick={downloadKuitansi}>download kuitansi</Button> : <p>-</p>}</div>
                <div className="flex "><p className="text-lg ">bukti pembayaran : </p>{invoice.bukti_pembayaran ? <Button className="ml-5 " color="blue" size={5} onClick={downloadBuktiTransfer}>download bukti pembayaran</Button> : <p>-</p>}</div>
            </div>
            <br />
            <div className="md:mx-20 mx-5">
                {
                    order.map((e, i) => {
                        return (<AdminOrderCard uuid={e.uuid} id={e._id} jenis_pengujian={e.jenis_pengujian} kode_pengujian={e.kode_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={i + 1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} foto_sample={e.foto_sample} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} key={i} />)

                    })
                }
            </div>
        </>
    )
}