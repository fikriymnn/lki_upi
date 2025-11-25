'use client'
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"
import Image from "next/image"

export default function Login({ searchParams }) {
    const router = useRouter()
    const { prevRoute } = searchParams
    
    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function checkUser() {
            try {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
                    withCredentials: true
                })

                if (data.data.success && prevRoute) {
                    router.replace(prevRoute)
                }
            } catch (err) {
                console.log(err.message)
            }
        }
        checkUser()
    }, [prevRoute, router])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
    }

    const handleLupaPassword = (e) => {
        e.preventDefault()
        router.push('/lupapassword')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            const data = await axios.post(
                `${process.env.NEXT_PUBLIC_URL}/api/login`, 
                userForm, 
                { withCredentials: true }
            )

            if (data.data.success) {
                localStorage.setItem('access_token', data.data.token)
                alert("Login sukses")
                window.location.replace(prevRoute || "/")
            } else {
                alert(data.data.message)
            }
        } catch (err) {
            alert(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Image with Overlay */}
            <div className="relative bg-neutral-900 lg:flex hidden">
                <Image 
                    alt="Gedung Laboratorium" 
                    src="/images/gedung.jpg" 
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center px-8 text-white">
                    <h1 className="text-5xl font-bold text-center mb-6">
                        Masuk atau Daftar
                    </h1>
                    <p className="text-xl text-center max-w-md leading-relaxed">
                        Laboratorium Kimia Instrumen UPI pengujian dan analisis sampel.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-6 lg:p-12 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Masuk atau Daftar
                        </h1>
                        <p className="text-sm text-gray-600">
                            Laboratorium Kimia Instrumen UPI
                        </p>
                    </div>

                    {/* Login Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900">Login <span className="text-red-700">LKI UPI</span></h2>
                        <p className="mt-2 text-gray-600">Selamat datang kembali</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-semibold text-gray-700 uppercase tracking-wide"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                onChange={handleChange}
                                value={userForm.email}
                                placeholder="contoh@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-semibold text-gray-700 uppercase tracking-wide"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    onChange={handleChange}
                                    value={userForm.password}
                                    placeholder="Masukkan password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red-600 hover:text-red-700 uppercase"
                                >
                                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleLupaPassword}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Lupa password?
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="py-3 px-6 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 text-white font-bold text-lg rounded-full hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Memproses...' : 'Masuk'}
                            </button>
                            <a
                                href={`/register?prevRoute=${prevRoute || ''}`}
                                className="py-3 px-6 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 text-white font-bold text-lg rounded-full hover:shadow-lg transform hover:scale-105 transition-all text-center flex items-center justify-center"
                            >
                                Daftar
                            </a>
                        </div>
                    </form>

                    {/* Footer Text */}
                    <p className="text-center text-sm text-gray-500">
                        Dengan masuk, Anda menyetujui syarat dan ketentuan kami
                    </p>
                </div>
            </div>
        </div>
    )
}