import React from "react";
import Image from "next/image";
function FooterCustom() {
  return (
    <div>
      <div className="mx-auto grid md:grid-cols-4 grid-cols-1 bg-[#202020] text-white  py-9">
        <Image
          alt=""
          src={"/footer.png"}
          width={0}
          height={0}
          sizes="100vw"
          className="w-[343px]"
        />
        <div className="w-11/12">
          <h1 className="mb-5 font-bold text-xl">Tentang Kami</h1>
          <p>
            Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia Gedung
            JICA &#40; FPMIPA-A &#41; Lt. 5 Jl. Dr. Setiabudhi No. 229 Bandung
            40154
          </p>
        </div>
        <div>
          <h1 className="mb-5 font-bold text-xl">Kontak Kami</h1>
          <div className="flex gap-3 mb-6">
            <Image
              src={"/images/wa.svg"}
              alt=""
              width={0}
              height={0}
              className="w-6"
            />
            <p>+61892765628</p>
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
        <div>
          <h1 className="mb-5 font-bold text-xl">Layanan</h1>
          <div className="flex flex-col gap-5">
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
