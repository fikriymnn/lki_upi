"use client"
import { useState } from "react"

export default function tracking({ params }) {
    const { id } = params
    const [invoice, setInvoice] = useState({ status: "menunggu form dikonfirmasi" })
    return (
        <>
            <div className="m-auto">
            <p className='text-center text-4xl font-bold text-gray-800 mt-7'>PROGRESS</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
                <div className="m-auto">
                    <div className="m-auto mx-40 border-2 rounded-lg">
                        <br/>
                        <br/>
                        {invoice.status == "menunggu form dikonfirmasi" ? <div className="flex"><p className="mx-10 w-28 text-center text-xs">20 desember 2023</p><p className="text-blue-600 text-xl">form dikirim</p></div> : <div><p className="mx-10 w-28 text-center">-</p><p className="">form dikirim</p></div>}
                        {invoice.status == "menunggu form dikonfirmasi" ? <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">menunggu acc</p></div>:<div className="flex"><p className="mx-14 text-xs"></p><p className="text-gray-400 text-xl">menunggu acc</p></div>}


                        {invoice.status == "form dikonfirmasi" ? <div><p className="text-blue-600 text-xl">form diterima</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">form diterima</p></div>}
                        {invoice.status == "form dikonfirmasi" ? <div><p className="">menunggu sample diterima oleh admin</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">menunggu sample diterima oleh admin</p></div>}


                        {invoice.status == "sample diterima admin" ? <div><p className="text-blue-600 text-xl">sample diterima oleh admin</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" ? <div><p className="text-blue-600 text-xl">menunggu sample diterima oleh operator</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">sedang dikerjakan oleh operator</p></div>}


                        {invoice.status == "sample dikerjakan operator" ? <div><p className="text-blue-600 text-xl">sample diterima oleh operator</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">sample diterima oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" ? <div><p className="text-blue-600 text-xl">sedang dikerjakan oleh operator</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">sedang dikerjakan oleh operator</p></div>}


                        {invoice.status == "menunggu pembayaran" ? <div><p className="text-blue-600 text-xl">selesai dikerjakan oleh operator</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai dikerjakan oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" ? <div><p className="text-blue-600 text-xl">Menunggu verifikasi</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu verifikasi</p></div>}

                        

                        {invoice.status == "menunggu pembayaran" ? <div><p className="text-blue-600 text-xl">selesai verifikasi</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai verifikasi </p></div>}
                        {invoice.status == "menunggu pembayaran" ? <div><p className="">menunggu pembayaran</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">menunggu pembayaran</p></div>}


                        {invoice.status == "pembayaran selesai" ? <div><p className="text-blue-600 text-xl">pembayaran selesai</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">pembayaran selesai</p></div>}
                        {invoice.status == "pembayaran selesai" ? <div><p className="">menunggu pembayaran dikonfirmasi</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">menunggu pembayaran dikonfirmasi</p></div>}

                        
                        {invoice.status == "selesai" ? <div><p className="text-blue-600 text-xl">selesai</p></div> : <div className="flex"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai</p></div>}
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
        </>
    )
}

