'use client'
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"

export default function ResetPassword() {
    const router = useRouter()
    const { token } = useParams()

    const [passwordForm, setPasswordForm] = useState({
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setPasswordForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (passwordForm.password !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak sama.' })
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            const data = await axios.post(
                `${process.env.NEXT_PUBLIC_URL}/api/reset_password/${token}`,
                { password: passwordForm.password }
            )

            if (data.data.success) {
                setMessage({ type: 'success', text: data.data.message })
                setTimeout(() => router.push('/login'), 2000)
            } else {
                setMessage({ type: 'error', text: data.data.message })
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Reset <span className="text-red-700">Password</span></h2>
                    <p className="mt-2 text-gray-600">Masukkan password baru kamu</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 uppercase tracking-wide"
                        >
                            Password Baru
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                onChange={handleChange}
                                value={passwordForm.password}
                                placeholder="Masukkan password baru"
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

                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-semibold text-gray-700 uppercase tracking-wide"
                        >
                            Konfirmasi Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            onChange={handleChange}
                            value={passwordForm.confirmPassword}
                            placeholder="Ulangi password baru"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    {message && (
                        <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 text-white font-bold text-lg rounded-full hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Memproses...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}