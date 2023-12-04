'use client'
import AdminInvoiceCard from "@/components/AdminInvoiceCard"
import { useState } from "react"

export default function Order(){
    const [invoice,setInvoice] = useState([{list_sample:["asa","bbd"],invoice:"12asndaj23",tanggal:"17 agustus",index:1}])
    return (
        <>
        <p>Order</p>
         {
            invoice.map((e,i)=>{
                return <AdminInvoiceCard list_sample={e.list_sample} invoice={e.invoice} tanggal={e.tanggal} index={++i} key={i}/>

            })
         }
        </>
    )
}

