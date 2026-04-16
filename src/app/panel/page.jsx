"use client";
import { useState } from 'react';
import { Eye, EyeOff, FlaskConical, Lock, User, Beaker, Atom, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.trace("1")
    if (!username || !password) {
      setErrorMessage('Username dan password harus diisi');
      return;
    }

    console.trace("2")
    setIsLoading(true);
    setErrorMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: username, password: password })
      });
      console.trace("3")
      const data = await response.json();

      if (data.success) {
        console.trace("4")
        if (data.data) {
          console.trace("5")
          const userRole = data.data.role;
          if (['admin', 'operator', 'pj'].includes(userRole)) {
            router.push('/panel/portal');
          } else {
            setErrorMessage('Akses terbatas untuk Admin, Operator, dan PJ.');
          }
        }
      } else {
        setErrorMessage(data.message || 'Login gagal. Periksa kembali email dan password.');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel - Hero Branding (Sesuai Portal) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#b91c1c] relative overflow-hidden flex-col items-center justify-center p-12">
        
        {/* Abstract Background (Matching Portal Page) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-red-500/20 blur-[100px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-black/20 blur-[100px]" />
        </div>

        {/* Floating Icons */}
        <div className="absolute top-16 right-16 bg-white/10 backdrop-blur-md rounded-2xl p-4 rotate-12 border border-white/10 shadow-2xl">
          <Beaker className="w-8 h-8 text-white/70" />
        </div>
        <div className="absolute bottom-24 left-12 bg-white/10 backdrop-blur-md rounded-2xl p-4 -rotate-6 border border-white/10 shadow-2xl">
          <Atom className="w-8 h-8 text-white/70" />
        </div>
        <div className="absolute top-1/3 left-8 bg-white/10 backdrop-blur-md rounded-2xl p-3 rotate-3 border border-white/10 shadow-2xl">
          <FlaskConical className="w-6 h-6 text-white/70" />
        </div>

        {/* Branding Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center p-4 mb-10 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl transition-transform hover:scale-105 duration-500">
            <img src="/footer.png" alt="UPI Logo" className="w-24 object-contain" />
          </div>

          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Lab Kimia <br />
            <span className="text-red-200">Instrumen</span>
          </h1>
          <p className="text-red-100 text-lg leading-relaxed opacity-90">
            Pusat kendali terintegrasi untuk manajemen stok, layanan analisis, dan kolaborasi mitra UPI.
          </p>
        </div>

        <div className="absolute bottom-8 text-white/40 text-xs font-medium tracking-widest uppercase">
          Universitas Pendidikan Indonesia
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f8fafc] p-8">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo Only */}
          <div className="flex lg:hidden justify-center mb-10">
            <div className="bg-red-600 rounded-3xl p-5 shadow-xl shadow-red-600/20">
              <img src="/footer.png" alt="UPI Logo" className="w-16 object-contain" />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Selamat Datang</h2>
            <p className="text-gray-500 font-medium">
              Silakan masuk ke <span className="text-red-600">Dashboard LKI</span>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-10 relative overflow-hidden">
            {/* Design Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 -mr-16 -mt-16" />

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-medium animate-shake">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div>
                <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Email Address
                </label>
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none placeholder:text-gray-300 font-medium"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Security Password
                </label>
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none placeholder:text-gray-300 font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-red-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-xl grad hover:shadow-red-600/30 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Otentikasi...</span>
                  </div>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-xs font-medium">
            © 2026 Laboratorium Kimia Instrumen <br/>
            FPMIPA Universitas Pendidikan Indonesia
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;