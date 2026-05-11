"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function Layout({ children }) {
    const router = useRouter()

    useEffect(() => {
        async function checkAdmin() {
            try {
                const token = localStorage.getItem('access_token')
                if (!token) { router.replace("/panel"); return }

                const data = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
                    { withCredentials: true }
                )

                // ✅ Cek role dari data, bukan dari success string
                if (!data.data.success || data.data.data?.role !== 'admin') {
                    router.replace("/panel")
                }
            } catch (err) {
                router.replace("/panel")
            }
        }
        checkAdmin()
    }, [])

    return <>{children}</>
}