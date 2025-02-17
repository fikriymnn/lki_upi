import Image from "next/image";
export const metadata = {
  title: "Tentang Kami",
  description:
    "Laboratorium Kimia Instrumen (LKI) merupakan salah satu unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi, dan juga masyarakat umum.",
};

export default function About() {
  return (
    <>
      <div className="mb-16">
        <div className=" flex md:h-[229px] h-40 w-full  ">
          <Image
            alt=""
            src={"/images/banner_aboutu.jpg"}
            width={0}
            height={0}
            sizes="100vw"
            className=" md:h-[229px] h-40 w-full"
          />
          <div className="bg-neutral-900 bg-opacity-70 w-full md:h-[229px] h-40  absolute flex justify-center items-center">
            <p className="text-white md:text-5xl sm:text-xl text-lg font-bold">
              Laboratorium Kimia Instrumen UPI
            </p>
          </div>
        </div>

        <p className="text-center text-4xl font-bold text-gray-800 mt-7">
          Tentang Kami
        </p>
        <div className="flex justify-center ">
          <hr className="text-red-700 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 h-2 mb-10 mt-5 w-72 text-center" />
        </div>
        <div className="md:flex sm:flex md:justify-normal justify-center items-center m-auto ">
          <div className="md:px-14 sm:px-5 px-3 flex  justify-center items-center ">
            <Image
              src={"/tentangkami.jpg"}
              alt="Labolatory"
              width={600}
              height={600}
            />
          </div>
          <div className="flex justify-center">
            <p className="text-justify font-medium md:text-[24px] text-[16px] md:leading-[48px] leading-10 tracking-wide text-neutral-900 text-opacity-90 w-9/12 p-2">
              Laboratorium Kimia Instrumen &#40;LKI&#41; merupakan salah satu
              unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI
              membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi,
              dan juga masyarakat umum.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
