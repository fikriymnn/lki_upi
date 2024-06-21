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
        <br className="md:mb-20 sm:mb-14 mb-10"/>
        <p className="md:text-3xl sm:text-2xl text-2xl font-bold md:mb-2 sm:mb-8 mb-2  md:mt-6 sm:mt-6 mt-3 text-center">LAYANAN</p>
        <div className="flex justify-center ">
          <hr className="text-red-700 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 h-2 mb-10 w-56 text-center" />
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
          <br/><br/>
          <br className="md:mb-20 sm:mb-18 mb-14"/>
        </div>
      </div>
      <div className="bg-gray-200 py-10 w-full h-full md:px-16 sm:px-16 px-10">
          <div className="flex justify-center w-full md:flex-nowrap flex-wrap drop-shadow-lg">
           <Image src={'/images/bbb.jpg'} width={400} height={280} alt={"foto"} className="rounded-lg shadow-lg"/>
           <div className="grid grid-cols-1 md:p-10 sm:p-5 p-2">
            <p className="md:text-5xl sm:text-3xl text-lg font-bold md:mb-100 sm:mb-8 mb-2 text-left">About us</p>
            <p className="text-left drop-shadow-xl md:text-xl sm:text-lg text-sm">Laboratorium Kimia Instrumen (LKI) merupakan salah satu unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi, dan juga masyarakat umum.</p>
            <ButtonOrder />
           </div>
          </div>
          </div>
          <br className="md:h-40 sm:mb-14 mb-10"/>
          <br/><br/>
    </>
  );
}
