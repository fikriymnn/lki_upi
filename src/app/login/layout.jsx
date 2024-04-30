"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function Layout({ children }) {
    const router = useRouter()
    useEffect(() => {
        async function user() {
            try {
                const token = localStorage.getItem('access_token')
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${token}`, {
                    withCredentials: true
                })
                if (data.data.success == "user") {
                    router.replace("/")
                }
            } catch (err) {

                return false
            }
        }
        user()
    }, [])


    return (
        <>
            {children}
        </>
    )
}