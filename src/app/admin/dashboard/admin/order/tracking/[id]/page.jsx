"use client"
import { useEffect, useState } from "react"

export default function Tracking_admin({ params }) {
    const [edit, setEdit] = useState(false)
    const { id } = params
    const [order_status, setOrder_status] = useState([])
    const [progress_status, setProgress_status] = useState([])
    const [invoice, setInvoice] = useState({ status: "menunggu verifikasi" })

    // useEffect(()=>{

    // },[invoice])
    return (
        <>
            <div className="m-auto">
                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>PROGRESS</p>
                <div className='flex justify-center'>
                    <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <div className="m-auto">


                    <div className="m-auto mx-40 border-2 rounded-lg">
                        <br />
                        <br />
                        <div className="mx-10">
                            {edit ? <button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Konfirmasi</button> : <button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Edit</button>}
                            {edit ? <div><p className="text-lg ">status : <select>
                                <option value="menunggu form dikonfirmasi">menunggu form dikonfirmasi</option>
                                <option value="form dikonfirmasi">form dikonfirmasi</option>
                                <option value="sample diterima admin">sample diterima admin</option>
                                <option value="sample dikerjakan operator">sample dikerjakan operator</option>
                                <option value="menunggu pembayaran">menunggu pembayaran</option>
                                <option value="pembayaran selesai">pembayaran selesai</option>
                                <option value="selesai">selesai</option></select></p></div> : <div className="flex"> <p className="text-lg ">Status  : menunggu form dikonfirmasi</p></div>}
                        </div>
                        <br />
                        <br />
                        {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">form dikirim</p></div> : <div><p className="mx-10 w-28 text-center">-</p><p className="">form dikirim</p></div>}
                        {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu ACC</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu ACC </p></div>}


                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">form diterima</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">form diterima</p></div>}
                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu sample diterima oleh admin</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu sample diterima oleh admin</p></div>}


                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">sample diterima oleh admin</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">sample sedang dikirim ke operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Sedang dikirim ke operator </p></div>}


                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">sample diterima oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">sample diterima oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">sedang dikerjakan oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Sedang dikerjakan oleh operator</p></div>}

                        <div>
                            {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai"?  <div className="flex  ml-20 my-3"><p className="text-lg">Progress analisis sample</p></div>: <div className="flex  ml-20 my-3"><p className="text-lg text-gray-400">Progress analisis sample</p></div>}
                      
                       
                            <div className="m-auto mx-20 my-3 border-2 rounded-lg">
                            <div className="flex ml-14 my-3"><p className="text-lg font-bold">GCMS</p></div>
                                
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">form dikirim</p></div> : <div><p className="mx-10 w-28 text-center">-</p><p className="">form dikirim</p></div>}
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-lg">Menunggu ACC</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">Menunggu ACC </p></div>}


                                {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">form diterima</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">form diterima</p></div>}
                                {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-lg">Menunggu sample diterima oleh admin</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">Menunggu sample diterima oleh admin</p></div>}


                                {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">sample diterima oleh admin</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">sample diterima oleh admin</p></div>}
                                {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-lg">sample sedang dikirim ke operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">Sedang dikirim ke operator </p></div>}


                                {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">sample diterima oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">sample diterima oleh operator </p></div>}
                                {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-lg">sedang dikerjakan oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">Sedang dikerjakan oleh operator</p></div>}


                                {invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">selesai dikerjakan oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">selesai dikerjakan oleh operator </p></div>}
                                {invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-lg">Menunggu verifikasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">Menunggu verifikasi </p></div>}


                                {invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">selesai verifikasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">selesai verifikasi </p></div>}
                                {invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-lg">Menunggu pembayaran</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">Menunggu pembayaran </p></div>}


                                {invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">pembayaran selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">pembayaran selesai</p></div>}
                                {invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div><p className="">menunggu pembayaran dikonfirmasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-lg">menunggu pembayaran dikonfirmasi</p></div>}


                                {invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-lg">selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-lg">-</p><p className="text-gray-400 text-lg">selesai</p></div>}
                                <br />
                                <br />
                            </div>
                        </div>


                        {invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">selesai dikerjakan oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai dikerjakan oleh operator </p></div>}
                        {invoice.status == "menunggu verifikasi" || invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu verifikasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu verifikasi </p></div>}


                        {invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">selesai verifikasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai verifikasi </p></div>}
                        {invoice.status == "verifikasi selesai" || invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu pembayaran</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu pembayaran </p></div>}


                        {invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">pembayaran selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">pembayaran selesai</p></div>}
                        {invoice.status == "pembayaran selesai" || invoice.status == "selesai" ? <div><p className="">menunggu pembayaran dikonfirmasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">menunggu pembayaran dikonfirmasi</p></div>}


                        {invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai</p></div>}
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

