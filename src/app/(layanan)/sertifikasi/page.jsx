import Image from "next/image";

const Sertifikasi = () => {
    return (
        <main className="w-full">
            {/* Hero Section */}
            <div className="flex md:h-[60vh] h-[40vh] w-full ">
                            <Image
                                alt="Laboratory"
                                src={"/carousel.jpg"}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className=" md:h-[60vh] h-[40vh] w-full object-cover object-center"
                            />
                            <div className="bg-neutral-900 bg-opacity-80 w-full md:h-[60vh] h-[40vh]  absolute flex flex-col justify-center items-center">
                                <p className="text-white md:text-7xl text-3xl font-bold">
                                    Layanan Sertifikasi
                                </p>
                            </div>
                        </div>
            <div class="flex py-4 bg-neutral-secondary-medium rounded-base shadow-sm" aria-label="Breadcrumb">
                <div className="max-w-7xl md:px-8 px-4 mx-auto w-full">
                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li class="inline-flex items-center">
                            <a href="#" class="inline-flex items-center text-sm text-gray-600 font-medium text-body hover:text-fg-brand">
                                Home
                            </a>
                        </li>
                        <li>
                            <div class="flex items-center space-x-1.5">
                                <svg class="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
                                <a href="#" class="inline-flex items-center text-sm text-gray-600 font-medium text-body hover:text-fg-brand">Sertifikasi</a>
                            </div>
                        </li>

                    </ol>
                </div>
            </div>
            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">

                <div className="grid grid-cols-1 gap-8 items-start">
                    <div className="flex flex-col justify-start h-full">
                        <p className="max-w-xl md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 md:mb-4 mb-4 text-red-700">
                            Layanan Sertifikasi Laboratorium Kimia Instrumen
                        </p>
                        <p className="text-gray-800 text-opacity-90 font-medium text-sm md:text-base leading-8 md:leading-[40px] text-justify">
                            Laboratorium Kimia Instrumen UPI bekerja sama dengan Lembaga Tenaga
                            Laboratorium Penguji (TELAPI) untuk Layanan Sertifikasi.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Image
                            src="/images/sertifikasi.jpeg"
                            alt="Laboratory"
                            width={800}
                            height={600}
                            className="rounded-sm shadow-md object-cover"
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-10 md:pt-20">
                    <div className="bg-slate-900 grad px-10 py-4 rounded-md">
                        <p className="text-white font-bold text-sm sm:text-lg uppercase">
                            Segera Hadir
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Sertifikasi;