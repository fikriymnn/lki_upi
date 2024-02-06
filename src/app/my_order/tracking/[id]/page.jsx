"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Image from 'next/image'

export default function tracking({ params }) {
    const { id } = params
    const [invoice, setInvoice] = useState({})

    useEffect(() => {
        async function getInvoice() {
            try {
                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`, { withCredentials: true })
                if (data.data.success) {
                    setInvoice(data.data.data)
                    console.log(invoice)
                }

            } catch (err) {
                console.log(err.message)
            }
        }
        getInvoice()
    }, [])




    return (
        <>
            <div className="m-auto">

                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>PROGRESS</p>
                <div className='flex justify-center'>
                    <hr className='grad rounded-md h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <div className="flex justify-center items-center">
                    <div className="m-auto w-10/12 border-2 rounded-lg flex flex-col justify-center items-center">
                        <br />
                        <br />
                        <div className="grid grid-cols-2">
                            {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[90px] h-[90px]" src={'/tracking/on/on1.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[90px] h-[90px]" src={'/tracking/on/on1.png'} />}
                            <div>
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">form dikirim</p></div> : <div className=""><p className="text-gray-400 text-xl">form dikirim</p></div>}
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu acc</p><p className="mx-10 w-28 text-center text-xs">{invoice.s1_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">Menunggu acc</p></div>}
                            </div>
                        </div>

                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">form diterima</p></div> : <div className=""><p className="text-gray-400 text-xl">form diterima</p></div>}
                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu sample diterima oleh admin</p><p className="mx-10 w-28 text-center text-xs">{invoice.s2_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">Menunggu sample diterima oleh admin</p></div>}


                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sample diterima oleh admin</p></div> : <div className=""><p className="text-gray-400 text-xl">sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sample sedang dikirim ke operator</p><p className="mx-10 w-28 text-center text-xs">{invoice.s3_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">Sedang dikirim ke operator </p></div>}



                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sample diterima oleh operator</p></div> : <div className=""><p className="text-gray-400 text-xl">sample diterima oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sedang dikerjakan oleh operator</p><p className="mx-10 w-28 text-center text-xs">{invoice.s4_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">Sedang dikerjakan oleh operator</p></div>}



                        {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">selesai dikerjakan oleh operator</p></div> : <div className=""><p className="text-gray-400 text-xl">selesai dikerjakan oleh operator </p></div>}
                        {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu verifikasi</p><p className="mx-10 w-28 text-center text-xs">{invoice.s5_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">Menunggu verifikasi </p></div>}


                        {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">selesai verifikasi</p></div> : <div className=""><p className="text-gray-400 text-xl">selesai verifikasi </p></div>}
                        {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran</p><p className="mx-10 w-28 text-center text-xs">{invoice.s6_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">Menunggu pembayaran </p></div>}


                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">pembayaran selesai</p></div> : <div className=""><p className="text-gray-400 text-xl">pembayaran selesai</p></div>}
                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div><p className="">menunggu pembayaran dikonfirmasi</p><p className="mx-10 w-28 text-center text-xs">{invoice.s7_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">menunggu pembayaran dikonfirmasi</p></div>}


                        {invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">selesai</p><p className="mx-10 w-28 text-center text-xs">{invoice.s8_date}</p></div> : <div className=""><p className="text-gray-400 text-xl">selesai</p></div>}
                        <br />
                        <br />

                    </div>
                </div>
            </div>
        </>
    )
}

