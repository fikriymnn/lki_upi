"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Tracking({ params }) {
  const { id } = params;
  const [invoice, setInvoice] = useState({});

  useEffect(() => {
    async function getInvoice() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          { withCredentials: true }
        );
        if (data.data.success) {
          setInvoice(data.data.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, []);

  return (
    <>
      <div className="m-auto">
        <p className="text-center text-4xl font-bold text-gray-800 mt-7">
          Progres Status
        </p>
        <div className="flex justify-center">
          <hr className="grad rounded-md h-2 mb-8 mt-5 w-56 text-center" />
        </div>
        <div className="flex mb-20">
          <div className="m-auto w-10/12 border-2 rounded-lg flex flex-col justify-start items-start ">
            <p className="text-white text-xl font-bold px-10 w-full grad rounded-t-[6px]">
              Detail
            </p>
            <div className="flex gap-5 w-62 mx-5  mt-10">
              {invoice.status == "Menunggu Form Dikonfirmasi" ||
              invoice.status == "Form Dikonfirmasi" ||
              invoice.status == "Sample Diterima Admin" ||
              invoice.status == "Sample Dikerjakan Operator" ||
              invoice.status == "Menunggu Verifikasi" ||
              invoice.status == "Menunggu Pembayaran" ||
              invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on1.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on1.png"}
                />
              )}
              <div>
                {invoice.status == "Menunggu Form Dikonfirmasi" ||
                invoice.status == "Form Dikonfirmasi" ||
                invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Form Dikirim
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Form Dikirim
                    </p>
                  </div>
                )}
                {invoice.status == "Menunggu Form Dikonfirmasi" ||
                invoice.status == "Form Dikonfirmasi" ||
                invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Acc
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s1_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Acc
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-5 w-62 mx-5 ">
              {invoice.status == "Form Dikonfirmasi" ||
              invoice.status == "Sample Diterima Admin" ||
              invoice.status == "Sample Dikerjakan Operator" ||
              invoice.status == "Menunggu Verifikasi" ||
              invoice.status == "Menunggu Pembayaran" ||
              invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on2.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/off/off2.png"}
                />
              )}
              <div>
                {invoice.status == "Form Dikonfirmasi" ||
                invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Form Diterima
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Form Diterima
                    </p>
                  </div>
                )}
                {invoice.status == "Form Dikonfirmasi" ||
                invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Sample Diterima Oleh Admin
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s2_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Sample Diterima Oleh Admin
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-62 mx-5">
              {invoice.status == "Sample Diterima Admin" ||
              invoice.status == "Sample Dikerjakan Operator" ||
              invoice.status == "Menunggu Verifikasi" ||
              invoice.status == "Menunggu Pembayaran" ||
              invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on3.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/off/off3.png"}
                />
              )}
              <div>
                {invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Sample Diterima Oleh Admin
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Sample Diterima Oleh Admin
                    </p>
                  </div>
                )}
                {invoice.status == "Sample Diterima Admin" ||
                invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Sample Sedang Dikirim ke Operator
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s3_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Sedang dikirim ke operator{" "}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-5 w-62 mx-5  ">
              {invoice.status == "Sample Dikerjakan Operator" ||
              invoice.status == "Menunggu Verifikasi" ||
              invoice.status == "Menunggu Pembayaran" ||
              invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on4.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/off/off4.png"}
                />
              )}
              <div>
                {invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Sample Diterima oleh Operator
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Sample Diterima oleh Operator{" "}
                    </p>
                  </div>
                )}
                {invoice.status == "Sample Dikerjakan Operator" ||
                invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Sedang Dikerjakan oleh Operator
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s4_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Sedang Dikerjakan oleh Operator
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-62 mx-5  ">
              {invoice.status == "Menunggu Verifikasi" ||
              invoice.status == "Menunggu Pembayaran" ||
              invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on5.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/off/off5.png"}
                />
              )}
              <div>
                {invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Selesai Dikerjakan oleh Operator
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Selesai Dikerjakan oleh Operator{" "}
                    </p>
                  </div>
                )}
                {invoice.status == "Menunggu Verifikasi" ||
                invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Verifikasi
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s5_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Verifikasi{" "}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-62 mx-5  ">
              {invoice.status == "Menunggu Pembayaran" ||
              invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on6.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/off/off6.png"}
                />
              )}
              <div>
                {invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Selesai Verifikasi
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Selesai Verifikasi{" "}
                    </p>
                  </div>
                )}
                {invoice.status == "Menunggu Pembayaran" ||
                invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Pembayaran
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s6_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Pembayaran{" "}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-62 mx-5  ">
              {invoice.status == "Menunggu Konfirmasi Pembayaran" ||
              invoice.status == "Selesai" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/on/on7.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[133.7px]"
                  src={"/tracking/off/off7.png"}
                />
              )}
              <div>
                {invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Pembayaran Selesai
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Pembayaran Selesai
                    </p>
                  </div>
                )}
                {invoice.status == "Menunggu Konfirmasi Pembayaran" ||
                invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Pembayaran Dikonfirmasi
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s7_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Menunggu Pembayaran Dikonfirmasi
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-62 mx-5  ">
              {invoice.status == "Selesai" ||
              invoice.status == "Order Dibatalkan" ? (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[87.5px]"
                  src={"/tracking/on/on8.png"}
                />
              ) : (
                <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[87.5px] h-[87.5px]"
                  src={"/tracking/off/off8.png"}
                />
              )}
              <div>
                {invoice.status == "Selesai" ? (
                  <div className="">
                    <p className="text-red-600 md:text-2xl sm:text-xl text-base font-semibold">
                      Selesai
                    </p>
                    <p className="mx-10  text-center text-xs">
                      {invoice.s8_date}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                      Selesai
                    </p>
                  </div>
                )}
              </div>
            </div>

            <br />
            <br />
          </div>
        </div>
      </div>
    </>
  );
}
