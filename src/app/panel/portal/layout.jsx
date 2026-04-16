"use client"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import { useRouter } from "next/navigation"


export default function Layout({ children }) {
    // const router = useRouter()
    // useEffect(() => {
    //     async function user() {
    //         try {
    //             const token = localStorage.getItem('access_token')
    //             if (!token) {
    //                 router.replace("/")
    //             }
    //         } catch (err) {

    //             router.replace("/")
    //         }
    //     }
    //     user()
    // }, [])


    return (
        <>
            {children}
        </>
    )
}