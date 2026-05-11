"use client"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Layout({ children }) {
    const router = useRouter()

    useEffect(() => {
        async function checkUser() {
            try {
                const token = localStorage.getItem('access_token')
                if (!token) { router.replace("/"); return }

                const data = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
                    { withCredentials: true }
                )

                // ✅ Kalau tidak success atau role bukan user biasa, redirect ke login
                if (!data.data.success || data.data.data?.role !== 'user') {
                    router.replace("/")
                }
            } catch (err) {
                router.replace("/")
            }
        }
        checkUser()
    }, [])

    return <>{children}</>
}