"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import month_bahasa from "@/utils/month_bahasa"
import Image from "next/image"

export default function Tracking_admin({ params }) {
    const [edit, setEdit] = useState(false)
    const { id } = params
    const [form, setForm] = useState({
        estimasi_date: '',
        total_harga: 0,
        status: ""
    })
    const [invoice, setInvoice] = useState({})
    // const [invoice, setInvoice] = useState({ status: "menunggu verifikasi" })

    const handleChange = async (e) => {
        const { value, name } = e.target
        setForm(e => ({ ...e, [name]: value }))

    }

    const handleConfirm = async (e) => {
        e.preventDefault()
        setEdit(a => !a)
        let obj = { status: form.status, estimasi_date: form.estimasi_date, total_harga: form.total_harga }
        try {
            console.log(form)
            function timeNow() {
                var d = new Date(),
                    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                return h + ':' + m;
            }

            const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`
            function selection() {
                switch (form.status) {
                    case "menunggu form dikonfirmasi":
                        obj.s1_date = date_format
                        return true
                    case "form dikonfirmasi":
                        obj.s2_date = date_format

                        return true;
                    case "sample diterima admin":
                        obj.s3_date = date_format
                        return true;
                    case "sample dikerjakan operator":
                        obj.s4_date = date_format
                        return true;
                    case "menunggu verifikasi":
                        obj.s5_date = date_format
                        return true;
                    case "menunggu pembayaran":
                        obj.s6_date = date_format
                        return true;
                    case "menunggu konfirmasi pembayaran":
                        obj.s7_date = date_format
                        return true;
                    case "selesai":

                        obj.success = true
                        obj.s8_date = date_format
                        return true;
                    case "order dibatalkan":
                        obj.success = true
                        obj.s8_date = date_format
                        return true;
                }
            }
            if (selection() == true) {
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, obj, { withCredentials: true })
                alert("update successfully")
                if (data.data.success) {
                    window.location.reload()
                }
            }
        } catch (err) {
            alert(err.message)
        }

    }


    useEffect(() => {
        async function getInvoice() {
            try {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, { withCredentials: true })
                if (data.data.success) {
                    const obj = data.data.data
                    setInvoice(obj)
                    setForm({ estimasi_date: obj.estimasi_date, total_harga: obj.total_harga, status: obj.status })
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
                    <hr className='grad h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <div className="m-auto">


                    <div className="m-auto  w-10/12 border-2 rounded-lg">

                        <br />
                        <br />
                        <div className="md:mx-10 mx-5 flex flex-col gap-3 md:w-6/12 ">

                            {edit ? <div>
                                <p className="md:text-lg text-base grid grid-cols-2 font-semibold">Status :
                                    <select name="status"  className="font-normal" onChange={(e) => setForm((a) => ({ ...a, [e.target.name]: e.target.value }))} value={form.status}>
                                    <option value="">pilih</option>
                                    <option value="order dibatalkan">batalkan order</option>
                                    <option value="form dikonfirmasi">form dikonfirmasi</option>
                                    <option value="sample diterima admin">sample diterima admin</option>
                                    <option value="sample dikerjakan operator">sample dikerjakan operator</option>
                                    {/* <option value="menunggu verifikasi">menunggu verifikasi</option> */}
                                    <option value="menunggu pembayaran">menunggu pembayaran</option>
                                    <option value="selesai">konfirmasi pembayaran dan selesai</option></select>
                                    
                                   
                                    </p></div> : <div>
                                <p className="md:text-lg text-base font-semibold md:grid grid-cols-2 gap-5 flex">Status  : <span className="font-normal">{form.status}</span> </p></div>}


                            {edit ? <div>
                                <p className="md:text-lg text-base grid grid-cols-2 font-semibold">Total harga  : <input type="number" name="total_harga" onChange={handleChange} value={form.total_harga} /></p></div> : <div>
                                <p className="md:text-lg text-base font-semibold md:grid grid-cols-2 gap-5 flex">total harga  : <span className="font-normal">Rp.{form.total_harga}</span></p></div>}
                            {edit ? <div>
                                <p className="md:text-lg text-base grid grid-cols-2 font-semibold">Tanggal estimasi selesai  : <input type="text" name="estimasi_date" onChange={handleChange} value={form.estimasi_date} /></p></div> : <div>
                                <p className="md:text-lg text-base font-semibold md:grid grid-cols-2 gap-5 flex">Tanggal estimasi selesai  : <span className="font-normal">{form.estimasi_date}</span> </p></div>}
                            {edit ? <div className="flex gap-5 mt-5"><button onClick={handleConfirm} className="grad text-white px-2 py-1 rounded-lg">Konfirmasi</button><button onClick={() => setEdit(a => !a)} className="grad text-white px-2 py-1 rounded-lg">Cancel</button></div> : <button onClick={() => setEdit(a => !a)} className="grad text-white px-2 py-1 rounded-lg w-40">Edit</button>}
                        </div>
                        <br />
                        <br />

                    </div>
                    <div className="flex mb-20 mt-10 ">
                        <div className="m-auto w-10/12 border-2 rounded-lg flex flex-col justify-start items-start ">
                            <p className="text-white text-xl font-bold px-10 w-full grad rounded-t-[6px]">Detail</p>
                            <div className="flex gap-5 w-62 mx-5  mt-10">
                                {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on1.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on1.png'} />}
                                <div>
                                    {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"|| invoice.status == "order dibatalkan" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Form dikirim</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Form dikirim</p></div>}
                                    {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"|| invoice.status == "order dibatalkan" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu acc</p><p className="text-red-600 text-xs font-semibold">{invoice.s1_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu acc</p></div>}
                                </div>
                            </div>

                            <div className="flex gap-5 w-62 mx-5 ">
                                {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"|| invoice.status == "order dibatalkan" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on2.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off2.png'} />}
                                <div>
                                    {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai"|| invoice.status == "order dibatalkan" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Form diterima</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Form diterima</p></div>}
                                    {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu sample diterima oleh admin</p><p className="text-red-600 text-xs font-semibold">{invoice.s2_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu sample diterima oleh admin</p></div>}
                                </div>
                            </div>
                            <div className="flex gap-5 w-62 mx-5">
                                {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on3.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off3.png'} />}
                                <div>
                                    {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Sample diterima oleh admin</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Sample diterima oleh admin</p></div>}
                                    {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Sample sedang dikirim ke operator</p><p className="text-red-600   text-xs font-semibold">{invoice.s3_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Sample sedang dikirim ke operator </p></div>}
                                </div>
                            </div>



                            <div className="flex gap-5 w-62 mx-5  ">
                                {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on4.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off4.png'} />}
                                <div>
                                    {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Sample diterima oleh operator</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Sample diterima oleh operator </p></div>}
                                    {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Sedang dikerjakan oleh operator</p><p className="text-red-600 text-xs font-semibold">{invoice.s4_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Sedang dikerjakan oleh operator</p></div>}
                                </div>
                            </div>
                            <div className="flex gap-5 w-62 mx-5  ">
                                {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on5.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off5.png'} />}
                                <div>
                                    {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Selesai dikerjakan oleh operator</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Selesai dikerjakan oleh operator </p></div>}
                                    {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu verifikasi</p><p className="text-red-600 text-xs font-semibold">{invoice.s5_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu verifikasi </p></div>}
                                </div>
                            </div>
                            <div className="flex gap-5 w-62 mx-5  ">
                                {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on6.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off6.png'} />}
                                <div>
                                    {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Selesai verifikasi</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Selesai verifikasi </p></div>}
                                    {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran</p><p className="text-red-600  text-xs font-semibold">{invoice.s6_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran </p></div>}
                                </div>
                            </div>
                            <div className="flex gap-5 w-62 mx-5  ">
                                {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" || invoice.status == "order dibatalkan"? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/on/on7.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[133.7px]" src={'/tracking/off/off7.png'} />}
                                <div>
                                    {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Pembayaran selesai</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Pembayaran selesai</p></div>}
                                    {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran dikonfirmasi</p><p className="text-red-600 text-xs font-semibold">{invoice.s7_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Menunggu pembayaran dikonfirmasi</p></div>}
                                </div>
                            </div>
                            <div className="flex gap-5 w-62 mx-5  ">
                                {invoice.status == "selesai" ? <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[87.5px]" src={'/tracking/on/on8.png'} /> : <Image alt="" width={0} height={0} sizes="100vw" className="w-[87.5px] h-[87.5px]" src={'/tracking/off/off8.png'} />}
                                <div>
                                    {invoice.status == "selesai" || invoice.status == "order dibatalkan" ? <div className=""><p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">Selesai</p><p className="text-red-600 text-xs font-semibold">{invoice.s8_date}</p></div> : <div className=""><p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">Selesai</p></div>}
                                </div>
                            </div>



                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

