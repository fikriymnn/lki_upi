import Image from "next/image";

export default function About() {
    return (
        <>
            <div className="">

                <div className='bg-gray-600 h-96 w-full'>

                </div>

                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>Tentang Kami</p>
                <div className='flex justify-center '>
                    <hr className='text-red-700 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 h-2 mb-10 mt-5 w-72 text-center' />
                </div>
                <div className="md:flex sm:flex md:justify-normal justify-center items-center ">
                    <div className="md:px-14 sm:px-5 flex  justify-center items-center ">

                        <Image src={"/tentangkami.jpg"}
                            alt="Labolatory"
                            width={0}
                            height={0}
                            sizes="100vh"
                            className="md:w-[329px] w-[329px] sm:w-48"
                        />
                    </div>
                    <div className="flex justify-center">

                        <div className="w-[449px] px-10 md:py-0 py-5">
                            <p className="text-justify font-medium md:text-[24px] text-[16px] md:leading-[48px] leading-10 tracking-wide text-neutral-900 text-opacity-90 ">

                                Laboratorium Kimia Instrumen (LKI) merupakan salah satu unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi, dan juga masyarakat umum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}