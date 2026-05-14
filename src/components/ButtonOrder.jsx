'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios'

export default function ButtonOrder() {
    const router = useRouter()
    const prevRoute = usePathname()
    const [loading, setLoading] = useState(false)

    async function pesanLayanan() {
        setLoading(true)
        try {
            const token = localStorage.getItem('access_token')

            // Jika tidak ada token, langsung redirect
            if (!token) {
                router.push(`/login?prevRoute=${prevRoute}`)
                return
            }

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
                { withCredentials: true }
            )

            // Cek success DAN role harus 'user'
            if (data.success && data.data?.role === 'user') {
                router.push(`/order_analisis`)
            } else {
                router.push(`/login?prevRoute=${prevRoute}`)
            }
        } catch (err) {
            router.push(`/login?prevRoute=${prevRoute}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='cursor-pointer mb-5'>
            <div className="flex justify-center md:mt-[8px] mt-5">
                <button
                    onClick={pesanLayanan}
                    disabled={loading}
                    className="md:px-16 sm:px-10 px-10 py-4 bg-slate-900 text-white rounded-md font-bold md:text-lg sm:text-lg text-sm grad disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                >
                    <p className='text-white font-bold md:text-base sm:text-base text-sm'>
                        {loading ? 'Memeriksa...' : 'Pesan Sekarang'}
                    </p>
                </button>
            </div>
        </div>
    )
}