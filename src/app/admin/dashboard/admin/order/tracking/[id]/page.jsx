"use client"
import { useEffect, useState } from "react"
import axios from "axios"


export default function Tracking_admin({ params }) {
    const [edit, setEdit] = useState(false)
    const { id } = params
    const [form, setForm] = useState({
        estimasi_harga: 0,
        total_harga: 0,
        status: "",
        date: ""
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
        const obj = {status: form.status,estimasi_harga:form.estimasi_harga,total_harga:form.total_harga}
        try{
            switch (form.status) {
                case "menunggu form dikonfirmasi":
                      obj.s1_date = form.date 
                    break;
                case "form dikonfirmasi":
                      obj.s2_date = form.date  
                    break;
                case "sample diterima admin":
                    obj.s3_date = form.date
                    break;
                case "sample dikerjakan operator":
                    obj.s4_date = form.date
                    break;
                case "menunggu verifikasi":
                    obj.s5_date = form.date
                    break;
                case "menunggu pembayaran":
                    obj.s6_date = form.date
                    break;
                case "menunggu konfirmasi pembayaran":
                    obj.s7_date = form.date
                    break;
                case "selesai":
                    obj.s8_date = form.date
                    break;
    
            }
            const data = await axios.put(`http://localhost:5000/api/invoice/${id}`,obj,{withCredentials:true})
            alert("update successfully")
            console.log(data)
        }catch(err){
            alert(err.message)
        }
       
    }


    useEffect(() => {
        async function getInvoice() {
            try {
                const data = await axios.get(`http://localhost:5000/api/invoice/${id}`, { withCredentials: true })
                if (data.data.success) {
                    const obj = data.data.data
                    setInvoice(obj)
                    setForm({ estimasi_harga: obj.estimasi_harga, total_harga: obj.total_harga, status: obj.status })
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
                    <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <div className="m-auto">


                    <div className="m-auto mx-40 border-2 rounded-lg">

                        <br />
                        <br />
                        <div className="mx-10">
                            {edit ? <button onClick={handleConfirm } className="bg-blue-400 text-white px-2 py-1 rounded-lg">Konfirmasi</button> : <button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Edit</button>}
                            {edit ? <div><p className="text-lg ">Status : <select name="status" onChange={(e) => {
                                const { value } = e.target
                                setForm(a => ({ ...a, status: value.status, date: value.date }))
                            }}>
                                <option value={{ status: "menunggu form dikonfirmasi", date: new Date() }}>menunggu form dikonfirmasi</option>
                                <option value={{ status: "form dikonfirmasi", date: new Date() }}>form dikonfirmasi</option>
                                <option value={{ status: "sample diterima admin", date: new Date() }}>sample diterima admin</option>
                                <option value={{ status: "sample dikerjakan operator", date: new Date() }}>sample dikerjakan operator</option>
                                <option value={{ status: "menunggu verifikasi", date: new Date() }}>menunggu verifikasi</option>
                                <option value={{ status: "menunggu pembayaran", date: new Date() }}>menunggu pembayaran</option>
                                <option value={{ status: "menunggu konfirmasi pembayaran", date: new Date() }}>pembayaran konfirmasi pembayaran</option>
                                <option value={{ status: "selesai", date: new Date() }}>selesai</option></select></p></div> : <div>
                                <p className="text-lg ">Status  : {invoice.status} </p></div>}
                            {edit ? <div>
                                <p className="text-lg ">Estimasi harga  : <input type="text" name="estimasi_harga" onChange={handleChange} /></p></div> : <div>
                                <p className="text-lg ">estimasi harga  : Rp.{invoice.estimasi_harga}</p></div>}

                            {edit ? <div>
                                <p className="text-lg ">Total harga  : <input type="text" name="total_harga" /></p></div> : <div>
                                <p className="text-lg ">total harga  : Rp.{invoice.total_harga}</p></div>}
                        </div>
                        <br />
                        <br />
                        {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s1_date}</p><p className="text-blue-600 text-xl">form dikirim</p></div> : <div><p className="mx-10 w-28 text-center">-</p><p className="">form dikirim</p></div>}
                        {invoice.status == "menunggu form dikonfirmasi" || invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu ACC</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu ACC </p></div>}


                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s2_date}</p><p className="text-blue-600 text-xl">form diterima</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">form diterima</p></div>}
                        {invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu sample diterima oleh admin</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu sample diterima oleh admin</p></div>}


                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s3_date}</p><p className="text-blue-600 text-xl">sample diterima oleh admin</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">sample diterima oleh admin</p></div>}
                        {invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">sample sedang dikirim ke operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Sedang dikirim ke operator </p></div>}


                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s4_date}</p><p className="text-blue-600 text-xl">sample diterima oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">sample diterima oleh operator </p></div>}
                        {invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">sedang dikerjakan oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Sedang dikerjakan oleh operator</p></div>}



                        {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s5_date}</p><p className="text-blue-600 text-xl">selesai dikerjakan oleh operator</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai dikerjakan oleh operator </p></div>}
                        {invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu verifikasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu verifikasi </p></div>}


                        {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s6_date}</p><p className="text-blue-600 text-xl">selesai verifikasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai verifikasi </p></div>}
                        {invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu pembayaran</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu pembayaran </p></div>}


                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s7_date}</p><p className="text-blue-600 text-xl">pembayaran selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">pembayaran selesai</p></div>}
                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div><p className="">menunggu pembayaran dikonfirmasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">menunggu pembayaran dikonfirmasi</p></div>}


                        {invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s8_date}</p><p className="text-blue-600 text-xl">selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai</p></div>}
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

