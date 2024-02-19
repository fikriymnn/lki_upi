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

                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>Progres Status</p>
                <div className='flex justify-center'>
                    <hr className='grad rounded-md h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <div className="flex mb-20">
                    <div className="m-auto w-10/12 border-2 rounded-lg flex flex-col justify-start items-start ">
                        <p className="text-white text-xl font-bold px-10 w-full grad rounded-t-[6px]">Detail</p>
                        <div className="flex gap-5 w-62 mx-5  mt-10">
                            {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on1.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on1.png'} />}
                            <div>
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">form dikirim</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">form dikirim</p></div>}
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu acc</p><p className="mx-10  text-center text-xs">{invoice.s1_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu acc</p></div>}
                            </div>
                        </div>

                        <div className="flex gap-5 w-62 mx-5 ">
                            {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on2.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off2.png'} />}
                            <div>
                                {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">form diterima</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">form diterima</p></div>}
                                {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu sample diterima oleh admin</p><p className="mx-10  text-center text-xs">{invoice.s2_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu sample diterima oleh admin</p></div>}
                            </div>
                        </div>
                        <div className="flex gap-5 w-62 mx-5">
                            {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on3.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off3.png'} />}
                            <div>
                                {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sample diterima oleh admin</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">sample diterima oleh admin</p></div>}
                                {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sample sedang dikirim ke operator</p><p className="mx-10  text-center text-xs">{invoice.s3_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Sedang dikirim ke operator </p></div>}
                            </div>
                        </div>



                        <div className="flex gap-5 w-62 mx-5  ">
                            {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on4.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off4.png'} />}
                            <div>
                                {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sample diterima oleh operator</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">sample diterima oleh operator </p></div>}
                                {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">sedang dikerjakan oleh operator</p><p className="mx-10  text-center text-xs">{invoice.s4_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Sedang dikerjakan oleh operator</p></div>}
                            </div>
                        </div>
                        <div className="flex gap-5 w-62 mx-5  ">
                            {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on5.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off5.png'} />}
                            <div>
                                {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">selesai dikerjakan oleh operator</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">selesai dikerjakan oleh operator </p></div>}
                                {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu verifikasi</p><p className="mx-10  text-center text-xs">{invoice.s5_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu verifikasi </p></div>}
                            </div>
                        </div>
                        <div className="flex gap-5 w-62 mx-5  ">
                            {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on6.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off6.png'} />}
                            <div>
                                {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">selesai verifikasi</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">selesai verifikasi </p></div>}
                                {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran</p><p className="mx-10  text-center text-xs">{invoice.s6_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran </p></div>}
                            </div>
                        </div>
                        <div className="flex gap-5 w-62 mx-5  ">
                            {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on7.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off7.png'} />}
                            <div>
                                {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">pembayaran selesai</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">pembayaran selesai</p></div>}
                                {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">menunggu pembayaran dikonfirmasi</p><p className="mx-10  text-center text-xs">{invoice.s7_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">menunggu pembayaran dikonfirmasi</p></div>}
                            </div>
                        </div>
                        <div className="flex gap-5 w-62 mx-5  ">
                            {invoice.status == "selesai"||invoice.status == "order dibatalkan" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[87.5px]" src={'/tracking/on/on8.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[87.5px]" src={'/tracking/off/off8.png'} />}
                            <div>
                                {invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">selesai</p><p className="mx-10  text-center text-xs">{invoice.s8_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">selesai</p></div>}
                            </div>
                        </div>



                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

