'use client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserContext } from '@/context/userContext'
import { useState, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
        try {
            const token = localStorage.getItem('access_token')
            const data = await axios(`${process.env.NEXT_PUBLIC_URL}/api/user/${token}`, { withCredentials: true })
            if (data.data.success == true) {
                if (data.data.data.role == "user") {
                    router.push(`/order_analisis`)
                }
            } else {
                router.push(`/login?prevRoute=${prevRoute}`)
            }
        } catch (err) {
            router.push(`/login?prevRoute=${prevRoute}`)
        }
    }


    return (
        <>
            <div className='cursor-pointer mb-5'>

                <div className="flex justify-center md:mt-[20px] sm:mt-[56px] mt-5">
                    <div className="md:px-20 sm:px-10 px-10 py-4 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-lg text-sm" onClick={() => pesanLayanan()}>
                        <p className='text-white font-bold md:text-lg sm:text-lg text-sm'>
                            Pesan Sekarang
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}