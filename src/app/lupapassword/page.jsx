'use client'
import { useState } from "react"
import axios from "axios"

export default function LupaPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const data = await axios.post(
                `${process.env.NEXT_PUBLIC_URL}/api/forgot_password`,
                { email }
            )

            if (data.data.success) {
                setMessage({ type: 'success', text: data.data.message })
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
                    <h2 className="text-4xl font-bold text-gray-900">Lupa <span className="text-red-700">Password</span></h2>
                    <p className="mt-2 text-gray-600">Masukkan email untuk menerima link reset password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="contoh@email.com"
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
                        {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                    </button>
                </form>

                <p className="text-center text-sm">
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Kembali ke login
                    </a>
                </p>
            </div>
        </div>
    )
}