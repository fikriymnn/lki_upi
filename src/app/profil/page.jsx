"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Navigasi from "@/components/Navigasi";
import {
  User,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  GraduationCap,
  BookOpen,
  Pencil,
  Check,
  X,
} from "lucide-react";

// ✅ DIPINDAH KE LUAR (IMPORTANT)
const Field = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  edit,
  editable = true,
  readOnly = false,
}) => (
  <div className="grid grid-cols-2 items-center border border-gray-200 rounded-xl p-3 shadow-sm bg-white hover:bg-gray-50 transition">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <p className="text-sm font-semibold text-gray-700">{label}</p>
    </div>

    {edit && editable ? (
      <input
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition bg-white text-gray-700"
        type="text"
        name={name}
        value={value || ""} // ✅ FIX (controlled)
        onChange={onChange}
        readOnly={readOnly}
      />
    ) : (
      <p className="text-sm text-gray-600">
        {value || <span className="text-gray-300">—</span>}
      </p>
    )}
  </div>
);

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    nama_lengkap: "",
    jenis_institusi: "",
    no_whatsapp: "",
    email: "",
    no_telp: "",
    nama_institusi: "",
    falkultas: "",
    program_studi: "",
  });

  // ✅ FIX: HAPUS preventDefault
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const users = async () => {
      try {
        const data = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${user._id}`,
          user,
          { withCredentials: true }
        );
        if (data.data.success) {
          setEdit((e) => !e);
          alert("Update Success");
        }
      } catch (err) {
        alert(err.message);
      }
    };
    users();
  };

  useEffect(() => {
    const users = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const data = await axios(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          {
            withCredentials: true,
          }
        );
        if (data.data.success == true) {
          setUser(data.data.data);
        }
      } catch (err) {
        alert(err.message);
      }
    };
    users();
  }, []);

  return (
    <>
      <div className="p-6 mb-20">
        <div className="max-w-7xl mx-auto md:px-8 px-4">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola informasi akun dan data institusi Anda
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">
                  Informasi Pengguna
                </p>
              </div>

              {edit ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirm}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => setEdit((e) => !e)}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEdit((e) => !e)}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            {/* Form */}
            <form className="p-5 flex flex-col gap-3">
              <Field icon={User} label="Nama Lengkap" name="nama_lengkap" value={user?.nama_lengkap} onChange={handleChange} edit={edit} />
              <Field icon={Mail} label="Email" name="email" value={user?.email} onChange={handleChange} edit={edit} />
              <Field icon={MessageCircle} label="No Whatsapp" name="no_whatsapp" value={user?.no_whatsapp} onChange={handleChange} edit={edit} />
              <Field icon={Phone} label="No Telepon" name="no_telepon" value={user?.no_telp} onChange={handleChange} edit={edit} />
              <Field icon={Building2} label="Jenis Institusi" name="jenis_institusi" value={user?.jenis_institusi} onChange={handleChange} edit={edit} readOnly={true} />

              {user.jenis_institusi === "Pendidikan" ? (
                <>
                  <Field icon={Building2} label="Nama Institusi" name="nama_institusi" value={user?.jenis_institusi} onChange={handleChange} edit={edit} />
                  <Field icon={GraduationCap} label="Fakultas" name="fakultas" value={user?.falkultas} onChange={handleChange} edit={edit} />
                  <Field icon={BookOpen} label="Program Studi" name="program_studi" value={user?.program_studi} onChange={handleChange} edit={edit} />
                </>
              ) : (
                <Field icon={Building2} label="Nama Institusi" name="nama_institusi" value={user?.nama_institusi} onChange={handleChange} edit={edit} />
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}