"use client"
import { useEffect, useState } from "react"
import axios from "axios"
// import { useRouter } from "next/navigation"

export default function layout({children}){
//    const router= useRouter()
   const [role,setRole] = useState("")

useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
                
                if (data.data.success==true) {
                    setRole(data.data.data.role)
                    if(data.data.data.role!=="admin"){
                        window.location.replace("/")
                    }
                    
                }else{
                    window.location.replace("/")
                }
            }catch(err){
                console.log(err.message)
            }
                    
        }
        user()
    },[])

    return (
        <>
        {role=="admin"?children: <p>loading</p>}
        </>
    )
}