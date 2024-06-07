import Image from "next/image";
import CarouselCustom from "@/components/CarouselCustom";
import LayananCard from "@/components/LayananCard";
import ButtonOrder from "@/components/ButtonOrder";
import { Noto_Sans } from 'next/font/google';

const inter = Noto_Sans({ subsets: ['latin'],weight: "500" });

export default function Home() {
  return (
    <>
      <CarouselCustom />
      <div className=" ">
        <div className={inter.className}>
          <h1 className="text-center md:text-4xl m-auto sm:text-3xl text-2xl font-bold w-10/12 md:mt-14 sm:mt-6 mt-10 mb-2 text-gray-800">
            Layanan dan Jasa Lab Kimia UPI
          </h1>
          <div className="flex justify-center">
            <hr className="text-red-700 bg-red-600  h-[5px] md:mb-14 sm:mb-5 mb-5 w-7/12 text-center" />
          </div>
        </div>
        <div className="md:px-16 sm:px-16 px-10">
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center gap-6">
            <LayananCard
              title={"Layanan Analisis "}
              href={"/analisis"}
              selengkapnya={"Selengkapnya"}
              desc={
                "Layanan analisis ataupun pengujian sampel Laboratorium Kimia Instrumen UPI."
              }
            />
            <LayananCard
              title={"Sertifikasi"}
              href={""}
              selengkapnya={"Segera Hadir"}
              desc={"Sertifikasi LKI UPI."}
            />
            <LayananCard
              title={"Pelatihan"}
              selengkapnya={"Segera Hadir"}
              desc={"Pelatihan LKI UPI."}
            />
          </div>
          <div className="md:mb-20 sm:mb-20 mb-5">
            <ButtonOrder />
          </div>
        </div>
      </div>
    </>
  );
}
