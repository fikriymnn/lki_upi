import React from "react";
import Image from "next/image";
import AnalisisComponent from "/src/components/AnalisisComponent";
import ButtonOrder from "@/components/ButtonOrder";
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
          perusahaan: "a. 150.000",
          tigaHariNonKimia: "a. 67.500",
          tujuhHariNonKimia: "a. 62.500",
          tigaHariLuarUpi: "a. 101.250",
          tujuhHariLuarUpi: "a. 93.750",
          tigaHariPerusahaan: "a. 202.500",
          tujuhHariPerusahaan: "a. 187.500"
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 17.500",
          nonKimia: "b. 30.000",
          luarUpi: "b. 50.000",
          perusahaan: "b. 100.000",
          tigaHariNonKimia: "b. 40.500",
          tujuhHariNonKimia: "b. 37.500",
          tigaHariLuarUpi: "b. 67.500",
          tujuhHariLuarUpi: "b. 62.500",
          tigaHariPerusahaan: "b. 135.000",
          tujuhHariPerusahaan: "b. 125.000"
        },
        {
          jenis: "c. Scanning",
          kimia: "c. 22.500",
          nonKimia: "c. 40.000",
          luarUpi: "c. 60.000",
          perusahaan: "c. 110.000",
          tigaHariNonKimia: "c. 54.000",
          tujuhHariNonKimia: "c. 50.000",
          tigaHariLuarUpi: "c. 81.000",
          tujuhHariLuarUpi: "c. 75.000",
          tigaHariPerusahaan: "c. 148.500",
          tujuhHariPerusahaan: "c. 137.500"
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
          perusahaan: "a. 600.000",
          tigaHariNonKimia: "a. 540.000",
          tujuhHariNonKimia: "a. 500.000",
          tigaHariLuarUpi: "a. 675.000",
          tujuhHariLuarUpi: "a. 625.000",
          tigaHariPerusahaan: "a. 810.000",
          tujuhHariPerusahaan: "a. 750.000",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 200.000",
          nonKimia: "b. 300.000",
          luarUpi: "b. 350.000",
          perusahaan: "b. 400.000",
          tigaHariNonKimia: "b. 405.000",
          tujuhHariNonKimia: "b. 375.000",
          tigaHariLuarUpi: "b. 472.500",
          tujuhHariLuarUpi: "b. 437.500",
          tigaHariPerusahaan: "b. 540.000",
          tujuhHariPerusahaan: "b. 500.000",
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
          perusahaan: "a. 100.000",
          tigaHariNonKimia: "a. 229.500",
          tujuhHariNonKimia: "a. 121.500",
          tigaHariLuarUpi: "a. 270.000",
          tujuhHariLuarUpi: "a. 250.000",
          tigaHariPerusahaan: "a. 472.500",
          tujuhHariPerusahaan: "a. 437.500",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 80.000",
          nonKimia: "b. 130.000",
          luarUpi: "b. 150.000",
          perusahaan: "b. 250.000",
          tigaHariNonKimia: "b. 175.500",
          tujuhHariNonKimia: "b. 162.500",
          tigaHariLuarUpi: "b. 202.500",
          tujuhHariLuarUpi: "b. 187.500",
          tigaHariPerusahaan: "b. 337.500",
          tujuhHariPerusahaan: "b. 312.500",
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
          perusahaan: "a. 1.300.000",
          tigaHariNonKimia: "a. 1.350.000",
          tujuhHariNonKimia: "a. 1.250.000",
          tigaHariLuarUpi: "a. 1.620.000",
          tujuhHariLuarUpi: "a. 1.500.000",
          tigaHariPerusahaan: "a. 1.755.000",
          tujuhHariPerusahaan: "a. 1.625.000",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 300.000",
          nonKimia: "b. 500.000",
          luarUpi: "b. 700.000",
          perusahaan: "b. 800.000",
          tigaHariNonKimia: "b. 675.000",
          tujuhHariNonKimia: "b. 625.000",
          tigaHariLuarUpi: "b. 945.000",
          tujuhHariLuarUpi: "b. 875.000",
          tigaHariPerusahaan: "b. 1.080.000",
          tujuhHariPerusahaan: "b. 1.000.000",
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
          perusahaan: "a. 500.000",
          tigaHariNonKimia: "a.405.000",
          tujuhHariNonKimia: "a. 375.000",
          tigaHariLuarUpi: "a. 607.500",
          tujuhHariLuarUpi: "a. 562.500",
          tigaHariPerusahaan: "a. 675.000",
          tujuhHariPerusahaan: "a. 625.000",
        },
        {
          jenis: "b. Sampel",
          kimia: "b. 100.000",
          nonKimia: "b. 150.000",
          luarUpi: "b. 200.000",
          perusahaan: "b. 250.000",
          tigaHariNonKimia: "b. 202.500",
          tujuhHariNonKimia: "b. 187.500",
          tigaHariLuarUpi: "b. 270.000",
          tujuhHariLuarUpi: "b. 250.000",
          tigaHariPerusahaan: "b. 337.500",
          tujuhHariPerusahaan: "b. 312.500",
        },
      ],
    },
    {
      alatPengukuran: "TGA",
      jenisPengukuran: [
        {
          jenis: "a. Suhu 25℃ - 550℃",
          kimia: "a. 200.000",
          nonKimia: "a. 250.000",
          luarUpi: "a. 300.000",
          perusahaan: "a. 400.000",
          tigaHariNonKimia: "a. 337.500",
          tujuhHariNonKimia: "a. 312.500",
          tigaHariLuarUpi: "a. 405.500",
          tujuhHariLuarUpi: "a. 375.000",
          tigaHariPerusahaan: "a. 540.000",
          tujuhHariPerusahaan: "a. 500.000",
        },
        {
          jenis: "b.	Suhu 25℃ - 950℃",
          kimia: "b. 300.000",
          nonKimia: "b. 350.000",
          luarUpi: "b. 400.000",
          perusahaan: "b. 550.000",
          tigaHariNonKimia: "b. 472.500",
          tujuhHariNonKimia: "b. 437.500",
          tigaHariLuarUpi: "b. 540.000",
          tujuhHariLuarUpi: "b. 500.000",
          tigaHariPerusahaan: "b. 742.500",
          tujuhHariPerusahaan: "b. 687.500",
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
          perusahaan: "a. 400.000",
          tigaHariNonKimia: "a. 270.000",
          tujuhHariNonKimia: "a. 250.000",
          tigaHariLuarUpi: "a. 405.000",
          tujuhHariLuarUpi: "a. 375.000",
          tigaHariPerusahaan: "a. 540.000",
          tujuhHariPerusahaan: "a. 500.000",
        },
        {
          jenis: "b. Carbon",
          kimia: "b. 400.000",
          nonKimia: "b. 450.000",
          luarUpi: "b. 500.000",
          perusahaan: "b. 600.000",
          tigaHariNonKimia: "b. 607.500",
          tujuhHariNonKimia: "b. 562.500",
          tigaHariLuarUpi: "b. 675.000",
          tujuhHariLuarUpi: "b. 625.000",
          tigaHariPerusahaan: "b. 810.000",
          tujuhHariPerusahaan: "b. 750.000",
        },
        {
          jenis: "c. 2D",
          kimia: "c. 300.000",
          nonKimia: "c. 350.000",
          luarUpi: "c. 450.000",
          perusahaan: "c. 550.000",
          tigaHariNonKimia: "c. 472.500",
          tujuhHariNonKimia: "c. 437.500",
          tigaHariLuarUpi: "c. 607.500",
          tujuhHariLuarUpi: "c. 562.500",
          tigaHariPerusahaan: "c. 742.500",
          tujuhHariPerusahaan: "c. 687.500",
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
          perusahaan: "a. 350.000",
          tigaHariNonKimia: "a. 243.000",
          tujuhHariNonKimia: "a. 225.000",
          tigaHariLuarUpi: "a. 337.500",
          tujuhHariLuarUpi: "a. 312.500",
          tigaHariPerusahaan: "a. 472.500",
          tujuhHariPerusahaan: "a. 437.500",
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
          perusahaan: "a. 500.000",
          tigaHariNonKimia: "a. 405.000",
          tujuhHariNonKimia: "a. 375.000",
          tigaHariLuarUpi: "a. 540.000",
          tujuhHariLuarUpi: "a. 500.000",
          tigaHariPerusahaan: "a. 675.000",
          tujuhHariPerusahaan: "a. 625.000",
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
          perusahaan: "a. 500.000",
          tigaHariNonKimia: "a. 472.500",
          tujuhHariNonKimia: "a. 437.500",
          tigaHariLuarUpi: "a. 540.000",
          tujuhHariLuarUpi: "a. 500.000",
          tigaHariPerusahaan: "a. 675.000",
          tujuhHariPerusahaan: "a. 625.000",
        },
      ],
    },
    {
      alatPengukuran: "*Freeze Dry",
      jenisPengukuran: [
        {
          jenis: "a. Di atas 8 jam",
          kimia: "a. 10.000",
          nonKimia: "a. 20.000",
          luarUpi: "a. 25.000",
          perusahaan: "a. 35.000",
          tigaHariNonKimia: "-",
          tujuhHariNonKimia: "-",
          tigaHariLuarUpi: "-",
          tujuhHariLuarUpi: "-",
          tigaHariPerusahaan: "-",
          tujuhHariPerusahaan: "-",
        },
        {
          jenis: "b. Di bawah 8 jam",
          kimia: "b. 20.000",
          nonKimia: "b. 40.000",
          luarUpi: "b. 50.000",
          perusahaan: "b. 65.000",
          tigaHariNonKimia: "-",
          tujuhHariNonKimia: "-",
          tigaHariLuarUpi: "-",
          tujuhHariLuarUpi: "-",
          tigaHariPerusahaan: "-",
          tujuhHariPerusahaan: "-",
        },
      ],
    },
    {
      alatPengukuran: "*PCR",
      jenisPengukuran: [
        {
          jenis: "a. PCR (Per Jam)",
          kimia: "a. 50.000",
          nonKimia: "a. 120.000",
          luarUpi: "a. 150.000",
          perusahaan: "a. 250.000",
          tigaHariNonKimia: "-",
          tujuhHariNonKimia: "-",
          tigaHariLuarUpi: "-",
          tujuhHariLuarUpi: "-",
          tigaHariPerusahaan: "-",
          tujuhHariPerusahaan: "-",
        },
      ],
    },
  ];

  const data = [
    { no: 1, alat: "FTIR", pendidikan: "Rp. 500.000", industri: "Rp. 1.000.000", satuan: "Per Spectra" },
    { no: 2, alat: "GC-MS", pendidikan: "Rp. 750.000", industri: "Rp. 1.250.000", satuan: "Per Spectra" },
    { no: 3, alat: "NMR", pendidikan: "Rp. 3.000.000", industri: "Rp. 5.000.000", satuan: "Per Senyawa" },
  ];
  return (
    <>
      <main className="pb-16">
        <div className="flex md:h-[60vh] h-[40vh] w-full ">
          <Image
            alt=""
            src={"/carousel.jpg"}
            width={0}
            height={0}
            sizes="100vw"
            className=" md:h-[60vh] h-[40vh] w-full object-cover object-center"
          />
          <div className="bg-neutral-900 bg-opacity-80 w-full md:h-[60vh] h-[40vh]  absolute flex flex-col justify-center items-center">
            <p className="text-white md:text-7xl text-3xl font-bold">
              Layanan Analisis
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
                  <a href="#" class="inline-flex items-center text-sm text-gray-600 font-medium text-body hover:text-fg-brand">Analisis</a>
                </div>
              </li>

            </ol>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">

          <p className="max-w-2xl md:px-8 px-4 md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-8 md:mt-16 md:mb-4 mb-4 text-red-700">
            Pengujian Laboratorium Kimia Instrumen
          </p>
          <p className="md:text-lg text-sm text-gray-700 mx-auto text-justify md:px-8 px-4 md:mb-8 bg-white">
            Laboratorium Kimia Instrumen (LKI) Universitas Pendidikan Indonesia menyediakan layanan pengujian sampel berbasis teknologi instrumen modern dengan standar kualitas tinggi. Kami melayani kebutuhan penelitian, akademik, industri, dan komersial dengan hasil yang presisi, terverifikasi, dan dapat dipertanggungjawabkan secara ilmiah.
          </p>

          <div className="max-w-7xl flex md:px-8 px-4 mb-8 justify-center mx-auto">
            <ButtonOrder />
          </div>

          <div className="md:mb-4 mb-4 mx-auto">
            <p className="md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-7 max-w-3xl md:px-8 px-4 text-red-700">
              Daftar Harga Pengujian
            </p>
          </div>

          {/* TABLE BARU */}
          <div className="mx-auto md:px-8 px-4">
            <div className="bg-gray-300 w-full md:px-8 px-4 mx-auto py-4">
              <p className="text-center font-semibold md:text-lg text-sm">
                Paket Harga Normal (14 Hari kerja)
              </p>
              <p className="text-center font-semibold md:text-[14px] text-[7px] underline">
                Harga Dosen/Mahasiswa UPI
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="md:w-full w-[300%] border-collapse overflow-hidden px-4">

                {/* HEADER */}
                <thead>
                  <tr className="bg-gray-100 text-gray-800">
                    <th className="p-3 border md:text-base text-sm text-left font-semibold w-10">No</th>
                    <th className="p-3 border md:text-base text-sm text-left font-semibold w-64">
                      Jenis Alat Pengukuran
                    </th>
                    <th className="p-3 border md:text-base text-sm text-center font-semibold">
                      Kimia
                    </th>
                    <th className="p-3 border md:text-base text-sm text-center font-semibold">
                      Non Kimia
                    </th>
                    <th className="p-3 border md:text-base text-sm text-center align-bottom font-semibold">
                      Luar UPI <br />(Dosen/Mahasiswa)
                    </th>
                    <th className="p-3 border md:text-base text-sm text-center align-bottom font-semibold">
                      Luar UPI <br />(Perusahaan)
                    </th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {/* ROW 1 */}
                  {dataPengukur.map((data, i) => (
                    <tr className="border-t" key={i}>
                      <td className="p-3 border font-medium text-center align-top">{i + 1}</td>
                      <td className="p-3 border font-semibold">
                        {data.alatPengukuran}
                        <ul className="mt-2 text-sm font-normal text-gray-700 leading-6">
                          {
                            data.jenisPengukuran.map((v, i) => (
                              <li key={i}>{v.jenis}</li>
                            ))
                          }
                        </ul>
                      </td>

                      <td className="p-3 border text-center align-bottom align-bottom">
                        <ul className="text-sm leading-6">
                          {
                            data.jenisPengukuran.map((v, i) => (
                              <li key={i}>{v.kimia}</li>
                            ))
                          }
                        </ul>
                      </td>
                      <td className="p-3 border text-center align-bottom align-bottom">
                        <ul className="text-sm leading-6">
                          {
                            data.jenisPengukuran.map((v, i) => (
                              <li key={i}>{v.nonKimia}</li>
                            ))
                          }
                        </ul>
                      </td>
                      <td className="p-3 border text-center align-bottom align-bottom">
                        <ul className="text-sm leading-6">
                          {
                            data.jenisPengukuran.map((v, i) => (
                              <li key={i}>{v.luarUpi}</li>
                            ))
                          }
                        </ul>
                      </td>

                      <td className="p-3 border text-center align-bottom align-bottom">
                        <ul className="text-sm leading-6">
                          {
                            data.jenisPengukuran.map((v, i) => (
                              <li key={i}>{v.perusahaan}</li>
                            ))
                          }
                        </ul>
                      </td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex max-w-7xl mx-auto justify-between md:px-8 px-4 mt-8">
            <p className="text-black-700 md:font-semibold font-semibold md:text-[14px] text-xs">
              Syarat dan Ketentuan: <br />
              - Pelarut NMR-Kloroform: Rp100.000/ml. <br />
              - Pelarut NMR-Metanol: Rp80.000/ml. <br />
              - Pengenceran sampel lebih dari 25ml dikenakan biaya tambahan seeuai pemakaian.
            </p>
            <p className="text-black-700 md:font-semibold font-semibold text-end md:text-[14px] text-xs">
              *Biaya per Jam
            </p>
          </div>

          <div className="max-w-7xl md:px-8 px-4 mx-auto mt-16">
            <div className="bg-gray-300 w-full max-w-7xl md:px-8 px-4 mx-auto py-4 mt-8">
              <p className="text-center font-semibold md:text-lg text-sm">
                Paket Harga Fast Track
              </p>
              <p className="text-center font-semibold md:text-[14px] text-[7px] underline">
                Harga Dosen/Mahasiswa UPI
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="md:w-full w-[300%] border-collapse shadow rounded-b-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="p-3 border md:text-base text-sm font-semibold">No</th>
                    <th className="p-3 border md:text-base text-sm font-semibold">Jenis Alat Pengukuran</th>
                    <th className="p-3 border md:text-base text-sm font-semibold">
                      Non Kimia<br />3 Hari | 7 Hari
                    </th>
                    <th className="p-3 border md:text-base text-sm font-semibold">
                      Luar UPI (Dosen/Mhs)<br />3 Hari | 7 Hari
                    </th>
                    <th className="p-3 border md:text-base text-sm font-semibold">
                      Perusahaan<br />3 Hari | 7 Hari
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dataPengukur.map((item, index) => (
                    <tr key={index} className="bg-white border-b align-top">
                      {/* NO */}
                      <td className="p-3 border text-center font-semibold">
                        {index + 1}
                      </td>

                      {/* JENIS ALAT + SUB ITEM */}
                      <td className="p-3 border font-semibold">
                        {item.alatPengukuran}
                        <div className="mt-1 text-sm font-normal">
                          {item.jenisPengukuran.map((jenis, i) => (
                            <div key={i}>{jenis.jenis}</div>
                          ))}
                        </div>
                      </td>

                      {/* NON KIMIA */}
                      <td className="p-3 border text-center align-bottom text-sm">
                        {item.jenisPengukuran.map((jenis, i) => (
                          <div key={i}>
                            {jenis.tigaHariNonKimia} | {jenis.tujuhHariNonKimia}
                          </div>
                        ))}
                      </td>

                      {/* LUAR UPI DOSEN/MHS */}
                      <td className="p-3 border text-center align-bottom text-sm">
                        {item.jenisPengukuran.map((jenis, i) => (
                          <div key={i}>
                            {jenis.tigaHariLuarUpi} | {jenis.tujuhHariLuarUpi}
                          </div>
                        ))}
                      </td>

                      {/* PERUSAHAAN */}
                      <td className="p-3 border text-center align-bottom text-sm">
                        {item.jenisPengukuran.map((jenis, i) => (
                          <div key={i}>
                            {jenis.tigaHariPerusahaan} | {jenis.tujuhHariPerusahaan}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex max-w-7xl mx-auto justify-between md:px-8 px-4 mt-8">
            <p className="text-black-700 md:font-semibold font-semibold md:text-[14px] text-xs">
              Syarat dan Ketentuan: <br />
              - Pelarut NMR-Kloroform: Rp100.000/ml. <br />
              - Pelarut NMR-Metanol: Rp80.000/ml. <br />
              - Pengenceran sampel lebih dari 25ml dikenakan biaya tambahan seeuai pemakaian.
            </p>
            <p className="text-black-700 md:font-semibold font-semibold text-end md:text-[14px] text-xs">
              *Biaya per Jam
            </p>
          </div>

          <div className="md:mb-4 mb-4 max-w-7xl mx-auto mt-16">
            <p className="md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-7 max-w-3xl md:px-8 px-4 text-red-700">
              Pengukuran Dan Analisis Lanjutan
            </p>
          </div>
          <div className="">
            <div className="overflow-x-auto md:px-8 px-4">
              <table className="md:w-full w-[300%] border-collapse text-[16px] max-w-7xl mx-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="pt-2 px-2 text-center" rowSpan={2}>No</th>
                    <th className="pt-2 px-2 text-center" rowSpan={2}>Jenis Alat</th>
                    <th className="pt-2 px-2 text-center" colSpan={2}>Paket Harga</th>
                    <th className="pt-2 px-2 text-center" rowSpan={2}>Satuan</th>
                  </tr>

                  <tr className="bg-gray-100">
                    <th className="pb-2 px-2 text-center">Pendidikan</th>
                    <th className="pb-2 px-2 text-center">Industri</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((row) => (
                    <tr key={row.no} className="border-b">
                      <td className="p-4 text-center border text-sm">{row.no}</td>
                      <td className="p-4 text-center border text-sm">{row.alat}</td>
                      <td className="p-4 text-center border text-sm">{row.pendidikan}</td>
                      <td className="p-4 text-center border text-sm">{row.industri}</td>
                      <td className="p-4 text-center border text-sm">{row.satuan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:mb-4 mb-4 max-w-7xl mx-auto mt-16">
            <p className="md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-8 max-w-2xl md:px-8 px-4 text-red-700">
              Alur Pengujian
            </p>
          </div>
          <p className="md:text-lg text-sm text-gray-700 mx-auto text-justify md:px-8 px-4 px-4 mb-8">
            Catatan: Sampel akan dimusnahkan dalam waktu 7 hari setelah
            pesanan selesai. Komplain hasil pengujian dapat dilakukan maksimal
            7 hari setelah pesanan selesai melalui email: <a href="mailto:lkiupi2022@gmail.com" className="hover:text-blue-600 font-bold text-red-700 underline">lkiupi2022@gmail.com</a>
          </p>
          <div className="flex justify-center items-center">
            <Image
              src={"/images/alur_penerimaan_sampel.png"}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="md:w-[400px] sm:w-[350px] w-[250px] h-auto object-cover"
            />
          </div>

          <div className="mb-8 max-w-7xl mx-auto mt-16">
            <p className="md:text-3xl sm:text-2xl text-lg font-bold text-gray-800 mt-7 max-w-2xl md:px-8 px-4 text-red-700">
              Alur Keluhan
            </p>
          </div>
          <div className="flex justify-center items-center ">
            <Image
              src={"/images/alur_keluhan.png"}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="md:w-[340px] sm:w-[240px] w-[180px] h-auto object-cover"
            />
          </div>

        </div>

        <div className="mx-auto">
          <AnalisisComponent />
        </div>
      </main>
    </>
  );
};

export default Analisis;