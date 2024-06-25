import React from 'react'
import Image from "next/image";

const Sertifikasi = () => {
    return (
        <>
            <main>
                <div className="flex md:h-[229px] h-40 w-full">
                    <Image
                        alt=""
                        src={"/carousel.jpg"}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" md:h-[229px] h-40 w-full"
                    />
                    <div className="bg-neutral-900 bg-opacity-70 w-full md:h-[229px] h-40  absolute flex flex-col justify-center items-center">
                        <p className="text-white md:text-5xl sm:text-xl text-lg font-bold uppercase">
                            Layanan Sertifikasi LKI UPI
                        </p>
                        <div className="flex justify-center mt-5">
                            <a
                                href="/about"
                                className="px-10 py-2 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-base text-sm"
                            >
                                Tentang Kami
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mb-16 md:h-screen w-full">
                    <div className="flex flex-col md:h-[100px] items-center mt-8 md:ml-10 md:mr-10">
                        <h2 className="text-center mb-3 font-bold md:text-3xl text-lg uppercase">
                            Layanan Sertifikasi Laboratorium Kimia Instrumen
                        </h2>
                        <h2 className="text-center mb-3 font-bold md:text-3xl text-lg uppercase">
                            Universitas Pendidikan Indonesia
                        </h2>
                    </div>
                    <div className="flex justify-center">
                        <hr className="grad h-2 mb-8 mt-5 md:w-96 w-56 text-center" />
                    </div>
                    <div className="md:flex sm:flex md:justify-normal justify-center items-center m-auto ">
                        <div className="md:px-14 sm:px-5 px-3 flex  justify-center items-center ">
                            <Image
                                src={"/images/sertifikasi.jpeg"}
                                alt="Labolatory"
                                width={1500}
                                height={1500}
                            />
                        </div>
                        <div className="flex flex-col ml-8 md:ml-2 mr-8 md:mr-12">
                            <p className="text-justify font-medium md:text-[24px] text-[18px] md:leading-[48px] leading-10 tracking-wide text-neutral-900 text-opacity-90">Laboratorium Kimia Instrumen UPI bekerja sama dengan Lembaga Tenaga Laboratorium Penguji (TELAPI) untuk Layanan Sertifikasi.</p>

                        </div>
                    </div>
                    <div className="flex justify-center md:pt-28 pt-10">
                        <div className='cursor-pointer mb-5'>

                            <div className="flex justify-center md:mt-[20px] sm:mt-[56px] mt-5">
                                <div className="md:px-20 sm:px-10 px-10 py-4 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-lg text-sm uppercase">
                                    Segera Hadir
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Sertifikasi