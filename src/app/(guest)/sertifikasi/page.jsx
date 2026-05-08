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
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-white">
                        Layanan{" "}
                        <span className="font-extrabold text-red-700">Sertifikasi</span>
                    </h2>
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