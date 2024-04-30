"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Loading from "../../../../components/Loading"

export default function Layout({children}){
    const [role,setRole] = useState("")
   const router= useRouter()
useEffect(()=>{
        async function user(){
            try{
                const token = localStorage.getItem('access_token')
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,{
                    withCredentials: true
                })
                setRole(data.data.data.role)
                if(data.data.data.role!=="admin"){
                    router.replace("/")
                }                
            }catch(err){
                router.replace("/")
            }  
        }
        user()
    },[])

    return (
        <>
        {role=="admin"?children:<Loading/>}
        </>
    )
}