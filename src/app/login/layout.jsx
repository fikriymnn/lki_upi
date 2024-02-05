"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function layout({children}){
   const router= useRouter()
useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
                if(data.data.success=="user"){
                    router.replace("/")
                }                
            }catch(err){
             
                return false
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