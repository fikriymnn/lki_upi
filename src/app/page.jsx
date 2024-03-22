import Image from "next/image";
import CarouselCustom from "@/components/CarouselCustom";
import LayananCard from "@/components/LayananCard";
import ButtonOrder from "@/components/ButtonOrder";

export default function Home() {
  return (
    <>
      <CarouselCustom />
      <div className=" ">
        <div className="">
<<<<<<< HEAD
          <h1 className="text-center md:text-5xl m-auto sm:text-3xl text-3xl font-bold w-10/12 md:mt-14 sm:mt-6 mt-10 mb-5 text-gray-800">
=======
          <h1 className="text-center md:text-3xl sm:text-xl text-xl p-5 font-bold mt-10 mb-5 text-gray-800">
>>>>>>> 3668677f9a9b768164a5a59f73ae6ab8725491a1
            LAYANAN DAN JASA LAB KIMIA UPI
          </h1>
          <div className="flex justify-center">
            <hr className="text-red-700 bg-red-600  h-2 md:mb-14 sm:mb-5 mb-5 w-8/12 text-center" />
          </div>
        </div>
        <div className="px-16 ">
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center gap-6">
            <LayananCard
              title={"Layanan Analisis "}
              selengkapnya={"Selengkapnya"}
              desc={"Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.  biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order"}
            />
            <LayananCard title={"Sertifikasi"} selengkapnya={"Segera Hadir"} desc={"Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."} />
            <LayananCard title={"Pelatihan"} selengkapnya={"Segera Hadir"} desc={"Here are the biggest enterprise technology acquisitions of 2021 so "} />
          </div>
          <div>
            <ButtonOrder  />
          </div>
        </div>
      </div>
    </>
  );
}
