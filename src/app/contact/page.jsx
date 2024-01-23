import Iframe from "react-iframe";
import Image from "next/image";

export default function Contact() {
  return (
    <div className="mb-16">
      <div className=" flex md:h-[229px] h-40 w-full  ">
        <Image
          alt=""
          src={"/images/banner_contact.jpg"}
          width={0}
          height={0}
          sizes="100vw"
          className=" md:h-[229px] h-40 w-full"
        />
        <div className="bg-neutral-900 bg-opacity-70 w-full md:h-[229px] h-40  absolute flex justify-center items-center">
          <p className="text-white md:text-5xl sm:text-xl text-lg font-bold">
            Layanan Jasa Analisis LKI UPI
          </p>
        </div>
      </div>
      <div className="md:grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 mt-[37px]">
        <div>
          <p className="text-center md:text-3xl text-xl font-bold text-gray-800 mt-7">
            Temui Kami
          </p>
          <div className="flex justify-center">
            <hr className="md:w-[400px] w-[150px] mt-[13px] h-2.5 bg-gradient-to-r from-red-700 via-red-600 to-rose-950 rounded-lg shadow" />
          </div>
          <div className="flex flex-col justify-center items-center mt-[46px] ">
            <Iframe
              url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.2422146955596!2d107.58918557499594!3d-6.861548593136972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6bb891ffe73%3A0xcf17e168e0ad1c63!2sGedung%20JICA%20%2F%20FPMIPA%20A%20UPI!5e0!3m2!1sen!2sid!4v1705992932891!5m2!1sen!2sid
            width="
              height=""
              id=""
              className="md:w-[489px] w-[300px] md:h-[440px] h-[260px]"
              display="block"
              position=""
            />
            <p className="md:w-[493px] w-[300px] text-center text-neutral-700 md:text-lg text-base md:font-semibold leading-6 mt-[50px]">
              Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia
              Gedung JICA &#40;FPMIPA-A&#41; Lt. 5 Jl. Dr. Setiabudhi No. 229
              Bandung 40154
            </p>
          </div>
          <div></div>
        </div>
        <div>
          <p className="text-center md:text-3xl text-xl md:mt-7 mt-20 font-bold text-gray-800 ">
            Kontak Kami
          </p>
          <div className="flex justify-center">
            <hr className="md:w-[400px] w-[150px] mt-[13px] h-2.5 bg-gradient-to-r from-red-700 via-red-600 to-rose-950 rounded-lg shadow" />
          </div>
          <div className="flex items-center justify-center mt-[29px]">
            <div className=" md:w-[574px] w-[330px] ">
              <form>
                <div class="md:w-[574px] w-[330px]  flex-col justify-start items-start gap-[33px] inline-flex md:mb-[26px] mb-[20px] ">
                  <div className="md:w-[574px] w-[330px] flex-col justify-start items-start gap-2 flex">
                    <div className="text-neutral-700 md:text-lg text-sm font-medium  tracking-wide">
                      NAMA
                    </div>
                    <input
                      type="text"
                      placeholder="Masukan nama disini"
                      className="md:w-[574px] w-[330px] h-12 pl-4 pr-2 py-2 bg-zinc-100 bg-opacity-80 rounded-lg border border-neutral-900 border-opacity-10 justify-start items-center gap-2 inline-flex text-zinc-500 text-base font-medium  tracking-wide"
                    />
                  </div>
                </div>
                <div class="md:w-[574px] w-[330px]  flex-col justify-start items-start gap-[33px] inline-flex md:mb-[26px] mb-[20px]">
                  <div className="md:w-[574px] w-[330px] flex-col justify-start items-start gap-2 flex">
                    <div className="text-neutral-700 md:text-lg text-sm font-medium  tracking-wide">
                      EMAIL
                    </div>
                    <input
                      type="email"
                      placeholder="Masukan email di sini"
                      className="md:w-[574px] w-[330px] h-12 pl-4 pr-2 py-2 bg-zinc-100 bg-opacity-80 rounded-lg border border-neutral-900 border-opacity-10 justify-start items-center gap-2 inline-flex text-zinc-500 text-base font-medium  tracking-wide"
                    />
                  </div>
                </div>
                <div class="md:w-[574px] w-[330px]  flex-col justify-start items-start gap-[33px] inline-flex md:mb-[26px] mb-[20px]">
                  <div className="md:w-[574px] w-[330px] flex-col justify-start items-start gap-2 flex">
                    <div className="text-neutral-700 md:text-lg text-sm font-medium  tracking-wide">
                      DESKRIPSI
                    </div>
                    <textarea
                      type="name"
                      placeholder="Masukan Deskripsi di sini"
                      className="md:w-[574px] w-[330px]  h-[159px] pl-4 pr-2 py-2 bg-zinc-100 bg-opacity-80 rounded-lg border border-neutral-900 border-opacity-10   gap-2  text-base font-medium resize-none"
                    />
                  </div>
                </div>
                <div className="mx-auto flex justify-center">
                  <button className="md:py-3 py-1 md:w-60 w-44 bg-gradient-to-r from-red-700 via-red-600 to-rose-950 rounded-full shadow text-center md:text-2xl text-lg text-white font-bold">
                    Kirim
                  </button>
                </div>
              </form>
              <div className="mx-auto flex justify-center">
                <div>
                  <p className="text-center my-5 md:text-base text-sm">
                    Atau hubungi kami di
                  </p>
                  <p className="md:py-3 py-1 md:w-60 w-44  bg-gradient-to-r from-lime-600 via-green-600 to-lime-900 rounded-full shadow text-center md:text-2xl text-lg text-white font-bold">
                    Whatsapp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
