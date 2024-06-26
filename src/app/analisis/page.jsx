import React from "react";
import Image from "next/image";
import AnalisisComponent from "/src/components/AnalisisComponent";

export const metadata = {
  title: "Layanan Analisis",
  description: "Layanan Pengujian Laboratorium Kimia Instrumen LKI UPI",
};

const Analisis = () => {
  const dataPengukur = [
    {
      alatPengukuran: "UV-VIS",
      jenisPengukuran: [
        {
          jenis: "a. Kalibrasi",
          kimia: "a. 27.500",
          nonKimia: "a. 50.000",
          luarUpi: "a. 75.000",
          tigaHariNonKimia: "a. 67.500",
          tujuhHariNonKimia: "a. 62.500",
          tigaHariLuarUpi: "a. 101.250",
          tujuhHariLuarUpi: "a. 93.750",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 17.500",
          nonKimia: "b. 50.000",
          luarUpi: "b. 70.000",
          tigaHariNonKimia: "b. 67.500",
          tujuhHariNonKimia: "b. 62.500",
          tigaHariLuarUpi: "b. 94.500",
          tujuhHariLuarUpi: "b. 87.500",
        },
        {
          jenis: "c. Scanning",
          kimia: "c. 22.500",
          nonKimia: "c. 30.000",
          luarUpi: "c. 60.000",
          tigaHariNonKimia: "c. 40.500",
          tujuhHariNonKimia: "c. 37.500",
          tigaHariLuarUpi: "c. 81.000",
          tujuhHariLuarUpi: "c. 75.000",
        },
      ],
    },
    {
      alatPengukuran: "HPLC",
      jenisPengukuran: [
        {
          jenis: "a. Kalibrasi",
          kimia: "a. 350.000",
          nonKimia: "a. 400.000",
          luarUpi: "a. 500.000",
          tigaHariNonKimia: "a. 540.000",
          tujuhHariNonKimia: "a. 500.000",
          tigaHariLuarUpi: "a. 675.000",
          tujuhHariLuarUpi: "a. 625.000",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 250.000",
          nonKimia: "b. 300.000",
          luarUpi: "b. 350.000",
          tigaHariNonKimia: "b. 405.000",
          tujuhHariNonKimia: "b. 375.000",
          tigaHariLuarUpi: "b. 472.500",
          tujuhHariLuarUpi: "b. 437.500",
        },
      ],
    },

    {
      alatPengukuran: "AAS (Ca, Fe, Cu, Cd)",
      jenisPengukuran: [
        {
          jenis: "a. Kalibrasi",
          kimia: "a. 120.000",
          nonKimia: "a. 170.000",
          luarUpi: "a. 200.000",
          tigaHariNonKimia: "a. 229.500",
          tujuhHariNonKimia: "a. 121.500",
          tigaHariLuarUpi: "a. 270.000",
          tujuhHariLuarUpi: "a. 250.000",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 80.000",
          nonKimia: "b. 130.000",
          luarUpi: "b. 150.000",
          tigaHariNonKimia: "b. 175.500",
          tujuhHariNonKimia: "b. 162.500",
          tigaHariLuarUpi: "b. 202.500",
          tujuhHariLuarUpi: "b. 187.500",
        },
      ],
    },
    {
      alatPengukuran: "LCMS/MS",
      jenisPengukuran: [
        {
          jenis: "a. Kalibrasi",
          kimia: "a. 800.000",
          nonKimia: "a. 1.000.000",
          luarUpi: "a. 1.200.000",
          tigaHariNonKimia: "a. 1.350.000",
          tujuhHariNonKimia: "a. 1.250.000",
          tigaHariLuarUpi: "a. 1.620.000",
          tujuhHariLuarUpi: "a. 1.500.000",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 300.000",
          nonKimia: "b. 500.000",
          luarUpi: "b. 700.000",
          tigaHariNonKimia: "b. 675.000",
          tujuhHariNonKimia: "b. 625.000",
          tigaHariLuarUpi: "b. 945.000",
          tujuhHariLuarUpi: "b. 875.000",
        },
      ],
    },
    {
      alatPengukuran: "GC FID",
      jenisPengukuran: [
        {
          jenis: "a. Kalibrasi",
          kimia: "a. 250.000",
          nonKimia: "a. 300.000",
          luarUpi: "a. 450.000",
          tigaHariNonKimia: "a.405.000",
          tujuhHariNonKimia: "a. 375.000",
          tigaHariLuarUpi: "a. 607.500",
          tujuhHariLuarUpi: "a. 562.500",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 100.000",
          nonKimia: "b. 150.000",
          luarUpi: "b. 200.000",
          tigaHariNonKimia: "b. 202.500",
          tujuhHariNonKimia: "b. 187.500",
          tigaHariLuarUpi: "b. 270.000",
          tujuhHariLuarUpi: "b. 250.500",
        },
      ],
    },
    {
      alatPengukuran: "TG DTA",
      jenisPengukuran: [
        {
          jenis: "a.	Sampai Suhu 550 ℃",
          kimia: "a. 100.000",
          nonKimia: "a. 150.000",
          luarUpi: "a. 250.000",
          tigaHariNonKimia: "a. 202.500",
          tujuhHariNonKimia: "a. 187.500",
          tigaHariLuarUpi: "a. 337.500",
          tujuhHariLuarUpi: "a. 312.500",
        },
        {
          jenis: "b.	Diatas Suhu 550 ℃",
          kimia: "b. 150.000",
          nonKimia: "b. 200.000",
          luarUpi: "b. 300.000",
          tigaHariNonKimia: "b. 270.000",
          tujuhHariNonKimia: "b. 250.000",
          tigaHariLuarUpi: "b. 405.000",
          tujuhHariLuarUpi: "b. 375.000",
        },
      ],
    },
    {
      alatPengukuran: "NMR",
      jenisPengukuran: [
        {
          jenis: "a. Proton",
          kimia: "a. 150.000",
          nonKimia: "a. 200.000",
          luarUpi: "a. 300.000",
          tigaHariNonKimia: "a. 270.000",
          tujuhHariNonKimia: "a. 250.000",
          tigaHariLuarUpi: "a. 405.000",
          tujuhHariLuarUpi: "a. 375.000",
        },
        {
          jenis: "b. Carbon",
          kimia: "b. 400.000",
          nonKimia: "b. 450.000",
          luarUpi: "b. 500.000",
          tigaHariNonKimia: "b. 607.500",
          tujuhHariNonKimia: "b. 562.500",
          tigaHariLuarUpi: "b. 675.000",
          tujuhHariLuarUpi: "b. 625.000",
        },
        {
          jenis: "c. 2D",
          kimia: "c. 300.000",
          nonKimia: "c. 350.000",
          luarUpi: "c. 450.000",
          tigaHariNonKimia: "c. 472.500",
          tujuhHariNonKimia: "c. 437.500",
          tigaHariLuarUpi: "c. 607.500",
          tujuhHariLuarUpi: "c. 562.500",
        },
      ],
    },
    {
      alatPengukuran: "FTIR",
      jenisPengukuran: [
        {
          jenis: "a. FTIR",
          kimia: "a. 140.000",
          nonKimia: "a. 180.000",
          luarUpi: "a. 250.000",
          tigaHariNonKimia: "a. 243.000",
          tujuhHariNonKimia: "a. 225.000",
          tigaHariLuarUpi: "a. 337.500",
          tujuhHariLuarUpi: "a. 312.500",
        },
      ],
    },
    {
      alatPengukuran: "XRD",
      jenisPengukuran: [
        {
          jenis: "a. XRD",
          kimia: "a. 250.000",
          nonKimia: "a. 300.000",
          luarUpi: "a. 400.000",
          tigaHariNonKimia: "a. 405.000",
          tujuhHariNonKimia: "a. 375.000",
          tigaHariLuarUpi: "a. 540.000",
          tujuhHariLuarUpi: "a. 500.000",
        },
      ],
    },
    {
      alatPengukuran: "GCMS",
      jenisPengukuran: [
        {
          jenis: "a. GCMS",
          kimia: "a. 250.000",
          nonKimia: "a. 350.000",
          luarUpi: "a. 400.000",
          tigaHariNonKimia: "a. 472.500",
          tujuhHariNonKimia: "a. 437.500",
          tigaHariLuarUpi: "a. 540.000",
          tujuhHariLuarUpi: "a. 500.000",
        },
      ],
    },
    {
      alatPengukuran: "Freeze Dry",
      jenisPengukuran: [
        {
          jenis: "a. Di atas 8 jam",
          kimia: "a. 10.000",
          nonKimia: "a. 20.000",
          luarUpi: "a. 25.000",
          tigaHariNonKimia: "-",
          tujuhHariNonKimia: "-",
          tigaHariLuarUpi: "-",
          tujuhHariLuarUpi: "-",
        },
        {
          jenis: "b. Di bawah 8 jam",
          kimia: "b. 20.000",
          nonKimia: "b. 40.000",
          luarUpi: "b. 50.000",
          tigaHariNonKimia: "-",
          tujuhHariNonKimia: "-",
          tigaHariLuarUpi: "-",
          tujuhHariLuarUpi: "-",
        },
      ],
    },
    {
      alatPengukuran: "PCR (Per Jam)",
      jenisPengukuran: [
        {
          jenis: "a. PCR (Per Jam)",
          kimia: "a. 50.000",
          nonKimia: "a. 120.000",
          luarUpi: "a. 150.000",
          tigaHariNonKimia: "-",
          tujuhHariNonKimia: "-",
          tigaHariLuarUpi: "-",
          tujuhHariLuarUpi: "-",
        },
      ],
    },
  ];
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
              Layanan Jasa Analisis LKI UPI
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
        <div className="md:mx-[60px] sm:mx-[40px] mx-4">
          <AnalisisComponent />
          <div className="my-10">
            <p className="text-center md:text-4xl sm:text-2xl text-xl font-bold text-gray-800 mt-7">
              Alur Pengujian Laboratorium Kimia Instrumen UPI
            </p>
            <div className="flex justify-center">
              <hr className="grad h-2 mb-8 mt-5 w-8/12 text-center" />
            </div>
          </div>
          <div className="flex justify-center items-center translate-x-10">
            <Image
              src={"/images/diagram.png"}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="md:w-[600px] sm:w-[550px] w-[240px] md:h-[900px] h-full"
            />
          </div>
          <div className="my-10 ">
            <p className="font-medium md:text-xl text-sm">
              Catatan: Sampel akan dimusnahkan dalam waktu 7 hari setelah
              pesanan selesai Komplain hasil pengujian dapat dilakukan maksimal
              7 hari setelah pesanan selesai melalui menu kontak kami
            </p>
          </div>
          <div className="mt-24 mb-10">
            <p className="text-center md:text-4xl sm:text-2xl text-xl font-bold text-gray-800 mt-7">
              Daftar Harga Pengujian Laboratorium Kimia Instrumen UPI
            </p>
            <div className="flex justify-center">
              <hr className="grad h-2 mb-8 mt-5 w-8/12 text-center" />
            </div>
          </div>
          <p className="font-semibold text-xl md:ml-32 ml-0 my-3">Pengukuran</p>
          <div className="lg:mx-16 md:-mx-8 -mx-8 ">
            <p className="text-center font-bold md:text-lg sm:text-lg text-sm mb-5">
              Paket Harga Normal (14 Hari kerja)
            </p>
            <div className="bg-[#EDECECD4] md:py-5 py-2 rounded-lg shadow-[rgba(0,0,0,0.3)_1px_2px_2px_1px] mb-3">
              <p className="text-center mb-5 font-bold md:text-[14px] text-[7px] underline">
                Harga Dosen/Mahasiswa UPI
              </p>
              <div className="grid grid-cols-5 ">
                <p className="font-bold md:text-[14px] text-[7px] text-center">
                  No
                </p>
                <p className="font-bold md:text-[14px] text-[7px]">
                  Jenis Alat Pengukuran
                </p>
                <p className="font-bold md:text-[14px] text-[7px]">Kimia </p>
                <p className="font-bold md:text-[14px] text-[7px]">
                  Non Kimia{" "}
                </p>
                <p className="font-bold md:text-[14px] text-[7px]">Luar UPI</p>
              </div>
            </div>

            <div className="grid md:gap-3 sm:gap-3 gap-1">
              {dataPengukur.map((data, i) => (
                <div key={i}>
                  <div className="bg-white border shadow-[rgba(0,0,10,0.3)_1px_2px_2px_1px] rounded-lg py-2">
                    <div className="grid grid-cols-5 ">
                      <p className="font-medium md:text-[14px] text-[7px] text-center ">
                        {i + 1}
                      </p>
                      <p className="font-bold md:text-[14px] text-[7px]">
                        {data.alatPengukuran}
                      </p>
                    </div>
                    <div className="md:ml-3">
                      <div className="grid grid-cols-5 gap-1 ">
                        <p className="font-medium md:text-[14px] text-[7px]">
                          {""}
                        </p>
                        <div>
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <p
                              key={i}
                              className="font-medium md:text-[14px] text-[7px]"
                            >
                              {jenisPengukuran.jenis}
                            </p>
                          ))}
                        </div>
                        <div>
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <p
                              key={i}
                              className="font-medium md:text-[14px] text-[7px]"
                            >
                              {jenisPengukuran.kimia}
                            </p>
                          ))}
                        </div>
                        <div>
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <p
                              key={i}
                              className="font-medium md:text-[14px] text-[7px]"
                            >
                              {jenisPengukuran.nonKimia}
                            </p>
                          ))}
                        </div>
                        <div>
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <p
                              key={i}
                              className="font-medium md:text-[14px] text-[7px]"
                            >
                              {jenisPengukuran.luarUpi}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-red-700 md:font-bold font-semibold text-end md:mx-28 mx-0 md:text-[14px] text-sm mt-5">
            *Biaya per Jam
          </p>
          <div className="lg:mx-16 md:-mx-8 -mx-8 ">
            <p className="text-center font-bold text-lg mb-5 mt-10">
              Paket Harga Fast Track
            </p>
            <div className="bg-[#EDECECD4] md:py-5 py-2 rounded-lg shadow-[rgba(0,0,0,0.3)_1px_2px_2px_1px] mb-3">
              <p className="text-center mb-5 font-bold md:text-[14px] text-[7px] underline">
                Harga Dosen/Mahasiswa UPI
              </p>
              <div className="flex md:gap-3 gap-2">
                <p className="font-bold md:text-[14px] text-[7px] text-center md:w-[8%] w-[3%]">
                  No
                </p>
                <p className="font-bold md:text-[14px] text-[7px] w-[15%]">
                  Jenis Alat Pengukuran
                </p>
                <div className="flex flex-col justify-center items-center w-[22%]">
                  <p className="font-bold md:text-[14px] text-[7px]">
                    Non Kimia{" "}
                  </p>
                  <div className="grid grid-cols-2 gap-5 font-medium md:text-[14px] text-[7px]">
                    <p>3 Hari</p>
                    <p>7 Hari</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center w-[22%]">
                  <p className="font-bold md:text-[14px] text-[7px]">
                    Luar Upi{" "}
                  </p>
                  <div className="grid grid-cols-2 gap-5 font-medium md:text-[14px] text-[7px]">
                    <p>3 Hari</p>
                    <p>7 Hari</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:gap-3 sm:gap-3 gap-1">
              {dataPengukur.map((data, i) => (
                <div key={i}>
                  <div className="bg-white border shadow-[rgba(0,0,10,0.3)_1px_2px_2px_1px] rounded-lg py-2">
                    <div className="flex md:gap-20 gap-4 grid-cols-5 ">
                      <p className="font-medium md:text-[14px] text-[6px] text-center md:ml-5 ml-0">
                        {i + 1}
                      </p>
                      <p className="font-bold md:text-[14px] text-[6px] ">
                        {data.alatPengukuran}
                      </p>
                    </div>
                    <div className="md:ml-3">
                      <div className="flex  w-full gap-3 ">
                        <p className="font-medium md:text-[14px] text-[6px]  md:w-[8%] w-[3%]">
                          {""}
                        </p>
                        <div className="w-[15%]">
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <p
                              key={i}
                              className=" font-medium md:text-[14px] text-[6px] "
                            >
                              {jenisPengukuran.jenis}
                            </p>
                          ))}
                        </div>

                        <div className="w-[22%]">
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <div
                              key={i}
                              className="flex flex-col justify-center items-center  "
                            >
                              <div className="grid grid-cols-2 md:gap-5 gap-1">
                                <p className="font-medium md:text-[14px] text-[6px]">
                                  {jenisPengukuran.tigaHariNonKimia}
                                </p>
                                <p className="font-medium md:text-[14px] text-[6px]">
                                  {jenisPengukuran.tujuhHariNonKimia}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="w-[22%]">
                          {data.jenisPengukuran.map((jenisPengukuran, i) => (
                            <div
                              key={i}
                              className="flex flex-col justify-center items-center  "
                            >
                              <div className="grid grid-cols-2 md:gap-5 gap-1">
                                <p className="font-medium md:text-[14px] text-[6px]">
                                  {jenisPengukuran.tigaHariLuarUpi}
                                </p>
                                <p className="font-medium md:text-[14px] text-[6px]">
                                  {jenisPengukuran.tujuhHariLuarUpi}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-red-700 md:font-bold font-semibold text-end md:mx-28 mx-0 md:text-[14px] text-sm mt-5">
            *Biaya per Jam
          </p>
          <div className="mb-24">
            <p className="md:text-[29px] text-xl font-bold md:mx-16 mx-0 mt-20 mb-5">
              PENGUKURAN DAN ANALISIS LANJUTAN
            </p>
            <div className="flex justify-center items-center">
              <Image
                src={"/images/tabel2.png"}
                alt=""
                width={0}
                height={0}
                sizes="108vw"
                className="w-[1000px] h-full"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Analisis;
