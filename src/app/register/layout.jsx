"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Layout({ children }) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        async function checkUser() {
            try {
                const token = localStorage.getItem('access_token')
                const data = await axios.get(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
                    { withCredentials: true }
                )

                if (data.data.success && data.data.data.role === "user") {
                    router.replace("/")
                    return
                }
            } catch (err) {
                // Token tidak valid / tidak ada → boleh lanjut ke register
            } finally {
                setIsChecking(false)
            }
        }
        checkUser()
    }, [router])

    if (isChecking) return null

    return <>{children}</>
}