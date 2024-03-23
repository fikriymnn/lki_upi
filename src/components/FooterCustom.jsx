import React from "react";
import Image from "next/image";
function FooterCustom() {
  return (
    <div>
      <div className="mx-auto grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5 bg-[#202020] text-white  py-9 ">
        <Image
          alt=""
          src={"/footer.png"}
          width={0}
          height={0}
          sizes="100vw"
          className="md:w-[343px] w-[250px] md:mx-0 mx-3"
        />
        <div className="w-11/12 md:mx-0 mx-3">
          <h1 className="mb-5 font-bold md:text-xl text-lg">Tentang Kami</h1>
          <p>
            Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia Gedung
            JICA &#40; FPMIPA-A &#41; Lt. 5 Jl. Dr. Setiabudhi No. 229 Bandung
            40154
          </p>
        </div>
        <div className="md:mx-0 mx-3">
          <h1 className="mb-5 font-bold md:text-xl text-lg">Kontak Kami</h1>
          <div className="flex gap-3 mb-6">
            <Image
              src={"/images/wa.svg"}
              alt=""
              width={0}
              height={0}
              className="w-6"
            />
            <a href="https://wa.me/+6285795101010">+6285795101010</a>
          </div>
          <div className="flex gap-3">
            <Image
              src={"/images/email.svg"}
              alt=""
              width={0}
              height={0}
              className="w-6"
            />
            <p>lkiupi2022@gmail.com</p>
          </div>
        </div>
        <div className="md:mx-0 mx-3">
          <h1 className="mb-5 font-bold md:text-xl text-lg">Layanan</h1>
          <div className="flex flex-col md:gap-5 gap-2">
            <p>Layanan Analisis</p>
            <p>Sertifikat</p>
            <p>Pelatihan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterCustom;
