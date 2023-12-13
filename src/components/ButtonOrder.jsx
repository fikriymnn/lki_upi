'use client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserContext } from '@/context/userContext'
import { useState, useContext } from 'react'
import { useRouter, usePathname} from 'next/navigation'


export default function ButtonOrder() {
    const router = useRouter()
    const prevRoute = usePathname()
    const { user } = useContext(UserContext)

    function pesanLayanan() {
        if (!user.login) {
            router.push(`/login?prevRoute=${prevRoute}`)

        } else {
            router.push(`/order_analisis`)
        }
    }


    return (
        <>
            <div className='cursor-pointer'>

                <div className='w-40 h-full bg-blue-200 rounded-lg' onClick={() => pesanLayanan()}>
                    <h1 className='px-10 py-3'>Pesan Layanan</h1>
                </div>


            </div>
        </>
    )
}