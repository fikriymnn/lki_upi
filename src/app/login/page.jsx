'use client'
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/context/userContext"
import { useRouter } from 'next/navigation'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import axios from "axios";
import Router from "next/router";
import Image from "next/image";


export default function Login({ searchParams }) {
    const router = useRouter()

    const { prevRoute } = searchParams
    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_URL)
        async function user() {
            try {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
                    withCredentials: true
                })

                if (data.data.success) {

                    if (prevRoute) {

                        router.replace(prevRoute)
                    } else {

                        // router.replace("/")
                    }
                }
            } catch (err) {
                console.log(err.message)
            }

        }
        user()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const get_user = async () => {
            try {
                const data = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/login`, userForm, { withCredentials: true })

                if (data.data.success == true) {
                    localStorage.setItem('access_token', data.data.token);


                    alert("login sukses")

                    if (prevRoute) {
                        window.location.replace(prevRoute)

                    } else {
                        window.location.replace("/")

                    }


                } else {
                    alert(data.data.message)
                }
            } catch (err) {
                alert(err.message)
            }

        }
        get_user()
    }

    return (
        <>
            <div className="flex items-center justify-center text-2xl h-screen w-full uppercase">
                Under Maintenance. Thank you for patience.

            </div>
        </>
    )
}
