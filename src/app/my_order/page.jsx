"use client";
import InvoiceCard from "@/components/InvoiceCard";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Pagination } from "flowbite-react";
import Navigasi from "@/components/Navigasi";

const monthOption = [
  "Januari",

  "Februari",

  "Maret",

  "April",

  "Mei",

  "Juni",

  "Juli",

  "Agustus",

  "September",

  "Oktober",

  "November",

  "Desember",
];

export default function My_order() {

  const [invoice, setInvoice] = useState([]);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);
  const [yearOption, setYearOption] = useState([]);

  const convertRupiah = (angka) => {
    // Konversi angka menjadi string
    let angkaString = angka.toString();

    // Bagi angka menjadi array per 3 digit dari belakang
    let bagianAngka = angkaString.split('').reverse().join('').match(/\d{1,3}/g);

    // Gabungkan kembali dengan titik sebagai pemisah
    return bagianAngka.join('.').split('').reverse().join('');
  }



  useEffect(() => {
    let arr = [];
    const yearMax = new Date().getFullYear() - 2023;
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i);
      setYearOption(arr);
    }

    async function getInvoice() {
      try {
        const token = localStorage.getItem('access_token')
        const dataUser = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );
        if (dataUser.data.success) {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/invoice?status=Menunggu Verifikasi&status=menunggu form dikonfirmasi&status=sample diterima admin&status=Form Dikonfirmasi&status=Sample Dikerjakan Operator&status=Menunggu Pembayaran&status=Menunggu Konfirmasi Pembayaran&id_user=${dataUser.data.data._id
            }&skip=${page * 15}&limit=15${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""
            }`,
            { withCredentials: true }
          );
          if (data.data.success) {
            setInvoice(data.data.data);
            setLength(data.data.length_total);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, [year, month, page]);
  return (
    <>
      <div>
        <Navigasi text1={"user"} text2={"my order"} />
        <div className="flex justify-center mb-10">
          <div className="flex p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 ml-3">
            <p className="md:text-lg sm:text-base text-xs font-semibold text-white p-2">
              Tahun :
            </p>{" "}
            <select
              className="ml-3"
              name="year"
              id="year"
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" defaultChecked className="input-style-lki">
                All
              </option>
              {yearOption.map((v, i) => {
                return (
                  <option value={v} key={i}>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 ml-3 ">
            <p className="md:text-lg sm:text-base text-xs font-semibold text-white p-2">
              Bulan :
            </p>{" "}
            <select
              className="ml-3"
              name="bulan"
              id="bulan"
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="" defaultChecked className="input-style-lki">
                All
              </option>
              {monthOption.map((v, i) => {
                return (
                  <option value={i} key={i} defaultValue>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="m-auto w-11/12">
          <div className=" overflow-x-scroll w-full">
            <Table className="">
              <Table.Head>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs ">
                  No
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Tanggal
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  No Invoice
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Jenis Pengujian
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Harga
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Keterangan
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Status
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {invoice.map((value, i) => {
                  return (
                    <Table.Row
                      key={i}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center md:text-[11px] sm:text-[11px] text-xs">
                        {(i + 1) + (page * 15)}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">{`${value.date_format}`}</Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        {value.no_invoice}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        {value.jenis_pengujian}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        {value.total_harga !== 0 ? `Rp ${convertRupiah(value.total_harga)}` : "-"}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        <a
                          href={`/my_order/detail/${value._id}?no_invoice=${value.no_invoice}`}
                          className="font-medium text-white grad rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 md:text-[11px] sm:text-[11px] text-xs"
                        >
                          Detail
                        </a>
                      </Table.Cell>
                      <Table.Cell className="text-center gap-2">
                        <p className="text-center">{value.status}</p>
                        <br />
                        <a
                          href={`/my_order/tracking/${value._id}?no_invoice=${value.no_invoice}`}
                          className="font-medium text-white grad rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 md:text-[11px] sm:text-[11px] text-xs"
                        >
                          Detail
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
        <br />

        <p className=" text-center mb-2 text-red-600">page : {page + 1}</p>
        <div className="flex justify-center">
          <div className="m-auto flex items-center">
            <div className="flex overflow-x-auto sm:justify-center">
              <Pagination
                currentPage={page}
                totalPages={parseInt(Math.ceil(length / 15).toFixed())}
                onPageChange={(a) => {
                  console.log(a);
                  setPage(a - 1);
                }}
              />
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        {/* <div>
                <InvoiceCard list_sample={["asa","bbd"]} invoice={"12asndaj23"} tanggal={"17 agustus"} index={1}/>
                <InvoiceCard list_sample={["asa","tt ","aaks"]} invoice={"1se2asndaj2e3"} tanggal={"20 agustus"} index={2}/>

            </div> */}
      </div>
    </>
  );
}
