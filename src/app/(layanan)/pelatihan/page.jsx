"use client";
import React from "react";
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
            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[70vh] overflow-hidden">
                <Image
                    alt="Laboratory Hero"
                    src={"/carousel.jpg"}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-70 flex items-center justify-center">
                    <div className="text-center px-6 animate-fade-in">
                        <h1 className="text-white text-3xl md:text-6xl font-bold tracking-wide drop-shadow-lg">
                            Layanan Pelatihan
                        </h1>
                        <p
                            className="mt-2 px-8 py-2 text-white rounded-xl font-semibold text-sm sm:text-base md:text-lg"
                        >
                            Universitas Pendidikan Indonesia
                        </p>
                    </div>

                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">

                    {/* Text Content */}
                    <div className="animate-slide-right">
                        {/* Header */}
                        <p className="max-w-xl md:text-2xl sm:text-2xl text-lg font-bold text-gray-800 mt-8 md:mt-16 md:mb-4 mb-4">
                            Layanan Pelatihan Laboratorium Kimia Instrumen <span className="text-red-700">( LKI UPI )</span>
                        </p>

                        <p className="text-lg md:text-base font-medium text-gray-700 leading-relaxed mb-8">
                            Laboratorium Kimia Instrumen UPI menyediakan layanan pelatihan, meliputi:
                        </p>

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
                    </div>

                    {/* Image Section */}
                    <div className="relative group animate-slide-left mt-10">
                        <div className="relative overflow-hidden rounded-sm shadow-2xl transition-transform duration-500 hover:scale-105">
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

                {/* CTA Section */}
                <div className="flex justify-center pt-8 animate-fade-in-up mb-8">
                    <button className="group relative px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg uppercase rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10">Segera Hadir</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        <span className="relative z-10 ml-2 inline-block group-hover:translate-x-2 transition-transform duration-300">
                            →
                        </span>
                    </button>
                </div>

                {/* Additional Info Cards */}

            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-left {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                }

                .animate-slide-left {
                    animation: slide-left 0.8s ease-out;
                }

                .animate-slide-right {
                    animation: slide-right 0.8s ease-out;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out;
                }
            `}</style>
        </main>
    );
};

export default Pelatihan;