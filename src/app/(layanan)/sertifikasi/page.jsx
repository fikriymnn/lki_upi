import Image from "next/image";

const Sertifikasi = () => {
    return (
        <main className="w-full">
            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[70vh]">
                <Image
                    alt=""
                    src="/carousel.jpg"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-neutral-900/70 flex flex-col justify-center items-center text-center px-4">
                    <p className="text-white font-bold text-3xl md:text-6xl">
                        Layanan Sertifikasi
                    </p>
                    <p
                        className="mt-2 px-8 py-2 text-white rounded-xl font-bold text-sm sm:text-base md:text-lg"
                    >
                        Universitas Pendidikan Indonesia
                    </p>
                </div>
            </div>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="max-w-xl md:text-2xl sm:text-2xl text-lg font-bold text-gray-800 md:mb-4 mb-4">
                            Layanan Sertifikasi Laboratorium Kimia Instrumen <span className="text-red-700">( LKI UPI )</span>
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
                    <div className="bg-slate-900 grad px-10 py-4 rounded-xl">
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