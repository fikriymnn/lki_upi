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
          <h1 className="text-center text-4xl font-bold mt-10 mb-5 text-gray-800">
            LAYANAN DAN JASA LAB KIMIA UPI
          </h1>
          <div className="flex justify-center">
            <hr className="text-red-700 bg-red-600 h-2 mb-8 w-56 text-center" />
          </div>
        </div>
        <div className="p-16 ">
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
            <ButtonOrder />
          </div>
        </div>
      </div>
    </>
  );
}
