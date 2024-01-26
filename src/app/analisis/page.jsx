
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ButtonOrder from '@/components/ButtonOrder'
import Image from 'next/image'
import CardPenguji from '@/components/CardPenguji';

export default function analisis() {


    return (
        <>
            <main className=''>

                <div className=" flex md:h-[229px] h-40 w-full  ">
                    <Image
                        alt=""
                        src={"/carousel.jpg"}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" md:h-[229px] h-40 w-full"
                    />
                    <div className="bg-neutral-900 bg-opacity-70 w-full md:h-[229px] h-40  absolute flex flex-col justify-center items-center">
                        <p className="text-white md:text-5xl sm:text-xl text-lg font-bold">
                            Layanan Jasa Analisis LKI UPI
                        </p>
                        <div className="flex justify-center mt-5">
                            <div className="px-10 py-2 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-base text-sm">
                                Tentang Kami
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-[60px]'>
                    <p className='text-center text-4xl font-bold text-gray-800 mt-7'>Layanan Pengujian Laboratorium Kimia Instrumen LKI UPI</p>
                    <div className='flex justify-center'>
                        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
                    </div>
                    <div className='grid grid-cols-3 gap-10'>
                        <CardPenguji />
                        <CardPenguji />
                        <CardPenguji />
                    </div>

                    <div className='flex justify-center mt-24'>
                        <ButtonOrder className="" />
                    </div>
                    <br />
                    <br />

                </div>
            </main>
        </>
    )
}