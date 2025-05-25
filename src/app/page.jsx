import Image from "next/image";
import CarouselCustom from "@/components/CarouselCustom";
import LayananCard from "@/components/LayananCard";
import ButtonOrder from "@/components/ButtonOrder";
import Hero from "@/components/section/Hero";
import { Microscope,FileText,FlaskConical } from "lucide-react";


// const inter = Noto_Sans({ subsets: ["latin"], weight: "500" });

export default function Home() {
  return (
    <>
      <Hero />
      <div className=" ">
        <br className="md:mb-20 sm:mb-14 mb-10" />
        <p className="md:text-3xl sm:text-2xl text-2xl font-bold md:mb-2 sm:mb-8 mb-2  md:mt-6 sm:mt-6 mt-3 text-center">
          LAYANAN
        </p>
        <div className="flex justify-center ">
          <hr className="text-red-700 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 h-2 mb-10 w-56 text-center" />
        </div>
        <div className="md:px-16 sm:px-16 px-10">
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center gap-6">

            <div className="rounded-xl shadow-md p-6 flex flex-col gap-2 border">
              <div className="flex">
                <Microscope className="text-gray-400 w-14 h-14" />
              </div>
              <h3 className="font-semibold text-lg my-2">Layanan Analisis</h3>
              <p className="text-xs text-center text-gray-600 text-justify">
              Layanan analisis ataupun pengujian sampel Laboratorium Kimia Instrumen UPI.
              </p>
              <div className="flex justify-center w-full items-end h-full">
                <a href="/analisis" className="w-full"><button className="w-full bg-red-700 text-xs mt-4 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Selengkapnya
                </button></a>
              </div>
            </div>
            <div className="rounded-xl shadow-md p-6 flex flex-col gap-2 border">
              <div className="flex ">
                <FileText className="text-orange-500 w-14 h-14" />
              </div>
              <h3 className="font-semibold text-lg my-2">Sertifikasi</h3>
              <p className="text-xs text-center text-gray-600 text-justify">
                Laboratorium Kimia Instrumen UPI sebagai wadah pelatihan sertifikasi.
                Semua Laboratorium Bengkel FPTK/UPI untuk Layanan Sertifikasi.
              </p>
              <div className="flex justify-center w-full items-end h-full">
                <a href="" className="w-full"><button className="w-full bg-red-700 text-xs mt-4 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Selengkapnya
                </button></a>
              </div>
            </div>


            <div className="rounded-xl shadow-md p-6 flex flex-col gap-2 border">
              <div className="flex ">
                <FlaskConical className="text-green-600 w-14 h-14" />
              </div>
              <h3 className="font-semibold text-lg my-2">Pelatihan</h3>
              <p className="text-xs text-center text-gray-600 text-justify">
              Laboratorium Kimia Instrumen UPI menyediakan Layanan Pelatihan.
              </p>
              <div className="flex justify-center w-full items-end h-full">
                <a href="" className="w-full"><button className="w-full bg-red-700 text-xs mt-4 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Selengkapnya
                </button></a>
              </div>
            </div>
          </div>
          <br className="md:mb-14 sm:mb-18 mb-14" />
        </div>
      </div>
      <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Chemistry laboratory with colorful flasks"
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Tentang Kami</h2>
            <div className="w-24 h-1 bg-red-600 mb-6"></div>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              Laboratorium Kimia Instrumen (LKI) merupakan salah satu unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi, dan juga masyarakat umum.
            </p>
            
            <ul className="mb-8 space-y-2">
              <li className="flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">✓</span>
                <span>Analisis sampel profesional</span>
              </li>
              <li className="flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">✓</span>
                <span>Pelatihan penggunaan instrumen kimia</span>
              </li>
              <li className="flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">✓</span>
                <span>Program sertifikasi resmi</span>
              </li>
            </ul>
            
            {/* <Button variant="destructive" size="lg">
              Pesan Sekarang
            </Button> */}
          </div>
        </div>
      </div>
    </section>
      <br className="md:h-40 sm:mb-14 mb-10" />
      <br />
      <br />
    </>
  );
}
