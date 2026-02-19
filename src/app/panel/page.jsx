"use client";
import { useState } from 'react';
import { Eye, EyeOff, FlaskConical, Lock, User, ChevronRight, Beaker, Atom } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-700 via-red-600 to-red-800 relative overflow-hidden flex-col items-center justify-center p-12">

        {/* Animated background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-[-40px] w-48 h-48 bg-white/5 rounded-full" />

        {/* Floating science icons */}
        <div className="absolute top-16 right-16 bg-white/10 backdrop-blur-sm rounded-2xl p-3 rotate-12 shadow-lg">
          <Beaker className="w-7 h-7 text-white/80" />
        </div>
        <div className="absolute bottom-24 left-12 bg-white/10 backdrop-blur-sm rounded-2xl p-3 -rotate-6 shadow-lg">
          <Atom className="w-7 h-7 text-white/80" />
        </div>
        <div className="absolute top-1/3 right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-3 rotate-3 shadow-lg">
          <FlaskConical className="w-6 h-6 text-white/80" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Logo area */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-5 shadow-2xl border border-white/20">
              <img src="footer.png" alt="UPI Logo" className="w-28 object-contain" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Lab Kimia <span className="text-red-200">Instrumen</span>
          </h1>
          <p className="text-red-100 text-lg mb-10 leading-relaxed">
            Platform terintegrasi untuk manajemen laboratorium, layanan analisis, dan sistem affiliasi UPI
          </p>

          {/* Feature pills */}
          {/* <div className="flex flex-col gap-3">
            {[
              { icon: '', label: 'Manajemen Inventory' },
              { icon: '', label: 'Layanan Analisis Kimia' },
              { icon: '', label: 'Affiliate' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-left"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/90 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Bottom credit */}
        <div className="absolute bottom-6 text-white/40 text-xs">
          Universitas Pendidikan Indonesia — Bandung
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">

          {/* Mobile Logo (visible only on small screens) */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="bg-red-600 rounded-2xl p-4 shadow-lg">
              <img src="footer.png" alt="UPI Logo" className="w-20 object-contain" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            {/* <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-red-100">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Sistem Aktif
            </div> */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-500 text-sm">
              Masuk ke <span className="text-red-600 font-semibold">Dashboard Lab LKI UPI</span> untuk melanjutkan
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none bg-gray-50/50 placeholder:text-gray-400"
                    placeholder="Masukkan username Anda"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none bg-gray-50/50 placeholder:text-gray-400"
                    placeholder="Masukkan password Anda"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white group-hover:border-red-400'}`}>
                      {rememberMe && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 select-none">Ingat saya</span>
                </label>
                <a href="#" className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors hover:underline">
                  Lupa password?
                </a>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-xs text-gray-400">
              © 2024 <span className="font-medium text-gray-500">Universitas Pendidikan Indonesia</span>
            </p>
            <p className="text-xs text-gray-400">
              Laboratorium Kimia Instrumen — FPMIPA UPI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;