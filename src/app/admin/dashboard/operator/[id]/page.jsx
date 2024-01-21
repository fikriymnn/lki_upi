"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import month_bahasa from "@/utils/month_bahasa"


export default function Tracking_admin({ params }) {
    const [edit, setEdit] = useState(false)
    const { id } = params
    const [form, setForm] = useState({
        status: ""
    })
    const [invoice, setInvoice] = useState({})
    // const [invoice, setInvoice] = useState({ status: "menunggu verifikasi" })

    const handleConfirm = async (e) => {
        e.preventDefault()
        setEdit(a => !a)
        let obj = {status: form.status}
        try{
            console.log(form)
            function timeNow() {
                var d = new Date(),
                  h = (d.getHours()<10?'0':'') + d.getHours(),
                  m = (d.getMinutes()<10?'0':'') + d.getMinutes();
               return h + ':' + m;
              }
            
            const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`
            function selection(){
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
                        obj.s8_date = date_format
                        return true;
                }
            }
            if(selection()==true){
                const data = await axios.put(`http://localhost:5000/api/invoice/${id}`,obj,{withCredentials:true})
                alert("update successfully")

                if(data.data.success){
                    window.location.reload()
                }
            }        
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
                    setForm({status: obj.status })
        
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
                        <div className="mx-10">  {edit ? <div className="flex"><button onClick={handleConfirm } className="bg-blue-400 text-white px-2 py-1 rounded-lg">Konfirmasi</button><button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Cancel</button></div> : <button onClick={() => setEdit(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Edit</button>}
                            {edit ? <div><p className="text-lg ">Status : <select name="status" onChange={(e) =>setForm((a)=>({...a,[e.target.name]:e.target.value}))} value={form.status}>
                            <option value="" selected>Sample dikerjakan operator</option>  
                                <option value="menunggu verifikasi">menunggu verifikasi</option></select></p></div> : <div>
                                <p className="text-lg ">Status  : {form.status} </p></div>}
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
                        {invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-blue-600 text-xl">Menunggu pembayaran dikonfirmasi</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs"></p><p className="text-gray-400 text-xl">Menunggu pembayaran dikonfirmasi</p></div>}


                        {invoice.status == "selesai" ? <div className="flex items-center"><p className="mx-10 w-28 text-center text-xs">{invoice.s8_date}</p><p className="text-blue-600 text-xl">selesai</p></div> : <div className="flex items-center"><p className="mx-10 w-28 text-center text-xl">-</p><p className="text-gray-400 text-xl">selesai</p></div>}
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

