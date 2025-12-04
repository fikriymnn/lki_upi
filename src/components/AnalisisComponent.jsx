"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import ButtonOrder from "@/components/ButtonOrder";
import Image from "next/image";
import CardPenguji from "@/components/CardPenguji";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AnalisisComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/content?resize=true`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto md:px-8 px-4 py-12 md:pt-16">
        {/* Title Section */}
        <p className="md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-8 mb-8 text-red-700">
          Daftar Alat Laboratorium
        </p>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
            {data.map((v, i) => (
              <div key={i} className="transform transition-all duration-300 hover:scale-105">
                <CardPenguji id={v._id} nama={v.title} foto={v.foto} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">Belum ada alat laboratorium tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}