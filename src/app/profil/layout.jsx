"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Layout({children}){
   const router= useRouter()
useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
                if(data.data.success==false){
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
        {children}
        </>
    )
}