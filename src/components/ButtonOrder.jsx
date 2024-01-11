'use client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserContext } from '@/context/userContext'
import { useState, useContext } from 'react'
import { useRouter, usePathname} from 'next/navigation'
import axios from 'axios'


export default function ButtonOrder() {
    const router = useRouter()
    const prevRoute = usePathname()


    // useEffect(()=>{
    //     const user = async () => {
    //       try{
    //         const data = await axios("http://localhost:5000/api/user",{ withCredentials: true })
    //         console.log(data)
    //         if (data.data.success == true) {
    //             setRole(data.data.data.role)
    //             if(data.data.data.role=="user"){
    //               setLogin(true)
    //             }
    //         }
    //       }catch(err){
    //        return false
    //       }
    //     }
    //     user()
    //   },[])

    async function pesanLayanan() {
        try{
            const data = await axios("http://localhost:5000/api/user",{ withCredentials: true })
            console.log(data)
            if (data.data.success == true) {
                if(data.data.data.role=="user"){
                    router.push(`/order_analisis`)
                }
            }else{
                router.push(`/login?prevRoute=${prevRoute}`)
            }
          }catch(err){
               router.push(`/login?prevRoute=${prevRoute}`)
          }
    }  


    return (
        <>
            <div className='cursor-pointer'>
                <div className='w-40 h-full bg-red-700 rounded-lg' onClick={() => pesanLayanan()}>
                    <h1 className='px-5 py-3 font-semibold text-white'>Pesan Layanan</h1>
                </div>
            </div>
        </>
    )
}