import React from "react";
import Image from "next/image";
import Link from "next/link";
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
          <h2 className="mb-5 font-bold md:text-xl text-xl">Tentang Kami</h2>
          <p>
            Laboratorium Kimia Instrumen
            <br />
            Universitas Pendidikan Indonesia
            <br />
            Gedung JICA &#40; FPMIPA-A &#41; Lt. 5 Jl. Dr. Setiabudhi No. 229
            Bandung 40154
          </p>
        </div>
        <div className="md:mx-0 mx-3">
          <h2 className="mb-5 font-bold md:text-xl text-xl">Kontak Kami</h2>
          <div className="flex gap-3 mb-6">
            {/* <Image
              src={"/images/wa.svg"}
              alt=""
              width={0}
              height={0}
              className="w-6"
            />
            <a href="https://wa.me/+6285795101010">+6285795101010</a> */}
          </div>
          <div className="flex gap-3">
            <Image
              src={"/images/email.svg"}
              alt=""
              width={0}
              height={0}
              className="w-6"
            />
            <a href="mailto:lkiupi2022@gmail.com">lkiupi2022@gmail.com</a>
          </div>
        </div>
        <div className="md:mx-0 mx-3">
          <h2 className="mb-5 font-bold md:text-xl text-xl">Layanan</h2>
          <div className="flex flex-col md:gap-5 gap-2">
            <Link href="/layanan">
              <p>Layanan Analisis</p>
            </Link>
            <Link href="/sertifikasi">
              <p>Sertifikasi</p>
            </Link>
            <Link href="/pelatihan">
              <p>Pelatihan</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterCustom;
