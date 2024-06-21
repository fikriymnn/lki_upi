"use client";

import { Carousel } from "flowbite-react";

export default function CarouselCustom() {
  return (
    <div className="h-56 sm:h-85 xl:h-[500px] 2xl:h-[700px]  w-full shadow-xl">
      <Carousel>
        <div className="flex bg-neutral-900 ">
          <img
            src="./carousel1.jpeg"
            alt="..."
            className="h-56 sm:h-85 xl:h-[500px] 2xl:h-[700px] w-full opacity-70"
          />

          <div className="flex absolute z-40 md:w-[900px] sm:w-[400px] w-[250px] flex-col translate-y-[13vw] sm:translate-y-[8vw] md:translate-y-[10vw] lg:translate-y-[7vw] ">
            <p className="drop-shadow-md md:ml-[112px] sm:mx-[50px] mx-[10px]   text-white font-bold md:text-6xl sm:text-3xl text-lg ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="drop-shadow-md font-semibold md:w-[700px] md:text-2xl sm:text-lg md:pr-0 sm:pr-0 pr-8 text-xs md:mx-[112px] sm:mx-[50px] mx-[14px] text-white mt-2 md:mb-5">
              Laboratorium Kimia Instrumen UPI merupakan unit laboratorium
              pengujian di KIMIA UPI.
            </p>
            <div className="flex md:justify-center sm:justify-center md:ml-0 sm:ml-0 ml-5 md:mt-2 sm:mt-2 mt-5">
              {/* <div className="px-10 py-2 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-base text-sm">
                Tentang Kami
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex bg-neutral-900">
          <img
            src="./images/labb.jpg"
            alt="..."
            className="h-56 sm:h-85 xl:h-[500px] 2xl:h-[700px] w-full opacity-70"
          />
          <div className="flex absolute z-50 md:w-[900px] sm:w-[400px] w-[250px] flex-col translate-y-[13vw] sm:translate-y-[8vw] md:translate-y-[10vw] lg:translate-y-[7vw]">
            <p className="drop-shadow-md md:ml-[112px] sm:mx-[50px] mx-[10px]   text-white font-bold md:text-6xl sm:text-3xl text-lg ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="drop-shadow-md font-semibold md:w-[700px] md:text-2xl sm:text-lg text-xs md:pr-0 sm:pr-0 pr-8 md:mx-[112px] sm:mx-[50px] mx-[14px] text-white mt-2 md:mb-5">
              Laboratorium Kimia Instrumen UPI membuka layanan pengujian untuk
              dosen, mahasiswa, dan umum.
            </p>
            <div className="flex justify-centermd:justify-center sm:justify-center md:ml-0 sm:ml-0 ml-5 md:mt-2 sm:mt-2 mt-5">
              {/* <div className="px-10 py-2 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-base text-sm">
                Tentang Kami
              </div> */}
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
