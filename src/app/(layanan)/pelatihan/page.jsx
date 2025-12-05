import Image from "next/image";

const Pelatihan = () => {
    const trainingList = [
        "Pelatihan Peralatan instrumen HPLC, GCFID/GCMS, UV VIS, AAS dan LCMS",
        "Pelatihan Laboran Kimia",
        "Pelatihan K3 Laboratorium",
        "Pelatihan Teknisi Laboratorium",
        "Pelatihan Interpretasi Data NMR dan FTIR"
    ];

    return (
        <main className="min-h-screen bg-gray-50">
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
                        Layanan Pelatihan
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
                                <a href="#" class="inline-flex items-center text-sm text-gray-600 font-medium text-body hover:text-fg-brand">Pelatihan</a>
                            </div>
                        </li>

                    </ol>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">

                {/* Content Grid */}
                <div className="items-center mb-16">

                    {/* Text Content */}
                    <div className="animate-slide-right">
                        {/* Header */}
                        <p className="max-w-2xl md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-8 md:mt-16 md:mb-4 mb-4 text-red-700">
                            Layanan Pelatihan Laboratorium Kimia Instrumen
                        </p>

                        <p className="text-lg md:text-base font-medium text-gray-700 leading-relaxed mb-8">
                            Laboratorium Kimia Instrumen UPI menyediakan layanan pelatihan, meliputi:
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
                            {/* Training List */}
                            <div className="space-y-4">
                                {trainingList.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-600 text-white font-bold rounded-full group-hover:scale-110 transition-transform duration-300">
                                            {index + 1}
                                        </div>
                                        <p className="text-base md:text-sm text-slate-700 leading-relaxed font-medium">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* Image Section */}
                            <div className="relative group animate-slide-left">
                                <div className="relative overflow-hidden rounded-sm shadow-md transition-transform duration-200 hover:scale-102">
                                    <Image
                                        src={"/images/pelatihan.jpg"}
                                        alt="Laboratory Training"
                                        width={800}
                                        height={800}
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8 pb-8">
                    <div className="bg-slate-900 grad px-10 py-4 rounded-md">
                        <p className="text-white font-bold text-sm sm:text-lg uppercase">
                            Segera Hadir
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Pelatihan;