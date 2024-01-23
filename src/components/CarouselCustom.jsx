"use client";

import { Carousel } from "flowbite-react";

export default function CarouselCustom() {
  return (
    <div className="h-72 sm:h-96 xl:h-96 2xl:h-96">
      <Carousel>
        <div className="flex ">
          <img src="./carousel1.jpg" alt="..." className=" w-full " />
          <div className="flex absolute z-50 w-[700px] flex-col">
            <p className=" mx-[112px] pt-[200px]  text-white font-bold text-5xl ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="font-semibold text-xl mx-[112px] ">
              Laboratorium Kimia Instrumen UPI merupakan bla bla bla bla dengan
              bla bla bla bla bla.
            </p>
            <div className="flex justify-center mt-5">
              <div className="px-10 py-2 bg-slate-900 text-white bg-gradient-to-r from-red-700 via-red-700 to-rose-950 rounded-xl font-bold text-lg">
                Tentang Kami
              </div>
            </div>
          </div>
        </div>
        <div className="flex ">
          <img src="./carousel1.jpg" alt="..." className=" w-full " />
          <div className="flex absolute z-50 w-[700px] flex-col">
            <p className=" mx-[112px] pt-[200px]  text-white font-bold text-5xl ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="font-semibold text-xl mx-[112px] ">
              Laboratorium Kimia Instrumen UPI merupakan bla bla bla bla dengan
              bla bla bla bla bla.
            </p>
            <div className="flex justify-center mt-5">
              <div className="px-10 py-2 bg-slate-900 text-white bg-gradient-to-r from-red-700 via-red-700 to-rose-950 rounded-xl font-bold text-lg">
                Tentang Kami
              </div>
            </div>
          </div>
        </div>
        <div className="flex ">
          <img src="./carousel.jpg" alt="..." className=" w-full " />
          <div className="flex absolute z-50 w-[700px] flex-col">
            <p className=" mx-[112px] pt-[200px]  text-white font-bold text-5xl ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="font-semibold text-xl mx-[112px] ">
              Laboratorium Kimia Instrumen UPI merupakan bla bla bla bla dengan
              bla bla bla bla bla.
            </p>
            <div className="flex justify-center mt-5">
              <div className="px-10 py-2 bg-slate-900 text-white bg-gradient-to-r from-red-700 via-red-700 to-rose-950 rounded-xl font-bold text-lg">
                Tentang Kami
              </div>
            </div>
          </div>
        </div>
        <div className="flex ">
          <img src="./carousel1.jpg" alt="..." className=" w-full " />
          <div className="flex absolute z-50 w-[700px] flex-col">
            <p className=" mx-[112px] pt-[200px]  text-white font-bold text-5xl ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="font-semibold text-xl mx-[112px] ">
              Laboratorium Kimia Instrumen UPI merupakan bla bla bla bla dengan
              bla bla bla bla bla.
            </p>
            <div className="flex justify-center mt-5">
              <div className="px-10 py-2 bg-slate-900 text-white bg-gradient-to-r from-red-700 via-red-700 to-rose-950 rounded-xl font-bold text-lg">
                Tentang Kami
              </div>
            </div>
          </div>
        </div>
        <div className="flex ">
          <img src="./carousel.jpg" alt="..." className=" w-full " />
          <div className="flex absolute z-50 w-[700px] flex-col">
            <p className=" mx-[112px] pt-[200px]  text-white font-bold text-5xl ">
              Laboratorium Kimia Instrumen UPI
            </p>
            <p className="font-semibold text-xl mx-[112px] ">
              Laboratorium Kimia Instrumen UPI merupakan bla bla bla bla dengan
              bla bla bla bla bla.
            </p>
            <div className="flex justify-center mt-5">
              <div className="px-10 py-2 bg-slate-900 text-white bg-gradient-to-r from-red-700 via-red-700 to-rose-950 rounded-xl font-bold text-lg">
                Tentang Kami
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
