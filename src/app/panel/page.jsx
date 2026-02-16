"use client";
import { useState } from 'react';
import { Package } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      
    }
  };

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 px-4 bg-red-600 rounded-md mb-4">
              <img src='footer.png' className='w-24 object-center'/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Lab Kimia UPI</h1>
            <p className="text-gray-600 text-sm">Manajemen Inventory, Layanan analisis & Affiliate</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Masukkan password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition shadow-lg shadow-red-600/30"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            © 2024 Universitas Pendidikan Indonesia
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;