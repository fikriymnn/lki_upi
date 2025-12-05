import Image from "next/image";

export const metadata = {
  title: "Tentang Kami",
  description:
    "Laboratorium Kimia Instrumen (LKI) merupakan salah satu unit kerja di Prodi Kimia Universitas Pendidikan Indonesia. LKI membuka layanan untuk pengujian untuk dosen, mahasiswa, instansi, dan juga masyarakat umum.",
};

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="flex md:h-[60vh] h-[40vh] w-full ">
        <Image
          alt=""
          src={"/images/gedung.jpg"}
          width={0}
          height={0}
          sizes="100vw"
          className=" md:h-[60vh] h-[40vh] w-full object-cover object-center"
        />
        <div className="bg-neutral-900 bg-opacity-80 w-full md:h-[60vh] h-[40vh]  absolute flex flex-col justify-center items-center">
          <p className="text-white md:text-7xl text-3xl font-bold">
            Tentang Kami
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
                <a href="#" class="inline-flex items-center text-sm text-gray-600 font-medium text-body hover:text-fg-brand">About</a>
              </div>
            </li>

          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

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
