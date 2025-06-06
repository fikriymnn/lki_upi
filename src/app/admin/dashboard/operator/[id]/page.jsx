"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import month_bahasa from "@/utils/month_bahasa";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Tracking_admin({ params }) {
  const path = usePathname()
  const [edit, setEdit] = useState(false);
  const { id } = params;
  const [form, setForm] = useState({
    status: "",
    catatan: ""
  });
  const [invoice, setInvoice] = useState({});
  // const [invoice, setInvoice] = useState({ status: "menunggu verifikasi" })

  const handleConfirm = async (e) => {
    e.preventDefault();
    setEdit((a) => !a);
    let obj = { status: form.status, catatan: form.catatan };
    try {
      function timeNow() {
        var d = new Date(),
          h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
          m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        return h + ":" + m;
      }

      const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(
        new Date().getMonth()
      )} ${new Date().getFullYear()}`;
      function selection() {
        switch (form.status) {
          case "Menunggu Form Dikonfirmasi":
            obj.s1_date = date_format;
            return true;
          case "Form Dikonfirmasi":
            obj.s2_date = date_format;
            return true;
          case "Sample Diterima Admin":
            obj.s3_date = date_format;
            return true;
          case "Sample Dikerjakan Operator":
            obj.s4_date = date_format;
            return true;
          case "Menunggu Verifikasi":
            obj.s5_date = date_format;
            return true;
          case "Menunggu Pembayaran":
            obj.success = true;
            obj.s6_date = date_format;
            return true;
          case "Menunggu Konfirmasi Pembayaran":
            obj.s7_date = date_format;
            obj.success = true;
            return true;
          case "Selesai":
            obj.s8_date = date_format;
            obj.success = true;
            return true;
        }
      }
      if (selection() == true) {
        const data = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          obj,
          { withCredentials: true }
        );
        alert("update successfully");

        if (data.data.success) {
          window.location.replace(`/notifikasi?url=${path}`);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    async function getInvoice() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          { withCredentials: true }
        );
        if (data.data.success) {
          const obj = data.data.data;
          setInvoice(obj);
          setForm({
            status: obj.status,
            catatan: obj.catatan
          });
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
          PROGRESS
        </p>
        <div className="flex justify-center">
          <hr className="grad h-2 mb-8 mt-5 w-56 text-center" />
        </div>
        <div className="m-auto">
          <div className="m-auto w-10/12 border-2 rounded-lg px-5">
            <br />
            <br />
            <p className="md:text-base sm:text-base text-xs text-red-600">*Upload hasil analisis terlebih dahulu sebelum verifikasi</p>
            {edit && invoice.opTask ? (
              <div>
                <p className="text-lg flex font-semibold gap-5">
                  Status :{" "}
                  <select
                    className="font-normal"
                    name="status"
                    onChange={(e) =>
                      setForm((a) => ({
                        ...a,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    value={form.status}
                  >
                    <option value="Sample Dikerjakan Operator" selected>
                      Sample Dikerjakan Operator
                    </option>
                    <option value="Menunggu Verifikasi">
                      Menunggu Verifikasi
                    </option>
                  </select>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg flex gap-5 font-semibold">
                  Status : <span className="font-normal">{form.status} </span>
                </p>
              </div>
            )}
            {edit ? (
              <div>
                <p className="md:text-lg sm:text-xs text-sm grid grid-cols-2 font-semibold">
                  Catatan :{" "}
                  <textarea
                    placeholder="Tuliskan catatan"
                    className="input-style-lki-box"
                    name="catatan"
                    type="text"
                    onChange={(e) =>
                      setForm((a) => ({
                        ...a,
                        [e.target.name]: e.target.value,
                      }))}
                    value={form.catatan}
                  />
                  {/* <input
                      type="text"
                      name="catatan"
                      onChange={handleChange}
                      value={form.catatan}
                    /> */}
                </p>
              </div>
            ) : (
              <div>
                <p className="md:text-lg sm:text-xs text-sm font-semibold md:grid grid-cols-2 gap-5 flex">
                  Catatan :{" "}
                  <span className="font-normal md:text-lg sm:text-xs text-xs">{form.catatan}</span>{" "}
                </p>
              </div>
            )}
            <div className="mx-1 flex flex-col gap-3 md:w-6/12 w-full">
              {" "}
              {edit && invoice.opTask ? (
                <div className="flex gap-5 mt-5">
                  <button
                    onClick={handleConfirm}
                    className="bg-blue-400 text-white px-2 py-1 rounded-lg grad "
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => setEdit((a) => !a)}
                    className="bg-blue-400 text-white px-2 py-1 rounded-lg grad"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEdit((a) => !a)}
                  className="bg-blue-400 text-white px-2 py-1 rounded-lg grad w-40 mt-5"
                >
                  Edit
                </button>
              )}
            </div>
            <br />
            <br />
          </div>
          <div className="flex mb-20 mt-10">
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
                      <p className=" text-xs text-red-600">{invoice.s1_date}</p>
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
                        Menunggu Sample Diterima oleh Admin
                      </p>
                      <p className=" text-xs text-red-600">{invoice.s2_date}</p>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                        Menunggu Sample Diterima oleh Admin
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
                        Sample Diterima oleh Admin
                      </p>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                        Sample Diterima oleh Admin
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
                      <p className=" text-xs text-red-600">{invoice.s3_date}</p>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-gray-400 md:text-2xl sm:text-xl text-base font-semibold">
                        Sedang Dikirim ke Operator{" "}
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
                      <p className=" text-xs text-red-600">{invoice.s4_date}</p>
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
                      <p className=" text-xs text-red-600">{invoice.s5_date}</p>
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
                      <p className=" text-xs text-red-600">{invoice.s6_date}</p>
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
                      <p className=" text-xs text-red-600">{invoice.s7_date}</p>
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
                {invoice.status == "Selesai" ? (
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
                      <p className=" text-xs text-red-600">{invoice.s8_date}</p>
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
      </div>
    </>
  );
}
