import React from "react";
import { FileText } from "lucide-react";

const CardHome = () => {
  return (
    <div className="rounded-xl shadow-md p-4 flex flex-col gap-2 border">
      <div className="flex justify-center">
        <FileText className="text-orange-500 w-8 h-8" />
      </div>
      <h3 className="font-semibold text-lg text-center">Sertifikasi</h3>
      <p className="text-sm text-center text-gray-600">
        Laboratorium Kimia Instrumen UPI sebagai wadah pelatihan sertifikasi.
        Semua Laboratorium Bengkel FPTK/UPI untuk Layanan Sertifikasi.
      </p>
      <div className="flex justify-center">
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
          Selengkapnya
        </button>
      </div>
    </div>
  );
};

export default CardHome;