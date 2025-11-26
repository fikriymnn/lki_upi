import Image from "next/image";

export const metadata = {
  title: "Tentang Kami",
  description:
    "Laboratorium Kimia Instrumen (LKI) merupakan salah satu unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi, dan juga masyarakat umum.",
};

export default function About() {
  return (
    <div className="min-h-screen">

      <div className="flex md:h-[70vh] h-40 w-full ">
                <Image
                  alt=""
                  src={"/images/gedung.jpg"}
                  width={1000}
                  height={1000}
                
                  className=" md:h-[70vh] h-40 w-full object-cover object-center"
                />
                <div className="bg-neutral-900 bg-opacity-70 w-full md:h-[70vh] h-40  absolute flex flex-col justify-center items-center">
                  <p className="text-white md:text-6xl sm:text-xl text-lg font-bold">
                    Tentang Kami
                  </p>
                </div>
              </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Text */}
          <div className="bg-white">
            {/* Header */}
                <p className="max-w-2xl md:text-2xl sm:text-2xl text-lg font-bold text-gray-800 mb-4">
                    Laboratorium Kimia Instrumen
                </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              <span className="font-semibold text-red-700">
                Laboratorium Kimia Instrumen (LKI)
              </span>{" "}
              merupakan salah satu unit kerja di Prodi Kimia Universitas
              Pendidikan Indonesia.
              LKI membuka layanan pengujian untuk dosen, mahasiswa,
              instansi, dan masyarakat umum.
            </p>
          </div>

          {/* Image */}
          <div className="relative rounded-md overflow-hidden shadow-xl">
            <Image
              src="https://masuk-ptn.com/images/department/f8fa7948e0c74aada8d20df2f4c96d2c3f7491be.jpg"
              alt="Laboratorium Kimia Instrumen"
              width={600}
              height={600}
              className="w-full h-96 object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
