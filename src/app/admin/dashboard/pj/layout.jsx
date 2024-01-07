"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function layout({children}){
   const router= useRouter()
    const [role,setRole] = useState("")

useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
                
                if (data.data.success==true) {
                    setRole(data.data.data.role)
                }else{
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
        {role=="pj"?children:router.replace("/")}
        </>
    )
}