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

  useEffect(() => {
    async function getData() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/content?resize=true`,
          { withCredentials: true }
        );
        if (data.data.success) {
          setData(data.data.data);
        }
      } catch (err) {
        alert(err.message);
      }
    }
    getData();
  }, []);

  return (
    <>
      
      <p className="text-center md:text-4xl sm:text-2xl text-xl font-bold text-gray-800 mt-7">
        Daftar Alat Laboratorium Kimia Instrumen UPI
      </p>
      <div className="flex justify-center">
        <hr className="grad h-2 mb-8 mt-5 w-56 text-center" />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-0">
        {data.map((v, i) => (
          <>
            <CardPenguji key={i} id={v._id} nama={v.title} foto={v.foto} />
          </>
        ))}
      </div>

      <br />
      <p className="text-center md:text-4xl sm:text-2xl text-xl font-bold text-gray-800 mt-7">
        Layanan Pengujian Laboratorium Kimia Instrumen LKI UPI
      </p>
      <div className="flex justify-center">
        <hr className="grad h-2 mb-8 mt-5 w-56 text-center" />
      </div>
      <ButtonOrder />
      <br />
    </>
  );
}
