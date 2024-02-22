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
                const data = await axios.get("http://localhost:5000/api/user",{
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
        {role=="admin"?children:<div className="h-screen"><p className="m-auto text-center">Loading</p></div>}
        </>
    )
}