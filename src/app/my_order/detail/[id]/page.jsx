"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"

export default function detail({params}){
    const {id} = params
    const [order,setOrder] = useState([])

    // useEffect(async ()=>{
    //     const data = [{nama_sample:"rujak"},{nama_sample:"sambel"}];         
    //     setOrder(data)
    // },[])

    return(
        <>
        <div>
            <p>detail</p>
        </div>
        </>
    )
}