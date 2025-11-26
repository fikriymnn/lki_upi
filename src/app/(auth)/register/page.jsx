"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function Register({ searchParams }) {
  const { prevRoute } = searchParams;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    nama_lengkap: "",
    jenis_institusi: "",
    nama_institusi: "",
    program_studi: "",
    fakultas: "",
    email: "",
    password: "",
    no_telp: "",
    no_whatsapp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    async function checkUser() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/user`,
          { withCredentials: true }
        );

        if (data.data.success) {
          router.push(prevRoute || "/");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    checkUser();
  }, [prevRoute, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/register`,
        userForm,
        { withCredentials: true }
      );

      if (data.data.status === 400) {
        alert(data.data.message);
      }

      if (data.data.success) {
        localStorage.setItem("access_token", data.data.token);
        window.location.replace(prevRoute || "/");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Registrasi Layanan <span className="text-red-700">LKI UPI</span>
          </h1>
          <p className="text-gray-600">Lengkapi formulir pendaftaran di bawah ini</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Grid Layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="nama_lengkap"
                    type="text"
                    required
                    value={userForm.nama_lengkap}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Jenis Institusi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Institusi <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="jenis_institusi"
                    required
                    value={userForm.jenis_institusi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none bg-white"
                  >
                    <option value="" disabled>
                      Pilih jenis institusi
                    </option>
                    <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                    <option value="Perusahaan">Perusahaan</option>
                  </select>
                </div>

                {/* No Telepon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No Telepon <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="no_telp"
                    type="tel"
                    required
                    value={userForm.no_telp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* No WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No WhatsApp <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="no_whatsapp"
                    type="tel"
                    required
                    value={userForm.no_whatsapp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Conditional Fields based on Institution Type */}
                {userForm.jenis_institusi === "Perusahaan" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Perusahaan <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="nama_institusi"
                      type="text"
                      required
                      value={userForm.nama_institusi}
                      onChange={handleChange}
                      placeholder="Masukkan nama perusahaan"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                )}

                {userForm.jenis_institusi === "Perguruan Tinggi" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Perguruan Tinggi <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="nama_institusi"
                        type="text"
                        required
                        value={userForm.nama_institusi}
                        onChange={handleChange}
                        placeholder="Masukkan nama perguruan tinggi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Fakultas <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="fakultas"
                        type="text"
                        required
                        value={userForm.fakultas}
                        onChange={handleChange}
                        placeholder="Masukkan nama fakultas"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Program Studi <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="program_studi"
                        type="text"
                        required
                        value={userForm.program_studi}
                        onChange={handleChange}
                        placeholder="Masukkan nama program studi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={userForm.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={userForm.password}
                      onChange={handleChange}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red-600 hover:text-red-700 uppercase"
                    >
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center space-y-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-md py-4 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 text-white font-bold text-xl rounded-full hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Memproses..." : "Daftar Sekarang"}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-gray-600">Sudah punya akun? </span>
                <a
                  href={`/login?prevRoute=${prevRoute || ""}`}
                  className="text-red-700 font-semibold hover:text-red-800 transition-colors"
                >
                  Login di sini
                </a>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Dengan mendaftar, Anda menyetujui syarat dan ketentuan layanan LKI UPI
        </p>
      </div>
    </div>
  );
}