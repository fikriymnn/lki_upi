"use client"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Layout({ children }) {
    const router = useRouter()

    useEffect(() => {
        async function checkSuperadmin() {
            try {
                const token = localStorage.getItem('access_token')
                if (!token) { router.replace("/panel"); return }

                const data = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
                    { withCredentials: true }
                )

                // ✅ Cek role superadmin
                if (!data.data.success || data.data.data?.role !== 'superadmin') {
                    router.replace("/panel")
                }
            } catch (err) {
                router.replace("/panel")
            }
        }
        checkSuperadmin()
    }, [])

    return <>{children}</>
}