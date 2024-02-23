"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Layout({children}){
    const [role,setRole] = useState("")
   const router= useRouter()
useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`,{
                    withCredentials: true
                })
                setRole(data.data.data.role)
                if(data.data.data.role!=="pj"){
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
        {role=="pj"?children:<div className="h-screen"><p className="m-auto text-center">Loading</p></div>}
        </>
    )
}